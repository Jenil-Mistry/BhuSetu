# ⚙️ BhuSetu Backend: Developer Guide & Status Report

This document details the backend architecture, database design, API design, completed features, running instructions, and the pending development roadmap for the **BhuSetu** engine.

---

## 🏛️ Architecture & Design Philosophy

The BhuSetu backend is engineered as a high-throughput, cloud-ready REST API built with **FastAPI** (Python 3.10+).

### Key Architectural Decisions:
1. **No Heavy ORM**: Direct execution of SQL queries and native PostGIS stored procedures via the `supabase-py` client ensures microsecond spatial calculation times and avoids ORM impedance mismatch.
2. **Dual-Mode Repository Pattern (`BaseRepository`)**:
   - When connected to Supabase / PostgreSQL, queries hit spatial tables and PostGIS RPC functions.
   - When running without database credentials (e.g. offline testing, hackathon demo), repositories automatically fall back to an in-memory synthetic store (`self.store`).
   - The service layer remains 100% agnostic of whether data originates from PostgreSQL or in-memory seeds.
3. **Strict Scope-Based RBAC**: Handled via dependency injection (`require_scope("projects:approve")`) with JWT bearer token verification.
4. **Append-Only Audit & Transactional Outbox**: Every mutation records a tamper-evident audit entry and enqueues an outbox event for asynchronous notification/dispatch.

---

## 🛠️ Technology Stack

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | FastAPI | `^0.115` | Async REST API, OpenAPI 3.1 auto-documentation |
| **ASGI Server** | Uvicorn | `^0.34` | High-concurrency async web server |
| **Validation** | Pydantic & `pydantic-settings` | `^2.7` | Typed request/response validation and environment config |
| **Database Client** | Supabase Python (`supabase-py`) | `^2.11` | Connection pooling and PostGIS RPC execution |
| **Spatial Engine** | PostGIS Extensions | `3.4+` | Geometry intersection, buffer generation, area calculations |
| **Object Storage** | Boto3 (Amazon S3 / MinIO) | `^1.36` | Presigned URL generation for DPR KMLs and survey photos |
| **Test Suite** | Pytest & Starlette TestClient | `^9.1` | Unit and integration test automation (17 passing tests) |

---

## 📁 Backend Directory Structure

```text
backend/
├── app/
│   ├── main.py                   # App factory, CORS, exception handlers, and /health check
│   ├── config.py                 # Pydantic BaseSettings (Supabase, MinIO, JWT, CORS)
│   ├── dependencies.py           # Dependency injection (get_db, init_supabase, require_scope)
│   ├── errors.py                 # Centralized exception types & standardized JSON envelope
│   ├── middleware.py             # CorrelationIdMiddleware for distributed request tracing
│   ├── api/
│   │   └── v1/
│   │       ├── router.py         # Root aggregator for /api/v1 endpoints
│   │       ├── auth.py           # JWT token issuance, verification, and role profiles
│   │       ├── projects.py       # Acquisition corridor proposals & workflow transitions
│   │       ├── parcels.py        # Cadastral parcels, spatial intersection & survey logs
│   │       ├── compensation.py   # Valuation assessments & PFMS DBT payment batches
│   │       ├── rehabilitation.py # Project Affected Families (PAF) census & R&R awards
│   │       ├── documents.py      # Presigned S3/MinIO upload/download endpoints
│   │       ├── notifications.py  # Gazette publication registry & Section 11/19 records
│   │       ├── dashboards.py     # Aggregated national, state, and district metrics
│   │       ├── reports.py        # Statutory MIS summaries & export jobs
│   │       ├── admin.py          # Audit log queries & outbox queue monitoring
│   │       └── reference.py      # Master data (Districts, Tehsils, Villages, Organizations)
│   ├── repositories/
│   │   ├── base.py               # BaseRepository with seamless in-memory fallback store
│   │   ├── project_repo.py       # Project proposals, versions, and timeline persistence
│   │   ├── parcel_repo.py        # Cadastral land parcels and spatial geometry queries
│   │   ├── compensation_repo.py  # Compensation matrices and PFMS payment records
│   │   ├── document_repo.py      # Document metadata, versions, and checksum tracking
│   │   └── audit_repo.py         # Append-only audit trail and transactional outbox
│   ├── services/
│   │   ├── workflow_service.py   # RFCTLARR 2013 statutory stage transition engine
│   │   ├── compensation_service.py # Section 26-30 formula calculator
│   │   ├── spatial_service.py    # GeoJSON intersection & RoW buffer calculations
│   │   ├── document_service.py   # Presigned URL generation & file validation
│   │   └── audit_service.py      # Event hashing and asynchronous outbox generation
│   ├── schemas/                  # Pydantic schemas (auth, statutory, compensation, etc.)
│   ├── security/                 # JWT encoding/decoding and permission scope sets
│   └── workers/                  # Outbox event processor for asynchronous tasks
├── db/
│   ├── migrate.py                # Migration runner script
│   ├── supabase_init.sql         # Consolidated PostGIS schema initialization
│   └── migrations/
│       ├── 001_baseline_and_geography.sql    # Organizations, districts, villages
│       ├── 002_identity_and_scopes.sql       # Users, roles, capabilities, scopes
│       ├── 003_projects_and_workflows.sql    # Projects, proposals, workflow tasks
│       ├── 004_parcels_and_gis.sql           # PostGIS land_parcels, survey_logs
│       ├── 005_statutory_and_compensation.sql# Gazette notices, compensation matrices
│       ├── 006_rr_and_audit_outbox.sql       # PAF census, R&R, immutable audit, outbox
│       ├── 007_postgis_rpcs_and_functions.sql# calculate_parcel_intersections RPC
│       └── 008_demo_seeds.sql                # Synthetic Indian highway corridor seeds
├── storage/
│   └── minio_client.py           # MinioStorageService for S3 bucket operations
├── tests/
│   ├── unit/                     # Workflow, compensation, spatial, and scope tests
│   └── integration/              # Full HTTP API v1 test suite
└── main.py                       # Root entrypoint for 'uvicorn main:app' compatibility
```

---

## 🗄️ Database Architecture & Migrations

The database is designed for **PostgreSQL 15+** with the **PostGIS** extension enabled.

### Migration Sequence:
1. `001_baseline_and_geography.sql`: Enables `postgis` and `uuid-ossp`. Defines administrative geography hierarchy (`organizations`, `districts`, `tehsils`, `villages`).
2. `002_identity_and_scopes.sql`: Defines RBAC tables (`app_users`, `roles`, `user_scopes`) supporting CALA, PIA, Revenue Officer, Compensation Officer, and Auditor.
3. `003_projects_and_workflows.sql`: Project corridor definitions, DPR metadata, and state transition histories.
4. `004_parcels_and_gis.sql`: PostGIS spatial tables for `land_parcels` with `geometry(Polygon, 4326)` and spatial indices (`GIST`).
5. `005_statutory_and_compensation.sql`: Gazette notices, Section 26 market valuation records, and PFMS disbursement batches.
6. `006_rr_and_audit_outbox.sql`: Affected families register (`paf_census`), R&R entitlement ledger, append-only `audit_logs`, and transactional `outbox_events`.
7. `007_postgis_rpcs_and_functions.sql`: Compiles the `calculate_parcel_intersections(corridor_geom, buffer_meters)` database stored procedure.
8. `008_demo_seeds.sql`: Synthetic data covering NH-48 Vadodara-Ahmedabad widening corridor with realistic coordinates and cadastral khasras.

---

## ✅ What Has Been Implemented

### 1. RFCTLARR 2013 Workflow Engine (`app/services/workflow_service.py`)
Enforces statutory progression rules:
`DRAFT` ➔ `SUBMITTED` ➔ `UNDER_SCRUTINY` ➔ `SECTION_11_PUBLISHED` ➔ `HEARING_STAGE` ➔ `SECTION_19_DECLARED` ➔ `AWARD_APPROVED` ➔ `POSSESSION_TAKEN` ➔ `COMPLETED`
- Blocks invalid state jumps (e.g. attempting to approve an award before Section 19 declaration).
- Records actor ID, timestamp, and transition comments for compliance audits.

### 2. Statutory Compensation Calculator (`app/services/compensation_service.py`)
Computes mandatory RFCTLARR Act 2013 components:
- **Section 26**: Base market value determined from circle rates or recent registered sale deeds.
- **Section 28**: Multiplication factor (1.0x for urban, up to 2.0x for rural land based on distance from urban limits).
- **Section 30(1)**: 100% mandatory Solatium on land and attached asset value.
- **Section 30(3)**: 12% per annum additional compensation from Section 11 publication date to award date.

### 3. Cadastral Spatial Engine (`app/services/spatial_service.py`)
- Executes spatial overlap checks between Highway Alignment KML/GeoJSON and cadastral boundary polygons.
- Returns affected parcel IDs, calculated intersection area in hectares, and percentage of parcel acquired.

### 4. Direct Benefit Transfer (DBT) & PFMS Simulator (`app/api/v1/compensation.py`)
- Generates disbursement batches for approved awards.
- Simulates automated bank validation (NPCI Aadhaar-seeded account verification).
- Idempotent execution of payment batches preventing duplicate beneficiary payouts.

### 5. Document Storage with Presigned S3/MinIO URLs (`app/services/document_service.py`)
- Generates short-lived presigned upload and download URLs.
- Verifies SHA-256 file checksums to guarantee document integrity.

### 6. Automated Pytest Test Suite (`tests/`)
- **17 Passing Automated Tests**:
  - `test_workflow.py`: Statutory state machine transitions.
  - `test_compensation.py`: RFCTLARR mathematical precision tests.
  - `test_spatial.py`: Geometric intersection and buffer calculations.
  - `test_security_scopes.py`: Authorization enforcement and scope rejections.
  - `test_api_v1.py`: Integration testing of all public and protected HTTP endpoints.

---

## 🚀 What Remains To Be Done (Backend Roadmap)

Incoming backend developers should focus on the following backlog items:

### Priority 1: High Impact for Hackathon / Production
1. **Live Supabase / PostgreSQL Deployment**:
   - *Current State*: Backend is tested with in-memory fallback and ready SQL migrations.
   - *Pending Task*: Execute migrations `001` through `008` against a live Supabase cloud database instance and configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`.
2. **Asynchronous GeoJSON / Shapefile Processing Worker**:
   - *Current State*: Small GeoJSON payloads are processed synchronously in the request thread.
   - *Pending Task*: For large Cadastral Shapefiles (>20MB, 50,000+ parcels), implement a Celery or Arq worker with Redis to process spatial geometry in the background and notify via WebSocket/Outbox.
3. **Real PFMS / Bank Gateway Webhook Handler**:
   - *Current State*: Payment batch transitions are simulated via REST endpoints.
   - *Pending Task*: Expose a signed webhook endpoint (`/api/v1/compensation/webhook/pfms`) verifying HMAC SHA-256 signatures for bank ACK/NACK status callbacks.

### Priority 2: Infrastructure & Enterprise Hardening
4. **SMS / Email Outbox Dispatcher Service**:
   - *Current State*: Records are written to `outbox_events` in the database.
   - *Pending Task*: Build a background daemon (`app/workers/outbox_worker.py`) that polls pending outbox events and triggers SMS/Email notifications via CDAC / NIC SMS Gateway or SendGrid.
5. **Dynamic Vector Tile Server Integration**:
   - *Current State*: GeoJSON features are queried via REST.
   - *Pending Task*: Deploy `pg_tileserv` or implement an MVT endpoint (`/api/v1/gis/tiles/{z}/{x}/{y}.pbf`) for streaming millions of village cadastral maps at 60fps.
6. **Production Rate Limiting & Security Headers**:
   - *Current State*: CORS and Correlation ID middlewares enabled.
   - *Pending Task*: Add `slowapi` rate limiting on public citizen inquiry endpoints to prevent scraping of land records.

---

## 🏃 Setup & Development Commands

### 1. Configure Environment
Create a `.env` file in `backend/`:
```env
APP_NAME=BhuSetu Land Acquisition & Management Engine
ENVIRONMENT=development
API_V1_PREFIX=/api/v1
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Optional: Supabase credentials (runs in mock/fallback mode if omitted)
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-key

# MinIO S3 Object Storage
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=land-aquisition-docs
```

### 2. Activate Virtual Environment & Install Dependencies
```bash
cd backend

# On Windows
python -m venv venv
.\venv\Scripts\activate

# On Linux/macOS
# python3 -m venv venv
# source venv/bin/activate

pip install -r requirements.txt
```

### 3. Start Development Server
```bash
uvicorn main:app --reload --port 8000
```
- Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- OpenAPI Specification: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

### 4. Run Automated Test Suite
```bash
pytest -v
```
All 17 tests will run and validate the complete service stack.
