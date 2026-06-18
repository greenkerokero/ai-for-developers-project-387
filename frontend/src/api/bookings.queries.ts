import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./query-keys";
import type { components } from "./generated/openapi";

export const useOwnerBookings = (params?: { status?: components["schemas"]["BookingStatus"]; offset?: number; limit?: number }) => {
  return useQuery({
    queryKey: queryKeys.bookings.list(params),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/owner/bookings", {
        params: { query: params },
      });
      if (error) throw error;
      return data;
    },
  });
};

export const useOwnerBooking = (id: string) => {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/owner/bookings/{id}", {
        params: { path: { id } },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
