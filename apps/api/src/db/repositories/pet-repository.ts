import { and, eq } from "drizzle-orm";
import type { Db } from "../client";
import { pets, type NewPet, type Pet } from "../schema";

type PetSpaceKey = Pick<Pet, "organizationId">;
type PetIdentity = Pick<Pet, "id" | "organizationId">;
type CreatePetInput = Pick<NewPet, "name" | "organizationId">;
type UpdatePetInput = Pick<Pet, "id" | "name" | "organizationId">;

export type PetRepository = {
  listBySpaceId: (input: PetSpaceKey) => Promise<Pet[]>;
  create: (input: CreatePetInput) => Promise<Pet | undefined>;
  findByIdAndSpaceId: (input: PetIdentity) => Promise<Pet | undefined>;
  updateByIdAndSpaceId: (input: UpdatePetInput) => Promise<Pet | undefined>;
  deleteByIdAndSpaceId: (input: PetIdentity) => Promise<Pet | undefined>;
};

export const createPetRepository = (db: Db): PetRepository => ({
  listBySpaceId: async (input) =>
    db.select().from(pets).where(eq(pets.organizationId, input.organizationId)),

  create: async (input) => {
    const [pet] = await db.insert(pets).values(input).returning();

    return pet;
  },

  findByIdAndSpaceId: async (input) =>
    db
      .select()
      .from(pets)
      .where(and(eq(pets.id, input.id), eq(pets.organizationId, input.organizationId)))
      .get(),

  updateByIdAndSpaceId: async (input) => {
    const [pet] = await db
      .update(pets)
      .set({
        name: input.name,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(pets.id, input.id), eq(pets.organizationId, input.organizationId)))
      .returning();

    return pet;
  },

  deleteByIdAndSpaceId: async (input) => {
    const [pet] = await db
      .delete(pets)
      .where(and(eq(pets.id, input.id), eq(pets.organizationId, input.organizationId)))
      .returning();

    return pet;
  },
});
