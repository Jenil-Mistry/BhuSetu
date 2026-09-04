"""
Append-Only Audit Repository.
Stores and queries all domain mutations with before/after state diffs.
"""

import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from app.repositories.base import BaseRepository


class AuditRepository(BaseRepository):

    def append_event(
        self,
        action: str,
        entity_type: str,
        entity_id: str,
        actor_id: Optional[str] = None,
        before_state: Optional[Dict[str, Any]] = None,
        after_state: Optional[Dict[str, Any]] = None,
        correlation_id: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> Dict[str, Any]:
        db = self.db
        rec_id = str(uuid.uuid4())
        record = {
            "id": rec_id,
            "action": action,
            "entity_type": entity_type,
            "entity_id": str(entity_id),
            "actor_id": actor_id,
            "before_state": before_state,
            "after_state": after_state,
            "correlation_id": correlation_id,
            "ip_address": ip_address,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        if db:
            res = db.table("audit_events").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.audit_events.append(record)
        return record

    def list_events(
        self,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        actor_id: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            query = db.table("audit_events").select("*")
            if entity_type:
                query = query.eq("entity_type", entity_type)
            if entity_id:
                query = query.eq("entity_id", str(entity_id))
            if actor_id:
                query = query.eq("actor_id", actor_id)
            res = query.order("created_at", desc=True).limit(limit).execute()
            return res.data

        results = self.store.audit_events
        if entity_type:
            results = [e for e in results if e.get("entity_type") == entity_type]
        if entity_id:
            results = [e for e in results if e.get("entity_id") == str(entity_id)]
        if actor_id:
            results = [e for e in results if e.get("actor_id") == actor_id]
        return results[:limit]


audit_repo = AuditRepository()
