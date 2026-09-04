"""
Standard error codes, exceptions, and FastAPI exception handlers.
"""

from typing import Any, Dict, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None


class ErrorEnvelope(BaseModel):
    data: Optional[Any] = None
    meta: Optional[Dict[str, Any]] = None
    error: ErrorDetail


# Standard Error Codes
class ErrorCodes:
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS"
    SCOPE_MISMATCH = "SCOPE_MISMATCH"
    NOT_FOUND = "NOT_FOUND"
    CONFLICT = "CONFLICT"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    WORKFLOW_INVALID_TRANSITION = "WORKFLOW_INVALID_TRANSITION"
    WORKFLOW_MISSING_DOCUMENTS = "WORKFLOW_MISSING_DOCUMENTS"
    SPATIAL_INVALID_GEOMETRY = "SPATIAL_INVALID_GEOMETRY"
    SPATIAL_CRS_UNSUPPORTED = "SPATIAL_CRS_UNSUPPORTED"
    PAYMENT_RECONCILIATION_FAILED = "PAYMENT_RECONCILIATION_FAILED"
    STORAGE_ERROR = "STORAGE_ERROR"
    DATABASE_ERROR = "DATABASE_ERROR"
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"


class BhuSetuException(Exception):
    """Base exception for all domain errors."""

    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class WorkflowException(BhuSetuException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            code=ErrorCodes.WORKFLOW_INVALID_TRANSITION,
            message=message,
            status_code=getattr(status, "HTTP_422_UNPROCESSABLE_CONTENT", 422),
            details=details,
        )


class ScopeDeniedException(BhuSetuException):
    def __init__(self, message: str = "Access denied for the requested administrative scope", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            code=ErrorCodes.SCOPE_MISMATCH,
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            details=details,
        )


class EntityNotFoundException(BhuSetuException):
    def __init__(self, entity_type: str, entity_id: Any):
        super().__init__(
            code=ErrorCodes.NOT_FOUND,
            message=f"{entity_type} with ID '{entity_id}' was not found.",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"entity_type": entity_type, "entity_id": str(entity_id)},
        )


async def bhusetu_exception_handler(request: Request, exc: BhuSetuException) -> JSONResponse:
    correlation_id = getattr(request.state, "correlation_id", "unknown")
    payload = {
        "data": None,
        "meta": {"correlation_id": correlation_id},
        "error": {
            "code": exc.code,
            "message": exc.message,
            "details": exc.details,
        },
    }
    return JSONResponse(status_code=exc.status_code, content=payload)
