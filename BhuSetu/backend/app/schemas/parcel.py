"""
Land Parcel and PostGIS Spatial Schemas.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ParcelCreate(BaseModel):
    project_id: str
    village_id: Optional[int] = None
    parcel_number: str = Field(..., examples=["Khasra 402/1"])
    area_sq_meters: Optional[float] = Field(None, description="Calculated area in sq meters")
    owner_name: Optional[str] = None
    geometry: Dict[str, Any] = Field(..., description="GeoJSON Polygon or MultiPolygon")


class ParcelUpdate(BaseModel):
    parcel_number: Optional[str] = None
    status: Optional[str] = None
    payment_status: Optional[str] = None
    survey_photo_url: Optional[str] = None


class ParcelResponse(BaseModel):
    id: str
    project_id: str
    village_id: Optional[int] = None
    parcel_number: str
    area_sq_meters: Optional[float] = None
    area_hectares: Optional[float] = None
    status: str
    payment_status: Optional[str] = None
    survey_photo_url: Optional[str] = None
    kml_document_url: Optional[str] = None
    created_at: Optional[datetime] = None


class ParcelVerificationRequest(BaseModel):
    verified: bool
    verification_method: str = Field(..., examples=["FIELD_SURVEY"], description="FIELD_SURVEY, CADASTRAL_OFFICE, DRONE_IMAGERY")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    remarks: Optional[str] = None
    photo_urls: List[str] = []


class SpatialIntersectionRequest(BaseModel):
    geojson_geometry: Dict[str, Any] = Field(
        ...,
        description="GeoJSON geometry (Polygon or MultiPolygon) representing the proposed acquisition corridor",
    )
    project_id: Optional[str] = Field(
        default=None,
        description="Optional filter by project UUID",
    )


class SpatialIntersectionItem(BaseModel):
    parcel_id: str
    parcel_number: str
    project_id: Optional[str] = None
    status: str
    total_area_sq_m: float
    overlap_area_sq_m: float
    overlap_percentage: float
    overlap_geom_geojson: Optional[str] = None


class ParcelImportJobResponse(BaseModel):
    import_id: str
    project_id: str
    filename: str
    total_rows: int
    processed_rows: int
    success_count: int
    error_count: int
    status: str
