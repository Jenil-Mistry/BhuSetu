"""
Common API schemas: Envelopes, Pagination, Metadata.
"""

from typing import Generic, TypeVar, Optional, List, Dict, Any
from pydantic import BaseModel, Field

T = TypeVar("T")


class MetaData(BaseModel):
    correlation_id: Optional[str] = None
    count: Optional[int] = None
    limit: Optional[int] = None
    cursor: Optional[str] = None


class ApiResponse(BaseModel, Generic[T]):
    """Standard API envelope for all JSON responses."""
    data: Optional[T] = None
    meta: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, Any]] = None


class PaginationParams(BaseModel):
    limit: int = Field(default=50, ge=1, le=500)
    cursor: Optional[str] = None
    sort_by: Optional[str] = "created_at"
    sort_desc: bool = True
