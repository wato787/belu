import { queryOptions } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { spacesKeys } from "./keys";

type ListSpacesResponse = InferResponseType<typeof apiClient.spaces.$get, 200>;
type GetSpaceResponse = InferResponseType<(typeof apiClient.spaces)[":spaceId"]["$get"], 200>;

export const spacesQueries = {
  list: () =>
    queryOptions({
      queryKey: spacesKeys.lists(),
      queryFn: async () => {
        const response = await apiClient.spaces.$get();
        const data = await parseApiResponse<ListSpacesResponse>(response);
        return data.spaces;
      },
    }),
  detail: (spaceId: string) =>
    queryOptions({
      queryKey: spacesKeys.detail(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].$get({
          param: { spaceId },
        });
        const data = await parseApiResponse<GetSpaceResponse>(response);
        return data.space;
      },
    }),
};
