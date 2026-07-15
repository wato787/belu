import { zValidator } from "@hono/zod-validator";
import { getConfig } from "../../../config";
import { createDb } from "../../../db/client";
import { createPostRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { NotFoundException } from "../../../helpers/exceptions";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { createStorage } from "../../../storage";
import { spaceIdParamSchema } from "../schema";
import { toPostResponse } from "./helpers";
import { postIdParamSchema } from "./schema";

const getPostRoute = createRoute().get(
  "/:postId",
  requireUser,
  zValidator("param", spaceIdParamSchema.merge(postIdParamSchema)),
  requireSpaceMember,
  async (c) => {
    const { postId, spaceId } = c.req.valid("param");
    const spaceMember = c.get("spaceMember");
    const config = getConfig(c.env);
    const storage = createStorage(config.storage);
    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);
    const post = await postRepository.findByIdAndSpaceId({
      id: postId,
      organizationId: spaceId,
      viewerMemberId: spaceMember.id,
    });

    if (!post) {
      throw new NotFoundException("Post Not Found");
    }

    const postResponse = await toPostResponse(post, { storage });

    return c.json({ post: postResponse }, 200);
  },
);

export { getPostRoute };
