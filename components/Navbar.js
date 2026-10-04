"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, ShoppingBag, UtensilsCrossed, X } from "lucide-react";
import { logout } from "@/app/login/actions";
import { useCart } from "@/context/CartContext";
import Avatar from "./Avatar";
import ConfirmModal from "./ConfirmModal";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";

export default function Navbar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const links = [
    { href: "/", label: "Home" },
    { href: "/foods", label: "Menu" },
  ];

  if (user?.isAdmin) {
    links.push({ href: "/admin", label: "Dashboard" });
  }

  function handleLogout() {
    startTransition(async () => {
      await logout();
      setShowLogoutModal(false);
      router.push("/");
    });
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

          {user ? (
            <div className={styles.logout}>
              <Link href="/profile" className={styles.user} onClick={() => setMenuOpen(false)}>
                <Avatar src={user.avatarUrl} name={user.name} size={32} />
                <span className={styles.name}>{user.name}</span>
              </Link>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setMenuOpen(false);
                  setShowLogoutModal(true);
                }}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
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
          {!user?.isAdmin && (
            <Link href="/cart" className={`icon-btn ${styles.cart}`} aria-label="Cart">
              <ShoppingBag size={20} />
              {totalCount > 0 && <span className={styles.badge}>{totalCount}</span>}
            </Link>
          )}
          <button
            className={`icon-btn ${styles.menuButton}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showLogoutModal}
        title="Sign out"
        message="Are you sure you want to sign out?"
        confirmText="Sign out"
        isPending={isPending}
        onConfirm={handleLogout}
        onClose={() => setShowLogoutModal(false)}
      />
    </header>
  );
}
