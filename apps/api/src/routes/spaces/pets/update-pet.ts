import { zValidator } from "@hono/zod-validator";
import { createDb } from "../../../db/client";
import { createPetRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { NotFoundException } from "../../../helpers/exceptions";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { spaceIdParamSchema } from "../schema";
import { petIdParamSchema, updatePetSchema } from "./schema";

const updatePetRoute = createRoute();

updatePetRoute.patch(
  "/:petId",
  requireUser,
  zValidator("param", spaceIdParamSchema.merge(petIdParamSchema)),
  requireSpaceMember,
  zValidator("json", updatePetSchema),
  async (c) => {
    const { petId, spaceId } = c.req.valid("param");
    const body = c.req.valid("json");
    const db = createDb(c.env.DB);
    const petRepository = createPetRepository(db);
    const pet = await petRepository.updateByIdAndSpaceId({
      id: petId,
      name: body.name,
      organizationId: spaceId,
    });

    if (!pet) {
      throw new NotFoundException("Pet Not Found");
    }

    return c.json({
      pet: {
        id: pet.id,
        name: pet.name,
        createdAt: pet.createdAt,
        updatedAt: pet.updatedAt,
      },
    });
  },
);

export { updatePetRoute };
