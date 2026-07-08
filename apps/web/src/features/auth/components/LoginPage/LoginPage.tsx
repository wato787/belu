import { useState, type FormEvent } from "react";

import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  HeartIcon,
  LockIcon,
  MailIcon,
  Logo,
  UserIcon,
} from "../../../../components";
import styles from "./LoginPage.module.css";

const heroImage = "/assets/images/belu-hero-pets.jpg";

export type AuthMode = "sign-in" | "sign-up";

type LoginPageProps = {
  errorMessage: string | null;
  isSubmitting: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (input: {
    email: string;
    mode: AuthMode;
    name: string;
    password: string;
  }) => Promise<void>;
};

type FormErrors = {
  email?: string;
  name?: string;
  password?: string;
};

export const LoginPage = ({
  errorMessage,
  isSubmitting,
  mode,
  onModeChange,
  onSubmit,
}: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isSignUp = mode === "sign-up";

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

    if (isSignUp && !name.trim()) {
      nextErrors.name = "お名前を入力してください。";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({ email, mode, name, password });
  };

  const switchMode = () => {
    setErrors({});
    onModeChange(isSignUp ? "sign-in" : "sign-up");
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
              <h1>{isSignUp ? "新規登録" : "ログイン"}</h1>
            </div>

            {errorMessage ? (
              <div className={styles.message} role="alert">
                <HeartIcon className={styles.messageIcon} size={18} />
                <span>{errorMessage}</span>
              </div>
            ) : null}

            <form className={styles.form} onSubmit={handleSubmit}>
              {isSignUp ? (
                <label className={styles.field}>
                  <span>お名前</span>
                  <span className={styles.inputWrap}>
                    <UserIcon className={styles.inputIcon} size={18} />
                    <input
                      autoComplete="name"
                      disabled={isSubmitting}
                      name="name"
                      onChange={(event) => {
                        setName(event.currentTarget.value);
                        if (errors.name) {
                          clearError("name");
                        }
                      }}
                      placeholder="うちの パパ"
                      type="text"
                      value={name}
                    />
                  </span>
                  {errors.name ? <span className={styles.errorText}>{errors.name}</span> : null}
                </label>
              ) : null}

              <label className={styles.field}>
                <span>メールアドレス</span>
                <span className={styles.inputWrap}>
                  <MailIcon className={styles.inputIcon} size={18} />
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
                  <LockIcon className={styles.inputIcon} size={18} />
                  <input
                    autoComplete={isSignUp ? "new-password" : "current-password"}
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
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </span>
                {errors.password ? (
                  <span className={styles.errorText}>{errors.password}</span>
                ) : null}
              </label>

              {!isSignUp ? (
                <div className={styles.forgotPassword}>
                  <button type="button">パスワードをお忘れですか？</button>
                </div>
              ) : null}

              <button className={styles.submitButton} disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <span className={styles.spinner} />
                ) : (
                  <>
                    <span>{isSignUp ? "アカウントを作成する" : "ログインする"}</span>
                    <ArrowRightIcon size={16} />
                  </>
                )}
              </button>
            </form>

            <div className={styles.modeSwitch}>
              <p>
                {isSignUp ? "既にアカウントをお持ちですか？" : "アカウントをお持ちでないですか？"}
                <button onClick={switchMode} type="button">
                  {isSignUp ? "ログインはこちら" : "新規登録はこちら"}
                </button>
              </p>
            </div>
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
