import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./query-keys";

export const useOwnerAvailability = () => {
  return useQuery({
    queryKey: queryKeys.availability.all,
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/owner/availability");
      if (error) throw error;
      return data;
    },
  });
};
