"""
Slot computation service.

Slots are computed on-the-fly from the availability schedule
minus existing confirmed bookings.
NOT stored — pure calculation.
"""

from datetime import date, datetime, timedelta, timezone
from typing import Any

from booking_api import storage

# Map TypeSpec DayOfWeek enum values to Python weekday() numbers (Monday=0)
_DAY_OF_WEEK_TO_WEEKDAY: dict[str, int] = {
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
}


def _parse_time(time_str: str) -> tuple[int, int]:
    """Parse 'HH:MM' or 'HH:MM:SS' into (hour, minute)."""
    parts = time_str.split(":")
    return int(parts[0]), int(parts[1])


def _get_confirmed_bookings() -> list[tuple[datetime, datetime]]:
    """Return list of (startTime, endTime) for all confirmed bookings."""
    result: list[tuple[datetime, datetime]] = []
    for b in storage.bookings.values():
        if b["status"] == "confirmed":
            start = datetime.fromisoformat(b["startTime"])
            end = datetime.fromisoformat(b["endTime"])
            result.append((start, end))
    return result


def _slot_overlaps_booking(
    slot_start: datetime,
    slot_end: datetime,
    confirmed: list[tuple[datetime, datetime]],
) -> bool:
    """Return True if [slot_start, slot_end) overlaps with any confirmed booking."""
    for b_start, b_end in confirmed:
        if slot_start < b_end and slot_end > b_start:
            return True
    return False


def compute_slots(slug: str, filter_date: date | None) -> list[dict[str, Any]]:
    """
    Compute available slots for the given event type slug.

    Returns slots for the next 14 days (or only for filter_date if provided).
    A slot is unavailable if it overlaps with ANY confirmed booking.
    """
    event_type = storage.event_types.get(slug)
    if event_type is None:
        return []

    duration_minutes: int = event_type["durationMinutes"]
    confirmed_bookings = _get_confirmed_bookings()

    today = datetime.now(timezone.utc).date()

    if filter_date is not None:
        dates_to_check = [filter_date]
    else:
        dates_to_check = [today + timedelta(days=i) for i in range(14)]

    # Build a lookup: weekday → rule
    rule_by_weekday: dict[int, dict] = {}
    for rule in storage.availability_rules:
        weekday = _DAY_OF_WEEK_TO_WEEKDAY.get(rule["dayOfWeek"])
        if weekday is not None:
            rule_by_weekday[weekday] = rule

    slots: list[dict[str, Any]] = []

    for check_date in dates_to_check:
        weekday = check_date.weekday()
        rule = rule_by_weekday.get(weekday)

        if rule is None or not rule["isAvailable"]:
            continue

        start_h, start_m = _parse_time(rule["startTime"])
        end_h, end_m = _parse_time(rule["endTime"])

        window_start = datetime(
            check_date.year, check_date.month, check_date.day,
            start_h, start_m, tzinfo=timezone.utc,
        )
        window_end = datetime(
            check_date.year, check_date.month, check_date.day,
            end_h, end_m, tzinfo=timezone.utc,
        )

        slot_start = window_start
        while slot_start + timedelta(minutes=duration_minutes) <= window_end:
            slot_end = slot_start + timedelta(minutes=duration_minutes)
            is_available = not _slot_overlaps_booking(slot_start, slot_end, confirmed_bookings)
            slots.append({
                "startTime": slot_start.isoformat(),
                "endTime": slot_end.isoformat(),
                "isAvailable": is_available,
            })
            slot_start = slot_end

    return slots
