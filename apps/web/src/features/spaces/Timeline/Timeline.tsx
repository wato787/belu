import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../../components/Button/Button";
import { postsQueries, useDeletePost } from "../../posts";
import styles from "./Timeline.module.css";
import { PostCard } from "./PostCard/PostCard";

type TimelineProps = {
  spaceId: string;
};

const notifyCreatePostUnavailable = () => {
  toast.info("投稿作成画面はまだ利用できません。");
};

const notifyEditPostUnavailable = () => {
  toast.info("投稿編集はまだ利用できません。");
};

export const Timeline = ({ spaceId }: TimelineProps) => {
  const { data: posts } = useSuspenseQuery(postsQueries.list(spaceId));
  const { deletePost } = useDeletePost(spaceId);

  const handleDeletePostClick = (postId: string) => {
    const confirmed = window.confirm("投稿を削除してもよろしいですか？");

    if (!confirmed) {
      return;
    }

    deletePost(postId);
  };

  return (
    <main className={styles.main}>
      <div className={styles.feed}>
        <div className={styles.feedHeader}>
          <div className={styles.feedTitle}>
            <span />
            <h2>投稿</h2>
          </div>
          <Button className={styles.primaryAction} onClick={notifyCreatePostUnavailable}>
            <Plus size={16} />
            新規投稿
          </Button>
        </div>

        {posts.length === 0 ? (
          <section className={styles.postEmptyState}>
            <div className={styles.postEmptyIcon}>📭</div>
            <h3>投稿がまだありません</h3>
            <p>写真やお知らせを投稿して、メンバーと大切な思い出を共有しましょう。</p>
            <Button className={styles.secondaryAction} onClick={notifyCreatePostUnavailable}>
              <Plus size={16} />
              最初の投稿を作成する
            </Button>
          </section>
        ) : (
          <div className={styles.postGrid}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                onDelete={() => handleDeletePostClick(post.id)}
                onEdit={notifyEditPostUnavailable}
                post={post}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
