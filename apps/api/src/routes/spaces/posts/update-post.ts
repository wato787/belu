import { zValidator } from "@hono/zod-validator";
import { getConfig } from "../../../config";
import { createDb } from "../../../db/client";
import { createPostRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { BadRequestException, NotFoundException } from "../../../helpers/exceptions";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { createStorage } from "../../../storage";
import { spaceIdParamSchema } from "../schema";
import { toPostResponse, uniqueIds } from "./helpers";
import { postIdParamSchema, updatePostSchema } from "./schema";

const updatePostRoute = createRoute().patch(
  "/:postId",
  requireUser,
  zValidator("param", spaceIdParamSchema.merge(postIdParamSchema)),
  requireSpaceMember,
  zValidator("json", updatePostSchema),
  async (c) => {
    const { postId, spaceId } = c.req.valid("param");
    const body = c.req.valid("json");
    const spaceMember = c.get("spaceMember");
    const petIds = body.petIds === undefined ? undefined : uniqueIds(body.petIds);
    const config = getConfig(c.env);
    const storage = createStorage(config.storage);
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
      viewerMemberId: spaceMember.id,
      ...(body.body === undefined ? {} : { body: body.body }),
      ...(petIds === undefined ? {} : { petIds }),
    });

    if (!post) {
      throw new NotFoundException("Post Not Found");
    }

    const postResponse = await toPostResponse(post, { storage });

    return c.json({ post: postResponse }, 200);
  },
);

export { updatePostRoute };
