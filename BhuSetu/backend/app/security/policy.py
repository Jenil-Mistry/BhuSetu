"""
Role-Based and Attribute-Based Access Control (RBAC & ABAC) Policy Evaluator.
"""

from typing import Optional, Dict, Any
from app.dependencies import UserContext
from app.errors import ScopeDeniedException


class PolicyEngine:

    @staticmethod
    def assert_can_access_project(user: UserContext, project: Dict[str, Any]):
        """
        Validates whether the user's administrative scope allows accessing the target project.
        """
        if user.is_national_admin():
            return

        proj_district = project.get("district_id")
        proj_org = project.get("organization_id")

        has_access = False
        for assignment in user.assignments:
            scope_type = assignment.get("scope_type")
            scope_id = assignment.get("scope_id")

            if scope_type == "NATIONAL":
                has_access = True
                break
            if scope_type == "DISTRICT" and scope_id == proj_district:
                has_access = True
                break
            if scope_type == "ORGANIZATION" and scope_id == proj_org:
                has_access = True
                break

        if not has_access:
            raise ScopeDeniedException(
                message=f"User is not authorized to access project in district ID {proj_district} or organization ID {proj_org}."
            )


policy_engine = PolicyEngine()
