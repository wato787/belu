import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { membersKeys } from "./keys";

export const membersQueries = {
  list: (spaceId: string) =>
    queryOptions({
      queryKey: membersKeys.list(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].members.$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
};
