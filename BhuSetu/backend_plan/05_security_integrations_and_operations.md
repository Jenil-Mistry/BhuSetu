# Security, Integrations, and Operations

## 1. Security baseline

- Verify JWT signature, issuer, audience, expiry, and revocation strategy; do not trust a user ID supplied in request JSON.
- Authorize every read and write using capability plus organization/state/district/project scope.
- Add database RLS and least-privilege grants; treat a service-role client as a temporary backend-only implementation detail.
- Keep secrets in environment/secret management, never source control or logs. Rotate Supabase, MinIO, signing, and integration credentials.
- Validate all filenames, MIME types, magic bytes, sizes, archive contents, and upload destinations. Prevent path traversal and object-key collisions.
- Keep documents private; use short-lived presigned URLs and record download access for sensitive classifications.
- Redact personal, identity, financial, and token data from logs, traces, error responses, and exports by default.
- Add rate limits for login-adjacent, upload, import, export, and expensive spatial endpoints.
- Use security headers, strict CORS allowlists, TLS in deployed environments, and request body/file limits.
- Apply retention, archival, legal hold, and deletion rules only after the Ministry defines them.

## 2. Audit and accountability

Audit at least:

- Sign-in/access failures and privileged reads.
- Project creation, field edits, submissions, assignments, decisions, and holds.
- Parcel imports, geometry repairs, verification outcomes, and ownership links.
- Notification/award creation and document version changes.
- Compensation assessment, payment submission/reconciliation, and possession.
- Family/entitlement changes and every export/download of protected data.

Audit records should be append-only, time-synchronized, correlation-linked, and queryable by entity, actor, action, scope, and date. Store a safe before/after diff; never write raw secrets or unnecessary identity documents into audit JSON.

## 3. Integration boundary

Implement adapters with a common contract rather than embedding vendor-specific calls in services:

```python
class GovernmentAdapter(Protocol):
    def health(self) -> IntegrationHealth: ...
    def pull(self, request: PullRequest) -> PullResult: ...
    def push(self, request: PushRequest) -> PushResult: ...
```

Potential adapters, subject to official API availability and approval:

- Land records and cadastral map source.
- Identity and organization directory.
- PFMS/DBT or approved payment status source.
- SMS/email/push notification provider.
- Document signing/verification service.
- Existing ministry/state portals.

For every adapter define authentication, schema mapping, rate limits, timeout, retry, idempotency, pagination, error mapping, reconciliation, and ownership. Use mocked adapters for the SIH demo. Never present a local mock payment as a real disbursement.

## 4. Background jobs

Implement a small worker process around `outbox_events` before adding a heavyweight broker:

- notification delivery and deadline reminders;
- parcel import and geometry validation;
- document virus scan and metadata extraction;
- report generation and export expiry;
- integration polling/push and reconciliation;
- aggregate refresh/materialized view refresh.

Each job needs a lease/visibility timeout, bounded retries, dead-letter/error state, metrics, and an operator replay action. The HTTP API should return `202` with a job ID for long-running work.

## 5. Observability

- JSON logs with `request_id`, `actor_id` (when safe), route, status, latency, and service version.
- Metrics for request rate/error rate/latency, database calls, spatial query duration, import rows, queue age, notification failures, and integration reconciliation.
- Traces across HTTP, database, storage, worker, and external adapter boundaries where infrastructure supports it.
- Readiness checks for Supabase and MinIO; liveness should not fail just because a dependency is temporarily unavailable.
- Alert on elevated 5xx, queue backlog, failed payment reconciliations, storage failures, and overdue workflow SLAs.

## 6. Testing strategy

### Unit

- permission and scope policies;
- workflow transition rules;
- money calculations and rounding;
- metric definitions;
- geometry normalization/validation helpers;
- idempotency and retry behavior.

### Integration

- Supabase migrations on a clean database;
- PostGIS intersection and area calculations;
- RLS/policy behavior;
- MinIO upload, private download, checksum, and versioning;
- transaction behavior for command + audit + outbox.

### Contract and end-to-end

- OpenAPI response contracts used by the frontend;
- proposal-to-completion happy path;
- rejection/clarification/resubmission;
- duplicate import/payment retry;
- unauthorized cross-district access;
- dashboard totals versus fixture records.

Add deterministic fixtures with fake parties and never use real personal or financial data in development.

## 7. Deployment path

### SIH demo

- Docker Compose for MinIO and a documented Supabase project.
- One API process and one worker process.
- Seeded demo organizations, users, projects, parcels, documents, and workflow tasks.
- HTTPS only if exposed beyond the local network.

### Production evolution

- Separate development/staging/production Supabase projects and storage buckets.
- CI checks: formatting, linting, type checks, unit/integration/contract tests, migration validation, dependency/security scan.
- Immutable container build, non-root runtime, pinned dependency lock/export, and environment-specific configuration.
- Automated encrypted backups, tested restore, point-in-time recovery where available, and documented RPO/RTO.
- Blue/green or rolling deployments with backward-compatible migrations and a runbook for failure/replay.

## 8. Known implementation risks

| Risk | Mitigation |
| --- | --- |
| State processes differ | Configurable workflows and a process/legal validation workshop |
| Inaccurate cadastral data | Source/version metadata, validation, verification tasks, and confidence flags |
| Sensitive data exposure | Scope checks, RLS, redaction, private storage, reviewable exports |
| Payment status misunderstood | Separate intent, provider response, and reconciliation states |
| Large national map payloads | Tiled/generalized layers, bounding-box filters, pagination, caching |
| Service-role overreach | Backend-only access now; migrate to least privilege/RLS before rollout |
| Predictive analytics built on weak data | Baseline descriptive metrics and data-quality score before prediction |

