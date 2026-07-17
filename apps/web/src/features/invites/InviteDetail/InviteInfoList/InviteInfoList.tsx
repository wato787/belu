import { Calendar, Mail, User } from "lucide-react";

import { formatDate } from "../../../../utils/formatDate";
import styles from "./InviteInfoList.module.css";

type InviteInfoListProps = {
  invite: {
    email: string;
    expiresAt: Date | string;
    inviterEmail: string | undefined;
  };
};

export const InviteInfoList = ({ invite }: InviteInfoListProps) => (
  <dl className={styles.infoList}>
    <div className={styles.infoItem}>
      <Mail size={14} />
      <div>
        <dt>招待されたアドレス</dt>
        <dd>{invite.email}</dd>
      </div>
    </div>

    <div className={styles.infoItem}>
      <User size={14} />
      <div>
        <dt>招待者</dt>
        <dd>{invite.inviterEmail ?? "スペース管理者"}</dd>
      </div>
    </div>

    <div className={styles.infoItem}>
      <Calendar size={14} />
      <div>
        <dt>有効期限</dt>
        <dd>{formatDate(invite.expiresAt)} まで</dd>
      </div>
    </div>
  </dl>
);
