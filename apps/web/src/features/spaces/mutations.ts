import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { meKeys } from "../me";
import { spacesKeys } from "./keys";

type CreateSpaceInput = InferRequestType<typeof apiClient.spaces.$post>["json"];
type UpdateSpaceInput = InferRequestType<(typeof apiClient.spaces)[":spaceId"]["$patch"]>["json"];

export const spacesMutations = {
  create: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async (input: CreateSpaceInput) => {
        const response = await apiClient.spaces.$post({ json: input });
        return parseApiResponse(response);
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: meKeys.all }),
          queryClient.invalidateQueries({ queryKey: spacesKeys.lists() }),
        ]);
      },
    }),
  update: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({ input, spaceId }: { input: UpdateSpaceInput; spaceId: string }) => {
        const response = await apiClient.spaces[":spaceId"].$patch({
          json: input,
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: meKeys.all }),
          queryClient.invalidateQueries({ queryKey: spacesKeys.lists() }),
          queryClient.invalidateQueries({ queryKey: spacesKeys.detail(variables.spaceId) }),
        ]);
      },
    }),
  delete: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async (spaceId: string) => {
        const response = await apiClient.spaces[":spaceId"].$delete({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: meKeys.all }),
          queryClient.invalidateQueries({ queryKey: spacesKeys.all }),
        ]);
      },
    }),
};
