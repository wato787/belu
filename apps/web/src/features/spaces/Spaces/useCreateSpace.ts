import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { InferRequestType } from "hono/client";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../../lib/apiClient";
import { meKeys } from "../../me";
import { spacesKeys } from "../keys";

type CreateSpaceInput = InferRequestType<typeof apiClient.spaces.$post>["json"];

type CreateSpaceResult = {
  space: {
    id: string;
  };
};

const createSpaceFailedMessage =
  "スペースを作成できませんでした。時間をおいてもう一度お試しください。";
const createSpaceSucceededMessage = "スペースを作成しました。";

export const useCreateSpace = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: CreateSpaceInput) => {
      const response = await apiClient.spaces.$post({ json: input });
      return parseApiResponse(response);
    },
    onError: () => {
      toast.error(createSpaceFailedMessage);
    },
    onSuccess: async (data) => {
      toast.success(createSpaceSucceededMessage);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: meKeys.all }),
        queryClient.invalidateQueries({ queryKey: spacesKeys.lists() }),
      ]);

      const result = data as unknown as CreateSpaceResult;

      await navigate({
        params: { spaceId: result.space.id },
        to: "/spaces/$spaceId",
      });
    },
  });

  return {
    createSpace: mutation.mutate,
    isPending: mutation.isPending,
  };
};
