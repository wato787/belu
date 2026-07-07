import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { meKeys } from "../me";
import { spacesKeys } from "../spaces";
import { invitesKeys } from "./keys";

type CreateInviteInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["invites"]["$post"]
>["json"];

export const invitesMutations = {
  create: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({ input, spaceId }: { input: CreateInviteInput; spaceId: string }) => {
        const response = await apiClient.spaces[":spaceId"].invites.$post({
          json: input,
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries({ queryKey: invitesKeys.list(variables.spaceId) });
      },
    }),
  delete: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({ inviteId, spaceId }: { inviteId: string; spaceId: string }) => {
        const response = await apiClient.spaces[":spaceId"].invites[":inviteId"].$delete({
          param: { inviteId, spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries({ queryKey: invitesKeys.list(variables.spaceId) });
      },
    }),
  accept: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async (inviteId: string) => {
        const response = await apiClient.invites[":inviteId"].accept.$post({
          param: { inviteId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, inviteId) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: invitesKeys.detail(inviteId) }),
          queryClient.invalidateQueries({ queryKey: meKeys.all }),
          queryClient.invalidateQueries({ queryKey: spacesKeys.lists() }),
        ]);
      },
    }),
  reject: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async (inviteId: string) => {
        const response = await apiClient.invites[":inviteId"].reject.$post({
          param: { inviteId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, inviteId) => {
        await queryClient.invalidateQueries({ queryKey: invitesKeys.detail(inviteId) });
      },
    }),
};
