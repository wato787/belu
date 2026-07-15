import { cx } from "../../../../utils/cx";
import styles from "./StatusBadge.module.css";

type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === "pending") {
    return (
      <span className={cx(styles.badge, styles.pending)}>
        <span className={styles.dot} />
        招待中
      </span>
    );
  }

  if (status === "accepted") {
    return <span className={cx(styles.badge, styles.accepted)}>参加済み</span>;
  }

  if (status === "rejected") {
    return <span className={cx(styles.badge, styles.rejected)}>辞退</span>;
  }

  if (status === "canceled") {
    return <span className={cx(styles.badge, styles.canceled)}>キャンセル済</span>;
  }

  return <span className={cx(styles.badge, styles.canceled)}>{status}</span>;
};
