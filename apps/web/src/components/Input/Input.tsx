import { Input as BaseInput } from "@base-ui-components/react/input";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../utils/cx";
import { useFieldContext } from "../Field/Field";
import styles from "./Input.module.css";

type InputProps = Omit<ComponentPropsWithoutRef<typeof BaseInput>, "className"> & {
  className?: string;
};

export const Input = ({ className, ...props }: InputProps) => {
  const field = useFieldContext();

  return (
    <BaseInput
      {...props}
      aria-invalid={props["aria-invalid"] ?? field?.invalid}
      className={cx(styles.control, className)}
    />
  );
};
