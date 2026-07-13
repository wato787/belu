import type { AllowedPhotoContentType } from "./constants";

export type PhotoFile = {
  contentType: AllowedPhotoContentType;
  file: File;
  fileSize: number;
  id: string;
  previewUrl: string;
};
