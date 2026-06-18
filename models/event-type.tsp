namespace BookingApi;

/** An event type that guests can book. */
model EventType {
  /** URL-friendly unique identifier. */
  slug: slug;

  /** Display name of the event type. */
  @maxLength(100)
  name: string;

  /** Description of the event type. */
  @maxLength(500)
  description?: string;

  /** Duration of the event in minutes. */
  @minValue(5)
  @maxValue(480)
  durationMinutes: int32;

  /** Timestamp when this event type was created. */
  createdAt: utcDateTime;

  /** Timestamp when this event type was last updated. */
  updatedAt: utcDateTime;
}

/** Request body for creating a new event type. */
model EventTypeCreate {
  /** URL-friendly unique identifier. */
  slug: slug;

  /** Display name of the event type. */
  @maxLength(100)
  name: string;

  /** Description of the event type. */
  @maxLength(500)
  description?: string;

  /** Duration of the event in minutes. */
  @minValue(5)
  @maxValue(480)
  durationMinutes: int32;
}

/** Request body for updating an existing event type. */
model EventTypeUpdate {
  /** Display name of the event type. */
  @maxLength(100)
  name?: string;

  /** Description of the event type. */
  @maxLength(500)
  description?: string;

  /** Duration of the event in minutes. */
  @minValue(5)
  @maxValue(480)
  durationMinutes?: int32;
}
