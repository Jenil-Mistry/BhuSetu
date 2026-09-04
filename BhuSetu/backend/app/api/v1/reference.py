"""
Reference Geography and Organizations Router.
"""

from typing import List, Optional
from fastapi import APIRouter, Query

from app.repositories.reference_repo import reference_repo
from app.schemas.reference import (
    StateResponse,
    DistrictResponse,
    SubdistrictResponse,
    VillageResponse,
    OrganizationResponse,
)

router = APIRouter(prefix="/reference", tags=["Reference Geography & Data"])


@router.get("/states", response_model=List[StateResponse])
def get_states():
    """Lists all States and Union Territories."""
    return reference_repo.list_states()


@router.get("/districts", response_model=List[DistrictResponse])
def get_districts(state_id: Optional[int] = Query(None, description="Filter by State ID")):
    """Lists Districts, optionally filtered by State."""
    return reference_repo.list_districts(state_id=state_id)


@router.get("/subdistricts", response_model=List[SubdistrictResponse])
def get_subdistricts(district_id: Optional[int] = Query(None, description="Filter by District ID")):
    """Lists Subdistricts / Tehsils, optionally filtered by District."""
    return reference_repo.list_subdistricts(district_id=district_id)


@router.get("/villages", response_model=List[VillageResponse])
def get_villages(
    district_id: Optional[int] = Query(None, description="Filter by District ID"),
    subdistrict_id: Optional[int] = Query(None, description="Filter by Subdistrict ID"),
):
    """Lists cadastral Villages, optionally filtered by District or Tehsil."""
    return reference_repo.list_villages(district_id=district_id, subdistrict_id=subdistrict_id)


@router.get("/organizations", response_model=List[OrganizationResponse])
def get_organizations():
    """Lists government organizations, ministries, and agencies."""
    return reference_repo.list_organizations()
