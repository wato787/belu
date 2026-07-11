export const validateText = (value: string) => {
  if (!value.trim()) {
    return "入力してください。";
  }

  return null;
};
