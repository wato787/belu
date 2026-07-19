import { z } from "zod";

export const createPushSubscriptionSchema = z.object({
  endpoint: z.string().trim().url(),
  keys: z.object({
    auth: z.string().trim().min(1),
    p256dh: z.string().trim().min(1),
  }),
});
