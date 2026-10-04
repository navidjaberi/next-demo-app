"use server";

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
