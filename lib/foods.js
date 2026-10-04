import { addRating } from "@/lib/rating";
import { createClient } from "@/lib/supabase/server";

export async function getFoods({ search, category, limit } = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("foods")
    .select("*, reviews(rating)")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Could not load the menu. Please try again later.");
  }

  return data.map(addRating);
}

export async function getFood(id) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("foods")
    .select("*, reviews(rating)")
    .eq("id", id)
    .maybeSingle();

  return data ? addRating(data) : null;
}

export async function getReviews(foodId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url)")
    .eq("food_id", foodId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getFavoriteIds(userId) {
  if (!userId) {
    return [];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("food_id")
    .eq("user_id", userId);

  return (data || []).map((item) => item.food_id);
}

export async function getFavoriteFoods(userId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("foods(*, reviews(rating))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data || [])
    .map((item) => item.foods)
    .filter(Boolean)
    .map(addRating);
}

export async function getOrders(userId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getAllOrders(status) {
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return data || [];
}
