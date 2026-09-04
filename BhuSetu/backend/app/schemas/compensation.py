"""
Compensation and Payment Pydantic Schemas.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class AssessmentCreate(BaseModel):
    award_id: str
    parcel_id: str
    party_id: Optional[str] = None
    market_value: Decimal = Field(..., gt=0, decimal_places=2, max_digits=18)
    solatium_percentage: Decimal = Field(default=Decimal("100.00"), decimal_places=2, max_digits=5)
    interest_rate_percentage: Decimal = Field(default=Decimal("12.00"), decimal_places=2, max_digits=5)
    assets_value: Decimal = Field(default=Decimal("0.00"), decimal_places=2, max_digits=18)
    rehabilitation_allowance: Decimal = Field(default=Decimal("0.00"), decimal_places=2, max_digits=18)
    notes: Optional[str] = None


class AssessmentResponse(BaseModel):
    id: str
    award_id: str
    parcel_id: str
    market_value: Decimal
    solatium_amount: Decimal
    interest_amount: Decimal
    assets_value: Decimal
    total_assessed_amount: Decimal
    status: str = "APPROVED"
    created_at: datetime


class PaymentBatchCreate(BaseModel):
    project_id: str
    batch_reference: str = Field(..., examples=["PFMS-BATCH-2026-081"])
    disbursement_source: str = Field(default="ESCROW_ACCOUNT", examples=["ESCROW_ACCOUNT"])
    item_ids: List[str] = Field(default=[], description="Assessment IDs included in batch")


class PaymentBatchResponse(BaseModel):
    id: str
    project_id: str
    batch_reference: str
    total_amount: Decimal
    total_items: int
    status: str = "INITIATED"
    created_at: datetime


class PaymentItemReconcile(BaseModel):
    item_id: str
    status: str = Field(..., examples=["DBT_CLEARED"], description="DBT_CLEARED, PFMS_INITIATED, FAILED_REJECTED")
    utr_number: Optional[str] = Field(None, examples=["SBIN000123456789"])
    reconciliation_notes: Optional[str] = None
