export const queryKeys = {
  eventTypes: {
    all: ["eventTypes"] as const,
    list: (params?: { offset?: number; limit?: number }) =>
      [...queryKeys.eventTypes.all, "list", params] as const,
    detail: (slug: string) => [...queryKeys.eventTypes.all, "detail", slug] as const,
  },
  publicEventTypes: {
    all: ["publicEventTypes"] as const,
    list: () => [...queryKeys.publicEventTypes.all, "list"] as const,
    detail: (slug: string) => [...queryKeys.publicEventTypes.all, "detail", slug] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    list: (params?: { status?: string; offset?: number; limit?: number }) =>
      [...queryKeys.bookings.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.bookings.all, "detail", id] as const,
  },
  slots: {
    all: ["slots"] as const,
    byEventType: (slug: string, params?: { date?: string }) =>
      [...queryKeys.slots.all, slug, params] as const,
  },
  availability: {
    all: ["availability"] as const,
  },
};
