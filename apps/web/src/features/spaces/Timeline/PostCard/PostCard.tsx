import { Dialog } from "@base-ui-components/react/dialog";
import { Popover } from "@base-ui-components/react/popover";
import { Calendar, ChevronLeft, ChevronRight, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

import styles from "./PostCard.module.css";

type PostCardPet = {
  id: string;
  name: string;
};

type PostCardPhoto = {
  id: string;
  objectKey: string;
  sortOrder: number;
  url: string | null;
};

type PostCardPost = {
  author: {
    image: string | null;
    name: string;
  };
  body: string;
  createdAt: string;
  id: string;
  pets: PostCardPet[];
  photos: PostCardPhoto[];
};

type PostCardProps = {
  onDelete: () => void;
  onEdit: () => void;
  post: PostCardPost;
};

export const PostCard = ({ onDelete, onEdit, post }: PostCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const authorInitial = getAuthorInitial(post.author.name);
  const viewablePhotos = post.photos.filter((photo) => photo.url);
  const selectedPhoto =
    selectedPhotoIndex === null ? undefined : viewablePhotos.at(selectedPhotoIndex);
  const hasMultiplePhotos = viewablePhotos.length > 1;
  const closePhotoViewer = () => setSelectedPhotoIndex(null);
  const showPreviousPhoto = () => {
    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return (currentIndex + viewablePhotos.length - 1) % viewablePhotos.length;
    });
  };
  const showNextPhoto = () => {
    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return (currentIndex + 1) % viewablePhotos.length;
    });
  };
  const openPhotoViewer = (photo: PostCardPhoto | undefined) => {
    if (!photo?.url) {
      return;
    }

    const photoIndex = viewablePhotos.findIndex((viewablePhoto) => viewablePhoto.id === photo.id);

    if (photoIndex >= 0) {
      setSelectedPhotoIndex(photoIndex);
    }
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.author}>
          <div className={styles.avatar}>{authorInitial}</div>
          <div className={styles.authorText}>
            <span>{post.author.name}</span>
            <small>
              <Calendar size={11} />
              {formatPostDate(post.createdAt)}
            </small>
          </div>
        </div>

        <Popover.Root onOpenChange={setIsOpen} open={isOpen}>
          <Popover.Trigger className={() => styles.menuTrigger} title="操作メニュー">
            <MoreVertical size={16} />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner align="end" className={() => styles.menuPositioner} side="bottom">
              <Popover.Popup className={() => styles.menu}>
                <Popover.Close className={() => styles.menuItem} onClick={onEdit}>
                  <Pencil size={13} />
                  <span>編集する</span>
                </Popover.Close>
                <Popover.Close className={() => styles.menuItemDanger} onClick={onDelete}>
                  <Trash2 size={13} />
                  <span>削除する</span>
                </Popover.Close>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </header>

      {post.photos.length > 0 && (
        <div className={styles.photos}>
          {post.photos.length === 1 ? (
            <Photo onClick={() => openPhotoViewer(post.photos[0])} photo={post.photos[0]} />
          ) : (
            <div className={styles.photoGrid}>
              {post.photos.slice(0, 4).map((photo, index) => (
                <div className={styles.photoGridItem} key={photo.id}>
                  <Photo onClick={() => openPhotoViewer(photo)} photo={photo} />
                  {index === 3 && post.photos.length > 4 && (
                    <div className={styles.photoOverlay}>+{post.photos.length - 4}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.content}>
        {post.body && <p className={styles.body}>{post.body}</p>}

        {post.pets.length > 0 && (
          <div className={styles.petTags}>
            {post.pets.map((pet) => (
              <span className={styles.petTag} key={pet.id}>
                <span>🐾</span>
                <span>{pet.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <Dialog.Root
        onOpenChange={(open) => !open && closePhotoViewer()}
        open={selectedPhotoIndex !== null}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className={() => styles.photoViewerBackdrop} />
          <Dialog.Popup className={() => styles.photoViewer}>
            <Dialog.Title className={() => styles.photoViewerTitle}>投稿写真</Dialog.Title>
            <Dialog.Close className={() => styles.photoViewerClose} title="閉じる">
              <X size={22} />
            </Dialog.Close>

            {hasMultiplePhotos && (
              <button
                className={styles.photoViewerPrevious}
                onClick={showPreviousPhoto}
                title="前の写真"
                type="button"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {selectedPhoto?.url && (
              <img
                alt={`投稿写真 ${selectedPhotoIndex === null ? "" : selectedPhotoIndex + 1}`}
                className={styles.photoViewerImage}
                src={selectedPhoto.url}
              />
            )}

            {hasMultiplePhotos && (
              <button
                className={styles.photoViewerNext}
                onClick={showNextPhoto}
                title="次の写真"
                type="button"
              >
                <ChevronRight size={28} />
              </button>
            )}

            {hasMultiplePhotos && selectedPhotoIndex !== null && (
              <div className={styles.photoViewerCount}>
                {selectedPhotoIndex + 1} / {viewablePhotos.length}
              </div>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </article>
  );
};

const Photo = ({ onClick, photo }: { onClick: () => void; photo: PostCardPhoto | undefined }) => {
  if (photo?.url) {
    return (
      <button className={styles.photoTrigger} onClick={onClick} title="写真を拡大" type="button">
        <img alt="投稿写真" className={styles.photo} src={photo.url} />
      </button>
    );
  }

  return (
    <div className={styles.photoPlaceholder}>
      <span>写真</span>
      <small>{photo?.objectKey ?? ""}</small>
    </div>
  );
};

const getAuthorInitial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

const formatPostDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${String(
    date.getHours(),
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};
