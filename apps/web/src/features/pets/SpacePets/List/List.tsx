import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Button } from "../../../../components/Button/Button";
import { petsQueries } from "../../queries";
import { Card } from "../Card/Card";
import type { Pet } from "../types";
import styles from "./List.module.css";

type ListProps = {
  onAddClick: () => void;
  onDeleteClick: (pet: Pet) => void;
  onEditClick: (pet: Pet) => void;
  spaceId: string;
};

export const List = ({ onAddClick, onDeleteClick, onEditClick, spaceId }: ListProps) => {
  const { data: pets } = useSuspenseQuery(petsQueries.list(spaceId));

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>ペット</h1>
            <p className={styles.description}>スペースで記録するペットを管理します。</p>
          </div>

          {pets.length > 0 && (
            <Button className={styles.headerAction} onClick={onAddClick}>
              <Plus size={14} />
              ペットを追加
            </Button>
          )}
        </header>

        {pets.length === 0 ? (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon}>🐾</div>
            <h2>ペットがまだ登録されていません</h2>
            <p>投稿にタグ付けするペットを追加しましょう。</p>
            <Button className={styles.emptyAction} onClick={onAddClick}>
              <Plus size={16} />
              最初のペットを追加
            </Button>
          </section>
        ) : (
          <div className={styles.grid}>
            {pets.map((pet) => (
              <Card
                key={pet.id}
                onDelete={() => onDeleteClick(pet)}
                onEdit={() => onEditClick(pet)}
                pet={pet}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
