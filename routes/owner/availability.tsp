import "@typespec/http";

using TypeSpec.Http;

namespace BookingApi;

/** Owner operations for managing the weekly availability schedule. */
@route("/owner/availability")
interface OwnerAvailability {
  /** Get the current weekly availability schedule. */
  @get op get(): AvailabilitySchedule;

  /** Replace the entire weekly availability schedule. */
  @put op update(@body schedule: AvailabilitySchedule): AvailabilitySchedule;
}
