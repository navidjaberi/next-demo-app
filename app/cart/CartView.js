"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CircleCheck, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import FoodImage from "@/components/FoodImage";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { placeOrder } from "./actions";
import styles from "./cart.module.css";

export default function CartView({ isLoggedIn }) {
  const { items, totalPrice, addItem, decreaseItem, removeItem, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  function handleCheckout() {
    setError("");

    startTransition(async () => {
      const cartItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
      }));
      const result = await placeOrder(cartItems);

      if (result.error) {
        setError(result.error);
      } else {
        clearCart();
        setOrderPlaced(true);
      }
    });
  }

  if (orderPlaced) {
    return (
      <div className="empty-state">
        <CircleCheck size={48} />
        <h2>Thanks for your order!</h2>
        <p>We are preparing your food. You can see your orders in your profile.</p>
        <Link href="/profile" className="btn btn-primary">
          View my orders
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingBag size={48} />
        <p>Your cart is empty.</p>
        <Link href="/foods" className="btn btn-primary">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.image}>
              <FoodImage src={item.image_url} alt={item.name} sizes="80px" eager />
            </div>

            <div className={styles.info}>
              <Link href={`/foods/${item.id}`} className={styles.name}>
                {item.name}
              </Link>
              <span className={styles.price}>{formatPrice(item.price)}</span>
            </div>

            <div className={styles.quantity}>
              <button
                className="icon-btn"
                onClick={() => decreaseItem(item.id)}
                aria-label="Decrease"
              >
                <Minus size={16} />
              </button>
              <span>{item.quantity}</span>
              <button className="icon-btn" onClick={() => addItem(item)} aria-label="Increase">
                <Plus size={16} />
              </button>
            </div>

            <span className={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</span>

            <button
              className={`icon-btn ${styles.remove}`}
              onClick={() => removeItem(item.id)}
              aria-label="Remove"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      <aside className={`card ${styles.summary}`}>
        <h2>Order summary</h2>
        <div className={styles.row}>
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className={styles.row}>
          <span>Delivery</span>
          <span>Free</span>
        </div>
        <div className={`${styles.row} ${styles.total}`}>
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        {error && <p className="alert alert-error">{error}</p>}

        {isLoggedIn ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleCheckout}
            disabled={isPending}
          >
            {isPending ? "Placing order..." : "Place order"}
          </button>
        ) : (
          <Link href="/login?next=/cart" className="btn btn-primary btn-lg">
            Sign in to order
          </Link>
        )}

        <button className="btn btn-outline" onClick={clearCart} disabled={isPending}>
          Clear cart
        </button>
      </aside>
    </div>
  );
}
