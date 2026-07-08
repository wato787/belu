import { Logo } from "../../components/Logo/Logo";
import { LoginForm } from "./LoginForm";
import styles from "./Login.module.css";

const heroImage = "/assets/images/belu-hero-pets.jpg";

export const Login = () => {
  return (
    <main className={styles.loginPage}>
      <section className={styles.visualPane} aria-label="Belu">
        <img alt="" src={heroImage} />
      </section>

      <section className={styles.authPane} aria-label="Authentication">
        <div className={styles.mobileBrand}>
          <Logo size="sm" />
        </div>

        <div className={styles.content}>
          <div className={styles.desktopBrand}>
            <Logo />
          </div>

          <div className={styles.formCard}>
            <h1>ログイン</h1>

            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
};
