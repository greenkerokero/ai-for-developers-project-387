"""
Booking service — core business logic for creating, reading and cancelling bookings.

Business rules (from TypeSpec spec):
- A slot is unavailable if it overlaps with ANY confirmed booking,
  regardless of event type or duration.
- Cancelling sets status to 'cancelled'; slot becomes available again.
"""

import uuid as uuid_lib
from datetime import datetime, timedelta, timezone
from typing import Any

from booking_api import storage


class SlotUnavailableError(Exception):
    """Raised when the requested slot is already taken by a confirmed booking."""


class EventTypeNotFoundError(Exception):
    """Raised when the referenced event type slug does not exist."""


class BookingNotFoundError(Exception):
    """Raised when a booking with the given id does not exist."""


def _slot_conflicts_with_confirmed(
    slot_start: datetime,
    slot_end: datetime,
    exclude_id: str | None = None,
) -> bool:
    """Return True if [slot_start, slot_end) overlaps any confirmed booking."""
    for booking_id, b in storage.bookings.items():
        if b["status"] != "confirmed":
            continue
        if exclude_id and booking_id == exclude_id:
            continue
        b_start = datetime.fromisoformat(b["startTime"])
        b_end = datetime.fromisoformat(b["endTime"])
        if slot_start < b_end and slot_end > b_start:
            return True
    return False


def list_bookings(
    status_filter: str | None,
    offset: int,
    limit: int,
) -> dict[str, Any]:
    """Return a paginated list of bookings sorted by startTime ascending."""
    all_bookings = list(storage.bookings.values())

    if status_filter is not None:
        all_bookings = [b for b in all_bookings if b["status"] == status_filter]

    all_bookings.sort(key=lambda b: b["startTime"])

    total = len(all_bookings)
    page = all_bookings[offset : offset + limit]
    return {"items": page, "totalCount": total, "offset": offset, "limit": limit}


def get_booking(booking_id: str) -> dict | None:
    """Return booking by id or None if not found."""
    return storage.bookings.get(booking_id)


def create_booking(slug: str, data: dict[str, Any]) -> dict[str, Any]:
    """
    Create a new confirmed booking for the given event type slug.

    Raises:
        EventTypeNotFoundError: if the slug does not exist.
        SlotUnavailableError: if the slot overlaps a confirmed booking.
    """
    event_type = storage.event_types.get(slug)
    if event_type is None:
        raise EventTypeNotFoundError(slug)

    start_time_raw: str = data["startTime"]
    slot_start = datetime.fromisoformat(start_time_raw)
    if slot_start.tzinfo is None:
        slot_start = slot_start.replace(tzinfo=timezone.utc)

    duration_minutes: int = event_type["durationMinutes"]
    slot_end = slot_start + timedelta(minutes=duration_minutes)

    with storage._lock:
        if _slot_conflicts_with_confirmed(slot_start, slot_end):
            raise SlotUnavailableError("The requested slot is already taken.")

        booking_id = str(uuid_lib.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        record: storage.BookingRecord = {
            "id": booking_id,
            "eventTypeSlug": slug,
            "eventTypeName": event_type["name"],
            "startTime": slot_start.isoformat(),
            "endTime": slot_end.isoformat(),
            "guestName": data["guestName"],
            "guestEmail": data["guestEmail"],
            "status": "confirmed",
            "createdAt": now,
        }
        if "guestComment" in data and data["guestComment"]:
            record["guestComment"] = data["guestComment"]

        storage.bookings[booking_id] = record

    return dict(record)


def cancel_booking(booking_id: str) -> dict | None:
    """
    Cancel a booking by id.

    Returns the updated booking dict or None if not found.
    """
    booking = storage.bookings.get(booking_id)
    if booking is None:
        return None

    with storage._lock:
        updated = {**booking, "status": "cancelled"}
        storage.bookings[booking_id] = updated  # type: ignore[assignment]

    return dict(updated)
