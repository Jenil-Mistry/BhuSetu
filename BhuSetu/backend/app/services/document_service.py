"""
Document Service for secure presigned S3/MinIO upload/download URLs and metadata tracking.
"""

import uuid
import os
from typing import Optional, Dict, Any
from app.repositories.document_repo import document_repo
from app.config import settings
from storage.minio_client import get_storage_service


class DocumentService:

    @staticmethod
    def generate_presigned_upload(
        filename: str,
        content_type: str,
        document_type: str,
        classification: str,
        project_id: Optional[str] = None,
        parcel_id: Optional[str] = None,
        uploader_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Creates a document record and generates a presigned S3 upload URL.
        """
        clean_filename = os.path.basename(filename)
        doc_uuid = str(uuid.uuid4())
        
        prefix = f"projects/{project_id}" if project_id else f"parcels/{parcel_id}" if parcel_id else "general"
        object_key = f"{prefix}/{doc_uuid}_{clean_filename}"

        # Register metadata in DB
        doc_record = document_repo.create_document_metadata({
            "id": doc_uuid,
            "project_id": project_id,
            "parcel_id": parcel_id,
            "filename": clean_filename,
            "document_type": document_type,
            "classification": classification,
            "object_key": object_key,
            "mime_type": content_type,
            "created_by": uploader_id,
        })

        # Generate S3 presigned URL
        upload_url = f"{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET_NAME}/{object_key}"
        try:
            storage = get_storage_service()
            upload_url = storage.s3_client.generate_presigned_url(
                ClientMethod="put_object",
                Params={
                    "Bucket": storage.bucket_name,
                    "Key": object_key,
                    "ContentType": content_type,
                },
                ExpiresIn=3600,
            )
        except Exception:
            pass  # Fallback to direct URL

        return {
            "document_id": doc_uuid,
            "object_key": object_key,
            "upload_url": upload_url,
            "expires_in": 3600,
            "headers": {"Content-Type": content_type},
        }

    @staticmethod
    def generate_presigned_download(document_id: str) -> Optional[str]:
        doc = document_repo.get_by_id(document_id)
        if not doc:
            return None

        object_key = doc["object_key"]
        try:
            storage = get_storage_service()
            return storage.generate_presigned_download_url(object_key)
        except Exception:
            return f"{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET_NAME}/{object_key}"


document_service = DocumentService()
