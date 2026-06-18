import "@typespec/http";

using TypeSpec.Http;

namespace BookingApi;

/** Owner operations for managing event types. */
@route("/owner/event-types")
interface OwnerEventTypes {
  /** List all event types. */
  @get op list(
    @query offset?: int32,
    @query limit?: int32,
  ): PaginatedList<EventType>;

  /** Get a single event type by slug. */
  @get op read(@path slug: slug): EventType | ApiError;

  /** Create a new event type. */
  @post op create(@body eventType: EventTypeCreate): {
    @statusCode statusCode: 201;
    @body eventType: EventType;
  } | ApiError;

  /** Update an existing event type. */
  @put op update(
    @path slug: slug,
    @body eventType: EventTypeUpdate,
  ): EventType | ApiError;

  /** Delete an event type. */
  @delete op delete(@path slug: slug): {
    @statusCode statusCode: 204;
  } | ApiError;
}
