import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { petsKeys } from "./keys";

type CreatePetInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["pets"]["$post"]
>["json"];
type UpdatePetInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["pets"][":petId"]["$patch"]
>["json"];

export const petsMutations = {
  create: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({ input, spaceId }: { input: CreatePetInput; spaceId: string }) => {
        const response = await apiClient.spaces[":spaceId"].pets.$post({
          json: input,
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries({ queryKey: petsKeys.lists(variables.spaceId) });
      },
    }),
  update: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({
        input,
        petId,
        spaceId,
      }: {
        input: UpdatePetInput;
        petId: string;
        spaceId: string;
      }) => {
        const response = await apiClient.spaces[":spaceId"].pets[":petId"].$patch({
          json: input,
          param: { petId, spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: petsKeys.lists(variables.spaceId) }),
          queryClient.invalidateQueries({
            queryKey: petsKeys.detail(variables.spaceId, variables.petId),
          }),
        ]);
      },
    }),
  delete: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({ petId, spaceId }: { petId: string; spaceId: string }) => {
        const response = await apiClient.spaces[":spaceId"].pets[":petId"].$delete({
          param: { petId, spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries({ queryKey: petsKeys.bySpace(variables.spaceId) });
      },
    }),
};
