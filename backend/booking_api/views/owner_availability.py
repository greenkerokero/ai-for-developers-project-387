"""
Views for OwnerAvailability interface.

GET  /owner/availability  → OwnerAvailability_get
PUT  /owner/availability  → OwnerAvailability_update
"""

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from booking_api.serializers import (
    AvailabilityScheduleSerializer,
    api_error,
    validation_error_details,
)
from booking_api.services import availability_service


class OwnerAvailabilityView(APIView):
    def get(self, request: Request) -> Response:
        schedule = availability_service.get_schedule()
        serializer = AvailabilityScheduleSerializer(schedule)
        return Response(serializer.data)

    def put(self, request: Request) -> Response:
        serializer = AvailabilityScheduleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                api_error(
                    "validation_error",
                    "Invalid request body.",
                    validation_error_details(serializer.errors),
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )
        validated = serializer.validated_data
        # Convert time objects to strings for storage
        rules = []
        for rule in validated["rules"]:
            rules.append({
                "dayOfWeek": rule["dayOfWeek"],
                "startTime": rule["startTime"].strftime("%H:%M:%S"),
                "endTime": rule["endTime"].strftime("%H:%M:%S"),
                "isAvailable": rule["isAvailable"],
            })
        schedule = availability_service.update_schedule(rules)
        out_serializer = AvailabilityScheduleSerializer(schedule)
        return Response(out_serializer.data)
