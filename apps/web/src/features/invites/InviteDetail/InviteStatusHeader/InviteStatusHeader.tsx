import { CheckCircle, Heart, XCircle } from "lucide-react";

import styles from "./InviteStatusHeader.module.css";

type InviteStatusHeaderProps = {
  spaceName: string | undefined;
  status: "accepted" | "pending" | "rejected";
};

export const InviteStatusHeader = ({ spaceName, status }: InviteStatusHeaderProps) => {
  if (status === "accepted") {
    return (
      <header className={styles.header}>
        <div className={styles.successIcon}>
          <CheckCircle size={24} />
        </div>
        <h1 className={styles.title}>参加済みです</h1>
        <p className={styles.description}>すでにこのスペースのメンバーとして登録されています。</p>
      </header>
    );
  }

  if (status === "rejected") {
    return (
      <header className={styles.header}>
        <div className={styles.dangerIcon}>
          <XCircle size={24} />
        </div>
        <h1 className={styles.title}>招待を辞退しました</h1>
        <p className={styles.description}>この招待は辞退されています。</p>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.primaryIcon}>
        <Heart size={24} />
      </div>
      <h1 className={styles.title}>{spaceName ?? "共有スペース"}</h1>
      <p className={styles.description}>上記のスペースに招待されています</p>
    </header>
  );
};
