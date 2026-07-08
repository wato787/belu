import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { spacesKeys } from "./keys";

export const spacesQueries = {
  list: () =>
    queryOptions({
      queryKey: spacesKeys.lists(),
      queryFn: async () => {
        const response = await apiClient.spaces.$get();
        return parseApiResponse(response);
      },
    }),
  detail: (spaceId: string) =>
    queryOptions({
      queryKey: spacesKeys.detail(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
};
