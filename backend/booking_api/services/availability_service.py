"""
Services for Availability business logic.
Operates on the in-memory storage.
"""

from typing import Any

from booking_api import storage


def get_schedule() -> dict[str, Any]:
    """Return the current weekly availability schedule."""
    return {"rules": list(storage.availability_rules)}


def update_schedule(rules: list[dict[str, Any]]) -> dict[str, Any]:
    """Replace the entire weekly availability schedule."""
    with storage._lock:
        storage.availability_rules.clear()
        storage.availability_rules.extend(rules)
    return {"rules": list(storage.availability_rules)}
