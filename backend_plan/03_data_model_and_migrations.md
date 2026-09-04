# Data Model and Migration Plan

## 1. Current schema assessment

The existing SQL is a foundation but needs revision before production use:

- `organizations.state_id`, `organizations.district_id`, and `villages.subdistrict_id` refer to concepts with no corresponding reference tables or foreign keys.
- `app_users.role` is a single free-text role; it cannot represent multiple scoped assignments.
- Projects and parcels lack proposal, notification, award, compensation, possession, R&R, milestone, audit, and integration entities.
- Parcel geometry is stored as `MultiPolygon`, but import/validation rules are not defined.
- The current RPC uses Web Mercator for area, which is not suitable as a national authoritative area calculation.
- The RPC signature and client payload should be tested against the actual PostGIS/Supabase behavior; GeoJSON should be converted explicitly to a typed geometry inside SQL.
- Timestamps and update behavior need database triggers or explicit service logic.
- No row-level security policy, grants strategy, or migration history is present.

Do not edit the original initialization script repeatedly after shared environments exist. Convert it into numbered migrations and record the applied version.

## 2. Core entities

### Identity and administrative scope

- `states`, `districts`, `subdistricts`, `villages`: government reference geography with source/version metadata.
- `organizations`: hierarchy for ministries, agencies, state departments, and district offices.
- `users`: application profile linked to the identity provider subject.
- `user_assignments`: user, organization, capability/role, and scope type/id with validity dates.
- `parties`: minimal owner/affected-party profile; sensitive identity references remain tokenized or hashed.

### Project and acquisition lifecycle

- `projects`: stable project identity, code, implementing organization, geography, budget, and current summary status.
- `project_proposals`: proposal version, purpose, requiring body, scope, estimated area/cost, submission metadata, and decision data.
- `workflow_definitions`, `workflow_stages`, `workflow_transitions`: configurable process per process type and applicable jurisdiction.
- `workflow_instances`, `workflow_tasks`, `workflow_history`: current stage, assignment, SLA, comments, and immutable transition history.
- `project_milestones`: planned/actual dates, owner, status, evidence, and dependency.

### Parcel and evidence

- `land_parcels`: cadastral identity, geometry, area, village, owner reference, and lifecycle status.
- `parcel_project_links`: supports a parcel participating in a project without forcing one-project-only semantics.
- `parcel_verifications`: survey/office verification attempts, coordinates, result, actor, and reason.
- `parcel_import_jobs`, `parcel_import_rows`: source file, checksum, row outcome, error, and idempotency key.
- `documents`: business metadata, document type, classification, current version, and linked entity.
- `document_versions`: object key, checksum, MIME type, size, uploader, version, scan status, and retention metadata.

### Statutory/acquisition records

- `notifications`: notification type/reference, issue/publication dates, authority, affected scope, and source document.
- `awards`: parcel/party scope, award number/date, assessed amount, authority, and document.
- `compensation_assessments`: componentized amount, approval, currency, calculation basis, and effective version.
- `payment_batches`: requested/approved/initiated/reconciled totals and source system reference.
- `payment_items`: assessment/party amount, masked beneficiary reference, status, failure reason, and reconciliation data.
- `possession_records`: possession date, partial/full flag, memo, evidence, and verifier.

### R&R and reporting

- `affected_families`: project-scoped protected record with classification and displacement state.
- `rr_entitlements`: entitlement type, approved amount/service, due date, status, and evidence.
- `rr_milestones`: project/family milestone and completion evidence.
- `audit_events`: append-only actor/action/entity/before/after/reason/correlation metadata.
- `outbox_events`: event type, payload, attempt count, next attempt, and delivery state.
- `integration_runs`: adapter, direction, request/response reference, status, retry, and reconciliation summary.

## 3. Data rules

- Use `uuid` primary keys for business entities and numeric surrogate keys only where a government source requires them.
- Use `timestamptz` everywhere; store all timestamps in UTC and render in the user’s locale.
- Use `numeric(18,2)` or stricter domain types for money; never use Python `float` for persisted financial values.
- Add `created_at`, `updated_at`, and `created_by`/`updated_by` where applicable.
- Add `version` or optimistic-lock columns to mutable reviewable records.
- Prefer soft deletion for business records; hard deletion should be restricted to test/reference data.
- Add uniqueness constraints for official references, project codes, parcel source keys, and idempotency keys.
- Add `source_system`, `source_record_id`, `source_version`, and `ingested_at` for imported reference/business data.

## 4. Spatial design

- Store interchange geometry as `geometry(..., 4326)` after strict input validation.
- Keep authoritative area as a computed value based on an approved equal-area/project CRS or PostGIS geography approach, documented by the domain owner.
- Add GiST indexes on parcel, village, district, and project geometry.
- Use `ST_IsValid`, `ST_MakeValid` only with a recorded repair outcome, `ST_SnapToGrid` where appropriate, and explicit geometry-type checks.
- Enforce that parcel geometry falls within the relevant administrative/project extent where the process requires it.
- Return GeoJSON only at the API boundary; keep typed geometry internally.
- Add spatial query limits and simplify geometry for dashboard map responses to prevent oversized payloads.

## 5. Migration sequence

1. Baseline the current schema and add missing reference geography tables/foreign keys.
2. Add identity assignments and capability/scope tables.
3. Add projects, proposal versions, workflow definitions, instances, tasks, and history.
4. Add documents, versions, import jobs, notifications, awards, possession, compensation, and payments.
5. Add affected families, entitlements, R&R milestones, audit, outbox, and integration runs.
6. Add reporting views/materialized aggregates and indexes after query shapes are known.
7. Add RLS policies, grants, seed data, and migration verification checks.

Each migration must be forward-only, reviewed, runnable on an empty database, and safe to apply once. Add rollback guidance for operational recovery, but do not rely on destructive down migrations in production.

