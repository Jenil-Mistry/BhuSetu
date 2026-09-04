"""
Statutory acquisition schemas: Section 11 & 19 Notifications, Awards, Possession.
"""

from typing import Optional, List, Dict, Any
from datetime import date, datetime
from pydantic import BaseModel, Field


class NotificationCreate(BaseModel):
    project_id: str
    notification_type: str = Field(..., examples=["SECTION_11"], description="SECTION_11 (Preliminary) or SECTION_19 (Declaration)")
    gazette_number: str = Field(..., examples=["G-2026-LA-789"])
    publication_date: date
    authority: str = Field(..., examples=["District Collector & District Magistrate"])
    affected_villages: List[int] = Field(default=[], description="List of village IDs")
    document_id: Optional[str] = None
    summary: Optional[str] = None


class NotificationResponse(BaseModel):
    id: str
    project_id: str
    notification_type: str
    gazette_number: str
    publication_date: date
    authority: str
    status: str = "PUBLISHED"
    created_at: datetime


class AwardCreate(BaseModel):
    project_id: str
    parcel_id: str
    award_number: str = Field(..., examples=["AWD-2026-AMD-042"])
    award_date: date
    assessed_amount: float = Field(..., gt=0.0)
    authority: str = Field(..., examples=["Competent Authority Land Acquisition (CALA)"])
    document_id: Optional[str] = None


class AwardResponse(BaseModel):
    id: str
    project_id: str
    parcel_id: str
    award_number: str
    award_date: date
    assessed_amount: float
    status: str = "DECLARED"
    created_at: datetime


class PossessionRecordCreate(BaseModel):
    parcel_id: str
    possession_date: date
    is_full_possession: bool = True
    handover_memo_url: Optional[str] = None
    remarks: Optional[str] = None
    verifier_name: str
