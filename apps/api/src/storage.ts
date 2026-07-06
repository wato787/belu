type StorageObjectBody = Parameters<R2Bucket["put"]>[1];

type StorageConfig = {
  photosBucket: R2Bucket;
  photosPublicBaseUrl?: string;
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

export type Storage = {
  deletePhoto: (input: DeletePhotoInput) => Promise<void>;
  getPublicUrl: (input: GetPublicUrlInput) => string | null;
  uploadPhoto: (input: UploadPhotoInput) => Promise<{ key: string }>;
};

export const createStorage = ({ photosBucket, photosPublicBaseUrl }: StorageConfig): Storage => ({
  deletePhoto: async ({ key }) => {
    await photosBucket.delete(key);
  },

  getPublicUrl: ({ key }) => {
    if (!photosPublicBaseUrl) {
      return null;
    }

    return `${photosPublicBaseUrl.replace(/\/$/, "")}/${key}`;
  },

  uploadPhoto: async ({ body, contentType, key }) => {
    await photosBucket.put(key, body, {
      httpMetadata: {
        contentType,
      },
    });

    return { key };
  },
});
