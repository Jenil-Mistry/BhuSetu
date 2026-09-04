"""
Statutory Notifications API Router (Section 11 Preliminary & Section 19 Declarations).
"""

from typing import Optional
from fastapi import APIRouter, Depends, status, Request, HTTPException

from app.dependencies import get_current_user, UserContext, require_capability
from app.schemas.statutory import NotificationCreate, NotificationResponse
from app.repositories.statutory_repo import statutory_repo
from app.services.audit_service import audit_service

router = APIRouter(prefix="/projects/{project_id}/notifications", tags=["Statutory Notifications"])


@router.get("")
def list_notifications(
    project_id: str,
    user: UserContext = Depends(get_current_user),
):
    """
    Lists statutory notifications issued for a project.
    """
    items = statutory_repo.list_notifications(project_id=project_id)
    return {
        "success": True,
        "count": len(items),
        "data": items,
    }


@router.post("", status_code=status.HTTP_201_CREATED)
def issue_notification(
    project_id: str,
    notification_in: NotificationCreate,
    request: Request,
    user: UserContext = Depends(require_capability("NOTIFICATION_ISSUE")),
):
    """
    Issues a formal Gazette Notification (Section 11 or Section 19) for land acquisition.
    """
    correlation_id = getattr(request.state, "correlation_id", None)
    payload = notification_in.model_dump()
    payload["project_id"] = project_id
    payload["publication_date"] = payload["publication_date"].isoformat()

    created = statutory_repo.create_notification(payload)

    audit_service.record_action(
        action=f"NOTIFICATION_ISSUED_{notification_in.notification_type}",
        entity_type="NOTIFICATION",
        entity_id=created["id"],
        actor_id=user.user_id,
        correlation_id=correlation_id,
    )

    return {
        "success": True,
        "message": f"Gazette Notification {notification_in.gazette_number} successfully registered.",
        "data": created,
    }
