import { useMutation } from "@tanstack/react-query";

import type { CreatePostPhotoFile, CreatePostUploadUrlResponse } from "./types";

type UploadPostPhotosVariables = {
  files: CreatePostPhotoFile[];
  onUploadedPhotoCountChange: (count: number) => void;
  uploads: CreatePostUploadUrlResponse["uploads"];
};

const uploadPostPhotoFailedMessage = "写真をアップロードできませんでした。";

export const useUploadPostPhotos = () => {
  const mutation = useMutation({
    mutationFn: async ({
      files,
      onUploadedPhotoCountChange,
      uploads,
    }: UploadPostPhotosVariables) => {
      for (const [index, upload] of uploads.entries()) {
        const file = files[index];

        if (!file) {
          throw new Error(uploadPostPhotoFailedMessage);
        }

        const response = await fetch(upload.uploadUrl, {
          body: file.file,
          headers: {
            "content-type": file.contentType,
          },
          method: "PUT",
        });

        if (!response.ok) {
          throw new Error(uploadPostPhotoFailedMessage);
        }

        onUploadedPhotoCountChange(index + 1);
      }
    },
  });

  return {
    isPending: mutation.isPending,
    uploadPostPhotosAsync: mutation.mutateAsync,
  };
};
