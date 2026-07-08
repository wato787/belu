import { PawIcon } from "../Icon";
import styles from "./Logo.module.css";

type LogoProps = {
  size?: "sm" | "md";
};

export const Logo = ({ size = "md" }: LogoProps) => (
  <div className={styles.logo} data-size={size}>
    <span className={styles.logoMark}>
      <PawIcon size={size === "sm" ? 18 : 26} />
    </span>
    <span className={styles.logoText}>Belu</span>
  </div>
);
