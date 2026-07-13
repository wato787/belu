import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { postsKeys } from "./keys";
import type { UpdatePostInput } from "./types";

type UpdatePostVariables = {
  input: UpdatePostInput;
  postId: string;
};

export const useUpdatePost = (spaceId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ input, postId }: UpdatePostVariables) => {
      const response = await apiClient.spaces[":spaceId"].posts[":postId"].$patch({
        json: input,
        param: { postId, spaceId },
      });

      return parseApiResponse(response);
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postsKeys.lists(spaceId) }),
        queryClient.invalidateQueries({ queryKey: postsKeys.detail(spaceId, variables.postId) }),
      ]);
    },
  });

  return {
    isPending: mutation.isPending,
    updatePostAsync: mutation.mutateAsync,
  };
};
