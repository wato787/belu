import { useMutation } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import type { CreatePostUploadUrlInput, CreatePostUploadUrlResponse } from "./types";

type CreatePostUploadUrlsVariables = {
  input: CreatePostUploadUrlInput;
  spaceId: string;
};

export const useCreatePostUploadUrls = () => {
  // react-doctor-disable-next-line react-doctor/query-mutation-missing-invalidation
  const mutation = useMutation({
    mutationFn: async ({ input, spaceId }: CreatePostUploadUrlsVariables) => {
      const response = await apiClient.spaces[":spaceId"].posts["upload-url"].$post({
        json: input,
        param: { spaceId },
      });

      return parseApiResponse<CreatePostUploadUrlResponse>(response);
    },
  });

  return {
    createPostUploadUrlsAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
