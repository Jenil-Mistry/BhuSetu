"""
Reference Data Repository.
Fetches administrative geography and organizational hierarchies.
"""

from typing import Optional, List, Dict, Any
from app.repositories.base import BaseRepository


class ReferenceRepository(BaseRepository):

    def list_states(self) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            res = db.table("states").select("id, code, name").order("name").execute()
            return res.data
        return self.store.states

    def list_districts(self, state_id: Optional[int] = None) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            query = db.table("districts").select("id, state_id, code, name")
            if state_id:
                query = query.eq("state_id", state_id)
            res = query.order("name").execute()
            return res.data

        results = self.store.districts
        if state_id:
            results = [d for d in results if d["state_id"] == state_id]
        return results

    def list_subdistricts(self, district_id: Optional[int] = None) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            query = db.table("subdistricts").select("id, district_id, code, name")
            if district_id:
                query = query.eq("district_id", district_id)
            res = query.order("name").execute()
            return res.data

        results = self.store.subdistricts
        if district_id:
            results = [s for s in results if s["district_id"] == district_id]
        return results

    def list_villages(self, district_id: Optional[int] = None, subdistrict_id: Optional[int] = None) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            query = db.table("villages").select("id, district_id, subdistrict_id, code, name")
            if district_id:
                query = query.eq("district_id", district_id)
            if subdistrict_id:
                query = query.eq("subdistrict_id", subdistrict_id)
            res = query.order("name").execute()
            return res.data

        results = self.store.villages
        if district_id:
            results = [v for v in results if v["district_id"] == district_id]
        if subdistrict_id:
            results = [v for v in results if v["subdistrict_id"] == subdistrict_id]
        return results

    def list_organizations(self) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            res = db.table("organizations").select("*").order("name").execute()
            return res.data
        return self.store.organizations


reference_repo = ReferenceRepository()
