import { Image, Plus, X } from "lucide-react";
import { useDropzone, type FileRejection } from "react-dropzone";

import { cx } from "../../../../utils/cx";
import { maxPostPhotoCount, maxPostPhotoFileSize } from "../constants";
import styles from "./PhotoPicker.module.css";

export type PhotoFile = {
  contentType: "image/heic" | "image/jpeg" | "image/png" | "image/webp";
  file: File;
  fileSize: number;
  id: string;
  previewUrl: string;
};

type PhotoPickerProps = {
  onAdd: (files: File[]) => void;
  onReject: (rejections: FileRejection[]) => void;
  onRemove: (id: string) => void;
  photos: PhotoFile[];
};

export const PhotoPicker = ({ onAdd, onReject, onRemove, photos }: PhotoPickerProps) => {
  const isMaxImagesReached = photos.length >= maxPostPhotoCount;
  const remainingFileCount = Math.max(maxPostPhotoCount - photos.length, 0);
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

  return (
    <section className={styles.section}>
      <div className={styles.labelRow}>
        <label className={styles.label}>
          <span>写真を追加</span>
          <span className={styles.required}>*</span>
          <span className={cx(styles.count, isMaxImagesReached && styles.countMax)}>
            {photos.length}/{maxPostPhotoCount}枚
          </span>
        </label>
        <span className={styles.format}>JPEG, PNG, WEBP, HEIC</span>
      </div>

      <div
        {...getRootProps({
          className: cx(
            styles.dropzone,
            isDragActive && styles.dropzoneActive,
            isMaxImagesReached && styles.dropzoneDisabled,
          ),
          onClick: handleOpen,
        })}
      >
        <input {...getInputProps({ className: styles.fileInput })} />
        <div className={styles.dropzoneIcon}>
          <Image size={20} />
        </div>
        <div className={styles.dropzoneText}>
          <p>
            {isMaxImagesReached
              ? "追加枚数の上限 (20枚) に達しました"
              : "クリックして写真を選択、またはドラッグ＆ドロップ"}
          </p>
          <span>1度に最大20枚までの写真をアップロードできます。</span>
        </div>
      </div>

      {photos.length > 0 && (
        <div className={styles.previewGrid}>
          {photos.map((photo) => (
            <div className={styles.preview} key={photo.id}>
              <img alt="" src={photo.previewUrl} />
              <button
                aria-label="写真を削除"
                className={styles.removeButton}
                onClick={() => onRemove(photo.id)}
                type="button"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {!isMaxImagesReached && (
            <button className={styles.addMoreButton} onClick={handleOpen} type="button">
              <Plus size={18} />
              <span>写真を追加</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
