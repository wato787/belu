type ClassValue = false | null | string | undefined;

const isClassValue = (value: ClassValue): value is string =>
  typeof value === "string" && value !== "";

export const cx = (...values: ClassValue[]) => values.filter(isClassValue).join(" ");
