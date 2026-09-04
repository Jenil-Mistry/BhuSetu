# BhuSetu Backend Implementation Plan

## 1. Purpose

This plan turns SIH problem statement 26016 into an implementable backend for BhuSetu: a national, role-aware system that tracks land acquisition from proposal through possession, compensation, and rehabilitation and resettlement (R&R).

The plan is based on the current repository foundation:

- FastAPI application in `backend/main.py`.
- Supabase/PostgreSQL with PostGIS in `backend/db/supabase_init.sql`.
- S3-compatible MinIO storage in `backend/storage/minio_client.py`.
- A Next.js frontend consuming the API.

The current backend is a useful proof of concept, not yet an end-to-end land acquisition system. It currently exposes project and parcel reads, project creation, one parcel-intersection RPC, and two upload endpoints. Authentication, authorization, lifecycle workflows, audit history, compensation, R&R, notifications, integrations, pagination, tests, and production controls are still required.

## 2. Guiding decisions

1. **FastAPI modular monolith first.** Keep one deployable backend while separating routers, services, repositories, schemas, and workers. This is easier to demo, test, and operate than premature microservices.
2. **Supabase/PostgreSQL remains the system of record.** Use PostGIS for spatial data and SQL migrations/RPCs for transactional and spatial operations. Do not add an ORM because the repository has already chosen direct Supabase access.
3. **Workflow is data-driven.** Stages, transition rules, required documents, SLA durations, and escalation rules must be configurable. Do not hard-code one state’s legal process into Python.
4. **Every important change is attributable.** Store actor, role, timestamp, reason, source, and before/after values for workflow, parcel, award, payment, and R&R changes.
5. **Privacy by design.** Store only the minimum personally identifiable information required for the workflow. Never store raw Aadhaar/PAN numbers; retain only an approved reference or hash where legally permitted.
6. **Async work is explicit.** Notifications, exports, large GIS imports, document scanning, and integration retries should run through a worker/outbox design rather than block HTTP requests.
7. **Demoable vertical slices.** Build a complete proposal-to-dashboard path early, then deepen compensation, R&R, integrations, and analytics.

## 3. Document map

| File | Contents |
| --- | --- |
| `01_scope_and_acceptance.md` | Scope, actors, outcomes, MVP boundary, and acceptance criteria |
| `02_architecture_and_structure.md` | Backend architecture, module layout, request flow, and implementation conventions |
| `03_data_model_and_migrations.md` | Target data model, relationships, migration strategy, and spatial design |
| `04_api_and_workflows.md` | API surface, lifecycle state machine, validation, and event behavior |
| `05_security_integrations_and_operations.md` | Security, storage, integrations, observability, resilience, and deployment |
| `06_implementation_roadmap.md` | Ordered phases, deliverables, dependencies, and definition of done |

## 4. Definition of success

For the SIH demonstration, an authorized officer should be able to:

1. Create and submit a project proposal.
2. Route it for scrutiny and approval with comments and required documents.
3. Import or capture parcels on a map and validate geometry against administrative boundaries.
4. Issue notification and award records for selected parcels.
5. Record assessed compensation, payment progress, possession, and R&R outcomes.
6. View project, district, state, and national metrics with drill-down to the source records.
7. Prove who changed each important record and when.

Production readiness additionally requires independent security review, formal legal/process validation by the Ministry, integration certification, backup/restore tests, performance tests, and operational ownership.

