import { Popover } from "@base-ui-components/react/popover";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import type { Pet } from "../types";
import styles from "./Card.module.css";

type CardProps = {
  onDelete: () => void;
  onEdit: () => void;
  pet: Pet;
};

export const Card = ({ onDelete, onEdit, pet }: CardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.petAvatar}>🐾</div>
        <div className={styles.petText}>
          <h2>{pet.name}</h2>
          <p>作成日 {formatDate(pet.createdAt)}</p>
        </div>
      </div>

      <Popover.Root onOpenChange={setIsOpen} open={isOpen}>
        <Popover.Trigger className={() => styles.menuTrigger} title="操作">
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
    </article>
  );
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};
