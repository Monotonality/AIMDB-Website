"use server";

import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/auth";
import {
  readProfileDetails,
  type ProfileDetailsInput,
} from "@/lib/profile-details";
import { createClient } from "@/lib/supabase/server";

export type DetailsFormState = {
  error: string | null;
  saved?: boolean;
  details?: ProfileDetailsInput;
};

export async function updateDetails(
  _prev: DetailsFormState,
  formData: FormData,
): Promise<DetailsFormState> {
  const user = await getAuthUser();
  if (!user) return { error: "Log in to edit your details." };

  const profile = readProfileDetails(formData);
  if (!profile.details) {
    return { error: profile.error, details: profile.input };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update(profile.details)
    .eq("id", user.id);

  if (error) return { error: error.message, details: profile.input };

  revalidatePath("/profile");
  revalidatePath("/apply");
  return { error: null, saved: true, details: profile.input };
}
