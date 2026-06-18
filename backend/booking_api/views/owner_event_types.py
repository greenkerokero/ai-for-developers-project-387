"""
Views for OwnerEventTypes interface.

GET    /owner/event-types         → OwnerEventTypes_list
POST   /owner/event-types         → OwnerEventTypes_create
GET    /owner/event-types/{slug}  → OwnerEventTypes_read
PUT    /owner/event-types/{slug}  → OwnerEventTypes_update
DELETE /owner/event-types/{slug}  → OwnerEventTypes_delete
"""

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from booking_api.serializers import (
    EventTypeCreateSerializer,
    EventTypeSerializer,
    EventTypeUpdateSerializer,
    api_error,
    validation_error_details,
)
from booking_api.services import event_type_service

DEFAULT_LIMIT = 20


class OwnerEventTypesListView(APIView):
    def get(self, request: Request) -> Response:
        offset = int(request.query_params.get("offset", 0))
        limit = int(request.query_params.get("limit", DEFAULT_LIMIT))
        result = event_type_service.list_event_types(offset=offset, limit=limit)
        items = [EventTypeSerializer(item).data for item in result["items"]]
        return Response({
            "items": items,
            "totalCount": result["totalCount"],
            "offset": result["offset"],
            "limit": result["limit"],
        })

    def post(self, request: Request) -> Response:
        serializer = EventTypeCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                api_error(
                    "validation_error",
                    "Invalid request body.",
                    validation_error_details(serializer.errors),
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )
        created = event_type_service.create_event_type(serializer.validated_data)
        if created is None:
            return Response(
                api_error("slug_conflict", "An event type with this slug already exists."),
                status=status.HTTP_409_CONFLICT,
            )
        return Response(EventTypeSerializer(created).data, status=status.HTTP_201_CREATED)


class OwnerEventTypeDetailView(APIView):
    def get(self, request: Request, slug: str) -> Response:
        event_type = event_type_service.get_event_type(slug)
        if event_type is None:
            return Response(
                api_error("not_found", f"Event type '{slug}' not found."),
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(EventTypeSerializer(event_type).data)

    def put(self, request: Request, slug: str) -> Response:
        serializer = EventTypeUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                api_error(
                    "validation_error",
                    "Invalid request body.",
                    validation_error_details(serializer.errors),
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )
        updated = event_type_service.update_event_type(slug, serializer.validated_data)
        if updated is None:
            return Response(
                api_error("not_found", f"Event type '{slug}' not found."),
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(EventTypeSerializer(updated).data)

    def delete(self, request: Request, slug: str) -> Response:
        deleted = event_type_service.delete_event_type(slug)
        if not deleted:
            return Response(
                api_error("not_found", f"Event type '{slug}' not found."),
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)
