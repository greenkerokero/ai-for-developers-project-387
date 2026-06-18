"""
Views for OwnerBookings interface.

GET   /owner/bookings        → OwnerBookings_list
GET   /owner/bookings/{id}   → OwnerBookings_read
POST  /owner/bookings/{id}   → OwnerBookings_cancel
"""

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from booking_api.serializers import api_error
from booking_api.services import booking_service

DEFAULT_LIMIT = 20


class OwnerBookingsListView(APIView):
    def get(self, request: Request) -> Response:
        status_filter = request.query_params.get("status")
        offset = int(request.query_params.get("offset", 0))
        limit = int(request.query_params.get("limit", DEFAULT_LIMIT))
        result = booking_service.list_bookings(
            status_filter=status_filter,
            offset=offset,
            limit=limit,
        )
        return Response(result)


class OwnerBookingDetailView(APIView):
    def get(self, request: Request, id: str) -> Response:
        booking = booking_service.get_booking(id)
        if booking is None:
            return Response(
                api_error("not_found", f"Booking '{id}' not found."),
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(booking)

    def post(self, request: Request, id: str) -> Response:
        """Cancel a booking — POST /owner/bookings/{id}."""
        updated = booking_service.cancel_booking(id)
        if updated is None:
            return Response(
                api_error("not_found", f"Booking '{id}' not found."),
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(updated)
