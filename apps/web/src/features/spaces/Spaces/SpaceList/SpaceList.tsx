import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, FolderHeart, Plus } from "lucide-react";

import { Button } from "../../../../components/Button/Button";
import { spacesQueries } from "../../queries";
import styles from "./SpaceList.module.css";

type SpaceListProps = {
  onCreateClick: () => void;
};

export const SpaceList = ({ onCreateClick }: SpaceListProps) => {
  const navigate = useNavigate();
  const { data: spacesData } = useSuspenseQuery(spacesQueries.list());
  const spaces = spacesData?.spaces ?? [];

  if (spaces.length === 0) {
    return (
      <main className={styles.listPage}>
        <SpaceListHeader />

        <div className={styles.stateCard}>
          <div className={styles.stateIcon}>
            <FolderHeart size={32} />
          </div>
          <h2 className={styles.stateTitle}>スペースがありません</h2>
          <p className={styles.stateDescription}>
            現在、参加している共有スペースはありません。新しいスペースを作成して、思い出を記録しましょう。
          </p>
          <Button className={styles.emptyCreateButton} onClick={onCreateClick}>
            <Plus size={18} />
            最初のスペースを作成する
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.listPage}>
      <SpaceListHeader action={<CreateSpaceButton onClick={onCreateClick} />} />

      <div className={styles.spaceList}>
        {spaces.map((space) => (
          <button
            className={styles.spaceCard}
            key={space.id}
            onClick={() =>
              navigate({
                params: { spaceId: space.id },
                to: "/spaces/$spaceId",
              })
            }
            type="button"
          >
            <span className={styles.spaceName}>{space.name}</span>
            <span className={styles.spaceAction}>
              <span>開く</span>
              <ArrowRight size={18} />
            </span>
          </button>
        ))}
      </div>
    </main>
  );
};

type SpaceListHeaderProps = {
  action?: ReactNode;
};

const SpaceListHeader = ({ action }: SpaceListHeaderProps) => (
  <header className={styles.listHeader}>
    <div>
      <h1 className={styles.listTitle}>スペースを選択</h1>
      <p className={styles.listDescription}>共有スペースを選択して開くか、新規作成してください。</p>
    </div>

    {action}
  </header>
);

type CreateSpaceButtonProps = {
  onClick: () => void;
};

const CreateSpaceButton = ({ onClick }: CreateSpaceButtonProps) => (
  <Button className={styles.createButton} onClick={onClick}>
    <Plus size={16} />
    新規作成
  </Button>
);
