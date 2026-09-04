"""
Statutory Notifications, Awards, and Possession Repository.
"""

import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from app.repositories.base import BaseRepository


class StatutoryRepository(BaseRepository):

    # Notifications
    def create_notification(self, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self.db
        rec_id = str(uuid.uuid4())
        record = {
            "id": rec_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            **data,
        }
        if db:
            res = db.table("notifications").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.notifications.append(record)
        return record

    def list_notifications(self, project_id: Optional[str] = None) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            query = db.table("notifications").select("*")
            if project_id:
                query = query.eq("project_id", project_id)
            res = query.order("publication_date", desc=True).execute()
            return res.data

        results = self.store.notifications
        if project_id:
            results = [n for n in results if n.get("project_id") == str(project_id)]
        return results

    # Awards
    def create_award(self, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self.db
        rec_id = str(uuid.uuid4())
        record = {
            "id": rec_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            **data,
        }
        if db:
            res = db.table("awards").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.awards.append(record)
        return record

    def list_awards(self, project_id: Optional[str] = None) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            query = db.table("awards").select("*")
            if project_id:
                query = query.eq("project_id", project_id)
            res = query.order("award_date", desc=True).execute()
            return res.data

        results = self.store.awards
        if project_id:
            results = [a for a in results if a.get("project_id") == str(project_id)]
        return results

    # Possession
    def record_possession(self, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self.db
        rec_id = str(uuid.uuid4())
        record = {
            "id": rec_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            **data,
        }
        if db:
            res = db.table("possession_records").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.possession_records.append(record)
        return record


statutory_repo = StatutoryRepository()
