import { Logo } from "../../components/Logo/Logo";
import { SignUpForm } from "./SignUpForm";
import styles from "./Login.module.css";

const heroImage = "/assets/images/belu-hero-pets.jpg";

export const SignUp = () => {
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
            <h1>新規登録</h1>

            <SignUpForm />
          </div>
        </div>
      </section>
    </main>
  );
};
