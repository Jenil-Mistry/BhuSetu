"""
Audit Service for recording immutable user and system actions.
"""

from typing import Optional, Dict, Any
from app.repositories.audit_repo import audit_repo


class AuditService:

    @staticmethod
    def record_action(
        action: str,
        entity_type: str,
        entity_id: str,
        actor_id: Optional[str] = None,
        before_state: Optional[Dict[str, Any]] = None,
        after_state: Optional[Dict[str, Any]] = None,
        correlation_id: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> Dict[str, Any]:
        return audit_repo.append_event(
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            actor_id=actor_id,
            before_state=before_state,
            after_state=after_state,
            correlation_id=correlation_id,
            ip_address=ip_address,
        )


audit_service = AuditService()
