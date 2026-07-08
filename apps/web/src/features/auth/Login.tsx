import { useRouter, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Heart, Lock, Mail } from "lucide-react";

import { Logo } from "../../components/Logo/Logo";
import { authClient } from "../../lib/authClient";
import styles from "./Login.module.css";

const heroImage = "/assets/images/belu-hero-pets.jpg";

type FormErrors = {
  email?: string;
  password?: string;
};

export const Login = () => {
  const router = useRouter();
  const search = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = (field: keyof FormErrors) => {
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      nextErrors.email = "メールアドレスを入力してください。";
    } else if (!emailRegex.test(email)) {
      nextErrors.email = "正しいメールアドレスの形式で入力してください。";
    }

    if (!password) {
      nextErrors.password = "パスワードを入力してください。";
    } else if (password.length < 8) {
      nextErrors.password = "パスワードは8文字以上で入力してください。";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setErrorMessage(result.error.message ?? "Authentication failed");
        return;
      }

      router.history.push(search.redirect ?? "/spaces");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="Belu">
        <div className={styles.heroGlowPrimary} />
        <div className={styles.heroGlowAccent} />
        <img alt="" className={styles.heroImage} src={heroImage} />
        <div className={styles.heroOverlay} />
      </section>

      <section className={styles.panel} aria-label="Authentication">
        <div className={styles.mobileHeader}>
          <Logo size="sm" />
        </div>

        <div className={styles.formArea}>
          <div className={styles.desktopLogo}>
            <Logo />
          </div>

          <div className={styles.formShell}>
            <div className={styles.formHeader}>
              <h1>ログイン</h1>
            </div>

            {errorMessage ? (
              <div className={styles.message} role="alert">
                <Heart className={styles.messageIcon} size={18} />
                <span>{errorMessage}</span>
              </div>
            ) : null}

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span>メールアドレス</span>
                <span className={styles.inputWrap}>
                  <Mail className={styles.inputIcon} size={18} />
                  <input
                    autoComplete="email"
                    disabled={isSubmitting}
                    name="email"
                    onChange={(event) => {
                      setEmail(event.currentTarget.value);
                      if (errors.email) {
                        clearError("email");
                      }
                    }}
                    placeholder="your@email.com"
                    type="email"
                    value={email}
                  />
                </span>
                {errors.email ? <span className={styles.errorText}>{errors.email}</span> : null}
              </label>

              <label className={styles.field}>
                <span>パスワード</span>
                <span className={styles.inputWrap}>
                  <Lock className={styles.inputIcon} size={18} />
                  <input
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    name="password"
                    onChange={(event) => {
                      setPassword(event.currentTarget.value);
                      if (errors.password) {
                        clearError("password");
                      }
                    }}
                    placeholder="8文字以上の英数字"
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    className={styles.iconButton}
                    onClick={() => setShowPassword((current) => !current)}
                    tabIndex={-1}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
                {errors.password ? (
                  <span className={styles.errorText}>{errors.password}</span>
                ) : null}
              </label>

              <div className={styles.forgotPassword}>
                <button type="button">パスワードをお忘れですか？</button>
              </div>

              <button className={styles.submitButton} disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <span className={styles.spinner} />
                ) : (
                  <>
                    <span>ログインする</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <footer className={styles.footer}>
          <nav aria-label="Legal links">
            <a href="/">利用規約</a>
            <a href="/">プライバシーポリシー</a>
          </nav>
          <span>&copy; {new Date().getFullYear()} Belu</span>
        </footer>
      </section>
    </main>
  );
};
