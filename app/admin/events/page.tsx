import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getProfile } from "@/lib/auth";
import { eventDayLabel, eventTimeLabel, type EventRecord } from "@/lib/events";
import SiteFooter from "../../site-footer";
import SiteHeader from "../../site-header";

export const metadata: Metadata = {
  title: "Events | AIMDB admin",
  description: "Create, edit, and publish events on the public calendar.",
};

const COLUMNS =
  "id, title, description, location, link, starts_at, ends_at, all_day, published, created_at, updated_at";

export default async function AdminEventsPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/profile");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(COLUMNS)
    .order("starts_at", { ascending: false });

  const events = (data ?? []) as EventRecord[];
  const published = events.filter((event) => event.published).length;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 md:py-24">
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ← Admin
        </Link>
        <h1 className="mt-4 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          Events.
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-800">
          {events.length} {events.length === 1 ? "event" : "events"},{" "}
          {published} published. Drafts stay hidden from the public calendar until
          you publish them.
        </p>

        <div className="mt-8">
          <Link
            href="/admin/events/new"
            className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            New event
          </Link>
        </div>

        {error ? (
          <p className="mt-10 text-sm leading-relaxed text-ink-800" role="alert">
            Could not load events: {error.message}
          </p>
        ) : events.length === 0 ? (
          <p className="mt-10 max-w-prose leading-relaxed text-ink-800">
            No events yet. Create the first one to open the public calendar.
          </p>
        ) : (
          <div className="mt-12 overflow-x-auto border-y border-rule">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead>
                <tr className="border-b border-rule">
                  {["title", "starts", "state", "share", ""].map((label) => (
                    <th
                      key={label}
                      scope="col"
                      className="py-3 pr-6 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-ink-700"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="py-3 pr-6 font-bold text-ink-950">
                      {event.title}
                    </td>
                    <td className="py-3 pr-6 text-ink-800">
                      {eventDayLabel(event)}
                      <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-600">
                        {eventTimeLabel(event)}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-ink-950">
                      {event.published ? "Published" : "Draft"}
                    </td>
                    <td className="py-3 pr-6">
                      {event.published ? (
                        <Link
                          href={`/events/${event.id}`}
                          className="text-ink-800 underline underline-offset-4 hover:text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        >
                          View
                        </Link>
                      ) : (
                        <span className="text-ink-600">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-6 text-right">
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-950 underline underline-offset-4 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
