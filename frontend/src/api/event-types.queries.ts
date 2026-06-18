import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./query-keys";

export const useOwnerEventTypes = (params?: { offset?: number; limit?: number }) => {
  return useQuery({
    queryKey: queryKeys.eventTypes.list(params),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/owner/event-types", {
        params: { query: params },
      });
      if (error) throw error;
      return data;
    },
  });
};

export const useOwnerEventType = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.eventTypes.detail(slug),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/owner/event-types/{slug}", {
        params: { path: { slug } },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const usePublicEventTypes = () => {
  return useQuery({
    queryKey: queryKeys.publicEventTypes.list(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/public/event-types");
      if (error) throw error;
      return data;
    },
  });
};

export const usePublicEventType = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.publicEventTypes.detail(slug),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/public/event-types/{slug}", {
        params: { path: { slug } },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const usePublicSlots = (slug: string, date?: string) => {
  return useQuery({
    queryKey: queryKeys.slots.byEventType(slug, { date }),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/public/event-types/{slug}/slots", {
        params: {
          path: { slug },
          query: { date },
        },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};
