import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { invitesKeys } from "./keys";

type CreateInviteInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["invites"]["$post"]
>["json"];

const createInviteFailedMessage = "招待を作成できませんでした。";
const createInviteSucceededMessage = "招待を作成しました。リンクをコピーして共有してください。";

export const useCreateInvite = (spaceId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: CreateInviteInput) => {
      const response = await apiClient.spaces[":spaceId"].invites.$post({
        json: input,
        param: { spaceId },
      });
      return parseApiResponse(response);
    },
    onError: () => {
      toast.error(createInviteFailedMessage);
    },
    onSuccess: async () => {
      toast.success(createInviteSucceededMessage);
      await queryClient.invalidateQueries({ queryKey: invitesKeys.list(spaceId) });
    },
  });

  return {
    createInvite: mutation.mutate,
    isPending: mutation.isPending,
  };
};
