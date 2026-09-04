# API Surface and Workflow Design

## 1. Authentication and current user

Use Supabase Auth or an approved government identity provider for bearer-token verification. The backend must resolve the token subject to an internal user and active scoped assignments.

Initial endpoints:

```text
GET  /api/v1/me
GET  /api/v1/me/assignments
GET  /api/v1/reference/states
GET  /api/v1/reference/districts?state_id=...
```

The browser receives only the public/anon key where applicable. The service-role key stays server-side and should eventually be replaced with least-privilege database roles/RLS-compatible access.

## 2. Project proposal APIs

```text
POST   /api/v1/projects
GET    /api/v1/projects
GET    /api/v1/projects/{project_id}
PATCH  /api/v1/projects/{project_id}
POST   /api/v1/projects/{project_id}/submit
POST   /api/v1/projects/{project_id}/assign
GET    /api/v1/projects/{project_id}/tasks
POST   /api/v1/projects/{project_id}/tasks/{task_id}/complete
POST   /api/v1/projects/{project_id}/clarification
GET    /api/v1/projects/{project_id}/timeline
GET    /api/v1/projects/{project_id}/audit
```

Submission must validate required fields, geographic scope, budget/area consistency, duplicate official references, required document types, and current workflow stage.

## 3. Parcel and GIS APIs

```text
POST   /api/v1/projects/{project_id}/parcel-imports
GET    /api/v1/parcel-imports/{import_id}
GET    /api/v1/parcel-imports/{import_id}/errors
POST   /api/v1/projects/{project_id}/parcels
GET    /api/v1/projects/{project_id}/parcels
GET    /api/v1/parcels/{parcel_id}
PATCH  /api/v1/parcels/{parcel_id}
POST   /api/v1/parcels/{parcel_id}/verify
POST   /api/v1/projects/{project_id}/spatial/intersections
GET    /api/v1/projects/{project_id}/map-layer?zoom=...
```

Imports should be asynchronous for more than a small demo file. Accept GeoJSON first; add KML/KMZ through a parser service with file-size, feature-count, CRS, geometry-type, and zip-bomb controls.

## 4. Acquisition, money, possession, and R&R APIs

```text
POST  /api/v1/projects/{project_id}/notifications
GET   /api/v1/projects/{project_id}/notifications
POST  /api/v1/parcels/{parcel_id}/award
GET   /api/v1/projects/{project_id}/awards
POST  /api/v1/awards/{award_id}/assessments
POST  /api/v1/projects/{project_id}/payment-batches
GET   /api/v1/payment-batches/{batch_id}
POST  /api/v1/payment-batches/{batch_id}/submit
POST  /api/v1/payment-items/{item_id}/reconcile
POST  /api/v1/parcels/{parcel_id}/possession
POST  /api/v1/projects/{project_id}/families
GET   /api/v1/projects/{project_id}/families
POST  /api/v1/families/{family_id}/entitlements
PATCH /api/v1/rr-milestones/{milestone_id}
```

Payment APIs should record intent and status; they should not claim that funds were transferred until an approved payment integration or verified reconciliation confirms it.

## 5. Documents and storage APIs

```text
POST  /api/v1/documents/presign-upload
POST  /api/v1/documents/{document_id}/complete-upload
GET   /api/v1/documents/{document_id}
GET   /api/v1/documents/{document_id}/download-url
POST  /api/v1/documents/{document_id}/new-version
POST  /api/v1/documents/{document_id}/verify
```

The current direct upload endpoints can remain temporarily for the demo, but should be replaced with presigned multipart upload, server-side metadata completion, MIME/signature validation, checksum verification, malware scanning, and authorization at download time. The current MinIO bucket is private by default and the spelling/name of the existing bucket must be treated as a compatibility detail, not duplicated into new business logic.

## 6. Dashboard and MIS APIs

```text
GET /api/v1/dashboard/summary?scope_type=state&scope_id=...
GET /api/v1/dashboard/projects/{project_id}
GET /api/v1/dashboard/map?bbox=...&status=...
GET /api/v1/reports/acquisition?group_by=state&from=...&to=...
POST /api/v1/reports/exports
GET /api/v1/reports/exports/{export_id}
```

Define metric formulas in code and documentation. Example: “area acquired” must state whether it means parcels with possession taken, awards declared, or another statutory definition. Do not let every dashboard screen implement its own interpretation.

## 7. Recommended workflow state machine

Keep the exact statutory stage names configurable, but start with this implementation model:

```text
DRAFT
  -> SUBMITTED
  -> SCRUTINY
  -> CLARIFICATION_REQUIRED -> SUBMITTED
  -> RECOMMENDED
  -> APPROVED
  -> NOTIFICATION_IN_PROGRESS
  -> AWARD_IN_PROGRESS
  -> COMPENSATION_IN_PROGRESS
  -> POSSESSION_IN_PROGRESS
  -> RR_IN_PROGRESS
  -> COMPLETED

Any active stage -> ON_HOLD
ON_HOLD -> previous active stage
SCRUTINY/RECOMMENDED -> REJECTED
```

For parcels, keep parcel status independent from project status: `PROPOSED`, `NOTIFIED`, `AWARD_DECLARED`, `COMPENSATION_PENDING`, `COMPENSATION_PAID`, `POSSESSION_TAKEN`, `WITHDRAWN`, and `DISPUTED` are a starting vocabulary. Confirm legal names and section mappings before production.

## 8. Commands, events, and idempotency

Commands mutate state and produce events such as:

- `project.submitted`
- `workflow.task.assigned`
- `parcel.import.completed`
- `notification.issued`
- `award.declared`
- `payment.batch.submitted`
- `payment.item.reconciled`
- `possession.recorded`
- `rr.entitlement.updated`

Persist the event in `outbox_events` in the same database transaction as the mutation. Workers deliver notifications/integrations and retry with exponential backoff. Consumers must be idempotent using an event ID.

