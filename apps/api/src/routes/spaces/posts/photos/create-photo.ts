import { zValidator } from "@hono/zod-validator";
import { v7 as uuidv7 } from "uuid";
import { getConfig } from "../../../../config";
import { createDb } from "../../../../db/client";
import { createPhotoRepository, createPostRepository } from "../../../../db/repositories";
import { createRoute } from "../../../../helpers/create-route";
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from "../../../../helpers/exceptions";
import { requireUser } from "../../../../middleware/auth";
import { requireSpaceMember } from "../../../../middleware/space";
import { createStorage } from "../../../../storage";
import { spaceIdParamSchema } from "../../schema";
import { postIdParamSchema } from "../schema";
import { createPhotoObjectKey, getPhotoExtension } from "./helpers";

const createPhotoRoute = createRoute();

createPhotoRoute.post(
  "/",
  requireUser,
  zValidator("param", spaceIdParamSchema.merge(postIdParamSchema)),
  requireSpaceMember,
  async (c) => {
    const { postId, spaceId } = c.req.valid("param");
    const form = await c.req.parseBody();
    const file = form.file;

    if (!(file instanceof File)) {
      throw new BadRequestException("Photo file is required");
    }

    if (!file.type.startsWith("image/")) {
      throw new BadRequestException("Photo must be an image");
    }

    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);
    const post = await postRepository.findByIdAndSpaceId({
      id: postId,
      organizationId: spaceId,
    });

    if (!post) {
      throw new NotFoundException("Post Not Found");
    }

    const config = getConfig(c.env);
    const storage = createStorage({
      photosBucket: config.storage.photosBucket,
      photosPublicBaseUrl: config.storage.photosPublicBaseUrl,
    });
    const photoRepository = createPhotoRepository(db);
    const photoId = uuidv7();
    const objectKey = createPhotoObjectKey({
      extension: getPhotoExtension(file),
      photoId,
      postId,
      spaceId,
    });

    await storage.uploadPhoto({
      body: file,
      contentType: file.type,
      key: objectKey,
    });

    const photo = await photoRepository.create({
      id: photoId,
      objectKey,
      postId,
    });

    if (!photo) {
      await storage.deletePhoto({ key: objectKey });
      throw new InternalServerException();
    }

    return c.json(
      {
        photo: {
          id: photo.id,
          objectKey: photo.objectKey,
          publicUrl: storage.getPublicUrl({ key: photo.objectKey }),
          createdAt: photo.createdAt,
          updatedAt: photo.updatedAt,
        },
      },
      201,
    );
  },
);

export { createPhotoRoute };
