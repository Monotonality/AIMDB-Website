import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getProfile } from "@/lib/auth";
import { eventInputFrom, isEventId, type EventRecord } from "@/lib/events";
import SiteFooter from "../../../../site-footer";
import SiteHeader from "../../../../site-header";
import DeleteEvent from "../../delete-event";
import EventForm from "../../event-form";

export const metadata: Metadata = {
  title: "Edit event | AIMDB admin",
};

const COLUMNS =
  "id, title, description, location, link, starts_at, ends_at, all_day, published, created_at, updated_at";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/profile");

  const { id } = await params;
  if (!isEventId(id)) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();

  const event = data as EventRecord | null;
  if (!event) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 md:py-24">
        <Link
          href="/admin/events"
          className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ← All events
        </Link>
        <h1 className="mt-4 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          {event.published ? "Edit event." : "Edit draft."}
        </h1>
        {event.published ? (
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-800">
            This event is live at{" "}
            <Link
              href={`/events/${event.id}`}
              className="underline underline-offset-4 hover:text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              /events/{event.id}
            </Link>
            .
          </p>
        ) : (
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-800">
            Nobody can see this event yet.
          </p>
        )}

        <EventForm eventId={event.id} defaults={eventInputFrom(event)} />

        <section className="mt-16 border-t border-rule pt-8" aria-labelledby="danger-heading">
          <h2
            id="danger-heading"
            className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl"
          >
            Delete
          </h2>
          <p className="mt-3 max-w-prose leading-relaxed text-ink-800">
            This removes the event and its public link for good.
          </p>
          <DeleteEvent id={event.id} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
