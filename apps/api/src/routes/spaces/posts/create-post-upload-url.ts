import { zValidator } from "@hono/zod-validator";
import { v7 as uuidv7 } from "uuid";
import { getConfig } from "../../../config";
import { createRoute } from "../../../helpers/create-route";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceMember } from "../../../middleware/space";
import { createStorage } from "../../../storage";
import { spaceIdParamSchema } from "../schema";
import { createPostUploadUrlSchema, POST_PHOTO_UPLOAD_URL_EXPIRES_IN_SECONDS } from "./schema";

const createPostUploadUrlRoute = createRoute().post(
  "/upload-url",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  requireSpaceMember,
  zValidator("json", createPostUploadUrlSchema),
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const { files } = c.req.valid("json");
    const config = getConfig(c.env);
    const storage = createStorage(config.storage);
    const uploads = await Promise.all(
      files.map(async (file) => {
        const uploadId = uuidv7();
        const objectKey = storage.getPhotoUploadObjectKey({
          contentType: file.contentType,
          spaceId,
          uploadId,
        });
        const { expiresAt, uploadUrl } = await storage.createSignedPhotoUploadUrl({
          contentType: file.contentType,
          expiresInSeconds: POST_PHOTO_UPLOAD_URL_EXPIRES_IN_SECONDS,
          key: objectKey,
        });

        return {
          expiresAt,
          objectKey,
          uploadId,
          uploadUrl,
        };
      }),
    );

    return c.json({ uploads });
  },
);

export { createPostUploadUrlRoute };
