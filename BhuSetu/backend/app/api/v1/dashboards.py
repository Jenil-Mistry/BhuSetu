"""
Dashboards and Scoped MIS Metrics API Router.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException

from app.dependencies import get_current_user, UserContext
from app.services.dashboard_service import dashboard_service
from app.repositories.project_repo import project_repo
from app.repositories.parcel_repo import parcel_repo

router = APIRouter(prefix="/dashboard", tags=["Dashboards & MIS Metrics"])


@router.get("/summary")
def get_dashboard_summary(
    scope_type: str = Query("NATIONAL", description="NATIONAL, STATE, DISTRICT, or ORGANIZATION"),
    scope_id: Optional[str] = Query(None, description="Scope identifier"),
    user: UserContext = Depends(get_current_user),
):
    """
    Returns aggregated KPIs: projects, notified/acquired area, possession %, compensation, and R&R.
    """
    summary = dashboard_service.get_summary_metrics(scope_type=scope_type, scope_id=scope_id)
    return {
        "success": True,
        "data": summary,
    }


@router.get("/projects/{project_id}")
def get_project_dashboard(
    project_id: str,
    user: UserContext = Depends(get_current_user),
):
    """
    Returns detailed metrics for a specific project.
    """
    project = project_repo.get_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found.")

    parcels = parcel_repo.list_parcels(project_id=project_id)
    total_parcels = len(parcels)
    acquired_parcels = sum(1 for p in parcels if p.get("status") == "POSSESSION_TAKEN")

    return {
        "success": True,
        "data": {
            "project": project,
            "total_parcels": total_parcels,
            "acquired_parcels": acquired_parcels,
            "acquisition_rate_percentage": round((acquired_parcels / total_parcels * 100), 1) if total_parcels > 0 else 0.0,
            "budget": project.get("estimated_budget"),
        },
    }
