"""
Document Management and Presigned URL Schemas.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class PresignedUploadRequest(BaseModel):
    project_id: Optional[str] = None
    parcel_id: Optional[str] = None
    filename: str = Field(..., examples=["feasibility_report.pdf"])
    content_type: str = Field(default="application/pdf", examples=["application/pdf"])
    document_type: str = Field(default="GENERAL", examples=["FEASIBILITY_REPORT"], description="FEASIBILITY_REPORT, SIA_REPORT, GAZETTE_NOTIFICATION, SURVEY_PHOTO, KML_LAYER")
    classification: str = Field(default="RESTRICTED", description="PUBLIC, RESTRICTED, CONFIDENTIAL")


class PresignedUploadResponse(BaseModel):
    document_id: str
    object_key: str
    upload_url: str
    expires_in: int = 3600
    headers: Dict[str, str] = {}


class CompleteUploadRequest(BaseModel):
    document_id: str
    sha256_checksum: Optional[str] = None
    file_size_bytes: Optional[int] = None


class DocumentResponse(BaseModel):
    id: str
    filename: str
    document_type: str
    classification: str
    object_key: str
    file_size_bytes: Optional[int] = None
    mime_type: Optional[str] = None
    current_version: int = 1
    scan_status: str = "CLEAN"
    created_at: datetime
