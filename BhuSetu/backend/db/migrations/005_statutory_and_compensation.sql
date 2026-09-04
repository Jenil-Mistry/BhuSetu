-- ============================================================================
-- Migration 005: Statutory Notifications, Awards, Compensation & Possession
-- Financial calculations with numeric(18,2) precision and reconciliation states
-- ============================================================================

-- Statutory Notifications (Section 11 Preliminary Notification & Section 19 Declaration)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'SECTION_11', 'SECTION_19'
    gazette_number VARCHAR(100) NOT NULL,
    publication_date DATE NOT NULL,
    authority VARCHAR(255) NOT NULL,
    affected_village_ids INT[],
    document_id UUID,
    summary TEXT,
    status VARCHAR(50) DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Statutory Awards (Award declared under Section 23/31)
CREATE TABLE IF NOT EXISTS awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parcel_id UUID NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    award_number VARCHAR(100) UNIQUE NOT NULL,
    award_date DATE NOT NULL,
    assessed_amount NUMERIC(18, 2) NOT NULL,
    authority VARCHAR(255) NOT NULL,
    document_id UUID,
    status VARCHAR(50) DEFAULT 'DECLARED',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Componentized Compensation Assessments (RFCTLARR Act 2013 formulas)
CREATE TABLE IF NOT EXISTS compensation_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    award_id UUID NOT NULL REFERENCES awards(id) ON DELETE CASCADE,
    parcel_id UUID NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    party_id UUID REFERENCES parties(id) ON DELETE SET NULL,
    market_value NUMERIC(18, 2) NOT NULL,
    solatium_percentage NUMERIC(5, 2) DEFAULT 100.00,
    solatium_amount NUMERIC(18, 2) NOT NULL,
    interest_rate_percentage NUMERIC(5, 2) DEFAULT 12.00,
    interest_amount NUMERIC(18, 2) DEFAULT 0.00,
    assets_value NUMERIC(18, 2) DEFAULT 0.00,
    total_assessed_amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Payment Disbursement Batches
CREATE TABLE IF NOT EXISTS payment_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    batch_reference VARCHAR(100) UNIQUE NOT NULL,
    disbursement_source VARCHAR(100) DEFAULT 'ESCROW_ACCOUNT',
    total_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    total_items INT NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'INITIATED', -- 'INITIATED', 'SUBMITTED_TO_PFMS', 'RECONCILED', 'PARTIALLY_FAILED'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Payment Items with Masked Beneficiary References
CREATE TABLE IF NOT EXISTS payment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES payment_batches(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES compensation_assessments(id) ON DELETE CASCADE,
    party_id UUID REFERENCES parties(id) ON DELETE SET NULL,
    amount NUMERIC(18, 2) NOT NULL,
    masked_beneficiary_ref VARCHAR(100), -- e.g., 'A/C Ending in 4589'
    utr_number VARCHAR(100),
    status payment_status DEFAULT 'PFMS_INITIATED',
    failure_reason TEXT,
    reconciled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Possession Records (Physical handover of land)
CREATE TABLE IF NOT EXISTS possession_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    possession_date DATE NOT NULL,
    is_full_possession BOOLEAN DEFAULT TRUE,
    handover_memo_url TEXT,
    verifier_name VARCHAR(255) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_awards_project ON awards(project_id);
CREATE INDEX IF NOT EXISTS idx_compensation_parcel ON compensation_assessments(parcel_id);
CREATE INDEX IF NOT EXISTS idx_payment_batches_project ON payment_batches(project_id);
