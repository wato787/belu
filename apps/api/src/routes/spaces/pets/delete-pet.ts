import { zValidator } from "@hono/zod-validator";
import { createDb } from "../../../db/client";
import { createPetRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { NotFoundException } from "../../../helpers/exceptions";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { spaceIdParamSchema } from "../schema";
import { petIdParamSchema } from "./schema";

const deletePetRoute = createRoute().delete(
  "/:petId",
  requireUser,
  zValidator("param", spaceIdParamSchema.merge(petIdParamSchema)),
  requireSpaceMember,
  async (c) => {
    const { petId, spaceId } = c.req.valid("param");
    const db = createDb(c.env.DB);
    const petRepository = createPetRepository(db);
    const pet = await petRepository.deleteByIdAndSpaceId({
      id: petId,
      organizationId: spaceId,
    });

    if (!pet) {
      throw new NotFoundException("Pet Not Found");
    }

    return c.body(null, 204);
  },
);

export { deletePetRoute };
