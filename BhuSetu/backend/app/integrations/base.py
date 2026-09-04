"""
Integration Protocol and Base Interfaces for External Government Systems.
"""

from typing import Protocol, Dict, Any, Optional
from pydantic import BaseModel


class IntegrationHealth(BaseModel):
    adapter_name: str
    status: str  # HEALTHY, DEGRADED, OFFLINE
    latency_ms: float
    details: Optional[Dict[str, Any]] = None


class GovernmentAdapter(Protocol):
    def health(self) -> IntegrationHealth:
        ...

    def pull(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        ...

    def push(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        ...
