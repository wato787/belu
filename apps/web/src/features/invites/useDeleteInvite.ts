import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { invitesKeys } from "./keys";

const deleteInviteFailedMessage = "招待をキャンセルできませんでした。";
const deleteInviteSucceededMessage = "招待をキャンセルしました。";

export const useDeleteInvite = (spaceId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const response = await apiClient.spaces[":spaceId"].invites[":inviteId"].$delete({
        param: { inviteId, spaceId },
      });
      return parseApiResponse(response);
    },
    onError: () => {
      toast.error(deleteInviteFailedMessage);
    },
    onSuccess: async (_data, inviteId) => {
      toast.success(deleteInviteSucceededMessage);
      queryClient.removeQueries({ queryKey: invitesKeys.detail(inviteId) });
      await queryClient.invalidateQueries({ queryKey: invitesKeys.list(spaceId) });
    },
  });

  return {
    deleteInvite: mutation.mutate,
    isPending: mutation.isPending,
  };
};
