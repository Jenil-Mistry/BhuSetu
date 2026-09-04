"""
Document Metadata and Vault Repository.
"""

import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from app.repositories.base import BaseRepository


class DocumentRepository(BaseRepository):

    def create_document_metadata(self, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self.db
        doc_id = str(uuid.uuid4())
        record = {
            "id": doc_id,
            "current_version": 1,
            "scan_status": "CLEAN",
            "created_at": datetime.now(timezone.utc).isoformat(),
            **data,
        }
        if db:
            res = db.table("documents").insert(record).execute()
            return res.data[0] if res.data else record

        self.store.documents.append(record)
        return record

    def get_by_id(self, document_id: str) -> Optional[Dict[str, Any]]:
        db = self.db
        if db:
            res = db.table("documents").select("*").eq("id", document_id).execute()
            return res.data[0] if res.data else None

        for d in self.store.documents:
            if d["id"] == str(document_id):
                return d
        return None

    def complete_upload(
        self,
        document_id: str,
        sha256_checksum: Optional[str] = None,
        file_size_bytes: Optional[int] = None,
    ) -> Optional[Dict[str, Any]]:
        db = self.db
        updates: Dict[str, Any] = {"scan_status": "CLEAN"}
        if sha256_checksum:
            updates["sha256_checksum"] = sha256_checksum
        if file_size_bytes:
            updates["file_size_bytes"] = file_size_bytes

        if db:
            res = db.table("documents").update(updates).eq("id", document_id).execute()
            return res.data[0] if res.data else None

        for d in self.store.documents:
            if d["id"] == str(document_id):
                d.update(updates)
                return d
        return None


document_repo = DocumentRepository()
