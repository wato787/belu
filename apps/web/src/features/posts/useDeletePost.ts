import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { postsKeys } from "./keys";

const deletePostFailedMessage = "投稿を削除できませんでした。時間をおいてもう一度お試しください。";

export const useDeletePost = (spaceId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiClient.spaces[":spaceId"].posts[":postId"].$delete({
        param: { postId, spaceId },
      });
      return parseApiResponse(response);
    },
    onError: () => {
      toast.error(deletePostFailedMessage);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsKeys.bySpace(spaceId) });
    },
  });

  return {
    deletePost: mutation.mutate,
    isPending: mutation.isPending,
  };
};
