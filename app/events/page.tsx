import type { Metadata } from "next";
import Link from "next/link";
import { SHARE_IMAGE } from "@/lib/share-image";
import { createClient } from "@/lib/supabase/server";
import {
  eventDayLabel,
  eventSummary,
  eventTimeLabel,
  isUpcoming,
  type EventRecord,
} from "@/lib/events";
import type { CalendarEntry } from "./calendar";
import Calendar from "./calendar-loader";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

const description =
  "Hands-on projects, industry discussions, networking events, and workshops from AIMDB.";

export const metadata: Metadata = {
  title: "Events | AIMDB",
  description,
  openGraph: {
    title: "AIMDB events",
    description,
    siteName: "AIMDB",
    type: "website",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIMDB events",
    description,
    images: [SHARE_IMAGE],
  },
};

const COLUMNS =
  "id, title, description, location, link, starts_at, ends_at, all_day, published, created_at, updated_at";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(COLUMNS)
    .eq("published", true)
    .order("starts_at", { ascending: true });

  const events = (data ?? []) as EventRecord[];
  const upcoming = events.filter(isUpcoming);
  const past = events.filter((event) => !isUpcoming(event)).reverse();

  const entries: CalendarEntry[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    starts_at: event.starts_at,
    ends_at: event.ends_at,
    all_day: event.all_day,
    location: event.location,
    summary: eventSummary(event.description),
  }));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          calendar
        </p>
        <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          Events.
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-800">
          Everything AIMDB has scheduled, in club time (Central). Select an entry to
          read its details.
        </p>

        {error ? (
          <p className="mt-10 text-sm leading-relaxed text-ink-800" role="alert">
            Could not load events: {error.message}
          </p>
        ) : null}

        <div className="mt-12 border-y border-rule py-6">
          <Calendar entries={entries} />
        </div>

        <section className="mt-14" aria-labelledby="upcoming-heading">
          <h2
            id="upcoming-heading"
            className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl"
          >
            Upcoming
          </h2>
          {upcoming.length > 0 ? (
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {upcoming.map((event) => {
                const summary = eventSummary(event.description);
                return (
                <li key={event.id}>
                  <Link
                    href={`/events/${event.id}`}
                    className="grid gap-2 py-4 transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6"
                  >
                    <span className="font-mono text-sm text-ink-700">
                      {eventDayLabel(event)}
                      <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-ink-600">
                        {eventTimeLabel(event)}
                      </span>
                    </span>
                    <span className="leading-relaxed">
                      <span className="block text-lg font-bold tracking-tight text-ink-950">
                        {event.title}
                      </span>
                      {event.location ? (
                        <span className="mt-1 block text-sm text-ink-800">
                          {event.location}
                        </span>
                      ) : null}
                      {summary ? (
                        <span className="mt-2 block max-w-prose text-sm text-ink-800">
                          {summary}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 max-w-prose leading-relaxed text-ink-800">
              Nothing is scheduled yet. Officers post dates here as they are
              confirmed.
            </p>
          )}
        </section>

        {past.length > 0 ? (
          <section className="mt-14" aria-labelledby="past-heading">
            <h2
              id="past-heading"
              className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl"
            >
              Past
            </h2>
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {past.map((event) => (
                <li key={event.id}>
                  <Link
                    href={`/events/${event.id}`}
                    className="grid gap-2 py-4 text-ink-600 transition-colors hover:bg-white/60 hover:text-ink-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6"
                  >
                    <span className="font-mono text-sm">
                      {eventDayLabel(event)}
                    </span>
                    <span className="font-bold">{event.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
