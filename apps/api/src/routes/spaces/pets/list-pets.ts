import { zValidator } from "@hono/zod-validator";
import { createDb } from "../../../db/client";
import { createPetRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { spaceIdParamSchema } from "../schema";

const listPetsRoute = createRoute();

listPetsRoute.get(
  "/",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  requireSpaceMember,
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const db = createDb(c.env.DB);
    const petRepository = createPetRepository(db);
    const spacePets = await petRepository.listBySpaceId({ organizationId: spaceId });

    return c.json({
      pets: spacePets.map((pet) => ({
        id: pet.id,
        name: pet.name,
        createdAt: pet.createdAt,
        updatedAt: pet.updatedAt,
      })),
    });
  },
);

export { listPetsRoute };
