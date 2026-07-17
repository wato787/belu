import { validate as uuidValidate, version as uuidVersion } from "uuid";

import { BadRequestException } from "../../../helpers/exceptions";
import { ALLOWED_PHOTO_CONTENT_TYPES, getPhotoUploadObjectKey } from "../../../storage";

type PostPhotoInput = {
  objectKey: string;
  sortOrder: number;
  uploadId: string;
};

const hasDuplicate = (values: (number | string)[]) => new Set(values).size !== values.length;

const isUuidV7 = (value: string) => uuidValidate(value) && uuidVersion(value) === 7;

const isValidPhotoObjectKey = ({
  objectKey,
  spaceId,
  uploadId,
}: Pick<PostPhotoInput, "objectKey" | "uploadId"> & { spaceId: string }) =>
  ALLOWED_PHOTO_CONTENT_TYPES.some((contentType) => {
    const expectedObjectKey = getPhotoUploadObjectKey({
      contentType,
      spaceId,
      uploadId,
    });

    return objectKey === expectedObjectKey;
  });

export const validatePostPhotos = (photos: PostPhotoInput[], spaceId: string) => {
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
