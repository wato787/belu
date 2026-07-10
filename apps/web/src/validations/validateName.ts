export const validateName = (value: string) => {
  if (!value.trim()) {
    return "お名前を入力してください。";
  }

  return null;
};
