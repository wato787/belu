import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { invitesKeys } from "./keys";

export const invitesQueries = {
  list: (spaceId: string) =>
    queryOptions({
      queryKey: invitesKeys.list(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].invites.$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
  detail: (inviteId: string) =>
    queryOptions({
      queryKey: invitesKeys.detail(inviteId),
      queryFn: async () => {
        const response = await apiClient.invites[":inviteId"].$get({
          param: { inviteId },
        });
        return parseApiResponse(response);
      },
    }),
};
