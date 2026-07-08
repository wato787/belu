export const validatePassword = (value: string) => {
  if (!value) {
    return "パスワードを入力してください。";
  }

  if (value.length < 8) {
    return "パスワードは8文字以上で入力してください。";
  }

  return null;
};
