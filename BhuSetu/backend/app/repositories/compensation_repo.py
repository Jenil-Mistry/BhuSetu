"""
Compensation Assessment and Payment Batch Repository.
"""

import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from decimal import Decimal
from app.repositories.base import BaseRepository


class CompensationRepository(BaseRepository):

    def create_assessment(self, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self.db
        rec_id = str(uuid.uuid4())
        # Convert Decimals to float/string for JSON serialization if needed
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
            res = db.table("compensation_assessments").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.compensation_assessments.append(record)
        return record

    def list_assessments(self, award_id: Optional[str] = None, parcel_id: Optional[str] = None) -> List[Dict[str, Any]]:
        db = self.db
        if db:
            query = db.table("compensation_assessments").select("*")
            if award_id:
                query = query.eq("award_id", award_id)
            if parcel_id:
                query = query.eq("parcel_id", parcel_id)
            res = query.execute()
            return res.data

        results = self.store.compensation_assessments
        if award_id:
            results = [a for a in results if a.get("award_id") == str(award_id)]
        if parcel_id:
            results = [a for a in results if a.get("parcel_id") == str(parcel_id)]
        return results

    def create_payment_batch(self, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self.db
        batch_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        record = {
            "id": batch_id,
            "status": "INITIATED",
            "created_at": now,
            **data,
        }
        if db:
            res = db.table("payment_batches").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.payment_batches.append(record)
        return record

    def get_payment_batch(self, batch_id: str) -> Optional[Dict[str, Any]]:
        db = self.db
        if db:
            res = db.table("payment_batches").select("*").eq("id", batch_id).execute()
            return res.data[0] if res.data else None

        for b in self.store.payment_batches:
            if b["id"] == str(batch_id):
                return b
        return None

    def reconcile_payment_item(self, item_id: str, status: str, utr_number: Optional[str], notes: Optional[str]) -> Dict[str, Any]:
        db = self.db
        now = datetime.now(timezone.utc).isoformat()
        updates = {
            "status": status,
            "utr_number": utr_number,
            "reconciled_at": now,
        }
        if db:
            res = db.table("payment_items").update(updates).eq("id", item_id).execute()
            return res.data[0] if res.data else {"id": item_id, **updates}

        return {"id": item_id, **updates}


compensation_repo = CompensationRepository()
