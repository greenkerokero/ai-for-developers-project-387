import "@typespec/http";

using TypeSpec.Http;

namespace BookingApi;

/** Owner operations for managing bookings. */
@route("/owner/bookings")
interface OwnerBookings {
  /**
   * List upcoming bookings across all event types.
   * Sorted by start time ascending.
   */
  @get op list(
    /** Filter by booking status. */
    @query status?: BookingStatus,
    @query offset?: int32,
    @query limit?: int32,
  ): PaginatedList<Booking>;

  /** Get details of a specific booking. */
  @get op read(@path id: uuid): Booking | ApiError;

  /**
   * Cancel a booking. The associated time slot becomes available again
   * for new bookings.
   */
  @post op cancel(@path id: uuid): Booking | ApiError;
}
