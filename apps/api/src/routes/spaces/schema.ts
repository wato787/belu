import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1).optional(),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
