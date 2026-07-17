import { Check, Clock, Copy, Mail, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cx } from "../../../../utils/cx";
import { formatDate } from "../../../../utils/formatDate";
import { useDeleteInvite } from "../../../invites";
import type { SpaceInvite } from "../types";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import styles from "./InviteList.module.css";

type InviteListProps = {
  invites: SpaceInvite[];
  spaceId: string;
};

export const InviteList = ({ invites, spaceId }: InviteListProps) => {
  const { deleteInvite } = useDeleteInvite(spaceId);
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  const handleCancelInvite = (inviteId: string) => {
    const confirmed = window.confirm("この招待をキャンセルしてもよろしいですか？");

    if (!confirmed) {
      return;
    }

    deleteInvite(inviteId);
  };

  const handleCopyLink = async (inviteId: string) => {
    const inviteLink = `${window.location.origin}/invites/${inviteId}`;

    await navigator.clipboard.writeText(inviteLink);
    setCopiedInviteId(inviteId);
    toast.success("招待リンクをコピーしました。");
    window.setTimeout(() => setCopiedInviteId(null), 3000);
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Clock size={16} />
          <span>発行済みの招待</span>
        </h2>
        <span className={styles.countBadge}>{invites.length}件</span>
      </div>

      {invites.length === 0 ? (
        <div className={styles.emptyState}>
          <Mail size={32} />
          <p>招待履歴はありません</p>
          <span>上のフォームからメンバーを招待できます。</span>
        </div>
      ) : (
        <div className={styles.list}>
          {invites.map((invite) => {
            const isPending = invite.status === "pending";
            const isCopied = copiedInviteId === invite.id;

            return (
              <article className={styles.item} key={invite.id}>
                <div className={styles.info}>
                  <div className={styles.titleRow}>
                    <strong>{invite.email}</strong>
                    <StatusBadge status={invite.status} />
                  </div>
                  <div className={styles.meta}>
                    <span>権限: メンバー</span>
                    <span>•</span>
                    <span className={styles.dateMeta}>
                      <Clock size={11} />
                      期限: {formatDate(invite.expiresAt, dateFormatOptions)}
                    </span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={cx(styles.copyButton, isCopied && styles.copyButtonCopied)}
                    onClick={() => void handleCopyLink(invite.id)}
                    title="招待リンクをコピー"
                    type="button"
                  >
                    {isCopied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{isCopied ? "コピー済" : "リンクコピー"}</span>
                  </button>

                  {isPending ? (
                    <button
                      className={styles.cancelButton}
                      onClick={() => handleCancelInvite(invite.id)}
                      title="招待をキャンセル"
                      type="button"
                    >
                      <X size={15} />
                    </button>
                  ) : (
                    <span className={styles.noAction}>-</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

const dateFormatOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
} satisfies Intl.DateTimeFormatOptions;
