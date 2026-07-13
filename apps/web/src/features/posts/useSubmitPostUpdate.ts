import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import type { UpdatePostInput } from "./types";
import { useUpdatePost } from "./useUpdatePost";

const submitPostUpdateFailedMessage =
  "投稿を更新できませんでした。時間をおいてもう一度お試しください。";

type SubmitPostUpdateInput = {
  body: string;
  petIds: string[];
};

export const useSubmitPostUpdate = (spaceId: string, postId: string) => {
  const navigate = useNavigate();
  const { isPending, updatePostAsync } = useUpdatePost(spaceId);

  const submitPostUpdate = async ({ body, petIds }: SubmitPostUpdateInput) => {
    try {
      const input: UpdatePostInput = {
        body,
        petIds,
      };

      await updatePostAsync({ input, postId });
      toast.success("投稿を更新しました。");
      navigate({ params: { spaceId }, to: "/spaces/$spaceId" });
    } catch {
      toast.error(submitPostUpdateFailedMessage);
    }
  };

  return {
    isPending,
    submitPostUpdate,
  };
};
