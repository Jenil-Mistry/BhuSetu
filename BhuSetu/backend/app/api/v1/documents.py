"""
Documents and Object Storage API Router.
Supports both modern presigned URL workflows and direct multipart upload compatibility endpoints.
"""

from typing import Optional
from fastapi import APIRouter, Depends, status, Request, HTTPException, UploadFile, File, Form

from app.dependencies import get_current_user, UserContext
from app.schemas.document import (
    PresignedUploadRequest,
    PresignedUploadResponse,
    CompleteUploadRequest,
    DocumentResponse,
)
from app.repositories.document_repo import document_repo
from app.services.document_service import document_service
from app.services.audit_service import audit_service
from storage.minio_client import get_storage_service

router = APIRouter(tags=["Documents & Storage"])


@router.post("/documents/presign-upload", response_model=PresignedUploadResponse)
def get_presigned_upload_url(
    req: PresignedUploadRequest,
    user: UserContext = Depends(get_current_user),
):
    """
    Generates a secure temporary presigned S3/MinIO upload URL for client-side direct upload.
    """
    result = document_service.generate_presigned_upload(
        filename=req.filename,
        content_type=req.content_type,
        document_type=req.document_type,
        classification=req.classification,
        project_id=req.project_id,
        parcel_id=req.parcel_id,
        uploader_id=user.user_id,
    )
    return PresignedUploadResponse(**result)


@router.post("/documents/{document_id}/complete-upload")
def complete_document_upload(
    document_id: str,
    req: CompleteUploadRequest,
    request: Request,
    user: UserContext = Depends(get_current_user),
):
    """
    Confirms successful upload, recording checksum and file size in database metadata.
    """
    doc = document_repo.complete_upload(
        document_id=document_id,
        sha256_checksum=req.sha256_checksum,
        file_size_bytes=req.file_size_bytes,
    )
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")

    correlation_id = getattr(request.state, "correlation_id", None)
    audit_service.record_action(
        action="DOCUMENT_UPLOAD_COMPLETED",
        entity_type="DOCUMENT",
        entity_id=document_id,
        actor_id=user.user_id,
        correlation_id=correlation_id,
    )

    return {
        "success": True,
        "message": "Document upload verified and recorded.",
        "data": doc,
    }


@router.get("/documents/{document_id}")
def get_document_metadata(
    document_id: str,
    user: UserContext = Depends(get_current_user),
):
    """
    Retrieves document metadata and scan status.
    """
    doc = document_repo.get_by_id(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")
    return {
        "success": True,
        "data": doc,
    }


@router.get("/documents/{document_id}/download-url")
def get_document_download_url(
    document_id: str,
    user: UserContext = Depends(get_current_user),
):
    """
    Generates a secure, temporary presigned download URL for private documents.
    """
    download_url = document_service.generate_presigned_download(document_id)
    if not download_url:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")
    return {
        "success": True,
        "document_id": document_id,
        "download_url": download_url,
    }


# ============================================================================
# Compatibility direct upload endpoints matching existing main.py routes
# ============================================================================
@router.post("/storage/upload-kml")
async def upload_kml_file(
    project_id: str = Form(..., description="Target Project UUID"),
    file: UploadFile = File(..., description="KML file"),
):
    """
    Uploads a KML boundary layer to the local MinIO bucket under projects/{project_id}/kml/.
    """
    if not file.filename.lower().endswith((".kml", ".kmz", ".xml")):
        raise HTTPException(status_code=400, detail="Invalid file type. Only .kml or .kmz files are allowed.")

    storage = get_storage_service()
    try:
        contents = await file.read()
        result = storage.upload_kml(
            file_data=contents,
            project_id=project_id,
            filename=file.filename,
        )
        download_url = storage.generate_presigned_download_url(result["key"])
        return {
            "success": True,
            "message": "KML uploaded successfully.",
            "storage": result,
            "presigned_download_url": download_url,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(exc)}")


@router.post("/storage/upload-survey-image")
async def upload_survey_image(
    parcel_id: str = Form(..., description="Target Parcel UUID"),
    file: UploadFile = File(..., description="Geo-tagged photo or survey image"),
):
    """
    Uploads a geo-tagged survey image to MinIO under parcels/{parcel_id}/surveys/.
    """
    storage = get_storage_service()
    try:
        contents = await file.read()
        result = storage.upload_geotagged_image(
            file_data=contents,
            parcel_id=parcel_id,
            filename=file.filename,
            content_type=file.content_type or "image/jpeg",
        )
        download_url = storage.generate_presigned_download_url(result["key"])
        return {
            "success": True,
            "message": "Survey image uploaded successfully.",
            "storage": result,
            "presigned_download_url": download_url,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(exc)}")
