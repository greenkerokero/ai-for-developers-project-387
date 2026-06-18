namespace BookingApi;

/** Days of the week. */
enum DayOfWeek {
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday",
  Sunday: "sunday",
}

/** A single availability rule for a day of the week. */
model AvailabilityRule {
  /** Day of the week this rule applies to. */
  dayOfWeek: DayOfWeek;

  /** Start time of the availability window (e.g., "09:00"). */
  startTime: plainTime;

  /** End time of the availability window (e.g., "18:00"). */
  endTime: plainTime;

  /** Whether the owner is available on this day. */
  isAvailable: boolean;
}

/** Request body for updating the full weekly schedule. */
model AvailabilitySchedule {
  /** Availability rules for each day of the week. */
  rules: AvailabilityRule[];
}
