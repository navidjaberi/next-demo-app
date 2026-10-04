"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}
