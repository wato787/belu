import { zValidator } from "@hono/zod-validator";
import { createDb } from "../../../db/client";
import { createPostRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { BadRequestException, NotFoundException } from "../../../helpers/exceptions";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { spaceIdParamSchema } from "../schema";
import { toPostResponse, uniqueIds } from "./helpers";
import { postIdParamSchema, updatePostSchema } from "./schema";

const updatePostRoute = createRoute();

updatePostRoute.patch(
  "/:postId",
  requireUser,
  zValidator("param", spaceIdParamSchema.merge(postIdParamSchema)),
  requireSpaceMember,
  zValidator("json", updatePostSchema),
  async (c) => {
    const { postId, spaceId } = c.req.valid("param");
    const body = c.req.valid("json");
    const petIds = body.petIds === undefined ? undefined : uniqueIds(body.petIds);
    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);

    if (petIds !== undefined) {
      const petCount = await postRepository.countPetsBySpaceId({
        organizationId: spaceId,
        petIds,
      });

      if (petCount !== petIds.length) {
        throw new BadRequestException("Invalid Pet IDs");
      }
    }

    const post = await postRepository.updateByIdAndSpaceId({
      id: postId,
      organizationId: spaceId,
      ...(body.body === undefined ? {} : { body: body.body }),
      ...(petIds === undefined ? {} : { petIds }),
    });

    if (!post) {
      throw new NotFoundException("Post Not Found");
    }

    return c.json({ post: toPostResponse(post) });
  },
);

export { updatePostRoute };
