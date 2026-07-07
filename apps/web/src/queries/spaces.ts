import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../lib/apiClient";

export const spacesQueries = {
  all: ["spaces"] as const,
  lists: () => [...spacesQueries.all, "list"] as const,
  list: () =>
    queryOptions({
      queryKey: spacesQueries.lists(),
      queryFn: async () => {
        const response = await apiClient.spaces.$get();
        return parseApiResponse(response);
      },
    }),
  details: () => [...spacesQueries.all, "detail"] as const,
  detail: (spaceId: string) =>
    queryOptions({
      queryKey: [...spacesQueries.details(), spaceId] as const,
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
};
