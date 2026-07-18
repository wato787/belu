import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { petsKeys } from "./keys";

const deletePetFailedMessage = "ペットを削除できませんでした。時間をおいてもう一度お試しください。";
const deletePetSucceededMessage = "ペットを削除しました。";

export const useDeletePet = (spaceId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (petId: string) => {
      const response = await apiClient.spaces[":spaceId"].pets[":petId"].$delete({
        param: { petId, spaceId },
      });
      return parseApiResponse(response);
    },
    onError: () => {
      toast.error(deletePetFailedMessage);
    },
    onSuccess: async (_data, petId) => {
      toast.success(deletePetSucceededMessage);
      queryClient.removeQueries({ queryKey: petsKeys.detail(spaceId, petId) });
      await queryClient.invalidateQueries({ queryKey: petsKeys.bySpace(spaceId) });
    },
  });

  return {
    deletePet: mutation.mutate,
    isPending: mutation.isPending,
  };
};
