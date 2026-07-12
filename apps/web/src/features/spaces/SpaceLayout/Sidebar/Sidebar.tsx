import { useNavigate } from "@tanstack/react-router";
import { Settings, Users } from "lucide-react";

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

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBody}>
        <div className={styles.spaceIdentity}>
          <h1 className={styles.spaceName}>{spaceName}</h1>
        </div>

        <hr className={styles.divider} />

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>ペット</h2>
          <div className={styles.petEmptyItem}>
            <div className={styles.petAvatar}>🐾</div>
            <div className={styles.petEmptyText}>
              <p>登録なし</p>
              <span>ペットを登録してタグ付け</span>
            </div>
          </div>
          <button
            className={styles.textAction}
            onClick={() => navigate({ params: { spaceId }, to: "/spaces/$spaceId/pets" })}
            type="button"
          >
            + ペットを追加
          </button>
        </section>

        <hr className={styles.divider} />

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>設定と管理</h2>
          <button
            className={styles.navButton}
            onClick={() => navigate({ params: { spaceId }, to: "/spaces/$spaceId/members" })}
            type="button"
          >
            <span>メンバー・招待管理</span>
            <Users size={14} />
          </button>
          <button className={styles.navButton} type="button">
            <span>スペース設定</span>
            <Settings size={14} />
          </button>
        </section>
      </div>

      <ProfileMenu email={user.email} name={user.name ?? "ユーザー"} />
    </aside>
  );
};
