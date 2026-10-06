"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { isEventId, readEvent, type EventInput } from "@/lib/events";
import { createClient } from "@/lib/supabase/server";

export type EventFormState = {
  error: string | null;
  /** Echoed back so a rejected form keeps everything the officer typed. */
  input: EventInput | null;
};

const NOT_ADMIN = "Only admins can manage events.";

async function requireAdmin() {
  const profile = await getProfile();
  return profile?.role === "admin";
}

function rpcArgs(values: NonNullable<ReturnType<typeof readEvent>["values"]>) {
  return {
    p_title: values.title,
    p_description: values.description,
    p_location: values.location,
    p_link: values.link,
    p_starts_local: values.starts_local,
    p_ends_local: values.ends_local,
    p_all_day: values.all_day,
    p_published: values.published,
  };
}

function revalidateEvent(id?: string) {
  revalidatePath("/events");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  if (id) revalidatePath(`/events/${id}`);
  if (id) revalidatePath(`/admin/events/${id}/edit`);
}

export async function createEvent(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  if (!(await requireAdmin())) return { error: NOT_ADMIN, input: null };

  const { input, values, error } = readEvent(formData);
  if (error || !values) return { error, input };

  const supabase = await createClient();
  const { error: failure } = await supabase.rpc("admin_create_event", rpcArgs(values));
  if (failure) return { error: failure.message, input };

  revalidateEvent();
  redirect("/admin/events");
}

export async function updateEvent(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  if (!(await requireAdmin())) return { error: NOT_ADMIN, input: null };

  const id = String(formData.get("id") ?? "");
  if (!isEventId(id)) return { error: "Unknown event.", input: null };

  const { input, values, error } = readEvent(formData);
  if (error || !values) return { error, input };

  const supabase = await createClient();
  const { error: failure } = await supabase.rpc("admin_update_event", {
    p_target: id,
    ...rpcArgs(values),
  });
  if (failure) return { error: failure.message, input };

  revalidateEvent(id);
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  if (!(await requireAdmin())) redirect("/admin/events");

  const id = String(formData.get("id") ?? "");
  if (!isEventId(id)) redirect("/admin/events");

  const supabase = await createClient();
  await supabase.rpc("admin_delete_event", { p_target: id });

  revalidateEvent(id);
  redirect("/admin/events");
}
