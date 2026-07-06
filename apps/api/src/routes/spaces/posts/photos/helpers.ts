type CreatePhotoObjectKeyInput = {
  extension: string;
  photoId: string;
  postId: string;
  spaceId: string;
};

const extensionByContentType = new Map([
  ["image/gif", "gif"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export const createPhotoObjectKey = ({
  extension,
  photoId,
  postId,
  spaceId,
}: CreatePhotoObjectKeyInput) => {
  const normalizedExtension = extension.replace(/^\./, "").toLowerCase();

  return `spaces/${spaceId}/posts/${postId}/photos/${photoId}.${normalizedExtension}`;
};

export const getPhotoExtension = (file: File) => {
  const filenameExtension = file.name.split(".").pop()?.toLowerCase();

  return filenameExtension ?? extensionByContentType.get(file.type) ?? "bin";
};
