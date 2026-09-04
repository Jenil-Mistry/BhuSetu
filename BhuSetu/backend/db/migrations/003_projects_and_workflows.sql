-- ============================================================================
-- Migration 003: Projects, Proposals & Workflow State Machine
-- Configurable, data-driven lifecycle tracking from draft to completion
-- ============================================================================

-- Strict Project Status Enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM (
            'DRAFT',
            'SUBMITTED',
            'SCRUTINY',
            'CLARIFICATION_REQUIRED',
            'RECOMMENDED',
            'APPROVED',
            'NOTIFICATION_IN_PROGRESS',
            'AWARD_IN_PROGRESS',
            'COMPENSATION_IN_PROGRESS',
            'POSSESSION_IN_PROGRESS',
            'RR_IN_PROGRESS',
            'COMPLETED',
            'ON_HOLD',
            'REJECTED'
        );
    END IF;
END $$;

-- Land Acquisition Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    status project_status DEFAULT 'DRAFT',
    district_id INT REFERENCES districts(id) ON DELETE SET NULL,
    organization_id INT REFERENCES organizations(id) ON DELETE SET NULL,
    estimated_budget NUMERIC(18, 2) DEFAULT 0.00,
    created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Detailed Proposals associated with a Project
CREATE TABLE IF NOT EXISTS project_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    proposal_version INT NOT NULL DEFAULT 1,
    purpose TEXT NOT NULL,
    requiring_body VARCHAR(255) NOT NULL,
    estimated_area_hectares NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    estimated_budget NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    submission_notes TEXT,
    submitted_at TIMESTAMPTZ,
    submitted_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(project_id, proposal_version)
);

-- Workflow Definitions
CREATE TABLE IF NOT EXISTS workflow_definitions (
    id SERIAL PRIMARY KEY,
    process_type VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'STANDARD_LAND_ACQUISITION'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Workflow Stages (Configurable legal steps)
CREATE TABLE IF NOT EXISTS workflow_stages (
    id SERIAL PRIMARY KEY,
    workflow_id INT NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
    stage_key VARCHAR(50) NOT NULL, -- 'DRAFT', 'SUBMITTED', 'SCRUTINY', etc.
    name VARCHAR(100) NOT NULL,
    display_order INT NOT NULL,
    required_role VARCHAR(50),
    sla_days INT DEFAULT 15,
    is_terminal BOOLEAN DEFAULT FALSE,
    UNIQUE(workflow_id, stage_key)
);

-- Workflow Transitions (Configurable state transition guards)
CREATE TABLE IF NOT EXISTS workflow_transitions (
    id SERIAL PRIMARY KEY,
    workflow_id INT NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
    from_stage VARCHAR(50) NOT NULL,
    to_stage VARCHAR(50) NOT NULL,
    action_name VARCHAR(50) NOT NULL, -- 'SUBMIT', 'RECOMMEND', 'APPROVE', 'REJECT', etc.
    required_capability VARCHAR(50),
    requires_comment BOOLEAN DEFAULT FALSE,
    requires_documents BOOLEAN DEFAULT FALSE
);

-- Workflow History (Immutable audit log of all transitions)
CREATE TABLE IF NOT EXISTS workflow_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    from_stage VARCHAR(50),
    to_stage VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    performed_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Project Milestones
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_name VARCHAR(255) NOT NULL,
    planned_date DATE,
    actual_date DATE,
    status VARCHAR(50) DEFAULT 'PENDING',
    evidence_document_id UUID,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflow_history_project ON workflow_history(project_id);
