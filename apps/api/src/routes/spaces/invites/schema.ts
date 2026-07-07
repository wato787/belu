import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.preprocess((value) => (typeof value === "string" ? value.trim() : value), z.email()),
});

export const inviteIdParamSchema = z.object({
  inviteId: z.string().trim().min(1),
});
