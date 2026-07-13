import type { InferRequestType, InferResponseType } from "hono/client";

import type { apiClient } from "../../lib/apiClient";

export type CreatePostInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["posts"]["$post"]
>["json"];

export type UpdatePostInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["posts"][":postId"]["$patch"]
>["json"];

export type CreatePostUploadUrlInput = InferRequestType<
  (typeof apiClient.spaces)[":spaceId"]["posts"]["upload-url"]["$post"]
>["json"];

export type CreatePostUploadUrlResponse = InferResponseType<
  (typeof apiClient.spaces)[":spaceId"]["posts"]["upload-url"]["$post"],
  200
>;

export type CreatePostPhotoFile = {
  contentType: CreatePostUploadUrlInput["files"][number]["contentType"];
  file: File;
  fileSize: number;
};

export type SubmitPostInput = {
  body: string;
  files: CreatePostPhotoFile[];
  petIds: string[];
};

export type SubmitPostStep = "idle" | "upload-url" | "uploading" | "creating";
