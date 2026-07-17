import { zValidator } from "@hono/zod-validator";
import { getConfig } from "../../../config";
import { createDb } from "../../../db/client";
import { createPostRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { BadRequestException, InternalServerException } from "../../../helpers/exceptions";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { createStorage } from "../../../storage";
import { spaceIdParamSchema } from "../schema";
import { toPostResponse, uniqueIds } from "./helpers";
import { validatePostPhotos } from "./photo-validation";
import { createPostSchema } from "./schema";

const createPostRoute = createRoute().post(
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
    const config = getConfig(c.env);
    const storage = createStorage(config.storage);
    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);
    const petCount = await postRepository.countPetsBySpaceId({
      organizationId: spaceId,
      petIds,
    });

    if (petCount !== petIds.length) {
      throw new BadRequestException("Invalid Pet IDs");
    }

    validatePostPhotos(body.photos, spaceId);

    const photoExists = await Promise.all(
      body.photos.map((photo) => storage.hasPhoto({ key: photo.objectKey })),
    );

    if (photoExists.some((exists) => !exists)) {
      throw new BadRequestException("Invalid Photos");
    }

    const post = await postRepository.create({
      body: body.body,
      memberId: spaceMember.id,
      organizationId: spaceId,
      petIds,
      photos: body.photos,
    });

    if (!post) {
      throw new InternalServerException();
    }

    const postResponse = await toPostResponse(post, { storage });

    return c.json({ post: postResponse }, 201);
  },
);

export { createPostRoute };
