"""
In-memory storage for the Booking API.

All data lives here as module-level dicts/lists.
Data is lost on server restart — this is intentional for this stage.
Thread-safety: mutating operations must acquire _lock.
"""

import threading
from typing import TypedDict

_lock = threading.Lock()


class EventTypeRecord(TypedDict):
    slug: str
    name: str
    description: str
    durationMinutes: int
    createdAt: str
    updatedAt: str


class AvailabilityRuleRecord(TypedDict):
    dayOfWeek: str
    startTime: str
    endTime: str
    isAvailable: bool


class BookingRecord(TypedDict, total=False):
    id: str
    eventTypeSlug: str
    eventTypeName: str
    startTime: str
    endTime: str
    guestName: str
    guestEmail: str
    guestComment: str
    status: str
    createdAt: str


# slug → EventTypeRecord
event_types: dict[str, EventTypeRecord] = {}

# id (uuid str) → BookingRecord
bookings: dict[str, BookingRecord] = {}

# Ordered list of AvailabilityRuleRecord (one per day)
availability_rules: list[AvailabilityRuleRecord] = [
    {"dayOfWeek": "monday", "startTime": "09:00:00", "endTime": "18:00:00", "isAvailable": True},
    {"dayOfWeek": "tuesday", "startTime": "09:00:00", "endTime": "18:00:00", "isAvailable": True},
    {"dayOfWeek": "wednesday", "startTime": "09:00:00", "endTime": "18:00:00", "isAvailable": True},
    {"dayOfWeek": "thursday", "startTime": "09:00:00", "endTime": "18:00:00", "isAvailable": True},
    {"dayOfWeek": "friday", "startTime": "09:00:00", "endTime": "18:00:00", "isAvailable": True},
    {"dayOfWeek": "saturday", "startTime": "09:00:00", "endTime": "18:00:00", "isAvailable": False},
    {"dayOfWeek": "sunday", "startTime": "09:00:00", "endTime": "18:00:00", "isAvailable": False},
]
