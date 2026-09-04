"""
Authentication and Current User Router.
"""

from typing import List
from fastapi import APIRouter, Depends

from app.dependencies import get_current_user, UserContext
from app.schemas.auth import UserProfileResponse, UserAssignmentResponse

router = APIRouter(tags=["Authentication & Identity"])


@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(user: UserContext = Depends(get_current_user)):
    """
    Returns the caller's verified identity, role, capabilities, and active assignments.
    """
    assignments = [
        UserAssignmentResponse(
            role=a.get("role", user.role),
            scope_type=a.get("scope_type", "NATIONAL"),
            scope_id=a.get("scope_id", 0),
            state_id=a.get("state_id"),
            district_id=a.get("district_id"),
            organization_id=a.get("organization_id"),
            is_active=True,
        )
        for a in user.assignments
    ]

    return UserProfileResponse(
        id=user.user_id,
        username=user.username,
        email=user.email,
        role=user.role,
        status="ACTIVE",
        capabilities=user.capabilities,
        assignments=assignments,
    )


@router.get("/me/assignments", response_model=List[UserAssignmentResponse])
def get_user_assignments(user: UserContext = Depends(get_current_user)):
    """
    Returns list of geographic and organizational administrative scopes assigned to current user.
    """
    return [
        UserAssignmentResponse(
            role=a.get("role", user.role),
            scope_type=a.get("scope_type", "NATIONAL"),
            scope_id=a.get("scope_id", 0),
            state_id=a.get("state_id"),
            district_id=a.get("district_id"),
            organization_id=a.get("organization_id"),
            is_active=True,
        )
        for a in user.assignments
    ]
