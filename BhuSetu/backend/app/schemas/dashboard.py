"""
Dashboard, Analytics, and Reporting Schemas.
"""

from typing import Optional, List, Dict, Any
from decimal import Decimal
from pydantic import BaseModel, Field


class DashboardSummaryResponse(BaseModel):
    scope_type: str
    scope_id: Optional[str] = None
    total_projects: int
    active_projects: int
    completed_projects: int
    total_parcels: int
    total_area_notified_ha: float
    total_area_acquired_ha: float
    possession_percentage: float
    total_compensation_assessed_cr: float
    total_compensation_disbursed_cr: float
    disbursement_percentage: float
    total_affected_families: int
    resettled_families: int


class ProjectProgressMetrics(BaseModel):
    project_id: str
    project_name: str
    status: str
    workflow_stage: str
    progress_percentage: float
    notified_parcels: int
    acquired_parcels: int
    compensation_disbursed_inr: Decimal
    sla_health: str = "ON_TRACK"  # ON_TRACK, AT_RISK, DELAYED


class ExportJobRequest(BaseModel):
    report_type: str = Field(..., examples=["PROJECT_ACQUISITION_SUMMARY"], description="PROJECT_ACQUISITION_SUMMARY, COMPENSATION_DISBURSEMENT_REPORT, RR_STATUS_REPORT")
    scope_type: str = "NATIONAL"
    scope_id: Optional[str] = None
    format: str = "CSV"  # CSV, JSON


class ExportJobResponse(BaseModel):
    export_id: str
    report_type: str
    status: str = "PROCESSING"
    download_url: Optional[str] = None
    expires_at: Optional[str] = None
