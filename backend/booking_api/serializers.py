"""DRF serializers — validation mirrors TypeSpec constraints exactly."""

import re
from typing import Any

from rest_framework import serializers


# ─── Scalar validators ────────────────────────────────────────────────────────

SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def validate_slug(value: str) -> str:
    if not SLUG_PATTERN.match(value):
        raise serializers.ValidationError(
            "Must match pattern ^[a-z0-9]+(?:-[a-z0-9]+)*$"
        )
    return value


# ─── AvailabilityRule ─────────────────────────────────────────────────────────

DAY_OF_WEEK_CHOICES = [
    "monday", "tuesday", "wednesday", "thursday",
    "friday", "saturday", "sunday",
]


class AvailabilityRuleSerializer(serializers.Serializer):  # type: ignore[type-arg]
    dayOfWeek = serializers.ChoiceField(choices=DAY_OF_WEEK_CHOICES)
    startTime = serializers.TimeField(format="%H:%M:%S", input_formats=["%H:%M", "%H:%M:%S"])
    endTime = serializers.TimeField(format="%H:%M:%S", input_formats=["%H:%M", "%H:%M:%S"])
    isAvailable = serializers.BooleanField()

    def to_representation(self, instance: Any) -> dict[str, Any]:
        rep = super().to_representation(instance)
        # Normalize time to string if it was stored as string
        if isinstance(instance, dict):
            rep["startTime"] = instance["startTime"]
            rep["endTime"] = instance["endTime"]
        return rep


class AvailabilityScheduleSerializer(serializers.Serializer):  # type: ignore[type-arg]
    rules = AvailabilityRuleSerializer(many=True)


# ─── EventType ────────────────────────────────────────────────────────────────

class EventTypeSerializer(serializers.Serializer):  # type: ignore[type-arg]
    slug = serializers.CharField(validators=[validate_slug])
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=500, required=False, allow_blank=True)
    durationMinutes = serializers.IntegerField(min_value=5, max_value=480)
    createdAt = serializers.CharField(read_only=True)
    updatedAt = serializers.CharField(read_only=True)


class EventTypeCreateSerializer(serializers.Serializer):  # type: ignore[type-arg]
    slug = serializers.CharField(validators=[validate_slug])
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=500, required=False, allow_blank=True)
    durationMinutes = serializers.IntegerField(min_value=5, max_value=480)


class EventTypeUpdateSerializer(serializers.Serializer):  # type: ignore[type-arg]
    name = serializers.CharField(max_length=100, required=False)
    description = serializers.CharField(max_length=500, required=False)
    durationMinutes = serializers.IntegerField(min_value=5, max_value=480, required=False)


# ─── Booking ──────────────────────────────────────────────────────────────────

class BookingCreateSerializer(serializers.Serializer):  # type: ignore[type-arg]
    startTime = serializers.DateTimeField()
    guestName = serializers.CharField(max_length=100)
    guestEmail = serializers.EmailField()
    guestComment = serializers.CharField(max_length=500, required=False, allow_blank=True)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def api_error(code: str, message: str, details: list[str] | None = None) -> dict[str, Any]:
    """Build an ApiError response body matching the OpenAPI schema."""
    result: dict[str, Any] = {"code": code, "message": message}
    if details:
        result["details"] = details
    return result


def validation_error_details(errors: dict) -> list[str]:
    """Flatten DRF validation errors into a list of strings."""
    details: list[str] = []
    for field, messages in errors.items():
        if isinstance(messages, list):
            for msg in messages:
                details.append(f"{field}: {msg}")
        else:
            details.append(f"{field}: {messages}")
    return details
