import { z } from "zod";
import { REACTION_TYPES, type ReactionType } from "../../../constants";
import { ALLOWED_PHOTO_CONTENT_TYPES } from "../../../storage";

export const MAX_POST_PHOTO_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_POST_PHOTO_UPLOADS = 20;
export const POST_PHOTO_UPLOAD_URL_EXPIRES_IN_SECONDS = 5 * 60;
export const createPostSchema = z.object({
  body: z.string().trim().optional().default(""),
  petIds: z.array(z.string().trim().min(1)).optional().default([]),
  photos: z
    .array(
      z.object({
        objectKey: z.string().trim().min(1),
        sortOrder: z.number().int().nonnegative(),
        uploadId: z.string().trim().min(1),
      }),
    )
    .min(1)
    .max(MAX_POST_PHOTO_UPLOADS),
});

const postPhotoSchema = z.object({
  objectKey: z.string().trim().min(1),
  sortOrder: z.number().int().nonnegative(),
  uploadId: z.string().trim().min(1),
});

export const updatePostSchema = z
  .object({
    body: z.string().trim().optional(),
    petIds: z.array(z.string().trim().min(1)).optional(),
    photos: z.array(postPhotoSchema).min(1).max(MAX_POST_PHOTO_UPLOADS).optional(),
  })
  .refine((value) => value.body !== undefined || value.petIds !== undefined || value.photos, {
    message: "body, petIds or photos is required",
  });

export const postIdParamSchema = z.object({
  postId: z.string().trim().min(1),
});

export const reactionTypeParamSchema = z.object({
  type: z.enum(REACTION_TYPES),
});

export const createPostUploadUrlSchema = z.object({
  files: z
    .array(
      z.object({
        contentType: z.enum(ALLOWED_PHOTO_CONTENT_TYPES),
        fileSize: z.number().int().positive().max(MAX_POST_PHOTO_FILE_SIZE),
      }),
    )
    .min(1)
    .max(MAX_POST_PHOTO_UPLOADS),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreatePostUploadUrlInput = z.infer<typeof createPostUploadUrlSchema>;
export type { ReactionType };
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
