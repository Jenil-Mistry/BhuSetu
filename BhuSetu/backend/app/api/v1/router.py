"""
Master V1 API Router aggregating all domain sub-routers.
"""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.reference import router as reference_router
from app.api.v1.projects import router as projects_router
from app.api.v1.parcels import router as parcels_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.compensation import router as compensation_router
from app.api.v1.rehabilitation import router as rehabilitation_router
from app.api.v1.documents import router as documents_router
from app.api.v1.dashboards import router as dashboards_router
from app.api.v1.reports import router as reports_router
from app.api.v1.admin import router as admin_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router)
api_v1_router.include_router(reference_router)
api_v1_router.include_router(projects_router)
api_v1_router.include_router(parcels_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(compensation_router)
api_v1_router.include_router(rehabilitation_router)
api_v1_router.include_router(documents_router)
api_v1_router.include_router(dashboards_router)
api_v1_router.include_router(reports_router)
api_v1_router.include_router(admin_router)
