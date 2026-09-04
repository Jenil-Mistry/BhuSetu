"""
Unit tests for the Workflow State Machine.
"""

import pytest
from app.services.workflow_service import workflow_service
from app.repositories.project_repo import project_repo
from app.errors import WorkflowException


def test_valid_workflow_transition_sequence():
    # 1. Create a draft project
    proj = project_repo.create_project({
        "name": "Test Express Corridor",
        "code": "TEST-EXP-01",
        "status": "DRAFT",
        "district_id": 1,
        "organization_id": 1,
        "estimated_budget": 5000000.0,
    })
    project_id = proj["id"]

    # 2. Submit proposal: DRAFT -> SUBMITTED
    res1 = workflow_service.transition_project(
        project_id=project_id,
        action="SUBMIT",
        actor_id="user-pia-1",
        comment="Submission test",
    )
    assert res1["success"] is True
    assert res1["new_status"] == "SUBMITTED"

    # 3. Assign scrutiny: SUBMITTED -> SCRUTINY
    res2 = workflow_service.transition_project(
        project_id=project_id,
        action="ASSIGN_SCRUTINY",
        actor_id="user-dlao-1",
        comment="Under scrutiny",
    )
    assert res2["success"] is True
    assert res2["new_status"] == "SCRUTINY"

    # 4. Scrutiny to approved: SCRUTINY -> APPROVED
    res3 = workflow_service.transition_project(
        project_id=project_id,
        action="APPROVE",
        actor_id="user-dlao-1",
        comment="Approved following technical verification",
    )
    assert res3["success"] is True
    assert res3["new_status"] == "APPROVED"


def test_invalid_workflow_transition_raises_exception():
    proj = project_repo.create_project({
        "name": "Invalid Transition Project",
        "code": "TEST-INV-01",
        "status": "DRAFT",
    })
    project_id = proj["id"]

    # Trying to approve directly from DRAFT must fail
    with pytest.raises(WorkflowException) as exc_info:
        workflow_service.transition_project(
            project_id=project_id,
            action="APPROVE",
            actor_id="user-dlao-1",
        )
    assert "Action 'APPROVE' is not permitted" in str(exc_info.value.message)


def test_rejection_requires_comment():
    proj = project_repo.create_project({
        "name": "Reject Without Comment Project",
        "code": "TEST-REJ-01",
        "status": "SCRUTINY",
    })
    project_id = proj["id"]

    with pytest.raises(WorkflowException) as exc_info:
        workflow_service.transition_project(
            project_id=project_id,
            action="REJECT",
            actor_id="user-dlao-1",
            comment=None,  # Missing comment
        )
    assert "strictly requires a detailed comment" in str(exc_info.value.message)
