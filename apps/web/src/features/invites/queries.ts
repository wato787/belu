import { queryOptions } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { invitesKeys } from "./keys";

type ListInvitesResponse = InferResponseType<
  (typeof apiClient.spaces)[":spaceId"]["invites"]["$get"],
  200
>;
type GetInviteResponse = InferResponseType<(typeof apiClient.invites)[":inviteId"]["$get"], 200>;

export const invitesQueries = {
  list: (spaceId: string) =>
    queryOptions({
      queryKey: invitesKeys.list(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].invites.$get({
          param: { spaceId },
        });
        const data = await parseApiResponse<ListInvitesResponse>(response);
        return data.invites;
      },
    }),
  detail: (inviteId: string) =>
    queryOptions({
      queryKey: invitesKeys.detail(inviteId),
      queryFn: async () => {
        const response = await apiClient.invites[":inviteId"].$get({
          param: { inviteId },
        });
        const data = await parseApiResponse<GetInviteResponse>(response);
        return data.invite;
      },
    }),
};
