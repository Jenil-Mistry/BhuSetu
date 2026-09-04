-- ============================================================================
-- Migration 006: R&R, Documents Vault, Append-Only Audit & Outbox Engine
-- Privacy-preserving rehabilitation records, secure storage metadata, and event outbox
-- ============================================================================

-- Affected Families (R&R Beneficiaries)
CREATE TABLE IF NOT EXISTS affected_families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    family_head_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'LAND_OWNER', 'AGRICULTURAL_LABOURER', 'TENANT', 'ARTISAN'
    is_displaced BOOLEAN DEFAULT TRUE,
    current_village_id INT REFERENCES villages(id) ON DELETE SET NULL,
    num_dependents INT DEFAULT 0,
    resettlement_site_preference TEXT,
    status VARCHAR(50) DEFAULT 'REGISTERED',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- R&R Entitlements Catalog
CREATE TABLE IF NOT EXISTS rr_entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES affected_families(id) ON DELETE CASCADE,
    entitlement_type VARCHAR(100) NOT NULL, -- 'HOUSING_ALLOTMENT', 'SUBSISTENCE_GRANT', 'RESETTLEMENT_ALLOWANCE', 'SKILL_TRAINING'
    grant_amount NUMERIC(18, 2) DEFAULT 0.00,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'APPROVED', -- 'APPROVED', 'DISBURSED', 'COMPLETED'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Document Metadata Vault
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parcel_id UUID REFERENCES land_parcels(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'FEASIBILITY_REPORT', 'SIA_REPORT', 'GAZETTE_NOTIFICATION', 'SURVEY_PHOTO', 'KML_LAYER'
    classification VARCHAR(20) DEFAULT 'RESTRICTED', -- 'PUBLIC', 'RESTRICTED', 'CONFIDENTIAL'
    object_key TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    sha256_checksum VARCHAR(64),
    current_version INT DEFAULT 1,
    scan_status VARCHAR(20) DEFAULT 'CLEAN', -- 'PENDING', 'CLEAN', 'INFECTED'
    created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Document Version History
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    object_key TEXT NOT NULL,
    sha256_checksum VARCHAR(64),
    uploaded_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(document_id, version_number)
);

-- Append-Only Audit Trail (Strict Accountability for Every Mutation)
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'PROJECT_SUBMIT', 'PARCEL_VERIFY', 'AWARD_DECLARE'
    entity_type VARCHAR(50) NOT NULL, -- 'PROJECT', 'PARCEL', 'COMPENSATION', 'DOCUMENT'
    entity_id VARCHAR(100) NOT NULL,
    before_state JSONB,
    after_state JSONB,
    correlation_id VARCHAR(100),
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Outbox Events (Transactional outbox for reliable async event processing)
CREATE TABLE IF NOT EXISTS outbox_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING', -- 'PENDING', 'PROCESSING', 'DELIVERED', 'FAILED'
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 5,
    next_retry_at TIMESTAMPTZ DEFAULT now(),
    error_log TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- External Integration Runs (PFMS, State Land Records Bhulekh)
CREATE TABLE IF NOT EXISTS integration_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adapter_name VARCHAR(100) NOT NULL, -- 'PFMS_DBT', 'BHULEKH_ROR', 'SMS_GATEWAY'
    direction VARCHAR(10) NOT NULL, -- 'PULL', 'PUSH'
    status VARCHAR(30) NOT NULL, -- 'SUCCESS', 'FAILED', 'RECONCILED'
    request_reference VARCHAR(100),
    response_summary JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON audit_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at);
CREATE INDEX IF NOT EXISTS idx_outbox_events_pending ON outbox_events(status, next_retry_at);
