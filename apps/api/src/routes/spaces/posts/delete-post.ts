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
import { postIdParamSchema } from "./schema";

const deletePostRoute = createRoute().delete(
  "/:postId",
  requireUser,
  zValidator("param", spaceIdParamSchema.merge(postIdParamSchema)),
  requireSpaceMember,
  async (c) => {
    const { postId, spaceId } = c.req.valid("param");
    const config = getConfig(c.env);
    const storage = createStorage(config.storage);
    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);
    const post = await postRepository.deleteByIdAndSpaceId({
      id: postId,
      organizationId: spaceId,
    });

    if (!post) {
      throw new NotFoundException("Post Not Found");
    }

    await Promise.all(post.photos.map((photo) => storage.deletePhoto({ key: photo.objectKey })));

    return c.body(null, 204);
  },
);

export { deletePostRoute };
