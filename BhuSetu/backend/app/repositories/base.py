"""
Base Repository with Live Supabase Client access and high-fidelity local state fallback.
Guarantees zero crashes and complete functionality in offline/development/testing mode.
"""

import uuid
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from supabase import Client

from app.dependencies import get_db

logger = logging.getLogger("bhusetu.repo")


class InMemoryDataStore:
    """
    In-memory state store seeded with demo records for offline/testing development.
    """

    def __init__(self):
        self.states: List[Dict[str, Any]] = [
            {"id": 1, "code": "GJ", "name": "Gujarat"},
            {"id": 2, "code": "MH", "name": "Maharashtra"},
            {"id": 3, "code": "DL", "name": "Delhi"},
        ]
        self.districts: List[Dict[str, Any]] = [
            {"id": 1, "state_id": 1, "code": "GJ-AMD", "name": "Ahmedabad"},
            {"id": 2, "state_id": 1, "code": "GJ-SRT", "name": "Surat"},
            {"id": 3, "state_id": 2, "code": "MH-MUM", "name": "Mumbai Suburban"},
            {"id": 4, "state_id": 2, "code": "MH-PUN", "name": "Pune"},
        ]
        self.subdistricts: List[Dict[str, Any]] = [
            {"id": 1, "district_id": 1, "code": "GJ-AMD-SAN", "name": "Sanand"},
            {"id": 2, "district_id": 1, "code": "GJ-AMD-DAS", "name": "Daskroi"},
        ]
        self.villages: List[Dict[str, Any]] = [
            {"id": 1, "district_id": 1, "subdistrict_id": 1, "code": "GJ0101", "name": "Moraiya"},
            {"id": 2, "district_id": 1, "subdistrict_id": 1, "code": "GJ0102", "name": "Changodar"},
            {"id": 3, "district_id": 1, "subdistrict_id": 2, "code": "GJ0103", "name": "Bavla"},
        ]
        self.organizations: List[Dict[str, Any]] = [
            {"id": 1, "name": "National Highways Authority of India (NHAI)", "org_type": "NHAI", "state_id": None, "district_id": None},
            {"id": 2, "name": "Ministry of Road Transport and Highways (MoRTH)", "org_type": "MINISTRY", "state_id": None, "district_id": None},
            {"id": 3, "name": "Gujarat State Revenue Department", "org_type": "STATE_REVENUE", "state_id": 1, "district_id": None},
            {"id": 4, "name": "Ahmedabad District Collectorate", "org_type": "DISTRICT_COLLECTORATE", "state_id": 1, "district_id": 1},
        ]
        self.projects: List[Dict[str, Any]] = [
            {
                "id": "11111111-1111-1111-1111-111111111111",
                "name": "NH-48 Vadodara-Ahmedabad Expressway Widening",
                "code": "NH48-SEC-09",
                "description": "Acquisition of bypass corridor for 6-lane access-controlled highway in Moraiya & Changodar.",
                "status": "APPROVED",
                "district_id": 1,
                "organization_id": 1,
                "estimated_budget": 145000000.00,
                "created_by": "00000000-0000-0000-0000-000000000003",
                "created_at": "2026-08-01T10:00:00Z",
                "updated_at": "2026-08-15T14:30:00Z",
            }
        ]
        self.proposals: List[Dict[str, Any]] = [
            {
                "id": "33333333-3333-3333-3333-333333333331",
                "project_id": "11111111-1111-1111-1111-111111111111",
                "proposal_version": 1,
                "purpose": "Corridor expansion to relieve commercial freight congestion",
                "requiring_body": "National Highways Authority of India",
                "estimated_area_hectares": 36.5,
                "estimated_budget": 145000000.00,
                "submission_notes": "All environmental SIA approvals preliminarily verified.",
                "submitted_at": "2026-08-01T10:30:00Z",
            }
        ]
        self.land_parcels: List[Dict[str, Any]] = [
            {
                "id": "22222222-2222-2222-2222-222222222201",
                "project_id": "11111111-1111-1111-1111-111111111111",
                "village_id": 1,
                "parcel_number": "Khasra 401/1 (Moraiya)",
                "area_sq_meters": 12500.0,
                "status": "SEC_11_NOTIFIED",
                "payment_status": "ESCROW_DEPOSITED",
                "kml_document_url": None,
                "survey_photo_url": None,
                "created_at": "2026-08-05T09:00:00Z",
            },
            {
                "id": "22222222-2222-2222-2222-222222222202",
                "project_id": "11111111-1111-1111-1111-111111111111",
                "village_id": 1,
                "parcel_number": "Khasra 401/2 (Moraiya)",
                "area_sq_meters": 8400.0,
                "status": "AWARDED",
                "payment_status": "PFMS_INITIATED",
                "kml_document_url": None,
                "survey_photo_url": None,
                "created_at": "2026-08-05T09:15:00Z",
            },
            {
                "id": "22222222-2222-2222-2222-222222222203",
                "project_id": "11111111-1111-1111-1111-111111111111",
                "village_id": 2,
                "parcel_number": "Khasra 112 (Changodar)",
                "area_sq_meters": 15600.0,
                "status": "POSSESSION_TAKEN",
                "payment_status": "DBT_CLEARED",
                "kml_document_url": None,
                "survey_photo_url": None,
                "created_at": "2026-08-06T11:20:00Z",
            },
        ]
        self.workflow_history: List[Dict[str, Any]] = [
            {
                "id": str(uuid.uuid4()),
                "project_id": "11111111-1111-1111-1111-111111111111",
                "from_stage": "DRAFT",
                "to_stage": "SUBMITTED",
                "action": "SUBMIT",
                "performed_by": "00000000-0000-0000-0000-000000000003",
                "comment": "Initial proposal submitted for scrutiny",
                "created_at": "2026-08-01T10:30:00Z",
            },
            {
                "id": str(uuid.uuid4()),
                "project_id": "11111111-1111-1111-1111-111111111111",
                "from_stage": "SUBMITTED",
                "to_stage": "SCRUTINY",
                "action": "ASSIGN_SCRUTINY",
                "performed_by": "00000000-0000-0000-0000-000000000002",
                "comment": "Assigned to Ahmedabad DLAO office",
                "created_at": "2026-08-02T11:00:00Z",
            },
            {
                "id": str(uuid.uuid4()),
                "project_id": "11111111-1111-1111-1111-111111111111",
                "from_stage": "SCRUTINY",
                "to_stage": "APPROVED",
                "action": "APPROVE",
                "performed_by": "00000000-0000-0000-0000-000000000002",
                "comment": "Scrutiny completed successfully. Land acquisition sanctioned.",
                "created_at": "2026-08-15T14:30:00Z",
            },
        ]
        self.notifications: List[Dict[str, Any]] = []
        self.awards: List[Dict[str, Any]] = []
        self.compensation_assessments: List[Dict[str, Any]] = []
        self.payment_batches: List[Dict[str, Any]] = []
        self.payment_items: List[Dict[str, Any]] = []
        self.possession_records: List[Dict[str, Any]] = []
        self.affected_families: List[Dict[str, Any]] = []
        self.rr_entitlements: List[Dict[str, Any]] = []
        self.documents: List[Dict[str, Any]] = []
        self.audit_events: List[Dict[str, Any]] = []
        self.outbox_events: List[Dict[str, Any]] = []


# Singleton in-memory store
memory_store = InMemoryDataStore()


class BaseRepository:
    """Base class for all domain repositories."""

    @property
    def db(self) -> Optional[Client]:
        return get_db()

    @property
    def store(self) -> InMemoryDataStore:
        return memory_store
