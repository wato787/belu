import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, Settings, Users } from "lucide-react";

import { cx } from "../../../../utils/cx";
import { petsQueries } from "../../../pets/queries";
import { ProfileMenu } from "./ProfileMenu/ProfileMenu";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  spaceId: string;
  spaceName: string;
  user: {
    email: string;
    name?: string | null;
  };
};

export const Sidebar = ({ spaceId, spaceName, user }: SidebarProps) => {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { data: pets } = useSuspenseQuery(petsQueries.list(spaceId));
  const isPostsActive =
    pathname === `/spaces/${spaceId}` || pathname.startsWith(`/spaces/${spaceId}/posts`);
  const isPetsActive = pathname.startsWith(`/spaces/${spaceId}/pets`);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBody}>
        <div className={styles.spaceIdentity}>
          <button
            className={styles.spaceButton}
            onClick={() => navigate({ params: { spaceId }, to: "/spaces/$spaceId" })}
            type="button"
          >
            <h1 className={styles.spaceName}>{spaceName}</h1>
          </button>
        </div>

        <hr className={styles.divider} />

        <nav className={styles.navigation}>
          <button
            className={cx(styles.navItem, isPostsActive && styles.navItemActive)}
            onClick={() => navigate({ params: { spaceId }, to: "/spaces/$spaceId" })}
            type="button"
          >
            <Heart size={15} />
            <span>投稿</span>
          </button>

          <button
            className={cx(
              styles.navItem,
              styles.navItemSplit,
              isPetsActive && styles.navItemActive,
            )}
            onClick={() => navigate({ params: { spaceId }, to: "/spaces/$spaceId/pets" })}
            type="button"
          >
            <span className={styles.navItemLabel}>
              <span className={styles.petIcon}>🐾</span>
              <span>ペット管理</span>
            </span>
            {pets.length > 0 && (
              <span className={cx(styles.countBadge, isPetsActive && styles.countBadgeActive)}>
                {pets.length}
              </span>
            )}
          </button>

          <hr className={styles.divider} />

          <section className={styles.adminSection}>
            <h2 className={styles.adminTitle}>設定と管理</h2>
            <button
              className={styles.adminButton}
              onClick={() => navigate({ params: { spaceId }, to: "/spaces/$spaceId/members" })}
              type="button"
            >
              <span>メンバー・招待管理</span>
              <Users size={14} />
            </button>
            <button className={styles.adminButton} type="button">
              <span>スペース設定</span>
              <Settings size={14} />
            </button>
          </section>
        </nav>
      </div>

      <ProfileMenu email={user.email} name={user.name ?? "ユーザー"} />
    </aside>
  );
};
