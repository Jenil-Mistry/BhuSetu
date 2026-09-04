"""
FastAPI Application Factory for BhuSetu Platform.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.errors import BhuSetuException, bhusetu_exception_handler
from app.middleware import CorrelationIdMiddleware
from app.dependencies import init_supabase, get_db
from app.api.v1.router import api_v1_router
from storage.minio_client import get_storage_service

logger = logging.getLogger("bhusetu.app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Initializing {settings.APP_NAME} v{settings.APP_VERSION} [{settings.ENVIRONMENT}]")
    
    # Initialize database connection
    init_supabase()

    # Ensure MinIO bucket
    try:
        storage = get_storage_service()
        storage.ensure_bucket_exists()
        logger.info(f"MinIO bucket '{storage.bucket_name}' verified.")
    except Exception as exc:
        logger.warning(f"Could not connect to MinIO on startup: {exc}")

    yield
    # Shutdown
    logger.info("Shutting down BhuSetu application.")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        description="Real-Time National Land Acquisition, PostGIS Geospatial Tracking, Compensation, and R&R Platform.",
        version=settings.APP_VERSION,
        lifespan=lifespan,
    )

    # Middleware
    app.add_middleware(CorrelationIdMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception Handlers
    app.add_exception_handler(BhuSetuException, bhusetu_exception_handler)

    # Root & Health Check Endpoints
    @app.get("/")
    def root():
        return {
            "system": "BhuSetu Platform",
            "service": "Backend API",
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
            "docs_url": "/docs",
            "status": "online",
        }

    @app.get("/health")
    def health_check():
        db = get_db()
        return {
            "status": "healthy",
            "supabase_connected": db is not None,
            "minio_endpoint": settings.MINIO_ENDPOINT,
            "minio_bucket": settings.MINIO_BUCKET_NAME,
        }

    # Mount /api/v1
    app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

    return app


app = create_app()
