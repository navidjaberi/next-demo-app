"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, ShoppingBag, UtensilsCrossed, X } from "lucide-react";
import { logout } from "@/app/login/actions";
import { useCart } from "@/context/CartContext";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";

export default function Navbar({ userEmail }) {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/foods", label: "Menu" },
  ];

  if (userEmail) {
    links.push({ href: "/add-food", label: "Add food" });
    links.push({ href: "/profile", label: "Profile" });
  }

  function isActive(href) {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <UtensilsCrossed size={24} />
          Food Corner
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? styles.active : ""}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {userEmail ? (
            <form action={logout} className={styles.logoutForm}>
              <span className={styles.email}>{userEmail}</span>
              <button className="btn btn-outline" type="submit">
                <LogOut size={16} />
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <Link href="/cart" className={`icon-btn ${styles.cart}`} aria-label="Cart">
            <ShoppingBag size={20} />
            {totalCount > 0 && <span className={styles.badge}>{totalCount}</span>}
          </Link>
          <button
            className={`icon-btn ${styles.menuButton}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
