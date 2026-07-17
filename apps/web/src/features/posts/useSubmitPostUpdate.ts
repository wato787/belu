import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import type { SubmitPostStep, SubmitPostUpdateInput, UpdatePostInput } from "./types";
import { useCreatePostUploadUrls } from "./useCreatePostUploadUrls";
import { useUpdatePost } from "./useUpdatePost";
import { useUploadPostPhotos } from "./useUploadPostPhotos";

const submitPostUpdateFailedMessage =
  "投稿を更新できませんでした。時間をおいてもう一度お試しください。";

export const useSubmitPostUpdate = (spaceId: string, postId: string) => {
  const navigate = useNavigate();
  const { createPostUploadUrlsAsync, isPending: isCreatePostUploadUrlsPending } =
    useCreatePostUploadUrls();
  const { isPending: isUploadPostPhotosPending, uploadPostPhotosAsync } = useUploadPostPhotos();
  const { isPending: isUpdatePostPending, updatePostAsync } = useUpdatePost(spaceId);
  const [submitStep, setSubmitStep] = useState<SubmitPostStep>("idle");
  const [uploadedPhotoCount, setUploadedPhotoCount] = useState(0);
  const isPending =
    isCreatePostUploadUrlsPending || isUploadPostPhotosPending || isUpdatePostPending;

  const submitPostUpdate = async ({ body, files, petIds, photos }: SubmitPostUpdateInput) => {
    try {
      setSubmitStep(files.length > 0 ? "upload-url" : "creating");
      setUploadedPhotoCount(0);

      const uploads =
        files.length === 0
          ? []
          : (
              await createPostUploadUrlsAsync({
                input: {
                  files: files.map((file) => ({
                    contentType: file.contentType,
                    fileSize: file.fileSize,
                  })),
                },
                spaceId,
              })
            ).uploads;

      if (files.length > 0) {
        setSubmitStep("uploading");
        await uploadPostPhotosAsync({
          files,
          onUploadedPhotoCountChange: setUploadedPhotoCount,
          uploads,
        });
        setSubmitStep("creating");
      }

      const input: UpdatePostInput = {
        body,
        petIds,
        photos: [
          ...photos,
          ...uploads.map((upload) => ({
            objectKey: upload.objectKey,
            uploadId: upload.uploadId,
          })),
        ].map((photo, index) => ({
          objectKey: photo.objectKey,
          sortOrder: index,
          uploadId: photo.uploadId,
        })),
      };

      await updatePostAsync({ input, postId });
      toast.success("投稿を更新しました。");
      navigate({ params: { spaceId }, to: "/spaces/$spaceId" });
    } catch {
      toast.error(submitPostUpdateFailedMessage);
    } finally {
      setSubmitStep("idle");
      setUploadedPhotoCount(0);
    }
  };

  return {
    isPending,
    submitPostUpdate,
    submitStep,
    uploadedPhotoCount,
  };
};
