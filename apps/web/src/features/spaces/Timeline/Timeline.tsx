import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "../../../components/Button/Button";
import { postsQueries, useDeletePost } from "../../posts";
import styles from "./Timeline.module.css";
import { PostCard } from "./PostCard/PostCard";

type TimelineProps = {
  spaceId: string;
};

export const Timeline = ({ spaceId }: TimelineProps) => {
  const navigate = useNavigate();
  const { data: posts } = useSuspenseQuery(postsQueries.list(spaceId));
  const { deletePost } = useDeletePost(spaceId);

  const handleCreatePostClick = () => {
    navigate({ params: { spaceId }, to: "/spaces/$spaceId/posts/new" });
  };

  const handleDeletePostClick = (postId: string) => {
    const confirmed = window.confirm("投稿を削除してもよろしいですか？");

    if (!confirmed) {
      return;
    }

    deletePost(postId);
  };

  const handleEditPostClick = (postId: string) => {
    navigate({ params: { postId, spaceId }, to: "/spaces/$spaceId/posts/$postId/edit" });
  };

  return (
    <main className={styles.main}>
      <div className={styles.feed}>
        <div className={styles.feedHeader}>
          <div className={styles.feedTitle}>
            <span />
            <h2>投稿</h2>
          </div>
          <Button className={styles.primaryAction} onClick={handleCreatePostClick}>
            <Plus size={16} />
            新規投稿
          </Button>
        </div>

        {posts.length === 0 ? (
          <section className={styles.postEmptyState}>
            <h3>投稿がまだありません</h3>
            <Button className={styles.secondaryAction} onClick={handleCreatePostClick}>
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
                onEdit={() => handleEditPostClick(post.id)}
                post={post}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
