"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getSafeRedirect(next) {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/foods";
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Please enter your email and password.", email };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message, email };
  }

  revalidatePath("/", "layout");
  redirect(getSafeRedirect(formData.get("next")));
}

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!email || !password) {
    return { error: "Please enter your email and password.", email };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters.", email };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message, email };
  }

  if (!data.session) {
    return { message: "Account created! Check your email to confirm it, then sign in." };
  }

  revalidatePath("/", "layout");
  redirect(getSafeRedirect(formData.get("next")));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
}
