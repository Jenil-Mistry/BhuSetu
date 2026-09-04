"""
Unit tests for PostGIS Spatial & Geodetic Calculations.
"""

import pytest
from app.services.spatial_service import spatial_service
from app.errors import BhuSetuException


def test_valid_geojson_validation():
    valid_polygon = {
        "type": "Polygon",
        "coordinates": [
            [
                [72.450, 22.950],
                [72.455, 22.950],
                [72.455, 22.955],
                [72.450, 22.955],
                [72.450, 22.950],
            ]
        ],
    }
    validated = spatial_service.validate_geojson_geometry(valid_polygon)
    assert validated["type"] == "Polygon"


def test_invalid_geometry_type_raises_exception():
    invalid_geom = {
        "type": "UnknownShape",
        "coordinates": [],
    }
    with pytest.raises(BhuSetuException):
        spatial_service.validate_geojson_geometry(invalid_geom)


def test_geodetic_area_calculation():
    # Roughly 500m x 550m polygon near Ahmedabad
    coords = [
        [
            [72.450, 22.950],
            [72.455, 22.950],
            [72.455, 22.955],
            [72.450, 22.955],
            [72.450, 22.950],
        ]
    ]
    area_sq_m = spatial_service.calculate_geodetic_area_sq_meters(coords)
    assert area_sq_m > 250000.0  # Approx 280,000 sq meters
    hectares = spatial_service.sq_meters_to_hectares(area_sq_m)
    assert hectares > 25.0
