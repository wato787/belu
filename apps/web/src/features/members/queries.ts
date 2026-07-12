import { queryOptions } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { membersKeys } from "./keys";

type ListMembersResponse = InferResponseType<
  (typeof apiClient.spaces)[":spaceId"]["members"]["$get"],
  200
>;

export const membersQueries = {
  list: (spaceId: string) =>
    queryOptions({
      queryKey: membersKeys.list(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].members.$get({
          param: { spaceId },
        });
        const data = await parseApiResponse<ListMembersResponse>(response);
        return data.members;
      },
    }),
};
