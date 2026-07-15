import { useSuspenseQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { invitesQueries } from "../../invites";
import { meQueries } from "../../me";
import { membersQueries } from "../queries";
import { InviteForm } from "./InviteForm/InviteForm";
import { InviteList } from "./InviteList/InviteList";
import { MemberList } from "./MemberList/MemberList";
import styles from "./SpaceMembers.module.css";

type SpaceMembersProps = {
  spaceId: string;
};

export const SpaceMembers = ({ spaceId }: SpaceMembersProps) => {
  const { data: user } = useSuspenseQuery(meQueries.current());
  const { data: members } = useSuspenseQuery(membersQueries.list(spaceId));
  const { data: invites } = useSuspenseQuery(invitesQueries.list(spaceId));

  if (!user) {
    return null;
  }

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Users className={styles.titleIcon} size={20} />
          <h1 className={styles.title}>メンバー・招待管理</h1>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.primaryColumn}>
          <InviteForm spaceId={spaceId} />
          <InviteList invites={invites} spaceId={spaceId} />
        </div>

        <aside className={styles.secondaryColumn}>
          <MemberList currentUserEmail={user.email} members={members} spaceId={spaceId} />
        </aside>
      </div>
    </main>
  );
};
