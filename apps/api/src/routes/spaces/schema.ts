import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z.string().trim().min(1),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
