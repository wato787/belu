import { Image } from "lucide-react";

import styles from "./ExistingPhotos.module.css";

type ExistingPhoto = {
  id: string;
  objectKey: string;
  sortOrder: number;
  url: string | null;
};

type ExistingPhotosProps = {
  photos: ExistingPhoto[];
};

export const ExistingPhotos = ({ photos }: ExistingPhotosProps) => {
  const sortedPhotos = sortPhotosByOrder(photos);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>写真</h2>
        <span>{photos.length}枚</span>
      </div>

      <div className={styles.grid}>
        {sortedPhotos.map((photo) => (
          <div className={styles.item} key={photo.id}>
            {photo.url ? (
              <img alt="投稿写真" src={photo.url} />
            ) : (
              <div className={styles.placeholder}>
                <Image size={18} />
                <span>写真</span>
                <small>{photo.objectKey}</small>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const sortPhotosByOrder = (photos: ExistingPhoto[]) =>
  photos.reduce<ExistingPhoto[]>((sortedPhotos, photo) => {
    const insertIndex = sortedPhotos.findIndex(
      (sortedPhoto) => photo.sortOrder < sortedPhoto.sortOrder,
    );

    if (insertIndex === -1) {
      return [...sortedPhotos, photo];
    }

    return [...sortedPhotos.slice(0, insertIndex), photo, ...sortedPhotos.slice(insertIndex)];
  }, []);
