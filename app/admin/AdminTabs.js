"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Receipt, UtensilsCrossed } from "lucide-react";
import styles from "./admin.module.css";

export default function AdminTabs() {
  const pathname = usePathname();
  const isMenu = pathname.startsWith("/admin/foods");

  return (
    <div className={styles.tabs}>
      <Link href="/admin" className={!isMenu ? styles.activeTab : styles.tab}>
        <Receipt size={18} />
        Orders
      </Link>
      <Link href="/admin/foods" className={isMenu ? styles.activeTab : styles.tab}>
        <UtensilsCrossed size={18} />
        Menu
      </Link>
    </div>
  );
}
