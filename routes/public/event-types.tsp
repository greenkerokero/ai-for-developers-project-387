import "@typespec/http";

using TypeSpec.Http;

namespace BookingApi;

/** Public operations for browsing event types (guest-facing). */
@route("/public/event-types")
interface PublicEventTypes {
  /** List all available event types with name, description, and duration. */
  @get op list(): EventType[];

  /** Get details of a specific event type. */
  @get op read(@path slug: slug): EventType | ApiError;

  /**
   * Get available time slots for a specific event type.
   * Returns slots for the next 14 days computed from the owner's
   * availability schedule minus existing bookings.
   * A slot is unavailable if it overlaps with ANY existing booking,
   * regardless of event type or duration.
   */
  @route("{slug}/slots")
  @get op listSlots(
    @path slug: slug,

    /** Optional date filter — return slots only for this date (YYYY-MM-DD). */
    @query date?: plainDate,
  ): Slot[];
}
