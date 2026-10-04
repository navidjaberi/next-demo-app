import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Food Corner. Made with Next.js and Supabase.</p>
    </footer>
  );
}
