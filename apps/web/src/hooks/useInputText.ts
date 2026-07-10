import { useState, type ComponentPropsWithoutRef } from "react";

type InputChangeHandler = NonNullable<ComponentPropsWithoutRef<"input">["onChange"]>;
type InputTextValidator = (value: string) => string | null;

type UseInputTextOptions = {
  initialValue?: string;
  onChange?: (value: string) => void;
  validator?: InputTextValidator;
};

export const useInputText = ({
  initialValue = "",
  onChange,
  validator,
}: UseInputTextOptions = {}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = (nextValue = value) => {
    const nextError = validator?.(nextValue) ?? null;
    setError(nextError);
    return nextError;
  };

  const handleChange: InputChangeHandler = (event) => {
    const nextValue = event.target.value;

    setValue(nextValue);
    setError(validator?.(nextValue) ?? null);
    onChange?.(nextValue);
  };

  return {
    value,
    error,
    hasError: Boolean(error),
    onChange: handleChange,
    validate,
  };
};
