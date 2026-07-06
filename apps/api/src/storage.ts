type StorageObjectBody = Parameters<R2Bucket["put"]>[1];

type UploadStorageObjectInput = {
  body: StorageObjectBody;
  contentType: string;
  key: string;
};

type CreatePhotoObjectKeyInput = {
  extension: string;
  photoId: string;
  postId: string;
  spaceId: string;
};

export const createPhotoObjectKey = ({
  extension,
  photoId,
  postId,
  spaceId,
}: CreatePhotoObjectKeyInput) => {
  const normalizedExtension = extension.replace(/^\./, "").toLowerCase();

  return `spaces/${spaceId}/posts/${postId}/photos/${photoId}.${normalizedExtension}`;
};

export const uploadStorageObject = async (
  bucket: R2Bucket,
  { body, contentType, key }: UploadStorageObjectInput,
) =>
  bucket.put(key, body, {
    httpMetadata: {
      contentType,
    },
  });
