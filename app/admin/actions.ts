"use server";

import { revalidatePath } from "next/cache";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AccountActionState = { error: string | null };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function updateAccount(
  _prev: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const profile = await getProfile();
  if (profile?.role !== "admin") {
    return { error: "Only admins can manage accounts." };
  }

  const target = String(formData.get("user_id") ?? "");
  if (!UUID_PATTERN.test(target)) return { error: "Unknown account." };

  const on = formData.get("value") === "true";
  const supabase = await createClient();

  let result;
  switch (formData.get("operation")) {
    case "member":
      result = await supabase.rpc("admin_set_member", { target, member: on });
      break;
    case "payment":
      result = await supabase.rpc("admin_set_payment_verified", {
        target,
        verified: on,
      });
      break;
    case "admin":
      result = await supabase.rpc("admin_set_role", {
        target,
        new_role: on ? "admin" : "user",
      });
      break;
    case "active":
      result = await supabase.rpc("admin_set_active", { target, active: on });
      break;
    default:
      return { error: "Unknown action." };
  }

  if (result.error) return { error: result.error.message };

  revalidatePath("/admin");
  revalidatePath(`/admin/accounts/${target}`);
  return { error: null };
}
