"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ food, large = false }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      id: food.id,
      name: food.name,
      price: Number(food.price),
      image_url: food.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button className={`btn btn-primary ${large ? "btn-lg" : ""}`} onClick={handleClick}>
      {added ? <Check size={16} /> : <Plus size={16} />}
      {added ? "Added" : "Add to cart"}
    </button>
  );
}
