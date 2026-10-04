"use client";

import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("theme", newTheme);
  }

  return (
    <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
      <Sun size={20} className={styles.sun} />
      <Moon size={20} className={styles.moon} />
    </button>
  );
}
