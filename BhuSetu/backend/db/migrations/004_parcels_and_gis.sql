-- ============================================================================
-- Migration 004: Cadastral Land Parcels & Spatial Ingestion
-- PostGIS storage, spatial indexing, verification records, and idempotent import jobs
-- ============================================================================

-- Strict Parcel Status Enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'parcel_status') THEN
        CREATE TYPE parcel_status AS ENUM (
            'PROPOSED',
            'SEC_11_NOTIFIED',
            'SEC_19_DECLARED',
            'AWARDED',
            'COMPENSATION_PENDING',
            'COMPENSATION_PAID',
            'POSSESSION_TAKEN',
            'WITHDRAWN',
            'DISPUTED'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM (
            'ESCROW_DEPOSITED',
            'PFMS_INITIATED',
            'DBT_CLEARED',
            'FAILED_REJECTED'
        );
    END IF;
END $$;

-- Land Parcels Table
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

-- Parcel Verification Records (Surveyor & Field Inspection Log)
CREATE TABLE IF NOT EXISTS parcel_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    verified_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
    verification_method VARCHAR(50) NOT NULL, -- 'FIELD_SURVEY', 'CADASTRAL_OFFICE', 'DRONE_IMAGERY'
    inspection_point GEOMETRY(Point, 4326),
    remarks TEXT,
    photo_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Parcel Import Jobs (Idempotent asynchronous batch imports)
CREATE TABLE IF NOT EXISTS parcel_import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_filename VARCHAR(255) NOT NULL,
    file_checksum VARCHAR(64) NOT NULL,
    idempotency_key VARCHAR(100) UNIQUE,
    total_features INT DEFAULT 0,
    processed_features INT DEFAULT 0,
    success_count INT DEFAULT 0,
    error_count INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'PENDING', -- 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'
    error_summary TEXT,
    created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Import Rows for Error Debugging
CREATE TABLE IF NOT EXISTS parcel_import_rows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES parcel_import_jobs(id) ON DELETE CASCADE,
    row_number INT NOT NULL,
    parcel_number VARCHAR(100),
    status VARCHAR(20) NOT NULL, -- 'SUCCESS', 'ERROR', 'SKIPPED'
    error_message TEXT,
    raw_geojson JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- High-Performance Spatial GiST Indexes
CREATE INDEX IF NOT EXISTS idx_land_parcels_geom ON land_parcels USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_land_parcels_project_id ON land_parcels(project_id);
CREATE INDEX IF NOT EXISTS idx_land_parcels_village_id ON land_parcels(village_id);
CREATE INDEX IF NOT EXISTS idx_land_parcels_status ON land_parcels(status);
