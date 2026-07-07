import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../lib/apiClient";

export const membersQueries = {
  all: ["members"] as const,
  bySpace: (spaceId: string) => [...membersQueries.all, "space", spaceId] as const,
  list: (spaceId: string) =>
    queryOptions({
      queryKey: [...membersQueries.bySpace(spaceId), "list"] as const,
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].members.$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
};
