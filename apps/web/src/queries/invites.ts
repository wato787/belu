import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../lib/apiClient";

export const invitesQueries = {
  all: ["invites"] as const,
  bySpace: (spaceId: string) => [...invitesQueries.all, "space", spaceId] as const,
  list: (spaceId: string) =>
    queryOptions({
      queryKey: [...invitesQueries.bySpace(spaceId), "list"] as const,
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].invites.$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
  details: () => [...invitesQueries.all, "detail"] as const,
  detail: (inviteId: string) =>
    queryOptions({
      queryKey: [...invitesQueries.details(), inviteId] as const,
      queryFn: async () => {
        const response = await apiClient.invites[":inviteId"].$get({
          param: { inviteId },
        });
        return parseApiResponse(response);
      },
    }),
};
