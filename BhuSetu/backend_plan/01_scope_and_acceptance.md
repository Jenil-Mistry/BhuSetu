# Scope and Acceptance Criteria

## 1. Stakeholders and roles

Use permissions as capabilities, not only role-name checks. A user can hold multiple assignments scoped to an organization, state, district, or project.

| Actor | Typical capabilities |
| --- | --- |
| National administrator | Manage reference data, organizations, workflow configuration, users, and national reporting |
| Central ministry reviewer | Review centrally routed proposals, monitor portfolio, export reports |
| State nodal officer | Review state submissions, assign district work, approve state-level actions |
| District land acquisition officer | Scrutinize proposals, manage notifications/awards, verify parcel and possession records |
| Project implementing agency | Submit proposals, upload plans/documents, view project progress |
| Surveyor / field verifier | Capture parcel geometry, evidence, coordinates, and verification remarks from mobile UI |
| Compensation officer | Assess compensation, manage payment batches, reconcile outcomes |
| R&R officer | Register affected/displaced families, plans, entitlements, and completion evidence |
| Auditor / read-only official | Search records, inspect history, run authorized reports |
| Citizen / public viewer (optional) | View only approved, non-sensitive public project statistics and map layers |

## 2. Functional scope

### In scope for the backend

- Tenant-like administrative scoping across ministry, state, district, village, organization, and project.
- Project proposal intake, validation, submission, assignment, scrutiny, clarification, approval, rejection, hold, and completion.
- Cadastral parcel import, manual/field capture, geometry validation, overlap analysis, parcel lifecycle, and verification evidence.
- Configurable notification records, award records, compensation assessment and disbursement tracking.
- Affected/displaced family registration and R&R milestone tracking.
- Secure document metadata and object storage with versioning, access checks, checksums, and presigned URLs.
- Notifications and SLA reminders through an outbox and worker.
- Dashboards and exportable MIS reports with server-side filters and aggregation.
- Integration adapter boundary for land records, cadastral maps, PFMS/DBT, identity, messaging, and government portals.
- Full audit trail, structured error responses, health/readiness checks, and API documentation.

### Explicitly deferred until requirements are confirmed

- Automatic legal decisions or eligibility decisions made solely by predictive models.
- Direct mutation of external government systems without an approved integration contract.
- Storing raw Aadhaar, PAN, bank account, or other sensitive identifiers.
- Public disclosure of owner/family-level personal data.
- A nationwide production rollout before state-specific process and legal validation.

## 3. MVP vertical slice

The first demonstrable slice should cover one project, one district, and representative parcels:

1. Login and role-scoped access.
2. Project draft, proposal document upload, submit, assign, review, approve/reject.
3. Parcel upload from GeoJSON/KML, geometry validation, map retrieval, and intersection report.
4. Notification, award, compensation, possession, and R&R summary records.
5. Dashboard totals derived from database queries.
6. Audit history and an export of the project record.

Avoid building predictive analytics before the underlying event and milestone data is trustworthy.

## 4. Acceptance criteria

### Workflow

- A proposal cannot be submitted without required fields and required document types.
- Only an authorized assignee or approving authority can perform each transition.
- Invalid transitions return a stable error code and do not partially modify data.
- Every transition records actor, time, comment/reason, previous state, next state, and request correlation ID.
- A rejected or clarification-requested proposal can be resubmitted without erasing its history.

### GIS and parcels

- Uploaded geometries are parsed, normalized to EPSG:4326 for interchange, checked for validity, and rejected or repaired with a visible warning.
- Parcel area is calculated in an appropriate equal-area/project CRS; Web Mercator is not used as the authoritative area calculation.
- Intersection results include parcel identifiers, overlap area, percentage, and geometry suitable for map rendering.
- Imports are idempotent using an import job and source-row key; a retry does not duplicate parcels.

### Money and R&R

- Monetary values use fixed-precision numeric storage and explicit currency, not binary floating-point fields.
- Compensation assessment and disbursement are separate records with status, amount, beneficiary reference, source, and reconciliation state.
- R&R progress is represented by family-level eligibility/entitlement records plus project-level milestones, with sensitive fields access-controlled.

### Security and operations

- Protected endpoints require a verified identity and capability plus administrative scope.
- Service-role credentials are never exposed to the browser.
- Documents are private by default and are served through short-lived authorized URLs.
- Audit records are append-only to application users; privileged audit access is separately logged.
- Health checks distinguish process health from database/storage readiness.

### Reporting

- National, state, district, and project views show consistent definitions for notified area, acquired area, paid compensation, affected families, displaced families, possession, and milestone adherence.
- Every dashboard metric can be traced to a documented query and filtered source records.
- Large exports are asynchronous and produce a downloadable object with expiry.

