"""
Statutory Awards, Compensation Assessments & Payment Disbursement Router.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, status, Request, HTTPException

from app.dependencies import get_current_user, UserContext, require_capability
from app.schemas.statutory import AwardCreate, PossessionRecordCreate
from app.schemas.compensation import (
    AssessmentCreate,
    PaymentBatchCreate,
    PaymentItemReconcile,
)
from app.repositories.statutory_repo import statutory_repo
from app.repositories.compensation_repo import compensation_repo
from app.services.compensation_service import compensation_service
from app.services.audit_service import audit_service
from app.security.redaction import redactor

router = APIRouter(tags=["Compensation, Awards & Payments"])


# Awards
@router.get("/projects/{project_id}/awards")
def list_awards(
    project_id: str,
    user: UserContext = Depends(get_current_user),
):
    """
    Lists statutory awards declared for a project.
    """
    items = statutory_repo.list_awards(project_id=project_id)
    return {
        "success": True,
        "count": len(items),
        "data": items,
    }


@router.post("/projects/{project_id}/awards", status_code=status.HTTP_201_CREATED)
def declare_award(
    project_id: str,
    award_in: AwardCreate,
    request: Request,
    user: UserContext = Depends(require_capability("AWARD_DECLARE")),
):
    """
    Declares a formal land acquisition award under Section 23/31.
    """
    correlation_id = getattr(request.state, "correlation_id", None)
    payload = award_in.model_dump()
    payload["project_id"] = project_id
    payload["award_date"] = payload["award_date"].isoformat()

    created = statutory_repo.create_award(payload)

    audit_service.record_action(
        action="AWARD_DECLARED",
        entity_type="AWARD",
        entity_id=created["id"],
        actor_id=user.user_id,
        correlation_id=correlation_id,
    )

    return {
        "success": True,
        "message": f"Statutory Award {award_in.award_number} declared successfully.",
        "data": created,
    }


# Assessments
@router.post("/awards/{award_id}/assessments", status_code=status.HTTP_201_CREATED)
def create_compensation_assessment(
    award_id: str,
    assessment_in: AssessmentCreate,
    request: Request,
    user: UserContext = Depends(require_capability("COMPENSATION_ASSESS")),
):
    """
    Computes and records componentized compensation breakdown per RFCTLARR Act 2013:
    Market Value + 100% Solatium + 12% Interest + Assets = Total Award.
    """
    correlation_id = getattr(request.state, "correlation_id", None)

    calc = compensation_service.calculate_assessment(
        market_value=assessment_in.market_value,
        solatium_percentage=assessment_in.solatium_percentage,
        interest_rate_percentage=assessment_in.interest_rate_percentage,
        assets_value=assessment_in.assets_value,
        rehabilitation_allowance=assessment_in.rehabilitation_allowance,
    )

    payload = {
        "award_id": award_id,
        "parcel_id": assessment_in.parcel_id,
        "party_id": assessment_in.party_id,
        "market_value": calc["market_value"],
        "solatium_amount": calc["solatium_amount"],
        "interest_amount": calc["interest_amount"],
        "assets_value": calc["assets_value"],
        "total_assessed_amount": calc["total_assessed_amount"],
    }
    created = compensation_repo.create_assessment(payload)

    audit_service.record_action(
        action="COMPENSATION_ASSESSED",
        entity_type="COMPENSATION",
        entity_id=created["id"],
        actor_id=user.user_id,
        correlation_id=correlation_id,
    )

    return {
        "success": True,
        "message": "Compensation assessment calculated and approved.",
        "data": created,
    }


@router.get("/awards/{award_id}/assessments")
def get_award_assessments(
    award_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Lists compensation assessments under an award."""
    items = compensation_repo.list_assessments(award_id=award_id)
    return {
        "success": True,
        "count": len(items),
        "data": items,
    }


# Payment Batches
@router.post("/projects/{project_id}/payment-batches", status_code=status.HTTP_201_CREATED)
def create_payment_batch(
    project_id: str,
    batch_in: PaymentBatchCreate,
    request: Request,
    user: UserContext = Depends(require_capability("PAYMENT_SUBMIT")),
):
    """
    Groups assessed awards into an escrow disbursement batch for PFMS/DBT processing.
    """
    correlation_id = getattr(request.state, "correlation_id", None)
    payload = {
        "project_id": project_id,
        "batch_reference": batch_in.batch_reference,
        "disbursement_source": batch_in.disbursement_source,
        "total_amount": 2500000.00,  # Sample batch total
        "total_items": len(batch_in.item_ids) or 1,
    }
    created = compensation_repo.create_payment_batch(payload)

    audit_service.record_action(
        action="PAYMENT_BATCH_INITIATED",
        entity_type="PAYMENT_BATCH",
        entity_id=created["id"],
        actor_id=user.user_id,
        correlation_id=correlation_id,
    )

    return {
        "success": True,
        "message": f"Payment batch {batch_in.batch_reference} created.",
        "data": created,
    }


@router.get("/payment-batches/{batch_id}")
def get_payment_batch(
    batch_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Retrieves payment batch status and item progress."""
    batch = compensation_repo.get_payment_batch(batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail=f"Payment batch '{batch_id}' not found.")
    return {
        "success": True,
        "data": batch,
    }


@router.post("/payment-items/{item_id}/reconcile")
def reconcile_payment_item(
    item_id: str,
    reconcile_in: PaymentItemReconcile,
    request: Request,
    user: UserContext = Depends(require_capability("PAYMENT_RECONCILE")),
):
    """
    Reconciles a disbursement item with DBT/PFMS UTR transaction confirmation.
    """
    correlation_id = getattr(request.state, "correlation_id", None)
    result = compensation_repo.reconcile_payment_item(
        item_id=item_id,
        status=reconcile_in.status,
        utr_number=reconcile_in.utr_number,
        notes=reconcile_in.reconciliation_notes,
    )

    audit_service.record_action(
        action=f"PAYMENT_RECONCILED_{reconcile_in.status}",
        entity_type="PAYMENT_ITEM",
        entity_id=item_id,
        actor_id=user.user_id,
        correlation_id=correlation_id,
    )

    return {
        "success": True,
        "data": result,
    }


# Possession
@router.post("/parcels/{parcel_id}/possession", status_code=status.HTTP_201_CREATED)
def record_possession(
    parcel_id: str,
    possession_in: PossessionRecordCreate,
    request: Request,
    user: UserContext = Depends(require_capability("POSSESSION_RECORD")),
):
    """
    Records physical possession and site handover for an acquired cadastral parcel.
    """
    correlation_id = getattr(request.state, "correlation_id", None)
    payload = possession_in.model_dump()
    payload["parcel_id"] = parcel_id
    payload["possession_date"] = payload["possession_date"].isoformat()

    created = statutory_repo.record_possession(payload)

    audit_service.record_action(
        action="POSSESSION_RECORDED",
        entity_type="PARCEL",
        entity_id=parcel_id,
        actor_id=user.user_id,
        correlation_id=correlation_id,
    )

    return {
        "success": True,
        "message": f"Possession of parcel {parcel_id} recorded successfully.",
        "data": created,
    }
