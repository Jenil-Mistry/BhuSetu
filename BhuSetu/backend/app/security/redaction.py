"""
Privacy-by-Design and Sensitive Data Redaction Utilities.
Enforces that raw Aadhaar/PAN or full bank account numbers are never exposed.
"""

import re
from typing import Optional


class Redactor:

    @staticmethod
    def mask_bank_account(account_number: Optional[str]) -> str:
        if not account_number or len(account_number) < 4:
            return "A/C Ending in XXXX"
        return f"A/C Ending in {account_number[-4:]}"

    @staticmethod
    def mask_mobile(mobile: Optional[str]) -> str:
        if not mobile or len(mobile) < 4:
            return "XXXX-XXXX"
        return f"XXXXXX{mobile[-4:]}"

    @staticmethod
    def is_raw_aadhaar_or_pan(value: str) -> bool:
        """
        Detects unhashed 12-digit Aadhaar or 10-char PAN numbers to prevent accidental storage.
        """
        if not value:
            return False
        # 12-digit Aadhaar regex
        if re.match(r"^\d{12}$", value.replace(" ", "").replace("-", "")):
            return True
        # 10-char PAN regex
        if re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$", value.upper()):
            return True
        return False


redactor = Redactor()
