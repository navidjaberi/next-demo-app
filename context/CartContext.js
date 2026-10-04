"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { cartReducer, getTotalCount, getTotalPrice, initialCart } from "@/lib/cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  useEffect(() => {
    let savedItems = [];

    try {
      savedItems = JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      savedItems = [];
    }

    dispatch({ type: "load", items: savedItems });
  }, []);

  useEffect(() => {
    if (cart.loaded) {
      localStorage.setItem("cart", JSON.stringify(cart.items));
    }
  }, [cart]);

  const value = {
    items: cart.items,
    totalCount: getTotalCount(cart.items),
    totalPrice: getTotalPrice(cart.items),
    addItem: (item) => dispatch({ type: "add", item }),
    decreaseItem: (id) => dispatch({ type: "decrease", id }),
    removeItem: (id) => dispatch({ type: "remove", id }),
    clearCart: () => dispatch({ type: "clear" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
