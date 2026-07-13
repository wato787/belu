export const allowedPhotoContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
] as const;

export const maxPostPhotoCount = 20;
export const maxPostPhotoFileSize = 10 * 1024 * 1024;

export type AllowedPhotoContentType = (typeof allowedPhotoContentTypes)[number];
