import { zValidator } from "@hono/zod-validator";
import { createDb } from "../../../db/client";
import { createPostRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { spaceIdParamSchema } from "../schema";
import { toPostResponse } from "./helpers";

const listPostsRoute = createRoute();

listPostsRoute.get(
  "/",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  requireSpaceMember,
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const spaceMember = c.get("spaceMember");
    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);
    const spacePosts = await postRepository.listBySpaceId({
      organizationId: spaceId,
      viewerMemberId: spaceMember.id,
    });

    return c.json({
      posts: spacePosts.map(toPostResponse),
    });
  },
);

export { listPostsRoute };
