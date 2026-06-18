import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi";

import "./models/common.tsp";
import "./models/availability.tsp";
import "./models/event-type.tsp";
import "./models/slot.tsp";
import "./models/booking.tsp";

import "./routes/owner/availability.tsp";
import "./routes/owner/event-types.tsp";
import "./routes/owner/bookings.tsp";
import "./routes/public/event-types.tsp";
import "./routes/public/bookings.tsp";

using TypeSpec.Http;

@service({
  title: "Booking API",
})
@server("http://localhost:3000", "Local development server")
namespace BookingApi;
