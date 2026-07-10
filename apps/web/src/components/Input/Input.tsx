import { Input as BaseInput } from "@base-ui-components/react/input";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../utils/cx";
import { useFieldContext } from "../Field/Field";
import styles from "./Input.module.css";

type InputProps = Omit<ComponentPropsWithoutRef<typeof BaseInput>, "className"> & {
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const Input = ({ className, leftIcon, rightIcon, ...props }: InputProps) => {
  const field = useFieldContext();
  const isInvalid = Boolean(props["aria-invalid"] ?? field?.hasError);

  return (
    <span className={styles.root}>
      {leftIcon ? <span className={styles.leftIcon}>{leftIcon}</span> : null}
      <BaseInput {...props} aria-invalid={isInvalid} className={cx(styles.control, className)} />
      {rightIcon ? <span className={styles.rightIcon}>{rightIcon}</span> : null}
    </span>
  );
};
