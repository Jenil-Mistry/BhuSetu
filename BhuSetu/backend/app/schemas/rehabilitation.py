"""
Rehabilitation & Resettlement (R&R) Pydantic Schemas.
"""

from typing import Optional, List, Dict, Any
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class AffectedFamilyCreate(BaseModel):
    project_id: str
    family_head_name: str
    category: str = Field(..., examples=["LAND_OWNER"], description="LAND_OWNER, AGRICULTURAL_LABOURER, TENANT, ARTISAN")
    is_displaced: bool = True
    current_village_id: Optional[int] = None
    resettlement_site_preference: Optional[str] = None
    num_dependents: int = Field(default=0, ge=0)


class AffectedFamilyResponse(BaseModel):
    id: str
    project_id: str
    family_head_name: str
    category: str
    is_displaced: bool
    status: str = "REGISTERED"
    created_at: datetime


class EntitlementCreate(BaseModel):
    family_id: str
    entitlement_type: str = Field(..., examples=["HOUSING_ALLOTMENT"], description="HOUSING_ALLOTMENT, SUBSISTENCE_GRANT, RESETTLEMENT_ALLOWANCE, SKILL_TRAINING")
    grant_amount: Decimal = Field(default=Decimal("0.00"), decimal_places=2, max_digits=18)
    due_date: Optional[date] = None
    description: Optional[str] = None


class EntitlementResponse(BaseModel):
    id: str
    family_id: str
    entitlement_type: str
    grant_amount: Decimal
    status: str = "APPROVED"
    created_at: datetime


class MilestoneUpdate(BaseModel):
    milestone_id: str
    status: str = Field(..., examples=["COMPLETED"], description="PENDING, IN_PROGRESS, COMPLETED, DELAYED")
    actual_completion_date: Optional[date] = None
    evidence_document_id: Optional[str] = None
    remarks: Optional[str] = None
