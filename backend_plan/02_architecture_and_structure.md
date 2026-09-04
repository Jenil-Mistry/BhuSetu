# Backend Architecture and Code Structure

## 1. Target architecture

```text
Next.js web/mobile UI
        |
        v
FastAPI API (/api/v1)
  auth + scope + validation + rate limits
        |
        +--> domain services --> Supabase/PostgreSQL + PostGIS
        |                         - transactions
        |                         - RLS / database grants
        |                         - spatial RPCs and reporting views
        |
        +--> document service --> MinIO/S3
        |
        +--> outbox --> worker --> notifications / external integrations
        |
        +--> report jobs --> object storage
```

Start as a modular monolith. Split workers or services only when traffic, isolation, or deployment requirements justify it.

## 2. Proposed module layout

```text
backend/
├── app/
│   ├── main.py                 # app factory and lifespan
│   ├── config.py               # typed settings, no secret logging
│   ├── dependencies.py         # DB, current user, scope, request context
│   ├── errors.py               # stable error codes and exception handlers
│   ├── middleware.py           # correlation ID, access log, timing
│   ├── api/v1/                 # thin HTTP routers
│   │   ├── auth.py
│   │   ├── projects.py
│   │   ├── parcels.py
│   │   ├── notifications.py
│   │   ├── compensation.py
│   │   ├── rehabilitation.py
│   │   ├── documents.py
│   │   ├── dashboards.py
│   │   ├── reports.py
│   │   └── admin.py
│   ├── schemas/                # Pydantic request/response contracts
│   ├── services/               # business rules and transactions
│   ├── repositories/           # Supabase table/RPC access only
│   ├── integrations/           # adapter interfaces and implementations
│   ├── workers/                # outbox, reminders, imports, exports
│   └── security/               # token verification, policy checks, redaction
├── db/
│   ├── migrations/             # numbered forward-only SQL migrations
│   ├── functions/              # PostGIS/reporting functions
│   └── seeds/                  # safe demo/reference data
├── storage/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
└── requirements.txt
```

`backend/main.py` can remain as a compatibility entry point that imports the app factory during migration. Do not keep adding endpoints to the current single file.

## 3. Request processing convention

1. Middleware assigns a correlation ID and records request metadata without sensitive payloads.
2. FastAPI dependency verifies the bearer token and loads the current user/assignments.
3. Policy dependency checks capability and administrative scope.
4. Router validates the request schema and calls one domain service.
5. Domain service performs business validation and coordinates one transaction where possible.
6. Repository executes a parameterized Supabase query or approved RPC.
7. The same transaction appends an audit event and, where needed, an outbox event.
8. Response schema hides internal columns and returns a stable envelope.

## 4. API conventions

- Prefix all public endpoints with `/api/v1`.
- Use plural resources: `/projects`, `/parcels`, `/documents`, `/awards`.
- Use nested routes only when the parent scope is essential, for example `/projects/{project_id}/milestones`.
- Use UUIDs for externally visible entity identifiers.
- Use cursor pagination for large lists; support stable sorting and documented filters.
- Use `201` for creation, `202` for queued imports/exports, `204` for successful deletes where deletion is permitted.
- Return a consistent shape such as `{ "data": ..., "meta": ..., "error": null }`.
- Return machine-readable errors: `{ "error": { "code": "WORKFLOW_INVALID_TRANSITION", "message": "...", "details": {} } }`.
- Require an `Idempotency-Key` on payment, import, submission, and other retry-sensitive commands.
- Generate OpenAPI from FastAPI and add contract tests for frontend-consumed responses.

## 5. Transaction boundaries

Commands that must be atomic:

- Workflow transition + transition history + audit event + notification outbox event.
- Compensation assessment approval + audit event.
- Payment batch state update + reconciliation event.
- Parcel import row commit + import status/error record.
- Document metadata version creation + audit event after successful object upload.

If Supabase HTTP calls cannot provide the required transaction boundary, implement a PostgreSQL function/RPC for that command rather than pretending multiple HTTP requests are atomic.

