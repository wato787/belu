import { queryOptions } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { postsKeys } from "./keys";

type ListPostsResponse = InferResponseType<
  (typeof apiClient.spaces)[":spaceId"]["posts"]["$get"],
  200
>;
type GetPostResponse = InferResponseType<
  (typeof apiClient.spaces)[":spaceId"]["posts"][":postId"]["$get"],
  200
>;

export const postsQueries = {
  list: (spaceId: string) =>
    queryOptions({
      queryKey: postsKeys.lists(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].posts.$get({
          param: { spaceId },
        });
        const data = await parseApiResponse<ListPostsResponse>(response);
        return data.posts;
      },
    }),
  detail: (spaceId: string, postId: string) =>
    queryOptions({
      queryKey: postsKeys.detail(spaceId, postId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].posts[":postId"].$get({
          param: { postId, spaceId },
        });
        const data = await parseApiResponse<GetPostResponse>(response);
        return data.post;
      },
    }),
};
