"use server";

import { revalidatePath } from "next/cache";
import { getTotalPrice } from "@/lib/cart";
import { createClient, getUser } from "@/lib/supabase/server";

export async function placeOrder(cartItems) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Please sign in to place your order." };
  }

  if (user.isAdmin) {
    return { error: "Admin accounts can not place orders." };
  }

  if (!cartItems || cartItems.length === 0) {
    return { error: "Your cart is empty." };
  }

  const ids = cartItems.map((item) => item.id);
  const { data: foods, error: foodsError } = await supabase
    .from("foods")
    .select("id, name, price")
    .in("id", ids);

  if (foodsError) {
    return { error: "Something went wrong. Please try again." };
  }

  const items = [];

  for (const cartItem of cartItems) {
    const food = foods.find((f) => f.id === cartItem.id);
    const quantity = Math.floor(Number(cartItem.quantity));

    if (food && quantity > 0) {
      items.push({
        id: food.id,
        name: food.name,
        price: Number(food.price),
        quantity,
      });
    }
  }

  if (items.length === 0) {
    return { error: "The foods in your cart are not available anymore." };
  }

  const { error } = await supabase.from("orders").insert({
    user_id: user.id,
    items,
    total: getTotalPrice(items),
  });

  if (error) {
    return { error: "Placing your order failed. Please try again." };
  }

  revalidatePath("/profile");
  return { success: true };
}
