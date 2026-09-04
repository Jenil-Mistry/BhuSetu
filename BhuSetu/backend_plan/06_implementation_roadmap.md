# Implementation Roadmap

## Phase 0 — Confirm the contract (1–2 days)

Deliverables:

- Confirm statutory process stages, required documents, approval authorities, and metric definitions with the problem-owner perspective.
- Decide the identity provider and initial role/scope matrix.
- Define the SIH demo scenario and synthetic seed data.
- Record decisions as versioned configuration, not tribal knowledge.

Exit criteria: a signed-off workflow diagram, role matrix, data classification list, and MVP demo script.

## Phase 1 — Backend foundation (2–3 days)

Deliverables:

- Refactor the current single-file API into an app factory, config, routers, services, repositories, schemas, errors, and middleware.
- Add typed settings, correlation IDs, stable error envelopes, pagination utilities, and request limits.
- Add pytest, lint/type-check configuration, clean-database migration command, and seeded fixtures.
- Split health into liveness and readiness; keep current endpoints backward-compatible while migrating.

Exit criteria: the app boots from a clean environment, `/docs` is accurate, CI runs tests, and no secret is logged.

## Phase 2 — Identity, authorization, and audit (3–4 days)

Deliverables:

- Verify bearer tokens and map subjects to internal users.
- Add assignments, capabilities, administrative scopes, and policy dependencies.
- Add append-only audit events and audit query endpoint.
- Add negative tests for cross-scope reads/writes and privileged actions.

Exit criteria: every protected endpoint has an authorization test and every mutation produces an audit event.

## Phase 3 — Proposal and workflow vertical slice (4–6 days)

Deliverables:

- Add proposal versions, workflow definitions/instances/tasks/history, comments, SLA dates, and transition commands.
- Implement create, submit, assign, scrutinize, clarification, approve, reject, hold, resume, and complete.
- Add required document checks and idempotent command handling.
- Add outbox event creation for transitions and assignments.

Exit criteria: a synthetic proposal can move from draft to approved/completed through authorized actions, with a complete timeline and no invalid transitions.

## Phase 4 — GIS and parcel management (4–6 days)

Deliverables:

- Add parcel imports/jobs/rows, GeoJSON validation, KML/KMZ parser path, geometry repair reporting, and import idempotency.
- Correct area/intersection calculations and add project map-layer queries with bounding-box filters.
- Add parcel verification and survey evidence metadata.
- Preserve the current intersection endpoint as a compatibility wrapper over the new service.

Exit criteria: a test import produces expected parcels, rejects malformed rows with explanations, detects overlaps, and returns map-safe GeoJSON.

## Phase 5 — Documents and statutory records (4–6 days)

Deliverables:

- Replace direct uploads with presign/complete flow while retaining a safe migration path.
- Add document types, versions, checksums, access classification, scan status, and audit/download history.
- Add notifications, awards, possession records, and milestone endpoints.
- Add database constraints for official references and duplicate commands.

Exit criteria: every workflow-required document is versioned and privately retrievable, and a project can show notification-to-possession evidence.

## Phase 6 — Compensation and R&R (5–7 days)

Deliverables:

- Add assessment components, approval, payment batches/items, reconciliation states, and masked beneficiary references.
- Add affected family, entitlement, R&R milestone, evidence, and access-redaction rules.
- Add explicit financial rounding tests and reconciliation fixtures.
- Add mock PFMS/DBT adapter contract without claiming real transfer.

Exit criteria: the demo can show assessed, initiated, cleared, failed, and reconciled examples plus family-level R&R progress under correct permissions.

## Phase 7 — Dashboards, reports, and notifications (4–6 days)

Deliverables:

- Implement documented national/state/district/project metric queries.
- Add dashboard summary, map filters, drill-down, CSV/JSON export, and asynchronous export jobs.
- Add outbox worker for email/SMS mock delivery, SLA reminders, retries, and failure visibility.
- Add data-quality indicators so missing/stale data is visible rather than silently treated as zero.

Exit criteria: dashboard totals reconcile to fixture records at every scope and exports are auditable and permission-filtered.

## Phase 8 — Integration, hardening, and demo readiness (4–7 days)

Deliverables:

- Add adapter interfaces and mocked land-record/cadastral/payment/notification integrations.
- Add RLS/grants review, dependency scan, upload abuse tests, rate limits, and security checklist.
- Add Dockerized API/worker, CI pipeline, seed/reset instructions, backup/restore notes, and troubleshooting runbook.
- Run a full scripted demo and capture API contract examples for the frontend team.

Exit criteria: reproducible setup from the README, green automated checks, known limitations documented, and no real sensitive data in the demo.

## 9. Priority order if time is severely limited

1. Authorization and audit.
2. Proposal workflow with required documents.
3. Parcel import, validation, and spatial overlap.
4. Compensation/R&R summary records.
5. Dashboard metrics and export.
6. Mock integrations and notifications.
7. Predictive analytics only after data-quality baselines.

## 10. Final backend definition of done

- The API is modular, typed, documented, and tested.
- Database changes are migrations, not ad hoc dashboard edits.
- Workflow transitions, money states, and metric definitions are explicit.
- GIS calculations are CRS-appropriate and input validation is visible.
- Authorization is scope-aware and tested for denial cases.
- Documents are private, versioned, and auditable.
- Long-running work is asynchronous and retryable.
- Dashboard values are reproducible from source records.
- The SIH demo is seeded, repeatable, and honest about mocked integrations and deferred production requirements.

