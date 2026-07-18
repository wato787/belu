import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { petsKeys } from "./keys";

type CreatePetInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["pets"]["$post"]
>["json"];

const createPetFailedMessage = "ペットを登録できませんでした。時間をおいてもう一度お試しください。";
const createPetSucceededMessage = "ペットを登録しました。";

export const useCreatePet = (spaceId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: CreatePetInput) => {
      const response = await apiClient.spaces[":spaceId"].pets.$post({
        json: input,
        param: { spaceId },
      });
      return parseApiResponse(response);
    },
    onError: () => {
      toast.error(createPetFailedMessage);
    },
    onSuccess: async () => {
      toast.success(createPetSucceededMessage);
      await queryClient.invalidateQueries({ queryKey: petsKeys.lists(spaceId) });
    },
  });

  return {
    createPet: mutation.mutate,
    isPending: mutation.isPending,
  };
};
