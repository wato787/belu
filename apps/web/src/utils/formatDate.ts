type FormatDateOptions = Intl.DateTimeFormatOptions;

const defaultFormatDateOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
} satisfies FormatDateOptions;

export const formatDate = (
  value: Date | string,
  options: FormatDateOptions = defaultFormatDateOptions,
) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("ja-JP", options).format(date);
};
