"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { categories } from "@/lib/categories";
import { orderStatuses } from "@/lib/orders";
import { createClient, getUser } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

async function checkAdmin() {
  const user = await getUser();

  if (!user || !user.isAdmin) {
    redirect("/");
  }

  return user;
}

function validateFood(formData, imageRequired) {
  const values = {
    name: formData.get("name")?.trim() || "",
    category: formData.get("category") || "",
    price: Number(formData.get("price")),
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
  if (!(values.price > 0)) {
    errors.price = "Please enter a valid price.";
  }
  if (values.ingredients.length < 5) {
    errors.ingredients = "Please write the main ingredients.";
  }
  if (values.description.length < 15) {
    errors.description = "Description should be at least 15 characters.";
  }

  const hasImage = image && image.size > 0;

  if (!hasImage && imageRequired) {
    errors.image = "Please choose an image.";
  } else if (hasImage && !image.type.startsWith("image/")) {
    errors.image = "Only image files are allowed.";
  } else if (hasImage && image.size > MAX_IMAGE_SIZE) {
    errors.image = "Image should be smaller than 4MB.";
  }

  return { values, image: hasImage ? image : null, errors };
}

async function uploadImage(supabase, userId, image) {
  const extension = image.name.split(".").pop();
  const filePath = `${userId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("food-images")
    .upload(filePath, image, { contentType: image.type });

  if (error) {
    return null;
  }

  const { data } = supabase.storage.from("food-images").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function addFood(prevState, formData) {
  const user = await checkAdmin();
  const { values, image, errors } = validateFood(formData, true);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const imageUrl = await uploadImage(supabase, user.id, image);

  if (!imageUrl) {
    return { error: "Uploading the image failed. Please try again." };
  }

  const { error } = await supabase
    .from("foods")
    .insert({ ...values, image_url: imageUrl, created_by: user.id });

  if (error) {
    return { error: "Saving the food failed. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/foods");
}

export async function updateFood(id, prevState, formData) {
  const user = await checkAdmin();
  const { values, image, errors } = validateFood(formData, false);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const changes = { ...values };

  if (image) {
    const imageUrl = await uploadImage(supabase, user.id, image);

    if (!imageUrl) {
      return { error: "Uploading the image failed. Please try again." };
    }

    changes.image_url = imageUrl;
  }

  const { error } = await supabase.from("foods").update(changes).eq("id", id);

  if (error) {
    return { error: "Saving the food failed. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/foods");
}

export async function deleteFood(id) {
  await checkAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("foods").delete().eq("id", id);

  if (error) {
    return { error: "Deleting the food failed." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateOrderStatus(orderId, status) {
  await checkAdmin();

  if (!orderStatuses.includes(status)) {
    return { error: "Invalid status." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    return { error: "Updating the order failed." };
  }

  revalidatePath("/admin");
  revalidatePath("/profile");
  return { success: true };
}
