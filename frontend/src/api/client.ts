import createClient from "openapi-fetch";
import type { paths } from "./generated/openapi";
import { toast } from "sonner";

export const apiClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
});

apiClient.use({
  onResponse({ response }) {
    if (response.status >= 500) {
      toast.error(`Server Error: ${response.statusText}`);
    }
    return response;
  },
});
