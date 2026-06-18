"""
Services for EventType business logic.
Operates on the in-memory storage.
"""

from datetime import datetime, timezone
from typing import Any

from booking_api import storage


def list_event_types(offset: int, limit: int) -> dict[str, Any]:
    """Return a paginated list of all event types sorted by createdAt."""
    all_items = sorted(storage.event_types.values(), key=lambda e: e["createdAt"])
    total = len(all_items)
    page = all_items[offset : offset + limit]
    return {"items": list(page), "totalCount": total, "offset": offset, "limit": limit}


def get_event_type(slug: str) -> dict | None:
    """Return event type by slug or None if not found."""
    return storage.event_types.get(slug)


def create_event_type(data: dict[str, Any]) -> dict[str, Any] | None:
    """
    Create a new event type.
    Returns None if slug already exists.
    """
    slug: str = data["slug"]
    if slug in storage.event_types:
        return None
    now = datetime.now(timezone.utc).isoformat()
    record = {
        "slug": slug,
        "name": data["name"],
        "description": data.get("description", ""),
        "durationMinutes": data["durationMinutes"],
        "createdAt": now,
        "updatedAt": now,
    }
    with storage._lock:
        storage.event_types[slug] = record  # type: ignore[assignment]
    return record


def update_event_type(slug: str, data: dict[str, Any]) -> dict | None:
    """
    Partially update an existing event type.
    Returns updated record or None if not found.
    """
    existing = storage.event_types.get(slug)
    if existing is None:
        return None
    now = datetime.now(timezone.utc).isoformat()
    updated = {**existing}
    if "name" in data:
        updated["name"] = data["name"]
    if "description" in data:
        updated["description"] = data["description"]
    if "durationMinutes" in data:
        updated["durationMinutes"] = data["durationMinutes"]
    updated["updatedAt"] = now
    with storage._lock:
        storage.event_types[slug] = updated  # type: ignore[assignment]
    return updated


def delete_event_type(slug: str) -> bool:
    """Delete an event type. Returns True if deleted, False if not found."""
    if slug not in storage.event_types:
        return False
    with storage._lock:
        del storage.event_types[slug]
    return True
