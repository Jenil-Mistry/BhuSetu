-- ============================================================================
-- Migration 001: Baseline Extensions & Administrative Geography
-- Enables PostGIS, uuid-ossp, and creates states, districts, subdistricts, villages
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema Migrations Tracking Table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    description TEXT NOT NULL,
    applied_at TIMESTAMPTZ DEFAULT now()
);

-- States / Union Territories
CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Districts
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    state_id INT NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Subdistricts / Tehsils / Taluks
CREATE TABLE IF NOT EXISTS subdistricts (
    id SERIAL PRIMARY KEY,
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Villages
CREATE TABLE IF NOT EXISTS villages (
    id SERIAL PRIMARY KEY,
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    subdistrict_id INT REFERENCES subdistricts(id) ON DELETE SET NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Spatial GiST Indexes
CREATE INDEX IF NOT EXISTS idx_states_boundary ON states USING GIST (boundary);
CREATE INDEX IF NOT EXISTS idx_districts_boundary ON districts USING GIST (boundary);
CREATE INDEX IF NOT EXISTS idx_subdistricts_boundary ON subdistricts USING GIST (boundary);
CREATE INDEX IF NOT EXISTS idx_villages_boundary ON villages USING GIST (boundary);
