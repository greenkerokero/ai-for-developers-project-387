import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./query-keys";
import type { components } from "./generated/openapi";

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: components["schemas"]["AvailabilitySchedule"]) => {
      const { data, error } = await apiClient.PUT("/owner/availability", {
        body,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.slots.all });
    },
  });
};
