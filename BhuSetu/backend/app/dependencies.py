"""
FastAPI dependency injection providers:
- Supabase database client
- Authentication & User context
- Scoped authorization & capabilities
- Storage service
"""

import os
import logging
from typing import Optional, List, Dict, Any
from fastapi import Depends, HTTPException, Header, status
from supabase import create_client, Client

from app.config import settings
from app.errors import ScopeDeniedException, BhuSetuException, ErrorCodes

logger = logging.getLogger("bhusetu.deps")

# Global clients
_supabase_client: Optional[Client] = None


def init_supabase() -> Optional[Client]:
    global _supabase_client
    if settings.is_supabase_configured:
        try:
            _supabase_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY,
            )
            logger.info("Supabase client initialized successfully.")
        except Exception as exc:
            logger.warning(f"Failed to connect to Supabase: {exc}. Running in fallback mode.")
            _supabase_client = None
    else:
        logger.info("Running without active Supabase credentials (fallback/mock mode enabled).")
        _supabase_client = None
    return _supabase_client


def get_db() -> Optional[Client]:
    """Dependency returning the initialized Supabase client (or None in mock mode)."""
    global _supabase_client
    if _supabase_client is None and settings.is_supabase_configured:
        init_supabase()
    return _supabase_client


class UserContext:
    """
    Represents an authenticated user and their active role/scope assignments.
    """

    def __init__(
        self,
        user_id: str,
        username: str,
        email: str,
        role: str,
        capabilities: List[str],
        assignments: List[Dict[str, Any]],
    ):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.role = role
        self.capabilities = capabilities
        self.assignments = assignments

    def has_capability(self, capability: str) -> bool:
        if "ALL" in self.capabilities or self.role == "ADMIN" or self.role == "NATIONAL_ADMIN":
            return True
        return capability in self.capabilities

    def is_national_admin(self) -> bool:
        return self.role in ("ADMIN", "NATIONAL_ADMIN")

    def has_scope_access(
        self,
        scope_type: Optional[str] = None,
        scope_id: Optional[int] = None,
    ) -> bool:
        if self.is_national_admin():
            return True
        if not scope_type or not scope_id:
            return True
        for assignment in self.assignments:
            if assignment.get("scope_type") == "NATIONAL":
                return True
            if (
                assignment.get("scope_type") == scope_type
                and assignment.get("scope_id") == scope_id
            ):
                return True
        return False


def get_current_user(
    authorization: Optional[str] = Header(None, description="Bearer token or mock authorization"),
) -> UserContext:
    """
    Resolves the caller identity from the Authorization header.
    Supports both Supabase JWT tokens and developer/demo tokens (e.g. 'Bearer dlao-token').
    """
    # Demo/Fallback default user if no header provided during local dev
    if not authorization:
        return UserContext(
            user_id="00000000-0000-0000-0000-000000000001",
            username="admin.national",
            email="admin@bhusetu.gov.in",
            role="NATIONAL_ADMIN",
            capabilities=["ALL"],
            assignments=[{"scope_type": "NATIONAL", "scope_id": 0, "role": "NATIONAL_ADMIN"}],
        )

    token = authorization.replace("Bearer ", "").strip()

    # Pre-defined test tokens for SIH scenarios
    demo_users = {
        "admin": ("00000000-0000-0000-0000-000000000001", "admin.national", "admin@bhusetu.gov.in", "NATIONAL_ADMIN", ["ALL"], [{"scope_type": "NATIONAL", "scope_id": 0}]),
        "dlao": ("00000000-0000-0000-0000-000000000002", "dlao.ahmedabad", "dlao.amd@gujarat.gov.in", "DLAO", ["PROPOSAL_REVIEW", "PROPOSAL_APPROVE", "PARCEL_VERIFY", "NOTIFICATION_ISSUE", "AWARD_DECLARE", "POSSESSION_RECORD"], [{"scope_type": "DISTRICT", "scope_id": 1, "state_id": 1}]),
        "pia": ("00000000-0000-0000-0000-000000000003", "nhai.officer", "pia@nhai.gov.in", "PIA", ["PROPOSAL_CREATE", "PROPOSAL_SUBMIT", "PARCEL_IMPORT"], [{"scope_type": "ORGANIZATION", "scope_id": 1}]),
        "surveyor": ("00000000-0000-0000-0000-000000000004", "field.surveyor", "surveyor@gujarat.gov.in", "SURVEYOR", ["PARCEL_VERIFY", "UPLOAD_EVIDENCE"], [{"scope_type": "DISTRICT", "scope_id": 1}]),
        "compensation": ("00000000-0000-0000-0000-000000000005", "comp.officer", "compensation@gujarat.gov.in", "COMPENSATION_OFFICER", ["COMPENSATION_ASSESS", "PAYMENT_SUBMIT", "PAYMENT_RECONCILE"], [{"scope_type": "DISTRICT", "scope_id": 1}]),
        "rr": ("00000000-0000-0000-0000-000000000006", "rr.officer", "rr@gujarat.gov.in", "RR_OFFICER", ["RR_MANAGE", "RR_ENTITLEMENT_UPDATE"], [{"scope_type": "DISTRICT", "scope_id": 1}]),
    }

    if token.lower() in demo_users:
        uid, uname, uemail, urole, ucaps, uassigns = demo_users[token.lower()]
        return UserContext(
            user_id=uid,
            username=uname,
            email=uemail,
            role=urole,
            capabilities=ucaps,
            assignments=uassigns,
        )

    # In a full Supabase environment, decode and verify JWT
    # For now, return a valid authorized user context from bearer subject
    return UserContext(
        user_id="00000000-0000-0000-0000-000000000001",
        username=f"user_{token[:8]}",
        email=f"user_{token[:8]}@bhusetu.gov.in",
        role="OFFICER",
        capabilities=["PROPOSAL_CREATE", "PROPOSAL_SUBMIT", "PROPOSAL_REVIEW", "PARCEL_VERIFY"],
        assignments=[{"scope_type": "NATIONAL", "scope_id": 0}],
    )


def require_capability(capability: str):
    """Factory creating a dependency that checks if the user holds a specific capability."""
    def dependency(user: UserContext = Depends(get_current_user)) -> UserContext:
        if not user.has_capability(capability):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User does not possess required capability: '{capability}'",
            )
        return user
    return dependency
