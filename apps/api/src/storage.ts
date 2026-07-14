import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { R2Bucket } from "@cloudflare/workers-types";

type StorageObjectBody = Parameters<R2Bucket["put"]>[1];

const R2_REGION = "auto";

export const ALLOWED_PHOTO_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
] as const;

export type PhotoContentType = (typeof ALLOWED_PHOTO_CONTENT_TYPES)[number];

const photoContentTypeExtensions = {
  "image/heic": "heic",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} satisfies Record<PhotoContentType, string>;

type StorageConfig = {
  photosBucket: R2Bucket;
  photosPublicBaseUrl: string | undefined;
  r2AccountId: string | undefined;
  r2AccessKeyId: string | undefined;
  r2BucketName: string | undefined;
  r2SecretAccessKey: string | undefined;
};

type UploadPhotoInput = {
  body: StorageObjectBody;
  contentType: string;
  key: string;
};

type DeletePhotoInput = {
  key: string;
};

type GetPublicUrlInput = {
  key: string;
};

type HasPhotoInput = {
  key: string;
};

type GetPhotoUploadObjectKeyInput = {
  contentType: PhotoContentType;
  spaceId: string;
  uploadId: string;
};

type CreateSignedPhotoUploadUrlInput = {
  contentType: PhotoContentType;
  expiresInSeconds: number;
  key: string;
  now?: Date;
};

type CreateSignedPhotoUploadUrlOutput = {
  expiresAt: string;
  uploadUrl: string;
};

export type Storage = {
  createSignedPhotoUploadUrl: (
    input: CreateSignedPhotoUploadUrlInput,
  ) => Promise<CreateSignedPhotoUploadUrlOutput>;
  deletePhoto: (input: DeletePhotoInput) => Promise<void>;
  getPhotoUploadObjectKey: (input: GetPhotoUploadObjectKeyInput) => string;
  getPublicUrl: (input: GetPublicUrlInput) => string | null;
  hasPhoto: (input: HasPhotoInput) => Promise<boolean>;
  uploadPhoto: (input: UploadPhotoInput) => Promise<{ key: string }>;
};

const getRequiredR2SigningConfig = (config: StorageConfig) => {
  const { r2AccessKeyId, r2AccountId, r2BucketName, r2SecretAccessKey } = config;
  const missingKeys = [
    !r2AccountId && "R2_ACCOUNT_ID",
    !r2AccessKeyId && "R2_ACCESS_KEY_ID",
    !r2BucketName && "R2_BUCKET_NAME",
    !r2SecretAccessKey && "R2_SECRET_ACCESS_KEY",
  ].filter((key) => typeof key === "string");

  if (missingKeys.length > 0) {
    throw new Error(`R2 signing configuration is missing: ${missingKeys.join(", ")}`);
  }

  return {
    accountId: r2AccountId as string,
    accessKeyId: r2AccessKeyId as string,
    bucketName: r2BucketName as string,
    secretAccessKey: r2SecretAccessKey as string,
  };
};

const createR2S3Client = ({
  accountId,
  accessKeyId,
  secretAccessKey,
}: ReturnType<typeof getRequiredR2SigningConfig>) =>
  new S3Client({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    region: R2_REGION,
  });

export const getPhotoContentTypeExtension = (contentType: PhotoContentType) =>
  photoContentTypeExtensions[contentType];

export const getPhotoUploadObjectKey = ({
  contentType,
  spaceId,
  uploadId,
}: GetPhotoUploadObjectKeyInput) => {
  const extension = getPhotoContentTypeExtension(contentType);

  return `spaces/${spaceId}/posts/uploads/${uploadId}.${extension}`;
};

export const createStorage = (config: StorageConfig): Storage => ({
  createSignedPhotoUploadUrl: async ({ contentType, expiresInSeconds, key, now = new Date() }) => {
    const signingConfig = getRequiredR2SigningConfig(config);

    return {
      expiresAt: new Date(now.getTime() + expiresInSeconds * 1000).toISOString(),
      uploadUrl: await getSignedUrl(
        createR2S3Client(signingConfig),
        new PutObjectCommand({
          Bucket: signingConfig.bucketName,
          ContentType: contentType,
          Key: key,
        }),
        { expiresIn: expiresInSeconds },
      ),
    };
  },

  deletePhoto: async ({ key }) => {
    await config.photosBucket.delete(key);
  },

  getPhotoUploadObjectKey: ({ contentType, spaceId, uploadId }) => {
    return getPhotoUploadObjectKey({ contentType, spaceId, uploadId });
  },

  getPublicUrl: ({ key }) => {
    if (!config.photosPublicBaseUrl) {
      return null;
    }

    return `${config.photosPublicBaseUrl.replace(/\/$/, "")}/${key}`;
  },

  hasPhoto: async ({ key }) => {
    const object = await config.photosBucket.head(key);

    return object !== null;
  },

  uploadPhoto: async ({ body, contentType, key }) => {
    await config.photosBucket.put(key, body, {
      httpMetadata: {
        contentType,
      },
    });

    return { key };
  },
});
