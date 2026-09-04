"""
Workflow State Machine and Task Schemas.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class WorkflowTransitionRequest(BaseModel):
    action: str = Field(..., examples=["APPROVE"], description="SUBMIT, SCRUTINIZE, APPROVE, REJECT, REQUEST_CLARIFICATION, PUT_ON_HOLD, RESUME, COMPLETE")
    target_stage: Optional[str] = None
    comment: Optional[str] = Field(None, examples=["All SIA criteria met. Recommended for award."])
    attachments: List[str] = Field(default=[], description="Document UUIDs attached with this decision")


class WorkflowTaskResponse(BaseModel):
    id: str
    project_id: str
    task_name: str
    current_stage: str
    assigned_role: str
    assigned_user_id: Optional[str] = None
    sla_due_date: Optional[datetime] = None
    status: str = "PENDING"
    created_at: datetime


class WorkflowHistoryResponse(BaseModel):
    id: str
    project_id: str
    from_stage: str
    to_stage: str
    action: str
    performed_by: str
    comment: Optional[str] = None
    created_at: datetime
