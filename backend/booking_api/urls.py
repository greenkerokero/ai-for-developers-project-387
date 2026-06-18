"""
URL configuration for booking_api.

Paths match exactly the OpenAPI spec paths.
"""

from django.urls import path

from booking_api.views.owner_availability import OwnerAvailabilityView
from booking_api.views.owner_bookings import OwnerBookingDetailView, OwnerBookingsListView
from booking_api.views.owner_event_types import (
    OwnerEventTypeDetailView,
    OwnerEventTypesListView,
)
from booking_api.views.public_bookings import PublicBookingsCreateView
from booking_api.views.public_event_types import (
    PublicEventTypeDetailView,
    PublicEventTypeSlotsView,
    PublicEventTypesListView,
)

urlpatterns = [
    # ─── Owner: Availability ─────────────────────────────────────────────────
    path("owner/availability", OwnerAvailabilityView.as_view()),
    # ─── Owner: Event Types ──────────────────────────────────────────────────
    path("owner/event-types", OwnerEventTypesListView.as_view()),
    path("owner/event-types/<slug:slug>", OwnerEventTypeDetailView.as_view()),
    # ─── Owner: Bookings ─────────────────────────────────────────────────────
    path("owner/bookings", OwnerBookingsListView.as_view()),
    path("owner/bookings/<str:id>", OwnerBookingDetailView.as_view()),
    # ─── Public: Event Types ─────────────────────────────────────────────────
    path("public/event-types", PublicEventTypesListView.as_view()),
    path("public/event-types/<slug:slug>", PublicEventTypeDetailView.as_view()),
    path("public/event-types/<slug:slug>/slots", PublicEventTypeSlotsView.as_view()),
    # ─── Public: Bookings ────────────────────────────────────────────────────
    path("public/event-types/<slug:slug>/bookings", PublicBookingsCreateView.as_view()),
]
