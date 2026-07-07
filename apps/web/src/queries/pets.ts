import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../lib/apiClient";

export const petsQueries = {
  all: ["pets"] as const,
  bySpace: (spaceId: string) => [...petsQueries.all, "space", spaceId] as const,
  lists: (spaceId: string) => [...petsQueries.bySpace(spaceId), "list"] as const,
  list: (spaceId: string) =>
    queryOptions({
      queryKey: petsQueries.lists(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].pets.$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
  details: (spaceId: string) => [...petsQueries.bySpace(spaceId), "detail"] as const,
  detail: (spaceId: string, petId: string) =>
    queryOptions({
      queryKey: [...petsQueries.details(spaceId), petId] as const,
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].pets[":petId"].$get({
          param: { petId, spaceId },
        });
        return parseApiResponse(response);
      },
    }),
};
