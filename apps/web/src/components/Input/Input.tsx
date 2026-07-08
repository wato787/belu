import { Input as BaseInput } from "@base-ui-components/react/input";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../utils/cx";
import styles from "./Input.module.css";

type InputProps = Omit<ComponentPropsWithoutRef<typeof BaseInput>, "className"> & {
  className?: string;
};

export const Input = ({ className, ...props }: InputProps) => (
  <BaseInput className={cx(styles.control, className)} {...props} />
);
