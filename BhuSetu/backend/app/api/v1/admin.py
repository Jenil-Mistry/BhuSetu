"""
Admin and Audit Router.
Provides privileged access to immutable audit events and outbox statuses.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_user, UserContext
from app.repositories.audit_repo import audit_repo
from app.repositories.outbox_repo import outbox_repo

router = APIRouter(prefix="/admin", tags=["Administration & Audit"])


@router.get("/audit-logs")
def list_audit_events(
    entity_type: Optional[str] = Query(None, description="Filter by entity type (e.g. PROJECT, PARCEL)"),
    entity_id: Optional[str] = Query(None, description="Filter by entity UUID"),
    limit: int = Query(50, ge=1, le=200),
    user: UserContext = Depends(get_current_user),
):
    """
    Queries immutable audit trail events.
    """
    events = audit_repo.list_events(
        entity_type=entity_type,
        entity_id=entity_id,
        limit=limit,
    )
    return {
        "success": True,
        "count": len(events),
        "data": events,
    }


@router.get("/outbox-events")
def list_outbox_events(
    limit: int = Query(20, ge=1, le=100),
    user: UserContext = Depends(get_current_user),
):
    """
    Inspects current asynchronous outbox queue.
    """
    events = outbox_repo.fetch_pending_events(limit=limit)
    return {
        "success": True,
        "count": len(events),
        "data": events,
    }
