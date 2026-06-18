import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./query-keys";
import type { components } from "./generated/openapi";

export const useCreateBooking = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: components["schemas"]["BookingCreate"]) => {
      const { data, error } = await apiClient.POST("/public/event-types/{slug}/bookings", {
        params: { path: { slug } },
        body,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.slots.byEventType(slug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await apiClient.POST("/owner/bookings/{id}", {
        params: { path: { id } },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.slots.all });
    },
  });
};
