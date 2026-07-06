import { z } from "zod";

export const createPostSchema = z.object({
  body: z.string().trim().min(1),
  petIds: z.array(z.string().trim().min(1)).optional().default([]),
});

export const updatePostSchema = z
  .object({
    body: z.string().trim().min(1).optional(),
    petIds: z.array(z.string().trim().min(1)).optional(),
  })
  .refine((value) => value.body !== undefined || value.petIds !== undefined, {
    message: "body or petIds is required",
  });

export const postIdParamSchema = z.object({
  postId: z.string().trim().min(1),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
