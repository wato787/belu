import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { membersKeys } from "./keys";

const deleteMemberFailedMessage = "メンバーを削除できませんでした。";

export const useDeleteMember = (spaceId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await apiClient.spaces[":spaceId"].members[":memberId"].$delete({
        param: { memberId, spaceId },
      });
      return parseApiResponse(response);
    },
    onError: () => {
      toast.error(deleteMemberFailedMessage);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: membersKeys.list(spaceId) });
    },
  });

  return {
    deleteMember: mutation.mutate,
    isPending: mutation.isPending,
  };
};
