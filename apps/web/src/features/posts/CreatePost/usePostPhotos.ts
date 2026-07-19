import { useEffect, useRef, useState } from "react";
import type { FileRejection } from "react-dropzone";

import {
  allowedPhotoContentTypes,
  maxPostPhotoCount,
  maxPostPhotoFileSize,
  type AllowedPhotoContentType,
} from "./constants";
import type { PhotoFile } from "./types";

const createPhotoId = () => `photo-${Date.now()}-${crypto.randomUUID()}`;

const isAllowedContentType = (value: string): value is AllowedPhotoContentType =>
  allowedPhotoContentTypes.some((contentType) => contentType === value);

const getFileContentType = (file: File): AllowedPhotoContentType | null => {
  if (isAllowedContentType(file.type)) {
    return file.type;
  }

  if (file.name.toLowerCase().endsWith(".heic")) {
    return "image/heic";
  }

  return null;
};

const revokePhotoPreviewUrl = (photo: PhotoFile) => {
  URL.revokeObjectURL(photo.previewUrl);
};

type UsePostPhotosOptions = {
  maxPhotoCount?: number;
};

export const usePostPhotos = ({ maxPhotoCount = maxPostPhotoCount }: UsePostPhotosOptions = {}) => {
  const photosRef = useRef<PhotoFile[]>([]);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [photoErrorMessage, setPhotoErrorMessage] = useState<string | null>(null);

  const updatePhotos = (
    nextPhotos: PhotoFile[] | ((currentPhotos: PhotoFile[]) => PhotoFile[]),
  ) => {
    const resolvedPhotos =
      typeof nextPhotos === "function" ? nextPhotos(photosRef.current) : nextPhotos;

    photosRef.current = resolvedPhotos;
    setPhotos(resolvedPhotos);
  };

  const addPhotos = (files: File[]) => {
    setPhotoErrorMessage(null);

    if (photosRef.current.length + files.length > maxPhotoCount) {
      setPhotoErrorMessage("写真は最大20枚まで登録可能です。");
      return;
    }

    const nextPhotos: PhotoFile[] = [];

    for (const file of files) {
      const contentType = getFileContentType(file);

      if (!contentType) {
        setPhotoErrorMessage(`対応していないファイル形式が含まれています: ${file.name}`);
        continue;
      }

      if (file.size > maxPostPhotoFileSize) {
        setPhotoErrorMessage(`ファイルサイズが大きすぎます (最大10MB): ${file.name}`);
        continue;
      }

      nextPhotos.push({
        contentType,
        file,
        fileSize: file.size,
        id: createPhotoId(),
        previewUrl: URL.createObjectURL(file),
      });
    }

    updatePhotos((currentPhotos) => [...currentPhotos, ...nextPhotos]);
  };

  const rejectPhotos = (rejections: FileRejection[]) => {
    const firstRejection = rejections[0];
    const firstError = firstRejection?.errors[0];

    if (!firstRejection || !firstError) {
      return;
    }

    if (firstError.code === "file-too-large") {
      setPhotoErrorMessage(`ファイルサイズが大きすぎます (最大10MB): ${firstRejection.file.name}`);
      return;
    }

    if (firstError.code === "too-many-files") {
      setPhotoErrorMessage("写真は最大20枚まで登録可能です。");
      return;
    }

    setPhotoErrorMessage(`対応していないファイル形式が含まれています: ${firstRejection.file.name}`);
  };

  const removePhoto = (id: string) => {
    const photo = photosRef.current.find((currentPhoto) => currentPhoto.id === id);

    if (photo) {
      revokePhotoPreviewUrl(photo);
    }

    updatePhotos((currentPhotos) => currentPhotos.filter((currentPhoto) => currentPhoto.id !== id));
    setPhotoErrorMessage(null);
  };

  const clearPhotoError = () => {
    setPhotoErrorMessage(null);
  };

  useEffect(
    () => () => {
      photosRef.current.forEach(revokePhotoPreviewUrl);
    },
    [],
  );

  return {
    addPhotos,
    clearPhotoError,
    photoErrorMessage,
    photos,
    rejectPhotos,
    removePhoto,
  };
};
