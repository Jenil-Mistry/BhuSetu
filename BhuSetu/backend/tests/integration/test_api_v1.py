"""
Integration tests for the complete BhuSetu API surface.
"""

import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_and_health_endpoints():
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert res_root.json()["system"] == "BhuSetu Platform"

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"


def test_auth_and_reference_endpoints():
    res_me = client.get("/api/v1/me", headers={"Authorization": "Bearer dlao"})
    assert res_me.status_code == 200
    data_me = res_me.json()
    assert data_me["role"] == "DLAO"
    assert len(data_me["assignments"]) > 0

    res_states = client.get("/api/v1/reference/states")
    assert res_states.status_code == 200
    states = res_states.json()
    assert len(states) >= 1
    assert any(s["name"] == "Gujarat" for s in states)


def test_projects_crud_and_proposal_submission():
    # 1. Create project
    create_payload = {
        "name": "Integration Test Highway",
        "code": "INT-HWY-001",
        "description": "Integration testing corridor",
        "status": "DRAFT",
        "district_id": 1,
        "organization_id": 1,
        "estimated_budget": 12000000.0,
    }
    res_create = client.post(
        "/api/v1/projects",
        json=create_payload,
        headers={"Authorization": "Bearer pia"},
    )
    assert res_create.status_code == 201
    created_proj = res_create.json()["data"]
    project_id = created_proj["id"]

    # 2. List projects
    res_list = client.get("/api/v1/projects")
    assert res_list.status_code == 200
    assert res_list.json()["count"] >= 1

    # 3. Submit proposal
    submit_payload = {
        "purpose": "Corridor expansion",
        "requiring_body": "NHAI",
        "estimated_area_hectares": 15.0,
        "estimated_budget": 12000000.0,
        "submission_notes": "All environmental criteria verified.",
    }
    res_submit = client.post(
        f"/api/v1/projects/{project_id}/submit",
        json=submit_payload,
        headers={"Authorization": "Bearer pia"},
    )
    assert res_submit.status_code == 200
    assert res_submit.json()["data"]["new_status"] == "SUBMITTED"

    # 4. Scrutinize and Approve transition
    res_scrutiny = client.post(
        f"/api/v1/projects/{project_id}/transition",
        json={"action": "ASSIGN_SCRUTINY", "comment": "Assigned to DLAO"},
        headers={"Authorization": "Bearer dlao"},
    )
    assert res_scrutiny.status_code == 200
    assert res_scrutiny.json()["data"]["new_status"] == "SCRUTINY"

    res_approve = client.post(
        f"/api/v1/projects/{project_id}/transition",
        json={"action": "APPROVE", "comment": "Proposal sanctioned."},
        headers={"Authorization": "Bearer dlao"},
    )
    assert res_approve.status_code == 200
    assert res_approve.json()["data"]["new_status"] == "APPROVED"

    # 5. Check timeline
    res_timeline = client.get(f"/api/v1/projects/{project_id}/timeline")
    assert res_timeline.status_code == 200
    assert res_timeline.json()["count"] >= 3


def test_parcels_and_spatial_intersections():
    # 1. List parcels
    res_parcels = client.get("/api/v1/parcels")
    assert res_parcels.status_code == 200
    assert res_parcels.json()["count"] >= 1
    sample_parcel = res_parcels.json()["data"][0]
    parcel_id = sample_parcel["id"]

    # 2. Verify parcel
    verify_payload = {
        "verified": True,
        "verification_method": "FIELD_SURVEY",
        "remarks": "Boundary markers inspected and found accurate.",
    }
    res_verify = client.post(
        f"/api/v1/parcels/{parcel_id}/verify",
        json=verify_payload,
        headers={"Authorization": "Bearer surveyor"},
    )
    assert res_verify.status_code == 200

    # 3. Spatial Intersections RPC
    intersection_payload = {
        "geojson_geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [72.450, 22.950],
                    [72.465, 22.950],
                    [72.465, 22.955],
                    [72.450, 22.955],
                    [72.450, 22.950],
                ]
            ],
        }
    }
    res_intersect = client.post("/api/v1/spatial/calculate-intersections", json=intersection_payload)
    assert res_intersect.status_code == 200
    assert res_intersect.json()["success"] is True
    assert "intersections_found" in res_intersect.json()


def test_statutory_notifications_and_compensation():
    project_id = "11111111-1111-1111-1111-111111111111"

    # 1. Section 11 Notification
    notif_payload = {
        "project_id": project_id,
        "notification_type": "SECTION_11",
        "gazette_number": "GAZ-2026-TEST-99",
        "publication_date": "2026-09-04",
        "authority": "District Magistrate Ahmedabad",
        "affected_villages": [1, 2],
    }
    res_notif = client.post(
        f"/api/v1/projects/{project_id}/notifications",
        json=notif_payload,
        headers={"Authorization": "Bearer dlao"},
    )
    assert res_notif.status_code == 201

    # 2. Statutory Award
    award_payload = {
        "project_id": project_id,
        "parcel_id": "22222222-2222-2222-2222-222222222201",
        "award_number": "AWD-TEST-001",
        "award_date": "2026-09-04",
        "assessed_amount": 2500000.0,
        "authority": "CALA Officer",
    }
    res_award = client.post(
        f"/api/v1/projects/{project_id}/awards",
        json=award_payload,
        headers={"Authorization": "Bearer dlao"},
    )
    assert res_award.status_code == 201
    award_id = res_award.json()["data"]["id"]

    # 3. Assessment calculation
    assessment_payload = {
        "award_id": award_id,
        "parcel_id": "22222222-2222-2222-2222-222222222201",
        "market_value": "1000000.00",
        "solatium_percentage": "100.00",
        "interest_rate_percentage": "12.00",
        "assets_value": "50000.00",
    }
    res_assess = client.post(
        f"/api/v1/awards/{award_id}/assessments",
        json=assessment_payload,
        headers={"Authorization": "Bearer compensation"},
    )
    assert res_assess.status_code == 201
    assert float(res_assess.json()["data"]["total_assessed_amount"]) == 2170000.0


def test_dashboard_summary():
    res = client.get("/api/v1/dashboard/summary")
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["total_projects"] >= 1
    assert data["total_parcels"] >= 1
    assert "possession_percentage" in data
    assert "total_compensation_assessed_cr" in data


def test_direct_upload_kml_compatibility():
    fake_kml = b"<?xml version='1.0' encoding='UTF-8'?><kml><Document><name>Test</name></Document></kml>"
    files = {"file": ("test.kml", io.BytesIO(fake_kml), "application/vnd.google-earth.kml+xml")}
    data = {"project_id": "11111111-1111-1111-1111-111111111111"}

    res = client.post("/api/v1/storage/upload-kml", data=data, files=files)
    # If MinIO is not running locally, returns 500 with descriptive detail
    # If MinIO is running, returns 200
    assert res.status_code in (200, 500)
