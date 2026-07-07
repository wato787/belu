import { z } from "zod";

export const memberIdParamSchema = z.object({
  memberId: z.string().trim().min(1),
});
