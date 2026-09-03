-- ============================================================================
-- BhuSetu: Real-Time National Land Acquisition & Management System
-- Supabase / PostgreSQL + PostGIS Initialization Script
-- ============================================================================

-- 1. Enable Extensions in Supabase
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Strict Enums for State Management
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('DRAFT', 'SIA_PENDING', 'APPROVED', 'COMPLETED', 'ON_HOLD');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('ESCROW_DEPOSITED', 'PFMS_INITIATED', 'DBT_CLEARED', 'FAILED_REJECTED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'parcel_status') THEN
        CREATE TYPE parcel_status AS ENUM ('PROPOSED', 'SEC_11_NOTIFIED', 'SEC_19_DECLARED', 'AWARDED', 'POSSESSION_TAKEN');
    END IF;
END $$;

-- 3. Foundational Organizations & Administrative Divisions
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    org_type VARCHAR(50) NOT NULL, -- e.g., 'NHAI', 'RAILWAYS', 'STATE_REVENUE'
    parent_id INT REFERENCES organizations(id) ON DELETE SET NULL,
    state_id INT,
    district_id INT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    state_id INT NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS villages (
    id SERIAL PRIMARY KEY,
    district_id INT REFERENCES districts(id) ON DELETE CASCADE,
    subdistrict_id INT NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Parties & User Identities
CREATE TABLE IF NOT EXISTS parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15),
    identity_ref_hash TEXT UNIQUE, -- Hashed Aadhaar/PAN
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id UUID REFERENCES parties(id) ON DELETE SET NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'OFFICER', -- e.g. 'ADMIN', 'COMPENSATION_OFFICER', 'SURVEYOR'
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMP NULL
);

-- 5. Land Acquisition Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'NH-48-WIDENING-SEC3'
    description TEXT,
    status project_status DEFAULT 'DRAFT',
    district_id INT REFERENCES districts(id) ON DELETE SET NULL,
    organization_id INT REFERENCES organizations(id) ON DELETE SET NULL,
    estimated_budget NUMERIC(16, 2) DEFAULT 0.00,
    created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Land Parcels (Cadastral plots with PostGIS geometry)
CREATE TABLE IF NOT EXISTS land_parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    village_id INT REFERENCES villages(id) ON DELETE SET NULL,
    parcel_number VARCHAR(100) NOT NULL, -- Khasra / Survey Number
    owner_party_id UUID REFERENCES parties(id) ON DELETE SET NULL,
    area_sq_meters DOUBLE PRECISION,
    status parcel_status DEFAULT 'PROPOSED',
    payment_status payment_status DEFAULT NULL,
    kml_document_url TEXT,
    survey_photo_url TEXT,
    geom GEOMETRY(MultiPolygon, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Spatial GiST Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_districts_boundary ON districts USING GIST (boundary);
CREATE INDEX IF NOT EXISTS idx_villages_boundary ON villages USING GIST (boundary);
CREATE INDEX IF NOT EXISTS idx_land_parcels_geom ON land_parcels USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_land_parcels_project_id ON land_parcels(project_id);

-- 8. Supabase RPC Function: calculate_parcel_intersections
-- Computes spatial overlaps between a proposed acquisition corridor/polygon and existing land parcels
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
BEGIN
    RETURN QUERY
    SELECT
        lp.id AS parcel_id,
        lp.parcel_number,
        lp.project_id,
        lp.status,
        lp.area_sq_meters AS total_area_sq_m,
        ROUND(
            ST_Area(
                ST_Transform(
                    ST_Intersection(lp.geom, ST_SetSRID(target_geom, 4326)),
                    3857
                )
            )::numeric, 2
        )::DOUBLE PRECISION AS overlap_area_sq_m,
        CASE
            WHEN lp.area_sq_meters > 0 THEN
                ROUND(
                    (ST_Area(ST_Transform(ST_Intersection(lp.geom, ST_SetSRID(target_geom, 4326)), 3857)) / lp.area_sq_meters * 100)::numeric,
                    2
                )::DOUBLE PRECISION
            ELSE 0.0
        END AS overlap_percentage,
        ST_AsGeoJSON(ST_Intersection(lp.geom, ST_SetSRID(target_geom, 4326))) AS overlap_geom_geojson
    FROM land_parcels lp
    WHERE
        (p_project_id IS NULL OR lp.project_id = p_project_id)
        AND ST_Intersects(lp.geom, ST_SetSRID(target_geom, 4326));
END;
$$;
