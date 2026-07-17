import { AlertTriangle } from "lucide-react";

import styles from "./EmailMismatchWarning.module.css";

type EmailMismatchWarningProps = {
  inviteEmail: string;
  userEmail: string;
};

export const EmailMismatchWarning = ({ inviteEmail, userEmail }: EmailMismatchWarningProps) => (
  <div className={styles.warning}>
    <AlertTriangle size={16} />
    <div>
      <p>ログインアカウントの確認</p>
      <span>
        招待されたメール（{inviteEmail}）と現在ログイン中のメール（{userEmail}）が異なります。
      </span>
    </div>
  </div>
);
