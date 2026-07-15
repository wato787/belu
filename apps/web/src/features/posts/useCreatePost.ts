import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { postsKeys } from "./keys";
import type { CreatePostInput, CreatePostResponse } from "./types";

export const useCreatePost = (spaceId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const createPostResponse = await apiClient.spaces[":spaceId"].posts.$post({
        json: input,
        param: { spaceId },
      });

      return parseApiResponse<CreatePostResponse>(createPostResponse);
    },
    onSuccess: async ({ post }) => {
      queryClient.setQueryData<CreatePostResponse["post"][]>(
        postsKeys.lists(spaceId),
        (currentPosts = []) => {
          const postsWithoutCreatedPost = currentPosts.filter(
            (currentPost) => currentPost.id !== post.id,
          );

          return [post, ...postsWithoutCreatedPost];
        },
      );
      await queryClient.invalidateQueries({ queryKey: postsKeys.lists(spaceId) });
    },
  });

  return {
    createPostAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
