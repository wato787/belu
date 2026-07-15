import { Field as BaseField } from "@base-ui-components/react/field";
import { createContext, useContext, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cx } from "../../utils/cx";
import styles from "./Field.module.css";

type FieldContextValue = {
  errorMessage: ReactNode | null;
};

const FieldContext = createContext<FieldContextValue | null>(null);

type FieldProps = Omit<ComponentPropsWithoutRef<typeof BaseField.Root>, "className"> & {
  className?: string | undefined;
  error?: unknown;
};

type FieldLabelProps = Omit<ComponentPropsWithoutRef<typeof BaseField.Label>, "className"> & {
  className?: string | undefined;
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
    <FieldContext value={{ errorMessage }}>
      <BaseField.Root className={cx(styles.field, className)} {...props}>
        {children}
        <FieldError />
      </BaseField.Root>
    </FieldContext>
  );
};

export const FieldLabel = ({ children, className, ...props }: FieldLabelProps) => (
  <BaseField.Label className={cx(styles.fieldLabel, className)} {...props}>
    {children}
  </BaseField.Label>
);

const FieldError = () => {
  const field = useFieldContext();
  const content = field?.errorMessage;

  if (!content) {
    return null;
  }

  return (
    <BaseField.Error className={cx(styles.fieldError)} match={true}>
      {content}
    </BaseField.Error>
  );
};
