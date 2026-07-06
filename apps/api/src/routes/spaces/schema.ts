import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z.string().trim().min(1),
  logo: z.string().trim().min(1).optional(),
});

export const updateSpaceSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    logo: z.string().trim().min(1).nullable().optional(),
  })
  .refine((value) => value.name !== undefined || value.logo !== undefined, {
    message: "name or logo is required",
  });

export const spaceIdParamSchema = z.object({
  spaceId: z.string().trim().min(1),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;
