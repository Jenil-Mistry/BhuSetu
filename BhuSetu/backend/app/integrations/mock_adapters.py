"""
Mock Integration Adapters for SIH Problem Statement 26016 Demonstration.
Faithfully implements the GovernmentAdapter protocol without mutating real external systems.
"""

import time
import logging
from typing import Dict, Any
from app.integrations.base import IntegrationHealth

logger = logging.getLogger("bhusetu.integrations")


class MockLandRecordsAdapter:
    """Simulates State Land Records Bhulekh / RoR API."""

    def health(self) -> IntegrationHealth:
        return IntegrationHealth(
            adapter_name="State_Bhulekh_Land_Records",
            status="HEALTHY",
            latency_ms=45.0,
            details={"provider": "NIC / State Land Records Portal"},
        )

    def pull(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        khasra_no = request_payload.get("parcel_number", "401/1")
        return {
            "success": True,
            "source": "State Cadastral Registry (Bhulekh)",
            "khasra_no": khasra_no,
            "owner_record": "Verified Landholder",
            "encumbrance_status": "CLEAR",
            "verified_at": "2026-09-04T10:00:00Z",
        }

    def push(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "success": True,
            "action": "MUTATION_INTENT_RECORDED",
            "acknowledgement_no": "BHL-2026-MUT-8841",
        }


class MockPfmsAdapter:
    """Simulates Public Financial Management System (PFMS) / DBT."""

    def health(self) -> IntegrationHealth:
        return IntegrationHealth(
            adapter_name="PFMS_DBT_Gateway",
            status="HEALTHY",
            latency_ms=120.0,
            details={"bank_gateway": "NPCI / RBI Escrow Gateway"},
        )

    def pull(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        batch_id = request_payload.get("batch_id")
        return {
            "success": True,
            "batch_id": batch_id,
            "status": "DBT_CLEARED",
            "utr_number": "RBI202609048891234",
            "cleared_items": 1,
            "failed_items": 0,
        }

    def push(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "success": True,
            "transaction_id": "PFMS-TXN-2026-9901",
            "status": "ACCEPTED_FOR_CLEARING",
        }


class MockNotificationAdapter:
    """Simulates Government SMS and Email Gateway."""

    def health(self) -> IntegrationHealth:
        return IntegrationHealth(
            adapter_name="Govt_SMS_Email_Gateway",
            status="HEALTHY",
            latency_ms=25.0,
            details={"sms_sender_id": "BHUSET"},
        )

    def push(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        logger.info(f"[SMS/Email Alert Sent] To: {request_payload.get('recipient')} Msg: {request_payload.get('message')}")
        return {
            "success": True,
            "message_id": "MSG-9923841",
            "delivery_status": "DELIVERED",
        }


mock_land_records = MockLandRecordsAdapter()
mock_pfms = MockPfmsAdapter()
mock_notifications = MockNotificationAdapter()
