-- ============================================================================
-- Migration 008: Demo Seed Data for SIH Problem Statement 26016
-- Populates reference geography, test users, workflow rules, NH-48 project, and cadastral parcels.
-- ============================================================================

-- 1. States & Districts
INSERT INTO states (id, code, name) VALUES
(1, 'GJ', 'Gujarat'),
(2, 'MH', 'Maharashtra'),
(3, 'DL', 'Delhi')
ON CONFLICT (id) DO NOTHING;

INSERT INTO districts (id, state_id, code, name) VALUES
(1, 1, 'GJ-AMD', 'Ahmedabad'),
(2, 1, 'GJ-SRT', 'Surat'),
(3, 2, 'MH-MUM', 'Mumbai Suburban'),
(4, 2, 'MH-PUN', 'Pune')
ON CONFLICT (id) DO NOTHING;

INSERT INTO subdistricts (id, district_id, code, name) VALUES
(1, 1, 'GJ-AMD-SAN', 'Sanand'),
(2, 1, 'GJ-AMD-DAS', 'Daskroi')
ON CONFLICT (id) DO NOTHING;

INSERT INTO villages (id, district_id, subdistrict_id, code, name) VALUES
(1, 1, 1, 'GJ0101', 'Moraiya'),
(2, 1, 1, 'GJ0102', 'Changodar'),
(3, 1, 2, 'GJ0103', 'Bavla')
ON CONFLICT (id) DO NOTHING;

-- 2. Organizations
INSERT INTO organizations (id, name, org_type, state_id, district_id) VALUES
(1, 'National Highways Authority of India (NHAI)', 'NHAI', NULL, NULL),
(2, 'Ministry of Road Transport and Highways (MoRTH)', 'MINISTRY', NULL, NULL),
(3, 'Gujarat State Revenue Department', 'STATE_REVENUE', 1, NULL),
(4, 'Ahmedabad District Collectorate', 'DISTRICT_COLLECTORATE', 1, 1)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence IDs
SELECT setval('states_id_seq', (SELECT MAX(id) FROM states));
SELECT setval('districts_id_seq', (SELECT MAX(id) FROM districts));
SELECT setval('subdistricts_id_seq', (SELECT MAX(id) FROM subdistricts));
SELECT setval('villages_id_seq', (SELECT MAX(id) FROM villages));
SELECT setval('organizations_id_seq', (SELECT MAX(id) FROM organizations));

-- 3. Workflow Definitions & Stages
INSERT INTO workflow_definitions (id, process_type, name, description) VALUES
(1, 'STANDARD_LAND_ACQUISITION', 'RFCTLARR 2013 Statutory Land Acquisition Workflow', 'Standard 12-stage lifecycle under Land Acquisition, Rehabilitation and Resettlement Act 2013')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workflow_stages (workflow_id, stage_key, name, display_order, required_role, sla_days) VALUES
(1, 'DRAFT', 'Proposal Draft', 1, 'PIA', 15),
(1, 'SUBMITTED', 'Proposal Submitted', 2, 'PIA', 5),
(1, 'SCRUTINY', 'Under Scrutiny by DLAO', 3, 'DLAO', 30),
(1, 'CLARIFICATION_REQUIRED', 'Clarification Requested', 4, 'PIA', 15),
(1, 'RECOMMENDED', 'Recommended by Collector', 5, 'STATE_NODAL_OFFICER', 20),
(1, 'APPROVED', 'Proposal Approved', 6, 'MINISTRY_REVIEWER', 10),
(1, 'NOTIFICATION_IN_PROGRESS', 'Section 11/19 Notification', 7, 'DLAO', 60),
(1, 'AWARD_IN_PROGRESS', 'Award Inquiry & Declaration', 8, 'DLAO', 90),
(1, 'COMPENSATION_IN_PROGRESS', 'Compensation Assessment & Disbursement', 9, 'COMPENSATION_OFFICER', 45),
(1, 'POSSESSION_IN_PROGRESS', 'Possession & Site Handover', 10, 'DLAO', 30),
(1, 'RR_IN_PROGRESS', 'R&R Implementation', 11, 'RR_OFFICER', 180),
(1, 'COMPLETED', 'Acquisition Completed', 12, 'NATIONAL_ADMIN', 0),
(1, 'ON_HOLD', 'Acquisition Suspended / On Hold', 13, 'NATIONAL_ADMIN', 0),
(1, 'REJECTED', 'Proposal Rejected', 14, 'DLAO', 0)
ON CONFLICT DO NOTHING;

-- 4. Demo Users & Assignments
INSERT INTO app_users (id, username, email, full_name, role, status) VALUES
('00000000-0000-0000-0000-000000000001', 'admin.national', 'admin@bhusetu.gov.in', 'Rajesh Sharma (National Admin)', 'NATIONAL_ADMIN', 'ACTIVE'),
('00000000-0000-0000-0000-000000000002', 'dlao.ahmedabad', 'dlao.amd@gujarat.gov.in', 'Anil Patel (DLAO Ahmedabad)', 'DLAO', 'ACTIVE'),
('00000000-0000-0000-0000-000000000003', 'nhai.officer', 'pia@nhai.gov.in', 'Vikram Singh (Project Director, NHAI)', 'PIA', 'ACTIVE'),
('00000000-0000-0000-0000-000000000004', 'field.surveyor', 'surveyor@gujarat.gov.in', 'Kavita Joshi (Field Surveyor)', 'SURVEYOR', 'ACTIVE'),
('00000000-0000-0000-0000-000000000005', 'comp.officer', 'compensation@gujarat.gov.in', 'Mahesh Mehta (CALA Officer)', 'COMPENSATION_OFFICER', 'ACTIVE'),
('00000000-0000-0000-0000-000000000006', 'rr.officer', 'rr@gujarat.gov.in', 'Priya Dave (R&R Administrator)', 'RR_OFFICER', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_assignments (user_id, organization_id, role, scope_type, scope_id, state_id, district_id) VALUES
('00000000-0000-0000-0000-000000000001', 2, 'NATIONAL_ADMIN', 'NATIONAL', 0, NULL, NULL),
('00000000-0000-0000-0000-000000000002', 4, 'DLAO', 'DISTRICT', 1, 1, 1),
('00000000-0000-0000-0000-000000000003', 1, 'PIA', 'ORGANIZATION', 1, NULL, NULL),
('00000000-0000-0000-0000-000000000004', 4, 'SURVEYOR', 'DISTRICT', 1, 1, 1),
('00000000-0000-0000-0000-000000000005', 4, 'COMPENSATION_OFFICER', 'DISTRICT', 1, 1, 1),
('00000000-0000-0000-0000-000000000006', 4, 'RR_OFFICER', 'DISTRICT', 1, 1, 1)
ON CONFLICT DO NOTHING;

-- 5. Demo Project (NH-48 Expressway Section)
INSERT INTO projects (id, name, code, description, status, district_id, organization_id, estimated_budget, created_by) VALUES
('11111111-1111-1111-1111-111111111111', 'NH-48 Vadodara-Ahmedabad Expressway Widening', 'NH48-SEC-09', 'Acquisition of bypass corridor for 6-lane access-controlled highway in Moraiya & Changodar.', 'APPROVED', 1, 1, 145000000.00, '00000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- 6. Demo Cadastral Land Parcels (Valid MultiPolygons in Ahmedabad/Sanand)
INSERT INTO land_parcels (id, project_id, village_id, parcel_number, area_sq_meters, status, payment_status, geom) VALUES
(
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111111',
    1,
    'Khasra 401/1 (Moraiya)',
    12500.0,
    'SEC_11_NOTIFIED',
    'ESCROW_DEPOSITED',
    ST_Multi(ST_GeomFromText('POLYGON((72.450 22.950, 72.455 22.950, 72.455 22.955, 72.450 22.955, 72.450 22.950))', 4326))
),
(
    '22222222-2222-2222-2222-222222222202',
    '11111111-1111-1111-1111-111111111111',
    1,
    'Khasra 401/2 (Moraiya)',
    8400.0,
    'AWARDED',
    'PFMS_INITIATED',
    ST_Multi(ST_GeomFromText('POLYGON((72.455 22.950, 72.460 22.950, 72.460 22.955, 72.455 22.955, 72.455 22.950))', 4326))
),
(
    '22222222-2222-2222-2222-222222222203',
    '11111111-1111-1111-1111-111111111111',
    2,
    'Khasra 112 (Changodar)',
    15600.0,
    'POSSESSION_TAKEN',
    'DBT_CLEARED',
    ST_Multi(ST_GeomFromText('POLYGON((72.460 22.950, 72.465 22.950, 72.465 22.955, 72.460 22.955, 72.460 22.950))', 4326))
)
ON CONFLICT (id) DO NOTHING;
