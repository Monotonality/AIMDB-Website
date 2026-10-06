"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isEduEmail } from "@/lib/edu-email";
import {
  readProfileDetails,
  type ProfileDetailsInput,
} from "@/lib/profile-details";
import { SITE_URL } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error: string | null;
  needsConfirm?: boolean;
  email?: string;
  details?: ProfileDetailsInput;
};

// Supabase only honours redirect targets on the project's Redirect URLs list.
async function siteUrl() {
  const origin = (await headers()).get("origin");
  return origin ?? SITE_URL;
}

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = readCredentials(formData);
  const profile = readProfileDetails(formData);
  const fail = (error: string): AuthFormState => ({
    error,
    email,
    details: profile.input,
  });

  if (!isEduEmail(email)) {
    return fail("Use a .edu email address to create an account.");
  }
  if (password.length < 8) {
    return fail("Password must be at least 8 characters.");
  }
  if (!profile.details) {
    return fail(profile.error ?? "Fill in every field.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${await siteUrl()}/auth/confirm?next=/apply`,
      data: profile.details,
    },
  });

  if (error) {
    return fail(error.message);
  }

  if (!data.session) {
    return {
      error: null,
      needsConfirm: true,
    };
  }

  redirect("/apply");
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = readCredentials(formData);

  if (!isEduEmail(email)) {
    return { error: "Log in with the .edu email you used to register.", email };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message, email };
  }

  redirect("/profile");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
