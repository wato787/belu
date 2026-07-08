const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (value: string) => {
  if (!value) {
    return "メールアドレスを入力してください。";
  }

  if (!emailPattern.test(value)) {
    return "正しいメールアドレスの形式で入力してください。";
  }

  return null;
};
