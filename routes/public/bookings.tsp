import "@typespec/http";

using TypeSpec.Http;

namespace BookingApi;

/** Public operations for creating bookings (guest-facing). */
@route("/public/event-types/{slug}/bookings")
interface PublicBookings {
  /**
   * Create a new booking for a specific event type.
   * The guest selects an available slot and provides their contact details.
   * If the slot is already taken, an error is returned.
   */
  @post op create(
    @path slug: slug,
    @body booking: BookingCreate,
  ): {
    @statusCode statusCode: 201;
    @body booking: Booking;
  } | ApiError;
}
