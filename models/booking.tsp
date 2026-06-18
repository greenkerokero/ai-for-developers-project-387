namespace BookingApi;

/** Status of a booking. */
enum BookingStatus {
  /** The booking is confirmed and active. */
  Confirmed: "confirmed",

  /** The booking was cancelled by the owner. */
  Cancelled: "cancelled",
}

/** A guest's booking for a specific time slot. */
model Booking {
  /** Unique identifier for the booking. */
  id: uuid;

  /** Slug of the event type this booking is for. */
  eventTypeSlug: slug;

  /** Name of the event type (denormalized for convenience). */
  eventTypeName: string;

  /** Start time of the booked slot. */
  startTime: utcDateTime;

  /** End time of the booked slot. */
  endTime: utcDateTime;

  /** Guest's full name. */
  guestName: string;

  /** Guest's email address. */
  guestEmail: email;

  /** Optional comment or note from the guest. */
  guestComment?: string;

  /** Current status of the booking. */
  status: BookingStatus;

  /** Timestamp when the booking was created. */
  createdAt: utcDateTime;
}

/** Request body for creating a new booking (guest-facing). */
model BookingCreate {
  /** Start time of the desired slot. Must be a valid available slot. */
  startTime: utcDateTime;

  /** Guest's full name. */
  @maxLength(100)
  guestName: string;

  /** Guest's email address. */
  guestEmail: email;

  /** Optional comment or note. */
  @maxLength(500)
  guestComment?: string;
}
