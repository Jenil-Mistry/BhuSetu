"""
Compensation Assessment & RFCTLARR Act 2013 Calculation Engine.
Enforces fixed-precision Decimal arithmetic for all financial operations.
"""

from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any


class CompensationService:

    @staticmethod
    def calculate_assessment(
        market_value: Decimal,
        solatium_percentage: Decimal = Decimal("100.00"),
        interest_rate_percentage: Decimal = Decimal("12.00"),
        assets_value: Decimal = Decimal("0.00"),
        rehabilitation_allowance: Decimal = Decimal("0.00"),
    ) -> Dict[str, Decimal]:
        """
        Calculates statutory compensation breakdown per RFCTLARR Act 2013:
        Total = Market Value + Solatium + 12% Interest + Assets + R&R Allowance
        """
        two_places = Decimal("0.01")

        # Solatium (100% of market value)
        solatium_amount = (market_value * (solatium_percentage / Decimal("100.00"))).quantize(
            two_places, rounding=ROUND_HALF_UP
        )

        # Additional interest (12% per annum)
        interest_amount = (market_value * (interest_rate_percentage / Decimal("100.00"))).quantize(
            two_places, rounding=ROUND_HALF_UP
        )

        assets_amount = assets_value.quantize(two_places, rounding=ROUND_HALF_UP)
        rr_amount = rehabilitation_allowance.quantize(two_places, rounding=ROUND_HALF_UP)

        total_assessed = (
            market_value + solatium_amount + interest_amount + assets_amount + rr_amount
        ).quantize(two_places, rounding=ROUND_HALF_UP)

        return {
            "market_value": market_value,
            "solatium_amount": solatium_amount,
            "interest_amount": interest_amount,
            "assets_value": assets_amount,
            "rehabilitation_allowance": rr_amount,
            "total_assessed_amount": total_assessed,
        }


compensation_service = CompensationService()
