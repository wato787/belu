const defaultFormatDateOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
} satisfies Intl.DateTimeFormatOptions;

const numericFormatDateOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
} satisfies Intl.DateTimeFormatOptions;

const twoDigitFormatDateOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
} satisfies Intl.DateTimeFormatOptions;

const defaultDateFormatter = new Intl.DateTimeFormat("ja-JP", defaultFormatDateOptions);
const numericDateFormatter = new Intl.DateTimeFormat("ja-JP", numericFormatDateOptions);
const twoDigitDateFormatter = new Intl.DateTimeFormat("ja-JP", twoDigitFormatDateOptions);

const toDate = (value: Date | string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

export const formatDate = (value: Date | string) => {
  const date = toDate(value);

  return date ? defaultDateFormatter.format(date) : String(value);
};

export const formatNumericDate = (value: Date | string) => {
  const date = toDate(value);

  return date ? numericDateFormatter.format(date) : String(value);
};

export const formatTwoDigitDate = (value: Date | string) => {
  const date = toDate(value);

  return date ? twoDigitDateFormatter.format(date) : String(value);
};
