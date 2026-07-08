import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { postsKeys } from "./keys";

type CreatePostInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["posts"]["$post"]
>["json"];
type CreatePostUploadUrlInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["posts"]["upload-url"]["$post"]
>["json"];
type UpdatePostInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["posts"][":postId"]["$patch"]
>["json"];
type ReactionType = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["posts"][":postId"]["reactions"][":type"]["$put"]
>["param"]["type"];

const invalidatePost = async (
  queryClient: QueryClient,
  variables: { postId: string; spaceId: string },
) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: postsKeys.lists(variables.spaceId) }),
    queryClient.invalidateQueries({
      queryKey: postsKeys.detail(variables.spaceId, variables.postId),
    }),
  ]);
};

export const postsMutations = {
  createUploadUrl: () =>
    mutationOptions({
      mutationFn: async ({
        input,
        spaceId,
      }: {
        input: CreatePostUploadUrlInput;
        spaceId: string;
      }) => {
        const response = await apiClient.spaces[":spaceId"].posts["upload-url"].$post({
          json: input,
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
  create: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({ input, spaceId }: { input: CreatePostInput; spaceId: string }) => {
        const response = await apiClient.spaces[":spaceId"].posts.$post({
          json: input,
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries({ queryKey: postsKeys.lists(variables.spaceId) });
      },
    }),
  update: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({
        input,
        postId,
        spaceId,
      }: {
        input: UpdatePostInput;
        postId: string;
        spaceId: string;
      }) => {
        const response = await apiClient.spaces[":spaceId"].posts[":postId"].$patch({
          json: input,
          param: { postId, spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await invalidatePost(queryClient, variables);
      },
    }),
  delete: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({ postId, spaceId }: { postId: string; spaceId: string }) => {
        const response = await apiClient.spaces[":spaceId"].posts[":postId"].$delete({
          param: { postId, spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries({ queryKey: postsKeys.bySpace(variables.spaceId) });
      },
    }),
  putReaction: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({
        postId,
        spaceId,
        type,
      }: {
        postId: string;
        spaceId: string;
        type: ReactionType;
      }) => {
        const response = await apiClient.spaces[":spaceId"].posts[":postId"].reactions[
          ":type"
        ].$put({
          param: { postId, spaceId, type },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await invalidatePost(queryClient, variables);
      },
    }),
  deleteReaction: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({
        postId,
        spaceId,
        type,
      }: {
        postId: string;
        spaceId: string;
        type: ReactionType;
      }) => {
        const response = await apiClient.spaces[":spaceId"].posts[":postId"].reactions[
          ":type"
        ].$delete({
          param: { postId, spaceId, type },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await invalidatePost(queryClient, variables);
      },
    }),
};
