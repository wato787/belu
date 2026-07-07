import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { postsKeys } from "./keys";

export const postsQueries = {
  list: (spaceId: string) =>
    queryOptions({
      queryKey: postsKeys.lists(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].posts.$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
  detail: (spaceId: string, postId: string) =>
    queryOptions({
      queryKey: postsKeys.detail(spaceId, postId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].posts[":postId"].$get({
          param: { postId, spaceId },
        });
        return parseApiResponse(response);
      },
    }),
};
