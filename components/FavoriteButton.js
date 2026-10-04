"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/foods/actions";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ foodId, initialFavorite }) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const oldValue = isFavorite;
    setIsFavorite(!oldValue);

    startTransition(async () => {
      const result = await toggleFavorite(foodId, oldValue);
      if (result.error) {
        setIsFavorite(oldValue);
      }
    });
  }

  return (
    <button
      className={`${styles.button} ${isFavorite ? styles.active : ""}`}
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
}
