-- ============================================================================
-- Migration 002: Identity, Organizations & Scoped Assignments
-- Multi-tier administrative scoping and privacy-by-design identities
-- ============================================================================

-- Organizations (Ministries, Implementing Agencies like NHAI, State Revenue Depts)
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    org_type VARCHAR(50) NOT NULL, -- 'MINISTRY', 'NHAI', 'RAILWAYS', 'STATE_REVENUE', 'DISTRICT_COLLECTORATE'
    parent_id INT REFERENCES organizations(id) ON DELETE SET NULL,
    state_id INT REFERENCES states(id) ON DELETE SET NULL,
    district_id INT REFERENCES districts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Parties (Landowners, Beneficiaries, Affected Persons) - Zero raw Aadhaar/PAN stored
CREATE TABLE IF NOT EXISTS parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15),
    email VARCHAR(255),
    identity_ref_hash TEXT UNIQUE, -- SHA-256 hash or government token
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Application Users (Government Officers, Surveyors, Reviewers)
CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id UUID REFERENCES parties(id) ON DELETE SET NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'OFFICER', -- 'NATIONAL_ADMIN', 'MINISTRY_REVIEWER', 'STATE_NODAL_OFFICER', 'DLAO', 'PIA', 'SURVEYOR', 'COMPENSATION_OFFICER', 'RR_OFFICER', 'AUDITOR'
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ NULL
);

-- Scoped User Assignments (Capabilities bound to geographic & organizational boundaries)
CREATE TABLE IF NOT EXISTS user_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    organization_id INT REFERENCES organizations(id) ON DELETE SET NULL,
    role VARCHAR(50) NOT NULL,
    scope_type VARCHAR(50) NOT NULL, -- 'NATIONAL', 'STATE', 'DISTRICT', 'ORGANIZATION', 'PROJECT'
    scope_id INT NOT NULL DEFAULT 0,
    state_id INT REFERENCES states(id) ON DELETE SET NULL,
    district_id INT REFERENCES districts(id) ON DELETE SET NULL,
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_until TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_assignments_lookup ON user_assignments (user_id, scope_type, scope_id);
