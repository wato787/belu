import { useSuspenseQuery } from "@tanstack/react-query";

import { Logo } from "../../../components/Logo/Logo";
import { meQueries } from "../../me/queries";
import { invitesQueries } from "../queries";
import { EmailMismatchWarning } from "./EmailMismatchWarning/EmailMismatchWarning";
import { InviteActions } from "./InviteActions/InviteActions";
import { InviteInfoList } from "./InviteInfoList/InviteInfoList";
import { InviteStatusHeader } from "./InviteStatusHeader/InviteStatusHeader";
import { InvalidInviteCard } from "./InvalidInviteCard/InvalidInviteCard";
import styles from "./InviteDetail.module.css";

type InviteDetailProps = {
  inviteId: string;
};

export const InviteDetail = ({ inviteId }: InviteDetailProps) => {
  const { data: invite } = useSuspenseQuery(invitesQueries.detail(inviteId));
  const { data: user } = useSuspenseQuery(meQueries.current());
  const status = getInviteStatus({ expiresAt: invite.expiresAt, status: invite.status });
  const hasEmailMismatch =
    status === "pending" && user.email.toLowerCase() !== invite.email.toLowerCase();

  if (status === "invalid") {
    return (
      <main className={styles.page}>
        <div className={styles.content}>
          <Logo />
          <InvalidInviteCard />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Logo />

        <section className={styles.card}>
          <InviteStatusHeader spaceName={invite.spaceName} status={status} />

          {hasEmailMismatch && (
            <EmailMismatchWarning inviteEmail={invite.email} userEmail={user.email} />
          )}

          <InviteInfoList invite={invite} />

          <InviteActions inviteId={invite.id} spaceId={invite.spaceId} status={status} />
        </section>
      </div>
    </main>
  );
};

type InviteStatus = "accepted" | "invalid" | "pending" | "rejected";

const getInviteStatus = ({
  expiresAt,
  status,
}: {
  expiresAt: Date | string;
  status: string;
}): InviteStatus => {
  if (new Date(expiresAt) < new Date() || status === "canceled") {
    return "invalid";
  }

  if (status === "accepted" || status === "rejected") {
    return status;
  }

  return "pending";
};
