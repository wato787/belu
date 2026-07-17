import { ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "../../../../components/Button/Button";
import { useAcceptInvite } from "../../useAcceptInvite";
import { useRejectInvite } from "../../useRejectInvite";
import styles from "./InviteActions.module.css";

type InviteActionsProps = {
  inviteId: string;
  spaceId: string;
  status: "accepted" | "pending" | "rejected";
};

export const InviteActions = ({ inviteId, spaceId, status }: InviteActionsProps) => {
  const navigate = useNavigate();
  const { acceptInvite, isPending: isAccepting } = useAcceptInvite();
  const { isPending: isRejecting, rejectInvite } = useRejectInvite();
  const isActionPending = isAccepting || isRejecting;

  const handleAccept = () => {
    acceptInvite(inviteId);
  };

  const handleReject = () => {
    rejectInvite(inviteId);
  };

  const handleNavigateHome = () => {
    void navigate({ to: "/spaces" });
  };

  const handleOpenSpace = () => {
    void navigate({
      params: { spaceId },
      to: "/spaces/$spaceId",
    });
  };

  if (status === "accepted") {
    return (
      <Button fullWidth onClick={handleOpenSpace}>
        <span>スペースを開く</span>
        <ArrowRight size={16} />
      </Button>
    );
  }

  if (status === "rejected") {
    return (
      <Button className={styles.secondaryButton} fullWidth onClick={handleNavigateHome}>
        ホームに戻る
      </Button>
    );
  }

  return (
    <div className={styles.actions}>
      <Button fullWidth isLoading={isAccepting} onClick={handleAccept}>
        <span>招待を受け入れる</span>
        <ArrowRight size={16} />
      </Button>
      <Button
        className={styles.secondaryButton}
        disabled={isActionPending}
        fullWidth
        onClick={handleReject}
      >
        辞退する
      </Button>
    </div>
  );
};
