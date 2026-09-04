"""
Outbox Repository for asynchronous event dispatch.
"""

import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from app.repositories.base import BaseRepository


class OutboxRepository(BaseRepository):

    def queue_event(self, event_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        db = self.db
        rec_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        record = {
            "id": rec_id,
            "event_type": event_type,
            "payload": payload,
            "status": "PENDING",
            "retry_count": 0,
            "max_retries": 5,
            "created_at": now,
        }
        if db:
            res = db.table("outbox_events").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.outbox_events.append(record)
        return record

    def fetch_pending_events(self, limit: int = 10) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            res = (
                db.table("outbox_events")
                .select("*")
                .eq("status", "PENDING")
                .order("created_at", desc=False)
                .limit(limit)
                .execute()
            )
            return res.data

        return [e for e in self.store.outbox_events if e.get("status") == "PENDING"][:limit]

    def mark_completed(self, event_id: str):
        db = self.db
        if db:
            db.table("outbox_events").update({"status": "DELIVERED"}).eq("id", event_id).execute()
            return
        for e in self.store.outbox_events:
            if e["id"] == str(event_id):
                e["status"] = "DELIVERED"


outbox_repo = OutboxRepository()
