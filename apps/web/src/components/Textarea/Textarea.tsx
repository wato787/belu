import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../utils/cx";
import styles from "./Textarea.module.css";

type TextareaProps = ComponentPropsWithoutRef<"textarea">;

export const Textarea = ({ className, ...props }: TextareaProps) => (
  <textarea className={cx(styles.textarea, className)} {...props} />
);
