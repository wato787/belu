import { Trash2, Users } from "lucide-react";

import { cx } from "../../../../utils/cx";
import { useDeleteMember } from "../../useDeleteMember";
import type { SpaceMember } from "../types";
import styles from "./MemberList.module.css";

type MemberListProps = {
  currentUserEmail: string;
  members: SpaceMember[];
  spaceId: string;
};

export const MemberList = ({ currentUserEmail, members, spaceId }: MemberListProps) => {
  const { deleteMember } = useDeleteMember(spaceId);

  const handleDeleteMember = (member: SpaceMember) => {
    const memberName = member.user?.name ?? member.user?.email ?? "メンバー";
    const confirmed = window.confirm(`${memberName} さんをスペースから削除してもよろしいですか？`);

    if (!confirmed) {
      return;
    }

    deleteMember(member.id);
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Users size={16} />
          <span>現在のメンバー一覧</span>
        </h2>
        <span className={styles.countBadge}>{members.length}人</span>
      </div>

      <div className={styles.list}>
        {members.map((member) => {
          const memberName = member.user?.name ?? "ユーザー";
          const memberEmail = member.user?.email ?? "";
          const isSelf = memberEmail.toLowerCase() === currentUserEmail.toLowerCase();
          const isOwner = member.role === "owner";

          return (
            <article className={styles.item} key={member.id}>
              <div className={styles.identity}>
                <div className={styles.avatar}>{getInitials(memberName)}</div>
                <div className={styles.text}>
                  <strong>
                    {memberName}
                    {isSelf && <span>あなた</span>}
                  </strong>
                  <small>{memberEmail}</small>
                </div>
              </div>

              <div className={styles.actions}>
                <span className={cx(styles.roleBadge, isOwner && styles.ownerBadge)}>
                  {isOwner ? "オーナー" : "メンバー"}
                </span>

                {!isOwner && !isSelf && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteMember(member)}
                    title="スペースから削除"
                    type="button"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

const getInitials = (name: string) => name.trim().slice(0, 2).toUpperCase() || "?";
