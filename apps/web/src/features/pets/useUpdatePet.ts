import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { petsKeys } from "./keys";

type UpdatePetInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["pets"][":petId"]["$patch"]
>["json"];

type UpdatePetVariables = {
  input: UpdatePetInput;
  petId: string;
};

const updatePetFailedMessage =
  "ペット情報を保存できませんでした。時間をおいてもう一度お試しください。";
const updatePetSucceededMessage = "ペット情報を保存しました。";

export const useUpdatePet = (spaceId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ input, petId }: UpdatePetVariables) => {
      const response = await apiClient.spaces[":spaceId"].pets[":petId"].$patch({
        json: input,
        param: { petId, spaceId },
      });
      return parseApiResponse(response);
    },
    onError: () => {
      toast.error(updatePetFailedMessage);
    },
    onSuccess: async (_data, variables) => {
      toast.success(updatePetSucceededMessage);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: petsKeys.lists(spaceId) }),
        queryClient.invalidateQueries({ queryKey: petsKeys.detail(spaceId, variables.petId) }),
      ]);
    },
  });

  return {
    isPending: mutation.isPending,
    updatePet: mutation.mutate,
  };
};
