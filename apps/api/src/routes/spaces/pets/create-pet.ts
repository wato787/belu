import { zValidator } from "@hono/zod-validator";
import { createDb } from "../../../db/client";
import { createPetRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { InternalServerException } from "../../../helpers/exceptions";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { spaceIdParamSchema } from "../schema";
import { createPetSchema } from "./schema";

const createPetRoute = createRoute().post(
  "/",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  requireSpaceMember,
  zValidator("json", createPetSchema),
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const body = c.req.valid("json");
    const db = createDb(c.env.DB);
    const petRepository = createPetRepository(db);
    const pet = await petRepository.create({
      name: body.name,
      organizationId: spaceId,
    });

    if (!pet) {
      throw new InternalServerException();
    }

    return c.json(
      {
        pet: {
          id: pet.id,
          name: pet.name,
          createdAt: pet.createdAt,
          updatedAt: pet.updatedAt,
        },
      },
      201,
    );
  },
);

export { createPetRoute };
