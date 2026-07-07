import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { petsKeys } from "./keys";

export const petsQueries = {
  list: (spaceId: string) =>
    queryOptions({
      queryKey: petsKeys.lists(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].pets.$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
  detail: (spaceId: string, petId: string) =>
    queryOptions({
      queryKey: petsKeys.detail(spaceId, petId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].pets[":petId"].$get({
          param: { petId, spaceId },
        });
        return parseApiResponse(response);
      },
    }),
};
