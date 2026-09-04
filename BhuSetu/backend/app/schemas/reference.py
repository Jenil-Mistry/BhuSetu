"""
Reference data schemas: States, Districts, Subdistricts, Villages, Organizations.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class StateResponse(BaseModel):
    id: int
    code: str
    name: str


class DistrictResponse(BaseModel):
    id: int
    state_id: int
    code: str
    name: str


class SubdistrictResponse(BaseModel):
    id: int
    district_id: int
    code: str
    name: str


class VillageResponse(BaseModel):
    id: int
    district_id: int
    subdistrict_id: int
    code: str
    name: str


class OrganizationResponse(BaseModel):
    id: int
    name: str
    org_type: str  # NHAI, RAILWAYS, STATE_REVENUE, etc.
    parent_id: Optional[int] = None
    state_id: Optional[int] = None
    district_id: Optional[int] = None
