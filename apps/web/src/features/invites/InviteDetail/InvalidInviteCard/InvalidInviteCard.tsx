import { AlertTriangle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "../../../../components/Button/Button";
import styles from "./InvalidInviteCard.module.css";

export const InvalidInviteCard = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    void navigate({ to: "/spaces" });
  };

  return (
    <section className={styles.card}>
      <div className={styles.icon}>
        <AlertTriangle size={24} />
      </div>
      <h1 className={styles.title}>この招待リンクは無効です</h1>
      <p className={styles.description}>
        この招待は期限が切れているか、キャンセルされたため利用できません。新しい招待リンクを発行してもらってください。
      </p>
      <Button fullWidth onClick={handleNavigateHome}>
        ホームに戻る
      </Button>
    </section>
  );
};
