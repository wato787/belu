import { Heart, Plus } from "lucide-react";

import { Button } from "../../../../components/Button/Button";
import styles from "./Main.module.css";

export const Main = () => (
  <main className={styles.main}>
    <div className={styles.feed}>
      <div className={styles.feedHeader}>
        <div className={styles.feedTitle}>
          <span />
          <h2>投稿</h2>
        </div>
        <Button className={styles.primaryAction}>
          <Plus size={16} />
          新規投稿
        </Button>
      </div>

      <section className={styles.postEmptyState}>
        <div className={styles.postEmptyIcon}>
          <Heart size={28} />
        </div>
        <h3>投稿がまだありません</h3>
        <p>写真やお知らせを投稿して、メンバーと大切な思い出を共有しましょう。</p>
        <Button className={styles.secondaryAction}>
          <Plus size={16} />
          最初の投稿を作成する
        </Button>
      </section>
    </div>
  </main>
);
