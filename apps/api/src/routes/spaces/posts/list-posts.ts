import { zValidator } from "@hono/zod-validator";
import { getConfig } from "../../../config";
import { createDb } from "../../../db/client";
import { createPostRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { createStorage } from "../../../storage";
import { spaceIdParamSchema } from "../schema";
import { toPostResponse } from "./helpers";

const listPostsRoute = createRoute().get(
  "/",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  requireSpaceMember,
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const spaceMember = c.get("spaceMember");
    const config = getConfig(c.env);
    const storage = createStorage(config.storage);
    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);
    const spacePosts = await postRepository.listBySpaceId({
      organizationId: spaceId,
      viewerMemberId: spaceMember.id,
    });

    return c.json(
      {
        posts: spacePosts.map((post) => toPostResponse(post, { storage })),
      },
      200,
    );
  },
);

export { listPostsRoute };
