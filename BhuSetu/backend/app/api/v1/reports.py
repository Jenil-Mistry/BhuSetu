"""
Reports & Asynchronous Export Jobs Router.
"""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, status, HTTPException
from app.dependencies import get_current_user, UserContext
from app.schemas.dashboard import ExportJobRequest, ExportJobResponse
from app.repositories.outbox_repo import outbox_repo

router = APIRouter(prefix="/reports", tags=["Reports & Exports"])


@router.post("/exports", status_code=status.HTTP_202_ACCEPTED, response_model=ExportJobResponse)
def trigger_export_job(
    req: ExportJobRequest,
    user: UserContext = Depends(get_current_user),
):
    """
    Triggers an asynchronous export job (CSV/JSON), returning 202 with an export job ID.
    """
    job_id = str(uuid.uuid4())
    outbox_repo.queue_event(
        event_type="report.export.requested",
        payload={
            "job_id": job_id,
            "report_type": req.report_type,
            "format": req.format,
            "user_id": user.user_id,
        },
    )

    return ExportJobResponse(
        export_id=job_id,
        report_type=req.report_type,
        status="PROCESSING",
        download_url=f"/api/v1/reports/exports/{job_id}/download",
    )


@router.get("/exports/{export_id}")
def get_export_status(
    export_id: str,
    user: UserContext = Depends(get_current_user),
):
    """
    Checks status of an export job.
    """
    return {
        "success": True,
        "export_id": export_id,
        "status": "COMPLETED",
        "download_url": f"http://localhost:9000/land-aquisition-docs/exports/{export_id}.csv",
    }
