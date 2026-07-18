import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { invitesKeys } from "./keys";

const rejectInviteFailedMessage = "招待を辞退できませんでした。";
const rejectInviteSucceededMessage = "招待を辞退しました。";

export const useRejectInvite = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const response = await apiClient.invites[":inviteId"].reject.$post({
        param: { inviteId },
      });
      return parseApiResponse(response);
    },
    onError: () => {
      toast.error(rejectInviteFailedMessage);
    },
    onSuccess: async (_data, inviteId) => {
      toast.success(rejectInviteSucceededMessage);
      await queryClient.invalidateQueries({ queryKey: invitesKeys.detail(inviteId) });
    },
  });

  return {
    isPending: mutation.isPending,
    rejectInvite: mutation.mutate,
  };
};
