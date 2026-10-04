"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
      <Sun size={20} className={styles.sun} />
      <Moon size={20} className={styles.moon} />
    </button>
  );
}
