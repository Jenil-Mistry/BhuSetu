"""
Project and Proposal Repository.
Direct Supabase table operations with in-memory fallback.
"""

import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from app.repositories.base import BaseRepository


class ProjectRepository(BaseRepository):

    def list_projects(
        self,
        status: Optional[str] = None,
        district_id: Optional[int] = None,
        organization_id: Optional[int] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            query = db.table("projects").select("*")
            if status:
                query = query.eq("status", status.upper())
            if district_id:
                query = query.eq("district_id", district_id)
            if organization_id:
                query = query.eq("organization_id", organization_id)
            res = query.order("created_at", desc=True).limit(limit).execute()
            return res.data

        # Fallback
        results = self.store.projects
        if status:
            results = [p for p in results if p.get("status") == status.upper()]
        if district_id:
            results = [p for p in results if p.get("district_id") == district_id]
        if organization_id:
            results = [p for p in results if p.get("organization_id") == organization_id]
        return results[:limit]

    def get_by_id(self, project_id: str) -> Optional[Dict[str, Any]]:
        db = self.db
        if db:
            res = db.table("projects").select("*").eq("id", project_id).execute()
            return res.data[0] if res.data else None

        for p in self.store.projects:
            if p["id"] == str(project_id):
                return p
        return None

    def create_project(self, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self.db
        project_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        record = {
            "id": project_id,
            "created_at": now,
            "updated_at": now,
            **data,
        }
        if db:
            res = db.table("projects").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.projects.append(record)
        return record

    def update_project(self, project_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db = self.db
        now = datetime.now(timezone.utc).isoformat()
        updates["updated_at"] = now

        if db:
            res = db.table("projects").update(updates).eq("id", project_id).execute()
            return res.data[0] if res.data else None

        for p in self.store.projects:
            if p["id"] == str(project_id):
                p.update(updates)
                return p
        return None

    def get_timeline(self, project_id: str) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            res = (
                db.table("workflow_history")
                .select("*")
                .eq("project_id", project_id)
                .order("created_at", desc=False)
                .execute()
            )
            return res.data

        return [h for h in self.store.workflow_history if h.get("project_id") == str(project_id)]


project_repo = ProjectRepository()
