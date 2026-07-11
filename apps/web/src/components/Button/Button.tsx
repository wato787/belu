import { Button as BaseButton } from "@base-ui-components/react/button";
import type { ButtonProps as BaseButtonProps } from "@base-ui-components/react/button";
import type { ButtonHTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import styles from "./Button.module.css";

type NativeButtonType = ButtonHTMLAttributes<HTMLButtonElement>["type"];

type ButtonProps = Omit<BaseButtonProps, "className" | "nativeButton" | "type"> & {
  className?: string | undefined;
  fullWidth?: boolean;
  isLoading?: boolean;
  type?: NativeButtonType;
};

export const Button = ({
  children,
  className,
  disabled,
  fullWidth = false,
  isLoading = false,
  type = "button",
  ...props
}: ButtonProps) => (
  <BaseButton
    className={cx(styles.root, className)}
    data-full-width={fullWidth}
    disabled={disabled || isLoading}
    nativeButton
    type={type}
    {...props}
  >
    {isLoading ? <span className={styles.loadingIndicator} /> : children}
  </BaseButton>
);
