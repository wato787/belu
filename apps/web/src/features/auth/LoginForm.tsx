import { useState, type ComponentPropsWithoutRef } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "../../components/Button/Button";
import { Field, FieldLabel } from "../../components/Field/Field";
import { Input } from "../../components/Input/Input";
import { useInputText } from "../../hooks/useInputText";
import { validateEmail } from "../../validations/validateEmail";
import { validatePassword } from "../../validations/validatePassword";
import { useLogin } from "./useLogin";
import styles from "./LoginForm.module.css";

type FormSubmitHandler = NonNullable<ComponentPropsWithoutRef<"form">["onSubmit"]>;

export const LoginForm = () => {
  const { login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const email = useInputText({ validator: validateEmail });
  const password = useInputText({ validator: validatePassword });

  const handleSubmit: FormSubmitHandler = (event) => {
    event.preventDefault();
    const emailError = email.validate();
    const passwordError = password.validate();

    if (emailError || passwordError) {
      return;
    }

    login({ email: email.value, password: password.value });
  };

  return (
    <form className={styles.loginForm} noValidate onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          disabled={isPending}
          leftIcon={<Lock size={18} />}
          name="password"
          onChange={password.onChange}
          placeholder="8文字以上の英数字"
          rightIcon={
            <button
              onClick={() => setShowPassword((current) => !current)}
              tabIndex={-1}
              type="button"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          type={showPassword ? "text" : "password"}
          value={password.value}
        />
      </Field>

      <button className={styles.secondaryAction} type="button">
        パスワードをお忘れですか？
      </button>

      <Button fullWidth isLoading={isPending} type="submit">
        <span>ログインする</span>
        <ArrowRight size={16} />
      </Button>
    </form>
  );
};
