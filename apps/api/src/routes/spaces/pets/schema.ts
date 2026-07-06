import { z } from "zod";

export const createPetSchema = z.object({
  name: z.string().trim().min(1),
});

export const updatePetSchema = z.object({
  name: z.string().trim().min(1),
});

export const petIdParamSchema = z.object({
  petId: z.string().trim().min(1),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
