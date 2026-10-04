"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function changePassword(prevState, formData) {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { message: "Your password has been changed." };
}

export async function updateName(prevState, formData) {
  const name = formData.get("fullName")?.trim() || "";

  if (name.length < 2) {
    return { error: "Name should be at least 2 characters.", name };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return { error: "Please sign in again." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: name })
    .eq("id", data.user.id);

  if (error) {
    return { error: "Saving your name failed.", name };
  }

  revalidatePath("/", "layout");
  return { message: "Your name has been saved.", name };
}

export async function updateAvatar(formData) {
  const avatar = formData.get("avatar");

  if (!avatar || avatar.size === 0 || !avatar.type.startsWith("image/")) {
    return { error: "Please choose an image." };
  }

  if (avatar.size > 2 * 1024 * 1024) {
    return { error: "Avatar should be smaller than 2MB." };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return { error: "Please sign in again." };
  }

  const extension = avatar.name.split(".").pop();
  const filePath = `${data.user.id}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, avatar, { contentType: avatar.type });

  if (uploadError) {
    return { error: "Uploading the avatar failed." };
  }

  const { data: imageData } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: imageData.publicUrl })
    .eq("id", data.user.id);

  if (error) {
    return { error: "Saving the avatar failed." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
