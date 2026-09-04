"""
Authentication, Identity, and Scoped Assignment Schemas.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field


class UserAssignmentResponse(BaseModel):
    id: Optional[str] = None
    role: str
    scope_type: str  # NATIONAL, STATE, DISTRICT, ORGANIZATION, PROJECT
    scope_id: int
    state_id: Optional[int] = None
    district_id: Optional[int] = None
    organization_id: Optional[int] = None
    is_active: bool = True


class UserProfileResponse(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    role: str
    status: str = "ACTIVE"
    capabilities: List[str] = []
    assignments: List[UserAssignmentResponse] = []


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserProfileResponse
