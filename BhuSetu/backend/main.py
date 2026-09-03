import os
import logging
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from supabase import create_client, Client

from storage.minio_client import get_storage_service, MinioStorageService

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bhusetu.api")

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# Global Supabase Client (No ORM used)
supabase_client: Optional[Client] = None

if SUPABASE_URL and SUPABASE_KEY and not SUPABASE_URL.startswith("https://your-project"):
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized successfully.")
    except Exception as exc:
        logger.warning(f"Failed to initialize Supabase client: {exc}")
else:
    logger.warning("Supabase credentials not configured in environment. Running in mock/offline mode.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure MinIO storage bucket exists
    try:
        storage = get_storage_service()
        storage.ensure_bucket_exists()
        logger.info(f"MinIO bucket '{storage.bucket_name}' verified.")
    except Exception as exc:
        logger.warning(f"Could not connect to MinIO on startup: {exc}. Verify docker-compose is running.")
    yield


app = FastAPI(
    title="BhuSetu Land Acquisition & Management Engine",
    description="Real-time national land acquisition, spatial PostGIS analytics, and MinIO document storage API.",
    version="0.1.0",
    lifespan=lifespan,
)

# Enable CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> Client:
    """Dependency / accessor for the global Supabase client."""
    if not supabase_client:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase client is not configured. Please supply valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        )
    return supabase_client


# ============================================================================
# Pydantic Schemas for Validation
# ============================================================================
class ProjectCreate(BaseModel):
    name: str = Field(..., example="NH-48 Corridor Expansion")
    code: str = Field(..., example="NH48-SEC-09")
    description: Optional[str] = None
    status: str = Field(default="DRAFT", example="DRAFT")
    district_id: Optional[int] = None
    organization_id: Optional[int] = None
    estimated_budget: Optional[float] = 0.0


class SpatialIntersectionRequest(BaseModel):
    geojson_geometry: Dict[str, Any] = Field(
        ...,
        description="GeoJSON geometry (Polygon or MultiPolygon) representing the proposed acquisition corridor",
    )
    project_id: Optional[str] = Field(
        default=None,
        description="Optional filter by project UUID",
    )


# ============================================================================
# Root & Health Endpoints
# ============================================================================
@app.get("/")
def root():
    return {
        "system": "BhuSetu Platform",
        "service": "Backend API",
        "version": "0.1.0",
        "docs_url": "/docs",
        "status": "online",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "supabase_connected": supabase_client is not None,
        "minio_endpoint": os.getenv("MINIO_ENDPOINT", "http://localhost:9000"),
        "minio_bucket": os.getenv("MINIO_BUCKET_NAME", "land-aquisition-docs"),
    }


# ============================================================================
# Projects Endpoints (Direct Supabase SQL/Table queries - No ORM)
# ============================================================================
@app.get("/api/v1/projects")
def list_projects(
    status: Optional[str] = Query(None, description="Filter by project status (e.g. DRAFT, APPROVED)"),
    limit: int = Query(50, ge=1, le=100),
):
    """
    Fetches land acquisition projects from Supabase database table.
    """
    db = get_db()
    try:
        query = db.table("projects").select("*")
        if status:
            query = query.eq("status", status.upper())
        response = query.order("created_at", desc=True).limit(limit).execute()
        return {
            "success": True,
            "count": len(response.data),
            "data": response.data,
        }
    except Exception as exc:
        logger.error(f"Error fetching projects: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/v1/projects", status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate):
    """
    Creates a new land acquisition project entry in Supabase.
    """
    db = get_db()
    try:
        payload = project.model_dump(exclude_unset=True)
        response = db.table("projects").insert(payload).execute()
        return {
            "success": True,
            "data": response.data,
        }
    except Exception as exc:
        logger.error(f"Error creating project: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


# ============================================================================
# Land Parcels & Spatial Queries
# ============================================================================
@app.get("/api/v1/parcels")
def list_parcels(
    project_id: Optional[str] = Query(None, description="Filter parcels by project UUID"),
    status: Optional[str] = Query(None, description="Filter by parcel status"),
    limit: int = Query(100, ge=1, le=500),
):
    """
    Fetches cadastral land parcels.
    """
    db = get_db()
    try:
        query = db.table("land_parcels").select("id, project_id, village_id, parcel_number, area_sq_meters, status, payment_status, created_at")
        if project_id:
            query = query.eq("project_id", project_id)
        if status:
            query = query.eq("status", status.upper())
        response = query.limit(limit).execute()
        return {
            "success": True,
            "count": len(response.data),
            "data": response.data,
        }
    except Exception as exc:
        logger.error(f"Error fetching parcels: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/v1/spatial/calculate-intersections")
def calculate_intersections(request: SpatialIntersectionRequest):
    """
    Calls the Supabase PostGIS RPC function 'calculate_parcel_intersections'
    to detect overlaps between proposed corridor geometry and registered parcels.
    """
    db = get_db()
    try:
        rpc_params = {
            "target_geom": request.geojson_geometry,
            "p_project_id": request.project_id,
        }
        response = db.rpc("calculate_parcel_intersections", rpc_params).execute()
        return {
            "success": True,
            "intersections_found": len(response.data),
            "data": response.data,
        }
    except Exception as exc:
        logger.error(f"Error running spatial intersection RPC: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


# ============================================================================
# Document & Imagery Storage Endpoints (MinIO S3 Integration)
# ============================================================================
@app.post("/api/v1/storage/upload-kml")
async def upload_kml_file(
    project_id: str = Form(..., description="Target Project UUID"),
    file: UploadFile = File(..., description="KML file"),
):
    """
    Uploads a KML boundary layer to the local MinIO bucket under projects/{project_id}/kml/.
    """
    if not file.filename.lower().endswith((".kml", ".kmz", ".xml")):
        raise HTTPException(status_code=400, detail="Invalid file type. Only .kml or .kmz files are allowed.")

    storage = get_storage_service()
    try:
        contents = await file.read()
        result = storage.upload_kml(
            file_data=contents,
            project_id=project_id,
            filename=file.filename,
        )
        download_url = storage.generate_presigned_download_url(result["key"])
        return {
            "success": True,
            "message": "KML uploaded successfully.",
            "storage": result,
            "presigned_download_url": download_url,
        }
    except Exception as exc:
        logger.error(f"KML upload failed: {exc}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(exc)}")


@app.post("/api/v1/storage/upload-survey-image")
async def upload_survey_image(
    parcel_id: str = Form(..., description="Target Parcel UUID"),
    file: UploadFile = File(..., description="Geo-tagged photo or survey image"),
):
    """
    Uploads a geo-tagged survey image to MinIO under parcels/{parcel_id}/surveys/.
    """
    storage = get_storage_service()
    try:
        contents = await file.read()
        result = storage.upload_geotagged_image(
            file_data=contents,
            parcel_id=parcel_id,
            filename=file.filename,
            content_type=file.content_type or "image/jpeg",
        )
        download_url = storage.generate_presigned_download_url(result["key"])
        return {
            "success": True,
            "message": "Survey image uploaded successfully.",
            "storage": result,
            "presigned_download_url": download_url,
        }
    except Exception as exc:
        logger.error(f"Image upload failed: {exc}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(exc)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
