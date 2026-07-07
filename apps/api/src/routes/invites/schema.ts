import { z } from "zod";

export const inviteIdParamSchema = z.object({
  inviteId: z.string().trim().min(1),
});
