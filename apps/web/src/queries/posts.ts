import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../lib/apiClient";

export const postsQueries = {
  all: ["posts"] as const,
  bySpace: (spaceId: string) => [...postsQueries.all, "space", spaceId] as const,
  lists: (spaceId: string) => [...postsQueries.bySpace(spaceId), "list"] as const,
  list: (spaceId: string) =>
    queryOptions({
      queryKey: postsQueries.lists(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].posts.$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
  details: (spaceId: string) => [...postsQueries.bySpace(spaceId), "detail"] as const,
  detail: (spaceId: string, postId: string) =>
    queryOptions({
      queryKey: [...postsQueries.details(spaceId), postId] as const,
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].posts[":postId"].$get({
          param: { postId, spaceId },
        });
        return parseApiResponse(response);
      },
    }),
};
