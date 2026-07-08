import { Field as BaseField } from "@base-ui-components/react/field";
import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react";

import { cx } from "../../utils/cx";
import styles from "./Field.module.css";

type FieldProps = Omit<ComponentPropsWithoutRef<typeof BaseField.Root>, "className"> & {
  className?: string;
};

type FieldLabelProps = Omit<ComponentPropsWithoutRef<typeof BaseField.Label>, "className"> & {
  className?: string;
};

type FieldErrorProps = Omit<ComponentPropsWithoutRef<typeof BaseField.Error>, "className"> & {
  className?: string;
};

export const Field = ({ children, className, ...props }: FieldProps) => (
  <BaseField.Root className={cx(styles.field, className)} {...props}>
    {children}
  </BaseField.Root>
);

export const FieldLabel = ({ children, className, ...props }: FieldLabelProps) => (
  <BaseField.Label className={cx(styles.fieldLabel, className)} {...props}>
    {children}
  </BaseField.Label>
);

export const FieldControl = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cx(styles.fieldControl, className)} {...props}>
    {children}
  </span>
);

export const FieldIcon = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cx(styles.fieldIcon, className)}>{children}</span>
);

export const FieldAction = ({
  children,
  className,
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button">) => (
  <button className={cx(styles.fieldAction, className)} type={type} {...props}>
    {children}
  </button>
);

export const FieldError = ({ children, className, ...props }: FieldErrorProps) => (
  <BaseField.Error className={cx(styles.fieldError, className)} {...props}>
    {children}
  </BaseField.Error>
);
