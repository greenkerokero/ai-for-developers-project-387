import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./query-keys";
import type { components } from "./generated/openapi";

export const useCreateEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: components["schemas"]["EventTypeCreate"]) => {
      const { data, error } = await apiClient.POST("/owner/event-types", {
        body,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventTypes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicEventTypes.all });
    },
  });
};

export const useUpdateEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, body }: { slug: string; body: components["schemas"]["EventTypeUpdate"] }) => {
      const { data, error } = await apiClient.PUT("/owner/event-types/{slug}", {
        params: { path: { slug } },
        body,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventTypes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicEventTypes.all });
    },
  });
};

export const useDeleteEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await apiClient.DELETE("/owner/event-types/{slug}", {
        params: { path: { slug } },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventTypes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicEventTypes.all });
    },
  });
};
