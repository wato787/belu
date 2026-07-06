import { zValidator } from "@hono/zod-validator";
import { createDb } from "../../../db/client";
import { createPostRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { BadRequestException, InternalServerException } from "../../../helpers/exceptions";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { spaceIdParamSchema } from "../schema";
import { toPostResponse, uniqueIds } from "./helpers";
import { createPostSchema } from "./schema";

const createPostRoute = createRoute();

createPostRoute.post(
  "/",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  requireSpaceMember,
  zValidator("json", createPostSchema),
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const body = c.req.valid("json");
    const spaceMember = c.get("spaceMember");
    const petIds = uniqueIds(body.petIds);
    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);
    const petCount = await postRepository.countPetsBySpaceId({
      organizationId: spaceId,
      petIds,
    });

    if (petCount !== petIds.length) {
      throw new BadRequestException("Invalid Pet IDs");
    }

    const post = await postRepository.create({
      body: body.body,
      memberId: spaceMember.id,
      organizationId: spaceId,
      petIds,
    });

    if (!post) {
      throw new InternalServerException();
    }

    return c.json({ post: toPostResponse(post) }, 201);
  },
);

export { createPostRoute };
