import styles from "./AppFooter.module.css";

export const AppFooter = () => (
  <footer className={styles.footer}>
    <nav aria-label="Legal links" className={styles.nav}>
      <a className={styles.link} href="/">
        利用規約
      </a>
      <a className={styles.link} href="/">
        プライバシーポリシー
      </a>
    </nav>
    <span>&copy; {new Date().getFullYear()} Belu</span>
  </footer>
);
