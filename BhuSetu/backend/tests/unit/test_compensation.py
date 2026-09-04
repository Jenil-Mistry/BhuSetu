"""
Unit tests for RFCTLARR Act 2013 Compensation Calculations.
"""

from decimal import Decimal
from app.services.compensation_service import compensation_service


def test_rfctlarr_act_calculation():
    # Market value = 1,000,000 INR
    # Solatium = 100% = 1,000,000 INR
    # 12% Interest = 120,000 INR
    # Assets = 50,000 INR
    # R&R Allowance = 25,000 INR
    # Expected total = 2,195,000 INR

    market_val = Decimal("1000000.00")
    solatium_pct = Decimal("100.00")
    interest_pct = Decimal("12.00")
    assets_val = Decimal("50000.00")
    rr_allowance = Decimal("25000.00")

    res = compensation_service.calculate_assessment(
        market_value=market_val,
        solatium_percentage=solatium_pct,
        interest_rate_percentage=interest_pct,
        assets_value=assets_val,
        rehabilitation_allowance=rr_allowance,
    )

    assert res["market_value"] == Decimal("1000000.00")
    assert res["solatium_amount"] == Decimal("1000000.00")
    assert res["interest_amount"] == Decimal("120000.00")
    assert res["assets_value"] == Decimal("50000.00")
    assert res["rehabilitation_allowance"] == Decimal("25000.00")
    assert res["total_assessed_amount"] == Decimal("2195000.00")
