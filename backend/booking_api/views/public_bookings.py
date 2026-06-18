"""
Views for PublicBookings interface.

POST /public/event-types/{slug}/bookings → PublicBookings_create
"""

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from booking_api.serializers import (
    BookingCreateSerializer,
    api_error,
    validation_error_details,
)
from booking_api.services.booking_service import (
    BookingNotFoundError,
    EventTypeNotFoundError,
    SlotUnavailableError,
    create_booking,
)


class PublicBookingsCreateView(APIView):
    def post(self, request: Request, slug: str) -> Response:
        serializer = BookingCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                api_error(
                    "validation_error",
                    "Invalid request body.",
                    validation_error_details(serializer.errors),
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data
        # Convert datetime to ISO string for storage
        data["startTime"] = data["startTime"].isoformat()

        try:
            booking = create_booking(slug=slug, data=data)
        except EventTypeNotFoundError:
            return Response(
                api_error("not_found", f"Event type '{slug}' not found."),
                status=status.HTTP_404_NOT_FOUND,
            )
        except SlotUnavailableError:
            return Response(
                api_error("slot_unavailable", "The requested slot is already taken."),
                status=status.HTTP_409_CONFLICT,
            )

        return Response(booking, status=status.HTTP_201_CREATED)
