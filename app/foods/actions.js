"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { categories } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export async function addFood(prevState, formData) {
  const values = {
    name: formData.get("name")?.trim() || "",
    category: formData.get("category") || "",
    price: formData.get("price") || "",
    ingredients: formData.get("ingredients")?.trim() || "",
    description: formData.get("description")?.trim() || "",
  };
  const image = formData.get("image");
  const errors = {};

  if (values.name.length < 2) {
    errors.name = "Name should be at least 2 characters.";
  }
  if (!categories.includes(values.category)) {
    errors.category = "Please choose a category.";
  }
  if (!(Number(values.price) > 0)) {
    errors.price = "Please enter a valid price.";
  }
  if (values.ingredients.length < 5) {
    errors.ingredients = "Please write the main ingredients.";
  }
  if (values.description.length < 15) {
    errors.description = "Description should be at least 15 characters.";
  }
  if (!image || image.size === 0) {
    errors.image = "Please choose an image.";
  } else if (!image.type.startsWith("image/")) {
    errors.image = "Only image files are allowed.";
  } else if (image.size > MAX_IMAGE_SIZE) {
    errors.image = "Image should be smaller than 4MB.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/login?next=/add-food");
  }

  const extension = image.name.split(".").pop();
  const filePath = `${user.id}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("food-images")
    .upload(filePath, image, { contentType: image.type });

  if (uploadError) {
    return { error: "Uploading the image failed. Please try again." };
  }

  const { data: imageData } = supabase.storage
    .from("food-images")
    .getPublicUrl(filePath);

  const { data: food, error } = await supabase
    .from("foods")
    .insert({
      name: values.name,
      category: values.category,
      price: Number(values.price),
      ingredients: values.ingredients,
      description: values.description,
      image_url: imageData.publicUrl,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    return { error: "Saving the food failed. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/foods");
  redirect(`/foods/${food.id}`);
}

export async function deleteFood(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("foods").delete().eq("id", id);

  if (error) {
    return { error: "Deleting the food failed." };
  }

  revalidatePath("/");
  revalidatePath("/foods");
  redirect("/foods");
}

export async function toggleFavorite(foodId, isFavorite) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return { error: "Please sign in first." };
  }

  let result;

  if (isFavorite) {
    result = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", data.user.id)
      .eq("food_id", foodId);
  } else {
    result = await supabase
      .from("favorites")
      .insert({ user_id: data.user.id, food_id: foodId });
  }

  if (result.error) {
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/profile");
  return { success: true };
}
