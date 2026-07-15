import { Popover } from "@base-ui-components/react/popover";
import { Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react";
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
  const authorInitial = getAuthorInitial(post.author.name);

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
            <Photo photo={post.photos[0]} />
          ) : (
            <div className={styles.photoGrid}>
              {post.photos.slice(0, 4).map((photo, index) => (
                <div className={styles.photoGridItem} key={photo.id}>
                  <Photo photo={photo} />
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
    </article>
  );
};

const Photo = ({ photo }: { photo: PostCardPhoto | undefined }) => {
  if (photo?.url) {
    return <img alt="投稿写真" className={styles.photo} src={photo.url} />;
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
