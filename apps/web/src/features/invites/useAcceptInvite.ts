import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { meKeys } from "../me";
import { spacesKeys } from "../spaces";
import { invitesKeys } from "./keys";

type AcceptInviteResponse = InferResponseType<
  (typeof apiClient.invites)[":inviteId"]["accept"]["$post"],
  200
>;

const acceptInviteFailedMessage = "招待に参加できませんでした。";

export const useAcceptInvite = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const response = await apiClient.invites[":inviteId"].accept.$post({
        param: { inviteId },
      });
      return parseApiResponse<AcceptInviteResponse>(response);
    },
    onError: () => {
      toast.error(acceptInviteFailedMessage);
    },
    onSuccess: async (data, inviteId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: invitesKeys.detail(inviteId) }),
        queryClient.invalidateQueries({ queryKey: meKeys.all }),
        queryClient.invalidateQueries({ queryKey: spacesKeys.lists() }),
      ]);

      await navigate({
        params: { spaceId: data.invite.spaceId },
        to: "/spaces/$spaceId",
      });
    },
  });

  return {
    acceptInvite: mutation.mutate,
    isPending: mutation.isPending,
  };
};
