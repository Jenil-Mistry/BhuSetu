"""
Rehabilitation & Resettlement (R&R) API Router.
"""

from typing import Optional
from fastapi import APIRouter, Depends, status, Request, HTTPException

from app.dependencies import get_current_user, UserContext, require_capability
from app.schemas.rehabilitation import AffectedFamilyCreate, EntitlementCreate
from app.repositories.rr_repo import rr_repo
from app.services.audit_service import audit_service

router = APIRouter(tags=["Rehabilitation & Resettlement (R&R)"])


@router.get("/projects/{project_id}/families")
def list_affected_families(
    project_id: str,
    user: UserContext = Depends(get_current_user),
):
    """
    Lists affected and displaced families registered under a project.
    """
    items = rr_repo.list_families(project_id=project_id)
    return {
        "success": True,
        "count": len(items),
        "data": items,
    }


@router.post("/projects/{project_id}/families", status_code=status.HTTP_201_CREATED)
def register_affected_family(
    project_id: str,
    family_in: AffectedFamilyCreate,
    request: Request,
    user: UserContext = Depends(require_capability("RR_MANAGE")),
):
    """
    Registers an affected family (landowner, agricultural labourer, tenant, artisan).
    """
    correlation_id = getattr(request.state, "correlation_id", None)
    payload = family_in.model_dump()
    payload["project_id"] = project_id

    created = rr_repo.create_family(payload)

    audit_service.record_action(
        action="RR_FAMILY_REGISTERED",
        entity_type="AFFECTED_FAMILY",
        entity_id=created["id"],
        actor_id=user.user_id,
        correlation_id=correlation_id,
    )

    return {
        "success": True,
        "data": created,
    }


@router.post("/families/{family_id}/entitlements", status_code=status.HTTP_201_CREATED)
def allocate_entitlement(
    family_id: str,
    entitlement_in: EntitlementCreate,
    request: Request,
    user: UserContext = Depends(require_capability("RR_MANAGE")),
):
    """
    Allocates an R&R entitlement (housing allotment, subsistence allowance, grant) to a family.
    """
    correlation_id = getattr(request.state, "correlation_id", None)
    payload = entitlement_in.model_dump()
    payload["family_id"] = family_id
    if payload.get("due_date"):
        payload["due_date"] = payload["due_date"].isoformat()

    created = rr_repo.create_entitlement(payload)

    audit_service.record_action(
        action="RR_ENTITLEMENT_ALLOCATED",
        entity_type="ENTITLEMENT",
        entity_id=created["id"],
        actor_id=user.user_id,
        correlation_id=correlation_id,
    )

    return {
        "success": True,
        "data": created,
    }
