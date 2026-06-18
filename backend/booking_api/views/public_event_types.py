"""
Views for PublicEventTypes interface.

GET  /public/event-types              → PublicEventTypes_list
GET  /public/event-types/{slug}       → PublicEventTypes_read
GET  /public/event-types/{slug}/slots → PublicEventTypes_listSlots
"""

from datetime import date

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from booking_api.serializers import EventTypeSerializer, api_error
from booking_api.services import event_type_service, slot_service


class PublicEventTypesListView(APIView):
    def get(self, request: Request) -> Response:
        all_event_types = list(event_type_service.list_event_types(offset=0, limit=10_000)["items"])
        serialized = [EventTypeSerializer(et).data for et in all_event_types]
        return Response(serialized)


class PublicEventTypeDetailView(APIView):
    def get(self, request: Request, slug: str) -> Response:
        event_type = event_type_service.get_event_type(slug)
        if event_type is None:
            return Response(
                api_error("not_found", f"Event type '{slug}' not found."),
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(EventTypeSerializer(event_type).data)


class PublicEventTypeSlotsView(APIView):
    def get(self, request: Request, slug: str) -> Response:
        # Verify the event type exists
        if event_type_service.get_event_type(slug) is None:
            return Response(
                api_error("not_found", f"Event type '{slug}' not found."),
                status=status.HTTP_404_NOT_FOUND,
            )

        filter_date: date | None = None
        date_param = request.query_params.get("date")
        if date_param:
            try:
                filter_date = date.fromisoformat(date_param)
            except ValueError:
                return Response(
                    api_error("validation_error", "Invalid date format. Expected YYYY-MM-DD."),
                    status=status.HTTP_400_BAD_REQUEST,
                )

        slots = slot_service.compute_slots(slug=slug, filter_date=filter_date)
        return Response(slots)
