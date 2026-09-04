"""
Deterministic Workflow State Machine Service for Land Acquisition.
Validates stages, guards transitions, and orchestrates atomic updates.
"""

import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone

from app.errors import WorkflowException, EntityNotFoundException
from app.repositories.project_repo import project_repo
from app.repositories.outbox_repo import outbox_repo
from app.repositories.base import memory_store
from app.services.audit_service import audit_service


# Complete transition graph
VALID_TRANSITIONS: Dict[str, Dict[str, str]] = {
    "DRAFT": {
        "SUBMIT": "SUBMITTED",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "SUBMITTED": {
        "ASSIGN_SCRUTINY": "SCRUTINY",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "SCRUTINY": {
        "REQUEST_CLARIFICATION": "CLARIFICATION_REQUIRED",
        "RECOMMEND": "RECOMMENDED",
        "APPROVE": "APPROVED",
        "REJECT": "REJECTED",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "CLARIFICATION_REQUIRED": {
        "RESUBMIT": "SUBMITTED",
        "REJECT": "REJECTED",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "RECOMMENDED": {
        "APPROVE": "APPROVED",
        "REJECT": "REJECTED",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "APPROVED": {
        "START_NOTIFICATION": "NOTIFICATION_IN_PROGRESS",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "NOTIFICATION_IN_PROGRESS": {
        "START_AWARD": "AWARD_IN_PROGRESS",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "AWARD_IN_PROGRESS": {
        "START_COMPENSATION": "COMPENSATION_IN_PROGRESS",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "COMPENSATION_IN_PROGRESS": {
        "START_POSSESSION": "POSSESSION_IN_PROGRESS",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "POSSESSION_IN_PROGRESS": {
        "START_RR": "RR_IN_PROGRESS",
        "COMPLETE": "COMPLETED",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "RR_IN_PROGRESS": {
        "COMPLETE": "COMPLETED",
        "PUT_ON_HOLD": "ON_HOLD",
    },
    "ON_HOLD": {
        "RESUME": "SCRUTINY",  # Resumes to active review
    },
}


class WorkflowService:

    def transition_project(
        self,
        project_id: str,
        action: str,
        actor_id: Optional[str] = None,
        actor_role: Optional[str] = None,
        comment: Optional[str] = None,
        correlation_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Executes a workflow state transition on a project.
        Enforces validation rules, logs history, records audit, and queues outbox event.
        """
        project = project_repo.get_by_id(project_id)
        if not project:
            raise EntityNotFoundException("Project", project_id)

        current_status = project.get("status", "DRAFT")
        allowed_actions = VALID_TRANSITIONS.get(current_status, {})

        if action not in allowed_actions:
            raise WorkflowException(
                message=f"Action '{action}' is not permitted from current stage '{current_status}'.",
                details={
                    "current_stage": current_status,
                    "requested_action": action,
                    "allowed_actions": list(allowed_actions.keys()),
                },
            )

        target_stage = allowed_actions[action]

        # Check required comments for rejections or clarifications
        if action in ("REJECT", "REQUEST_CLARIFICATION") and not comment:
            raise WorkflowException(
                message=f"Action '{action}' strictly requires a detailed comment or reason.",
                details={"action": action},
            )

        # Execute transition via atomic DB RPC if connected, else via repository
        db = project_repo.db
        if db:
            try:
                rpc_res = db.rpc(
                    "execute_workflow_transition",
                    {
                        "p_project_id": project_id,
                        "p_to_stage": target_stage,
                        "p_action": action,
                        "p_actor_id": actor_id,
                        "p_comment": comment,
                    },
                ).execute()
                if rpc_res.data and rpc_res.data.get("success"):
                    audit_service.record_action(
                        action=f"WORKFLOW_TRANSITION_{action}",
                        entity_type="PROJECT",
                        entity_id=project_id,
                        actor_id=actor_id,
                        before_state={"status": current_status},
                        after_state={"status": target_stage},
                        correlation_id=correlation_id,
                    )
                    return rpc_res.data
            except Exception:
                pass  # Fallback to repository update

        # Local / fallback transition execution
        updated_project = project_repo.update_project(project_id, {"status": target_stage})

        # Record workflow history
        now = datetime.now(timezone.utc).isoformat()
        history_entry = {
            "id": str(uuid.uuid4()),
            "project_id": str(project_id),
            "from_stage": current_status,
            "to_stage": target_stage,
            "action": action,
            "performed_by": actor_id,
            "comment": comment,
            "created_at": now,
        }
        memory_store.workflow_history.append(history_entry)

        # Record audit event
        audit_service.record_action(
            action=f"WORKFLOW_{action}",
            entity_type="PROJECT",
            entity_id=project_id,
            actor_id=actor_id,
            before_state={"status": current_status},
            after_state={"status": target_stage},
            correlation_id=correlation_id,
        )

        # Queue outbox event
        outbox_repo.queue_event(
            event_type="project.workflow.transitioned",
            payload={
                "project_id": str(project_id),
                "project_code": project.get("code"),
                "from_stage": current_status,
                "to_stage": target_stage,
                "action": action,
                "actor_id": actor_id,
                "timestamp": now,
            },
        )

        return {
            "success": True,
            "project_id": project_id,
            "previous_status": current_status,
            "new_status": target_stage,
            "action": action,
            "history_id": history_entry["id"],
        }


workflow_service = WorkflowService()
