import { zValidator } from "@hono/zod-validator";
import { createDb } from "../../../db/client";
import { createPostRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { NotFoundException } from "../../../helpers/exceptions";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { spaceIdParamSchema } from "../schema";
import { postIdParamSchema } from "./schema";

const deletePostRoute = createRoute();

deletePostRoute.delete(
  "/:postId",
  requireUser,
  zValidator("param", spaceIdParamSchema.merge(postIdParamSchema)),
  requireSpaceMember,
  async (c) => {
    const { postId, spaceId } = c.req.valid("param");
    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);
    const post = await postRepository.deleteByIdAndSpaceId({
      id: postId,
      organizationId: spaceId,
    });

    if (!post) {
      throw new NotFoundException("Post Not Found");
    }

    return c.body(null, 204);
  },
);

export { deletePostRoute };
