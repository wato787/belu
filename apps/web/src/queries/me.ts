import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../lib/apiClient";

export const meQueries = {
  all: ["me"] as const,
  current: () =>
    queryOptions({
      queryKey: meQueries.all,
      queryFn: async () => {
        const response = await apiClient.me.$get();
        return parseApiResponse(response);
      },
    }),
};
