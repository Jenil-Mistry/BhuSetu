-- ============================================================================
-- Migration 007: Geodetic PostGIS Spatial Functions & Transactional RPCs
-- Eliminates Web Mercator distortion with geodetic area calculations,
-- and provides atomic workflow transition execution.
-- ============================================================================

-- 1. High-Accuracy Geodetic Parcel Intersection RPC
-- Calculates exact spatial overlap in square meters using spherical/ellipsoidal geography
CREATE OR REPLACE FUNCTION calculate_parcel_intersections(
    target_geom GEOMETRY,
    p_project_id UUID DEFAULT NULL
)
RETURNS TABLE (
    parcel_id UUID,
    parcel_number VARCHAR(100),
    project_id UUID,
    status parcel_status,
    total_area_sq_m DOUBLE PRECISION,
    overlap_area_sq_m DOUBLE PRECISION,
    overlap_percentage DOUBLE PRECISION,
    overlap_geom_geojson TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_geom GEOMETRY;
BEGIN
    -- Ensure SRID 4326 and sanitize geometry
    v_clean_geom := ST_MakeValid(ST_SetSRID(target_geom, 4326));

    RETURN QUERY
    SELECT
        lp.id AS parcel_id,
        lp.parcel_number,
        lp.project_id,
        lp.status,
        COALESCE(lp.area_sq_meters, ROUND(ST_Area(lp.geom::geography)::numeric, 2)::DOUBLE PRECISION) AS total_area_sq_m,
        ROUND(
            ST_Area(
                ST_Intersection(lp.geom, v_clean_geom)::geography
            )::numeric, 2
        )::DOUBLE PRECISION AS overlap_area_sq_m,
        CASE
            WHEN COALESCE(lp.area_sq_meters, ST_Area(lp.geom::geography)) > 0 THEN
                ROUND(
                    (ST_Area(ST_Intersection(lp.geom, v_clean_geom)::geography) / 
                     COALESCE(NULLIF(lp.area_sq_meters, 0), ST_Area(lp.geom::geography)) * 100)::numeric,
                    2
                )::DOUBLE PRECISION
            ELSE 0.0
        END AS overlap_percentage,
        ST_AsGeoJSON(ST_Intersection(lp.geom, v_clean_geom)) AS overlap_geom_geojson
    FROM land_parcels lp
    WHERE
        (p_project_id IS NULL OR lp.project_id = p_project_id)
        AND ST_Intersects(lp.geom, v_clean_geom);
END;
$$;


-- 2. Atomic Workflow State Transition RPC
-- Updates project status, logs immutable workflow history, and creates an outbox event atomically
CREATE OR REPLACE FUNCTION execute_workflow_transition(
    p_project_id UUID,
    p_to_stage VARCHAR(50),
    p_action VARCHAR(50),
    p_actor_id UUID DEFAULT NULL,
    p_comment TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_status project_status;
    v_project_code VARCHAR(100);
    v_result JSONB;
BEGIN
    -- Lock row for update
    SELECT status, code INTO v_current_status, v_project_code
    FROM projects
    WHERE id = p_project_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Project not found: %', p_project_id USING ERRCODE = 'P0002';
    END IF;

    -- Update project status
    UPDATE projects
    SET
        status = p_to_stage::project_status,
        updated_at = now()
    WHERE id = p_project_id;

    -- Insert into workflow history
    INSERT INTO workflow_history (
        project_id,
        from_stage,
        to_stage,
        action,
        performed_by,
        comment,
        created_at
    ) VALUES (
        p_project_id,
        v_current_status::text,
        p_to_stage,
        p_action,
        p_actor_id,
        p_comment,
        now()
    );

    -- Insert atomic outbox event for async notifications
    INSERT INTO outbox_events (
        event_type,
        payload,
        status,
        created_at
    ) VALUES (
        'project.workflow.transitioned',
        jsonb_build_object(
            'project_id', p_project_id,
            'project_code', v_project_code,
            'from_stage', v_current_status,
            'to_stage', p_to_stage,
            'action', p_action,
            'actor_id', p_actor_id,
            'timestamp', now()
        ),
        'PENDING',
        now()
    );

    v_result := jsonb_build_object(
        'success', true,
        'project_id', p_project_id,
        'previous_status', v_current_status,
        'new_status', p_to_stage
    );

    RETURN v_result;
END;
$$;
