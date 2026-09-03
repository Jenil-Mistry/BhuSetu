# BhuSetu: Real-Time National Land Acquisition & Management System

BhuSetu is a high-performance geospatial land acquisition and management platform designed to streamline infrastructure projects, cadastral parcel mapping, compensation workflows, and boundary layer management across administrative divisions.

---

## 🏛️ Architecture Overview

- **Frontend**: Next.js (React 19, TypeScript), Tailwind CSS, [MapLibre GL JS](https://maplibre.org/) for vector tile rendering, and Lucide icons.
- **Backend**: FastAPI (Python 3.10+), Supabase Python Client (`supabase-py`), Boto3 (for S3/MinIO). **No ORM**.
- **Database**: Supabase (PostgreSQL with native PostGIS spatial extensions & RPC functions).
- **Storage**: MinIO (local S3-compatible object storage) running via Docker for KML boundary documents and geo-tagged survey photos.

---

## 📁 Repository Structure

```text
BhuSetu/
├── docker-compose.yml              # Local MinIO S3 object storage with auto-bucket provisioning
├── README.md                       # Monorepo documentation
├── backend/
│   ├── .env.example                # Supabase and MinIO environment configurations
│   ├── requirements.txt            # FastAPI, uvicorn, supabase, boto3, python-dotenv (No ORM)
│   ├── main.py                     # FastAPI application with Supabase & MinIO endpoints
│   ├── db/
│   │   └── supabase_init.sql       # PostGIS schema, enums, cadastral tables, and calculate_parcel_intersections RPC
│   └── storage/
│       ├── __init__.py
│       └── minio_client.py         # MinioStorageService for KML & geotagged image uploads
└── frontend/
    ├── .env.example                # Map style and API URL configurations
    ├── package.json                # Next.js dependencies + maplibre-gl & lucide-react
    ├── app/                        # Next.js App Router (pages, layout, styles)
    ├── components/                 # Reusable UI components
    ├── lib/                        # Utility functions
    └── hooks/                      # Custom React hooks
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
