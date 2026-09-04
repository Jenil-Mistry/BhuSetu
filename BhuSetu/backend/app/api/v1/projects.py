"""
Projects and Proposals API Router.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException, status, Request

from app.dependencies import get_current_user, UserContext, require_capability
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectProposalSubmit
from app.schemas.workflow import WorkflowTransitionRequest
from app.repositories.project_repo import project_repo
from app.services.workflow_service import workflow_service
from app.security.policy import policy_engine
from app.errors import EntityNotFoundException

router = APIRouter(prefix="/projects", tags=["Projects & Proposals"])


@router.get("")
def list_projects(
    status: Optional[str] = Query(None, description="Filter by status (e.g. DRAFT, APPROVED)"),
    district_id: Optional[int] = Query(None, description="Filter by District ID"),
    organization_id: Optional[int] = Query(None, description="Filter by Organization ID"),
    limit: int = Query(50, ge=1, le=500),
    user: UserContext = Depends(get_current_user),
):
    """
    Lists land acquisition projects matching optional filters.
    """
    projects = project_repo.list_projects(
        status=status,
        district_id=district_id,
        organization_id=organization_id,
        limit=limit,
    )
    return {
        "success": True,
        "count": len(projects),
        "data": projects,
    }


@router.post("", status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    user: UserContext = Depends(get_current_user),
):
    """
    Creates a new land acquisition project draft.
    """
    payload = project_in.model_dump(exclude_unset=True)
    payload["created_by"] = user.user_id

    created = project_repo.create_project(payload)
    return {
        "success": True,
        "data": created,
    }


@router.get("/{project_id}")
def get_project(
    project_id: str,
    user: UserContext = Depends(get_current_user),
):
    """
    Retrieves project details by UUID.
    """
    project = project_repo.get_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found.")

    policy_engine.assert_can_access_project(user, project)
    return {
        "success": True,
        "data": project,
    }


@router.patch("/{project_id}")
def update_project(
    project_id: str,
    updates: ProjectUpdate,
    user: UserContext = Depends(get_current_user),
):
    """
    Updates editable fields of a project.
    """
    project = project_repo.get_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found.")

    policy_engine.assert_can_access_project(user, project)
    updated = project_repo.update_project(project_id, updates.model_dump(exclude_unset=True))
    return {
        "success": True,
        "data": updated,
    }


@router.post("/{project_id}/submit")
def submit_project_proposal(
    project_id: str,
    proposal: ProjectProposalSubmit,
    request: Request,
    user: UserContext = Depends(get_current_user),
):
    """
    Submits a project proposal for formal scrutiny.
    """
    correlation_id = getattr(request.state, "correlation_id", None)
    result = workflow_service.transition_project(
        project_id=project_id,
        action="SUBMIT",
        actor_id=user.user_id,
        actor_role=user.role,
        comment=proposal.submission_notes or "Proposal submitted for statutory scrutiny.",
        correlation_id=correlation_id,
    )
    return {
        "success": True,
        "message": "Proposal successfully submitted for scrutiny.",
        "data": result,
    }


@router.post("/{project_id}/transition")
def transition_project_stage(
    project_id: str,
    transition: WorkflowTransitionRequest,
    request: Request,
    user: UserContext = Depends(get_current_user),
):
    """
    Executes a guarded workflow transition (e.g. ASSIGN_SCRUTINY, APPROVE, REJECT, REQUEST_CLARIFICATION).
    """
    correlation_id = getattr(request.state, "correlation_id", None)
    result = workflow_service.transition_project(
        project_id=project_id,
        action=transition.action,
        actor_id=user.user_id,
        actor_role=user.role,
        comment=transition.comment,
        correlation_id=correlation_id,
    )
    return {
        "success": True,
        "data": result,
    }


@router.get("/{project_id}/timeline")
def get_project_timeline(
    project_id: str,
    user: UserContext = Depends(get_current_user),
):
    """
    Returns the complete chronological audit timeline and workflow history of a project.
    """
    history = project_repo.get_timeline(project_id)
    return {
        "success": True,
        "count": len(history),
        "data": history,
    }
