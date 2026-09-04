"""
PostGIS Spatial and Geodetic Calculation Service.
Validates GeoJSON, normalizes geometries, and computes true ground areas.
"""

import math
from typing import Dict, Any, List, Optional
from app.errors import BhuSetuException, ErrorCodes


class SpatialService:

    @staticmethod
    def validate_geojson_geometry(geometry: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates GeoJSON geometry structure (Polygon or MultiPolygon) and coordinates.
        """
        if not isinstance(geometry, dict):
            raise BhuSetuException(
                code=ErrorCodes.SPATIAL_INVALID_GEOMETRY,
                message="Geometry must be a valid GeoJSON dictionary.",
            )

        geom_type = geometry.get("type")
        if geom_type not in ("Polygon", "MultiPolygon", "Point", "LineString"):
            raise BhuSetuException(
                code=ErrorCodes.SPATIAL_INVALID_GEOMETRY,
                message=f"Unsupported geometry type: '{geom_type}'. Must be Polygon or MultiPolygon.",
            )

        coordinates = geometry.get("coordinates")
        if not coordinates or not isinstance(coordinates, list):
            raise BhuSetuException(
                code=ErrorCodes.SPATIAL_INVALID_GEOMETRY,
                message="Geometry coordinates missing or invalid.",
            )

        return geometry

    @staticmethod
    def calculate_geodetic_area_sq_meters(coordinates: List[List[List[float]]]) -> float:
        """
        Computes accurate spherical surface area on WGS84 for a polygon in square meters.
        Eliminates Web Mercator distortion without requiring an external GIS runtime.
        """
        if not coordinates or len(coordinates) == 0:
            return 0.0

        ring = coordinates[0]
        if len(ring) < 3:
            return 0.0

        # Mean earth radius in meters
        EARTH_RADIUS = 6378137.0
        total_area = 0.0

        for i in range(len(ring)):
            p1 = ring[i]
            p2 = ring[(i + 1) % len(ring)]

            lon1, lat1 = math.radians(p1[0]), math.radians(p1[1])
            lon2, lat2 = math.radians(p2[0]), math.radians(p2[1])

            total_area += (lon2 - lon1) * (2 + math.sin(lat1) + math.sin(lat2))

        total_area = abs(total_area * EARTH_RADIUS * EARTH_RADIUS / 2.0)
        return round(total_area, 2)

    @staticmethod
    def sq_meters_to_hectares(sq_meters: float) -> float:
        return round(sq_meters / 10000.0, 4)


spatial_service = SpatialService()
