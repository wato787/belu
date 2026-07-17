import { Image, Plus, X } from "lucide-react";
import { useDropzone, type FileRejection } from "react-dropzone";

import { cx } from "../../../../utils/cx";
import { maxPostPhotoCount, maxPostPhotoFileSize } from "../../CreatePost/constants";
import type { PhotoFile } from "../../CreatePost/types";
import styles from "./EditPhotos.module.css";

export type ExistingEditablePhoto = {
  id: string;
  objectKey: string;
  sortOrder: number;
  uploadId: string;
  url: string | null;
};

type EditPhotosProps = {
  existingPhotos: ExistingEditablePhoto[];
  newPhotos: PhotoFile[];
  onAdd: (files: File[]) => void;
  onReject: (rejections: FileRejection[]) => void;
  onRemoveExisting: (id: string) => void;
  onRemoveNew: (id: string) => void;
};

export const EditPhotos = ({
  existingPhotos,
  newPhotos,
  onAdd,
  onReject,
  onRemoveExisting,
  onRemoveNew,
}: EditPhotosProps) => {
  const photoCount = existingPhotos.length + newPhotos.length;
  const isMaxImagesReached = photoCount >= maxPostPhotoCount;
  const remainingFileCount = Math.max(maxPostPhotoCount - photoCount, 0);
  const photoItems = [
    ...existingPhotos.map((photo) => ({
      id: photo.id,
      onRemove: () => onRemoveExisting(photo.id),
      src: photo.url,
    })),
    ...newPhotos.map((photo) => ({
      id: photo.id,
      onRemove: () => onRemoveNew(photo.id),
      src: photo.previewUrl,
    })),
  ];
  const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
    accept: {
      "image/heic": [".heic"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    disabled: isMaxImagesReached,
    maxFiles: remainingFileCount,
    maxSize: maxPostPhotoFileSize,
    multiple: true,
    noClick: true,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        onReject(fileRejections);
      }

      if (acceptedFiles.length > 0) {
        onAdd(acceptedFiles);
      }
    },
  });

  const handleOpen = () => {
    if (!isMaxImagesReached) {
      open();
    }
  };
  const dropzoneProps = getRootProps({
    className: cx(
      styles.dropzone,
      photoCount === 0 && styles.dropzoneEmpty,
      isDragActive && styles.dropzoneActive,
    ),
    onClick: handleOpen,
  });

  return (
    <section className={styles.section}>
      <div className={styles.labelRow}>
        <label className={styles.label}>
          <span>写真</span>
          <span className={styles.required}>*</span>
          <span className={cx(styles.count, isMaxImagesReached && styles.countMax)}>
            {photoCount}/{maxPostPhotoCount}枚
          </span>
        </label>
        <span className={styles.format}>JPEG, PNG, WEBP, HEIC</span>
      </div>

      <div {...dropzoneProps}>
        <input {...getInputProps({ className: styles.fileInput })} />

        {photoCount === 0 ? (
          <EmptyDropzoneContent />
        ) : (
          <>
            {photoItems.map((photo) => (
              <PhotoPreview key={photo.id} onRemove={photo.onRemove} src={photo.src} />
            ))}

            {!isMaxImagesReached && (
              <button className={styles.addPhotoButton} onClick={handleOpen} type="button">
                <Plus size={18} />
                <span>写真を追加</span>
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const EmptyDropzoneContent = () => (
  <>
    <div className={styles.emptyDropzoneIcon}>
      <Image size={20} />
    </div>
    <div className={styles.emptyDropzoneText}>
      <p>クリックして写真を選択、またはドラッグ＆ドロップ</p>
      <span>1度に最大20枚までの写真をアップロードできます。</span>
    </div>
  </>
);

type PhotoPreviewProps = {
  onRemove: () => void;
  src: string | null;
};

const PhotoPreview = ({ onRemove, src }: PhotoPreviewProps) => (
  <div className={styles.preview}>
    {src ? (
      <img alt="" src={src} />
    ) : (
      <div className={styles.placeholder}>
        <Image size={18} />
        <span>写真</span>
      </div>
    )}
    <button
      aria-label="写真を削除"
      className={styles.removeButton}
      onClick={onRemove}
      type="button"
    >
      <X size={12} />
    </button>
  </div>
);
