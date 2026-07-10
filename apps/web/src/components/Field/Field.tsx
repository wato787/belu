import { Field as BaseField } from "@base-ui-components/react/field";
import {
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cx } from "../../utils/cx";
import styles from "./Field.module.css";

type FieldContextValue = {
  errorMessage: ReactNode | null;
  hasError: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

type FieldProps = Omit<ComponentPropsWithoutRef<typeof BaseField.Root>, "className"> & {
  className?: string;
  error?: unknown;
};

type FieldLabelProps = Omit<ComponentPropsWithoutRef<typeof BaseField.Label>, "className"> & {
  className?: string;
};

type FieldErrorProps = Omit<
  ComponentPropsWithoutRef<typeof BaseField.Error>,
  "children" | "className"
> & {
  className?: string;
  error?: unknown;
  children?: ReactNode;
};

const errorToMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    error !== null &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  if (error !== null && error !== undefined) {
    return String(error);
  }

  return null;
};

export const useFieldContext = () => useContext(FieldContext);

export const Field = ({ children, className, error, ...props }: FieldProps) => {
  const errorMessage = errorToMessage(error);

  return (
    <FieldContext value={{ errorMessage, hasError: Boolean(errorMessage) }}>
      <BaseField.Root className={cx(styles.field, className)} {...props}>
        {children}
      </BaseField.Root>
    </FieldContext>
  );
};

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

export const FieldError = ({ children, className, error, match, ...props }: FieldErrorProps) => {
  const field = useFieldContext();
  const message = errorToMessage(error) ?? field?.errorMessage;
  const content = message ?? children;
  const errorMatch = message ? true : match;

  if (!content) {
    return null;
  }

  if (errorMatch === undefined) {
    return (
      <BaseField.Error className={cx(styles.fieldError, className)} {...props}>
        {content}
      </BaseField.Error>
    );
  }

  return (
    <BaseField.Error className={cx(styles.fieldError, className)} match={errorMatch} {...props}>
      {content}
    </BaseField.Error>
  );
};
