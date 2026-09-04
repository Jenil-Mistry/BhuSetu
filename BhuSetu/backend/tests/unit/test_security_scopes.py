"""
Unit tests for RBAC/ABAC Scopes and PII Redaction.
"""

import pytest
from app.dependencies import UserContext
from app.security.policy import policy_engine
from app.security.redaction import redactor
from app.errors import ScopeDeniedException


def test_national_admin_accesses_any_project():
    admin_user = UserContext(
        user_id="user-admin",
        username="admin",
        email="admin@bhusetu.gov.in",
        role="NATIONAL_ADMIN",
        capabilities=["ALL"],
        assignments=[{"scope_type": "NATIONAL", "scope_id": 0}],
    )
    # Project in district 99, org 99
    project = {"district_id": 99, "organization_id": 99}
    # Should not raise exception
    policy_engine.assert_can_access_project(admin_user, project)


def test_district_officer_denied_cross_district_access():
    dlao_user = UserContext(
        user_id="user-dlao",
        username="dlao.amd",
        email="dlao@gujarat.gov.in",
        role="DLAO",
        capabilities=["PROPOSAL_REVIEW"],
        assignments=[{"scope_type": "DISTRICT", "scope_id": 1}],
    )
    # Project in district 2 (Surat)
    surat_project = {"district_id": 2, "organization_id": 1}

    with pytest.raises(ScopeDeniedException):
        policy_engine.assert_can_access_project(dlao_user, surat_project)


def test_redaction_utilities():
    assert redactor.mask_bank_account("123456789012") == "A/C Ending in 9012"
    assert redactor.mask_mobile("9876543210") == "XXXXXX3210"
    assert redactor.is_raw_aadhaar_or_pan("123456789012") is True
    assert redactor.is_raw_aadhaar_or_pan("ABCDE1234F") is True
    assert redactor.is_raw_aadhaar_or_pan("hashed_value_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855") is False
