import { zValidator } from "@hono/zod-validator";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { getConfig } from "../../../config";
import { createDb } from "../../../db/client";
import { createPostRepository } from "../../../db/repositories";
import { createRoute } from "../../../helpers/create-route";
import { BadRequestException, InternalServerException } from "../../../helpers/exceptions";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import {
  ALLOWED_PHOTO_CONTENT_TYPES,
  createStorage,
  getPhotoUploadObjectKey,
} from "../../../storage";
import { spaceIdParamSchema } from "../schema";
import { toPostResponse, uniqueIds } from "./helpers";
import { createPostSchema, type CreatePostInput } from "./schema";

type CreatePostPhotoInput = CreatePostInput["photos"][number];

const hasDuplicate = (values: (number | string)[]) => new Set(values).size !== values.length;

const isUuidV7 = (value: string) => uuidValidate(value) && uuidVersion(value) === 7;

const isValidPhotoObjectKey = ({
  objectKey,
  spaceId,
  uploadId,
}: Pick<CreatePostPhotoInput, "objectKey" | "uploadId"> & { spaceId: string }) =>
  ALLOWED_PHOTO_CONTENT_TYPES.some((contentType) => {
    const expectedObjectKey = getPhotoUploadObjectKey({
      contentType,
      spaceId,
      uploadId,
    });

    return objectKey === expectedObjectKey;
  });

const validatePhotos = (photos: CreatePostPhotoInput[], spaceId: string) => {
  if (
    hasDuplicate(photos.map((photo) => photo.objectKey)) ||
    hasDuplicate(photos.map((photo) => photo.uploadId)) ||
    hasDuplicate(photos.map((photo) => photo.sortOrder))
  ) {
    throw new BadRequestException("Invalid Photos");
  }

  if (
    !photos.every(
      (photo) => isUuidV7(photo.uploadId) && isValidPhotoObjectKey({ ...photo, spaceId }),
    )
  ) {
    throw new BadRequestException("Invalid Photos");
  }
};

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

    validatePhotos(body.photos, spaceId);

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
