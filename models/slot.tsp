namespace BookingApi;

/**
 * A time slot available for booking.
 * Slots are computed on-the-fly based on the owner's availability schedule
 * and existing bookings. They are NOT stored in the database.
 */
model Slot {
  /** Start time of this slot. */
  startTime: utcDateTime;

  /** End time of this slot. */
  endTime: utcDateTime;

  /** Whether this slot is available for booking. */
  isAvailable: boolean;
}
