# BhuSetu: Real-Time National Land Acquisition & Management System

BhuSetu is a high-performance geospatial land acquisition and management platform designed to streamline infrastructure projects, cadastral parcel mapping, compensation workflows, and boundary layer management across administrative divisions.

---

## 🏛️ Architecture Overview

- **Frontend**: Next.js (React 19, TypeScript), Tailwind CSS, [MapLibre GL JS](https://maplibre.org/) for vector tile rendering, and Lucide icons.
- **Backend**: FastAPI (Python 3.10+), Supabase Python Client (`supabase-py`), Boto3 (for S3/MinIO). **No ORM**.
- **Database**: Supabase (PostgreSQL with native PostGIS spatial extensions & RPC functions).
- **Storage**: MinIO (local S3-compatible object storage) running via Docker for KML boundary documents and geo-tagged survey photos.

---

## 📖 Developer Documentation & Project Status

> **New to the project?** Detailed developer guides, completed milestones, and remaining roadmaps are documented inside the [`docs/`](file:///c:/Users/yg159/OneDrive/Desktop/sih/BhuSetu/docs/README.md) folder:
> - 📄 **[Master Developer Handover](file:///c:/Users/yg159/OneDrive/Desktop/sih/BhuSetu/docs/README.md)**: System overview, architecture diagram, and full-stack setup.
> - 🖥️ **[Frontend Status & Guide](file:///c:/Users/yg159/OneDrive/Desktop/sih/BhuSetu/docs/FRONTEND.md)**: Next.js 16 app router, MapLibre GIS, all 8 role views, and pending tasks.
> - ⚙️ **[Backend Status & Guide](file:///c:/Users/yg159/OneDrive/Desktop/sih/BhuSetu/docs/BACKEND.md)**: FastAPI engine, PostGIS schema, RFCTLARR workflow, test suite, and roadmap.

---

## 📁 Repository Structure

```text
BhuSetu/
├── docs/                           # Comprehensive developer handover documentation
│   ├── README.md                   # Master index & quickstart
│   ├── FRONTEND.md                 # Frontend architecture, implemented views & roadmap
│   └── BACKEND.md                  # Backend architecture, PostGIS schema & roadmap
├── docker-compose.yml              # Local MinIO S3 object storage with auto-bucket provisioning
├── README.md                       # Monorepo overview
├── backend/                        # FastAPI Python engine (No ORM, PostGIS, S3)
│   ├── .env.example                # Supabase and MinIO environment configurations
│   ├── requirements.txt            # FastAPI, uvicorn, supabase, boto3, python-dotenv
│   ├── main.py                     # FastAPI application entrypoint
│   ├── db/                         # PostGIS schema, migrations & seed scripts
│   └── storage/                    # MinioStorageService for KML & geotagged photos
├── frontend/                       # Next.js 16, React 19, MapLibre GIS, Tailwind v4
│   ├── .env.example                # Map style and API URL configurations
│   ├── package.json                # Next.js dependencies + maplibre-gl & lucide-react
│   ├── app/                        # Next.js App Router (pages, layout, styles)
│   ├── components/                 # Reusable UI & role-specific stakeholder views
│   ├── lib/                        # API client, offline mock store, and auth context
│   └── hooks/                      # Custom React hooks
└── backend_plan/                   # Initial SIH problem architecture plans
```

---

## 🚀 Getting Started

### 1. Start Local Object Storage (MinIO)

Run the docker container to start MinIO. The auto-provisioning entrypoint creates the `land-aquisition-docs` bucket automatically:

```bash
docker compose up -d
```

- **MinIO API (S3)**: [http://localhost:9000](http://localhost:9000)
- **MinIO Web Console**: [http://localhost:9001](http://localhost:9001)
- **Default Credentials**: `minioadmin` / `minioadmin`

---

### 2. Configure Database (Supabase)

1. Open your Supabase SQL Editor.
2. Execute the initialization script located in:
   ```text
   backend/db/supabase_init.sql
   ```
   This activates `postgis` and `uuid-ossp`, defines state management enums (`project_status`, `payment_status`, `parcel_status`), provisions spatial tables (`organizations`, `districts`, `villages`, `parties`, `app_users`, `projects`, `land_parcels`), and compiles the `calculate_parcel_intersections` PostGIS RPC function.

---

### 3. Backend Setup

```bash
cd backend

# Create and activate virtual environment (optional)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase URL and Service Role Key

# Start the FastAPI development server
uvicorn main:app --reload --port 8000
```

- **API Documentation (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

- **Web Application**: [http://localhost:3000](http://localhost:3000)
