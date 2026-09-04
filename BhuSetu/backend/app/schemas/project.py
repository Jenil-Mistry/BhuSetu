"""
Project and Proposal Pydantic schemas.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(..., examples=["NH-48 Corridor Expansion"])
    code: str = Field(..., examples=["NH48-SEC-09"])
    description: Optional[str] = None
    status: str = Field(default="DRAFT", examples=["DRAFT"])
    district_id: Optional[int] = None
    organization_id: Optional[int] = None
    estimated_budget: Optional[float] = 0.0


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    district_id: Optional[int] = None
    organization_id: Optional[int] = None
    estimated_budget: Optional[float] = None
    status: Optional[str] = None


class ProjectProposalSubmit(BaseModel):
    proposal_version: int = 1
    purpose: str = Field(..., examples=["Highway 6-laning project under Bharatmala"])
    requiring_body: str = Field(..., examples=["National Highways Authority of India"])
    estimated_area_hectares: float = Field(..., gt=0.0)
    estimated_budget: float = Field(..., gt=0.0)
    required_document_ids: List[str] = Field(default=[], description="Uploaded document UUIDs")
    submission_notes: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    code: str
    description: Optional[str] = None
    status: str
    district_id: Optional[int] = None
    organization_id: Optional[int] = None
    estimated_budget: Optional[float] = 0.0
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class TimelineEventResponse(BaseModel):
    id: str
    project_id: str
    stage_from: Optional[str] = None
    stage_to: str
    action: str
    actor_id: Optional[str] = None
    actor_name: Optional[str] = None
    comment: Optional[str] = None
    timestamp: datetime
