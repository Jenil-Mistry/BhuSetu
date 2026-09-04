"""
Cadastral Land Parcels & Spatial GIS API Router.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException, status, Request

from app.dependencies import get_current_user, UserContext
from app.schemas.parcel import (
    ParcelCreate,
    ParcelUpdate,
    ParcelVerificationRequest,
    SpatialIntersectionRequest,
)
from app.repositories.parcel_repo import parcel_repo
from app.services.spatial_service import spatial_service
from app.services.audit_service import audit_service

router = APIRouter(tags=["Land Parcels & Spatial GIS"])


@router.get("/parcels")
def list_parcels(
    project_id: Optional[str] = Query(None, description="Filter by project UUID"),
    status: Optional[str] = Query(None, description="Filter by parcel status"),
    village_id: Optional[int] = Query(None, description="Filter by village ID"),
    limit: int = Query(100, ge=1, le=500),
    user: UserContext = Depends(get_current_user),
):
    """
    Fetches cadastral land parcels, optionally filtered by project or status.
    """
    parcels = parcel_repo.list_parcels(
        project_id=project_id,
        status=status,
        village_id=village_id,
        limit=limit,
    )
    return {
        "success": True,
        "count": len(parcels),
        "data": parcels,
    }


@router.post("/parcels", status_code=status.HTTP_201_CREATED)
def create_parcel(
    parcel_in: ParcelCreate,
    user: UserContext = Depends(get_current_user),
):
    """
    Creates a new cadastral land parcel entry.
    """
    spatial_service.validate_geojson_geometry(parcel_in.geometry)

    # Compute area if not provided
    computed_area = parcel_in.area_sq_meters
    if not computed_area and parcel_in.geometry.get("type") == "Polygon":
        computed_area = spatial_service.calculate_geodetic_area_sq_meters(
            parcel_in.geometry.get("coordinates", [])
        )

    payload = {
        "project_id": parcel_in.project_id,
        "village_id": parcel_in.village_id,
        "parcel_number": parcel_in.parcel_number,
        "area_sq_meters": computed_area,
        "status": "PROPOSED",
    }
    created = parcel_repo.create_parcel(payload)
    return {
        "success": True,
        "data": created,
    }


@router.get("/parcels/{parcel_id}")
def get_parcel(
    parcel_id: str,
    user: UserContext = Depends(get_current_user),
):
    """
    Fetches details of a single cadastral parcel.
    """
    parcel = parcel_repo.get_by_id(parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail=f"Parcel '{parcel_id}' not found.")
    return {
        "success": True,
        "data": parcel,
    }


@router.patch("/parcels/{parcel_id}")
def update_parcel(
    parcel_id: str,
    updates: ParcelUpdate,
    user: UserContext = Depends(get_current_user),
):
    """
    Updates parcel status or metadata.
    """
    updated = parcel_repo.update_parcel(parcel_id, updates.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail=f"Parcel '{parcel_id}' not found.")
    return {
        "success": True,
        "data": updated,
    }


@router.post("/parcels/{parcel_id}/verify")
def verify_parcel(
    parcel_id: str,
    verification: ParcelVerificationRequest,
    request: Request,
    user: UserContext = Depends(get_current_user),
):
    """
    Records surveyor/field verification for a cadastral parcel.
    """
    parcel = parcel_repo.get_by_id(parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail=f"Parcel '{parcel_id}' not found.")

    correlation_id = getattr(request.state, "correlation_id", None)
    record = parcel_repo.record_verification({
        "parcel_id": parcel_id,
        "verified_by": user.user_id,
        "verification_method": verification.verification_method,
        "remarks": verification.remarks,
        "photo_urls": verification.photo_urls,
    })

    audit_service.record_action(
        action="PARCEL_VERIFIED",
        entity_type="PARCEL",
        entity_id=parcel_id,
        actor_id=user.user_id,
        correlation_id=correlation_id,
    )

    return {
        "success": True,
        "message": "Parcel verification successfully logged.",
        "data": record,
    }


@router.post("/spatial/calculate-intersections")
@router.post("/projects/{project_id}/spatial/intersections")
def calculate_spatial_intersections(
    request_data: SpatialIntersectionRequest,
    project_id: Optional[str] = None,
):
    """
    Detects spatial overlaps between a proposed acquisition corridor/polygon and registered cadastral parcels.
    Uses geodetic PostGIS intersection RPC with ellipsoidal area metrics.
    """
    spatial_service.validate_geojson_geometry(request_data.geojson_geometry)
    target_project_id = project_id or request_data.project_id

    intersections = parcel_repo.calculate_intersections(
        geojson_geometry=request_data.geojson_geometry,
        project_id=target_project_id,
    )

    return {
        "success": True,
        "intersections_found": len(intersections),
        "data": intersections,
    }
