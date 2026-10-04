"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";

export async function toggleFavorite(foodId, isFavorite) {
  const user = await getUser();

  if (!user) {
    return { error: "Please sign in first." };
  }

  const supabase = await createClient();
  let result;

  if (isFavorite) {
    result = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("food_id", foodId);
  } else {
    result = await supabase
      .from("favorites")
      .insert({ user_id: user.id, food_id: foodId });
  }

  if (result.error) {
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function addReview(foodId, prevState, formData) {
  const user = await getUser();

  if (!user) {
    return { error: "Please sign in to write a review." };
  }

  if (user.isAdmin) {
    return { error: "Admin accounts can not write reviews." };
  }

  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment")?.trim() || "";

  if (rating < 1 || rating > 5) {
    return { error: "Please choose a rating.", comment };
  }

  if (comment.length < 3) {
    return { error: "Please write a short comment.", comment };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .insert({ food_id: foodId, user_id: user.id, rating, comment });

  if (error) {
    return { error: "Saving your review failed. Please try again.", comment };
  }

  revalidatePath(`/foods/${foodId}`);
  revalidatePath("/foods");
  return { success: true };
}

export async function deleteReview(reviewId, foodId) {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  if (error) {
    return { error: "Deleting the review failed." };
  }

  revalidatePath(`/foods/${foodId}`);
  revalidatePath("/foods");
  return { success: true };
}
