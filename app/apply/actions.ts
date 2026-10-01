"use server";

import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/auth";
import { readMembership, type MembershipInput } from "@/lib/membership";
import { createClient } from "@/lib/supabase/server";

export type ApplicationFormState = {
  error: string | null;
  saved?: boolean;
  input?: MembershipInput;
};

export async function saveApplication(
  _prev: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Log in with your .edu account first." };
  }

  const submit = formData.get("intent") === "submit";
  const { input, values, error } = readMembership(formData, submit);
  if (!values) return { error, input };

  const supabase = await createClient();
  const { error: upsertError } = await supabase
    .from("applications")
    .upsert(
      { user_id: user.id, status: "draft" as const, ...values },
      { onConflict: "user_id" },
    );

  if (upsertError) {
    return { error: upsertError.message, input };
  }

  if (submit) {
    const { error: submitError } = await supabase
      .from("applications")
      .update({ status: "submitted" })
      .eq("user_id", user.id)
      .eq("status", "draft");

    if (submitError) {
      return { error: submitError.message, input };
    }
  }

  revalidatePath("/apply");
  revalidatePath("/profile");
  return { error: null, saved: !submit, input };
}
