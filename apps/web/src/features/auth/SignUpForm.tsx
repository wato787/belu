import { Link } from "@tanstack/react-router";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

import { Button } from "../../components/Button/Button";
import { Field, FieldLabel } from "../../components/Field/Field";
import { Input } from "../../components/Input/Input";
import { useInputText } from "../../hooks/useInputText";
import type { FormSubmitHandler } from "../../types/form";
import { cx } from "../../utils/cx";
import { validateEmail } from "../../validations/validateEmail";
import { validatePassword } from "../../validations/validatePassword";
import { validateText } from "../../validations/validateText";
import { useSignUp } from "./useSignUp";
import styles from "./SignUpForm.module.css";

export const SignUpForm = () => {
  const { isPending, signUp } = useSignUp();
  const name = useInputText({ validator: validateText });
  const email = useInputText({ validator: validateEmail });
  const password = useInputText({ validator: validatePassword });
  const canSubmit = Boolean(
    name.value.trim() &&
    email.value.trim() &&
    password.value &&
    !name.error &&
    !email.error &&
    !password.error,
  );

  const handleSubmit: FormSubmitHandler = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    signUp({ email: email.value, name: name.value.trim(), password: password.value });
  };

  return (
    <div className={styles.signUpFormShell}>
      <form className={styles.signUpForm} noValidate onSubmit={handleSubmit}>
        <Field error={name.error}>
          <FieldLabel>お名前</FieldLabel>
          <Input
            autoComplete="name"
            disabled={isPending}
            leftIcon={<User size={18} />}
            name="name"
            onChange={name.onChange}
            placeholder="うちの パパ"
            value={name.value}
          />
        </Field>

        <Field error={email.error}>
          <FieldLabel>メールアドレス</FieldLabel>
          <Input
            autoComplete="email"
            disabled={isPending}
            leftIcon={<Mail size={18} />}
            name="email"
            onChange={email.onChange}
            placeholder="your@email.com"
            type="email"
            value={email.value}
          />
        </Field>

        <Field error={password.error}>
          <FieldLabel>パスワード</FieldLabel>
          <Input
            autoComplete="new-password"
            disabled={isPending}
            leftIcon={<Lock size={18} />}
            name="password"
            onChange={password.onChange}
            placeholder="8文字以上の英数字"
            type="password"
            value={password.value}
          />
        </Field>

        <Button
          className={cx(styles.submitButton)}
          disabled={!canSubmit}
          fullWidth
          isLoading={isPending}
          type="submit"
        >
          <span>アカウントを作成する</span>
          <ArrowRight size={16} />
        </Button>
      </form>

      <div className={styles.modeSwitch}>
        <p>
          既にアカウントをお持ちですか？
          <Link search={{ redirect: undefined }} to="/login">
            ログインはこちら
          </Link>
        </p>
      </div>
    </div>
  );
};
