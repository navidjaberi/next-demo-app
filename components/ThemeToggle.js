"use client";

import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.css";

function getCurrentTheme() {
  const theme = document.documentElement.dataset.theme;

  if (theme) {
    return theme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  function toggleTheme() {
    const newTheme = getCurrentTheme() === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = newTheme;
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
  }

  return (
    <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
      <Sun size={20} className={styles.sun} />
      <Moon size={20} className={styles.moon} />
    </button>
  );
}
