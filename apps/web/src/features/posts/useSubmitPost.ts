import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { useCreatePost } from "./useCreatePost";
import { useCreatePostUploadUrls } from "./useCreatePostUploadUrls";
import { useUploadPostPhotos } from "./useUploadPostPhotos";
import type { CreatePostInput, SubmitPostInput, SubmitPostStep } from "./types";

const submitPostFailedMessage = "投稿を作成できませんでした。時間をおいてもう一度お試しください。";

export const useSubmitPost = (spaceId: string) => {
  const navigate = useNavigate();
  const { createPostAsync, isPending: isCreatePostPending } = useCreatePost(spaceId);
  const { createPostUploadUrlsAsync, isPending: isCreatePostUploadUrlsPending } =
    useCreatePostUploadUrls();
  const { isPending: isUploadPostPhotosPending, uploadPostPhotosAsync } = useUploadPostPhotos();
  const [submitStep, setSubmitStep] = useState<SubmitPostStep>("idle");
  const [uploadedPhotoCount, setUploadedPhotoCount] = useState(0);
  const isPending =
    isCreatePostPending || isCreatePostUploadUrlsPending || isUploadPostPhotosPending;

  const submitPost = async ({ body, files, petIds }: SubmitPostInput) => {
    try {
      setSubmitStep("upload-url");
      setUploadedPhotoCount(0);

      const { uploads } = await createPostUploadUrlsAsync({
        input: {
          files: files.map((file) => ({
            contentType: file.contentType,
            fileSize: file.fileSize,
          })),
        },
        spaceId,
      });

      setSubmitStep("uploading");
      await uploadPostPhotosAsync({
        files,
        onUploadedPhotoCountChange: setUploadedPhotoCount,
        uploads,
      });

      setSubmitStep("creating");

      const input: CreatePostInput = {
        body,
        petIds,
        photos: uploads.map((upload, index) => ({
          objectKey: upload.objectKey,
          sortOrder: index,
          uploadId: upload.uploadId,
        })),
      };

      await createPostAsync(input);
      toast.success("投稿を作成しました。");
      navigate({ params: { spaceId }, to: "/spaces/$spaceId" });
    } catch {
      toast.error(submitPostFailedMessage);
    } finally {
      setSubmitStep("idle");
      setUploadedPhotoCount(0);
    }
  };

  return {
    isPending,
    submitPost,
    submitStep,
    uploadedPhotoCount,
  };
};
