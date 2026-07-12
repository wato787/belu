import { Popover } from "@base-ui-components/react/popover";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronUp, LogOut, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "../../../../../lib/authClient";
import styles from "./ProfileMenu.module.css";

type ProfileMenuProps = {
  email: string;
  name: string;
};

export const ProfileMenu = ({ email, name }: ProfileMenuProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("ログアウトできませんでした。時間をおいてもう一度お試しください。");
      return;
    }

    await navigate({ replace: true, search: { redirect: undefined }, to: "/login" });
  };

  return (
    <div className={styles.profileArea}>
      <Popover.Root onOpenChange={setIsOpen} open={isOpen}>
        <Popover.Trigger className={() => styles.profileTrigger}>
          <div className={styles.profileSummary}>
            <div className={styles.profileAvatar}>
              <User size={14} />
            </div>
            <div className={styles.profileText}>
              <span>{name}</span>
              <small>{email}</small>
            </div>
          </div>
          <ChevronUp className={styles.profileChevron} data-open={isOpen} size={15} />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner
            align="center"
            className={() => styles.profileMenuPositioner}
            side="top"
          >
            <Popover.Popup className={() => styles.profileMenu}>
              <Popover.Close
                className={() => styles.profileMenuItem}
                onClick={() => navigate({ to: "/spaces" })}
              >
                <ArrowLeft size={15} />
                <span>スペース一覧に戻る</span>
              </Popover.Close>
              <Popover.Close
                className={() => styles.profileMenuItem}
                onClick={() => toast.info("プロフィール設定はまだ利用できません。")}
              >
                <User size={15} />
                <span>プロフィール設定</span>
              </Popover.Close>
              <hr className={styles.menuDivider} />
              <Popover.Close
                className={() => styles.profileMenuItemDanger}
                onClick={handleLogout}
                type="button"
              >
                <LogOut size={15} />
                <span>ログアウト</span>
              </Popover.Close>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
