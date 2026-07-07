import { zValidator } from "@hono/zod-validator";
import { getConfig } from "../../config";
import { createDb } from "../../db/client";
import { createPostRepository } from "../../db/repositories";
import { createRoute } from "../../helpers/create-route";
import { createAuth } from "../../lib/better-auth";
import { requireUser } from "../../middleware/auth";
import { requireSpaceOwner } from "../../middleware/space";
import { createStorage } from "../../storage";
import { spaceIdParamSchema } from "./schema";

const deleteSpaceRoute = createRoute();

deleteSpaceRoute.delete(
  "/:spaceId",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  requireSpaceOwner,
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const config = getConfig(c.env);
    const storage = createStorage(config.storage);
    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);
    const auth = createAuth(c.env);
    const posts = await postRepository.listBySpaceId({
      organizationId: spaceId,
    });
    const photoObjectKeys = posts.flatMap((post) => post.photos.map((photo) => photo.objectKey));

    await auth.api.deleteOrganization({
      body: {
        organizationId: spaceId,
      },
      headers: c.req.raw.headers,
    });

    await Promise.all(photoObjectKeys.map((key) => storage.deletePhoto({ key })));

    return c.body(null, 204);
  },
);

export { deleteSpaceRoute };
