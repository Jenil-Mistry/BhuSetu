"""
Rehabilitation & Resettlement (R&R) Repository.
"""

import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from decimal import Decimal
from app.repositories.base import BaseRepository


class RRRepository(BaseRepository):

    def create_family(self, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self.db
        rec_id = str(uuid.uuid4())
        record = {
            "id": rec_id,
            "status": "REGISTERED",
            "created_at": datetime.now(timezone.utc).isoformat(),
            **data,
        }
        if db:
            res = db.table("affected_families").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.affected_families.append(record)
        return record

    def list_families(self, project_id: str) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            res = db.table("affected_families").select("*").eq("project_id", project_id).execute()
            return res.data

        return [f for f in self.store.affected_families if f.get("project_id") == str(project_id)]

    def create_entitlement(self, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self.db
        rec_id = str(uuid.uuid4())
        serialized_data = {
            k: float(v) if isinstance(v, Decimal) else v
            for k, v in data.items()
        }
        record = {
            "id": rec_id,
            "status": "APPROVED",
            "created_at": datetime.now(timezone.utc).isoformat(),
            **serialized_data,
        }
        if db:
            res = db.table("rr_entitlements").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.rr_entitlements.append(record)
        return record


rr_repo = RRRepository()
