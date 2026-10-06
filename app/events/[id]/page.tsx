import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { SHARE_IMAGE } from "@/lib/share-image";
import { createClient } from "@/lib/supabase/server";
import {
  eventSummary,
  eventWhenLabel,
  isEventId,
  type EventRecord,
} from "@/lib/events";
import SiteFooter from "../../site-footer";
import SiteHeader from "../../site-header";
import ShareEvent from "./share-event";

const COLUMNS =
  "id, title, description, location, link, starts_at, ends_at, all_day, published, created_at, updated_at";

const getEvent = cache(async (id: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select(COLUMNS)
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  return data as EventRecord | null;
});

function shareText(event: EventRecord) {
  return [eventWhenLabel(event), event.location, eventSummary(event.description)]
    .filter(Boolean)
    .join(" · ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isEventId(id)) return { title: "Event | AIMDB" };

  const event = await getEvent(id);
  if (!event) return { title: "Event | AIMDB" };

  const description = shareText(event);
  return {
    title: `${event.title} | AIMDB`,
    description,
    openGraph: {
      title: event.title,
      description,
      siteName: "AIMDB",
      type: "article",
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [SHARE_IMAGE],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isEventId(id)) notFound();

  const event = await getEvent(id);
  if (!event) notFound();

  const rows: [string, string | null][] = [
    ["when", eventWhenLabel(event)],
    ["location", event.location],
    ["link", event.link],
  ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 md:py-24">
        <Link
          href="/events"
          className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ← All events
        </Link>
        <h1 className="mt-4 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          {event.title}
        </h1>

        <ShareEvent title={event.title} text={shareText(event)} />

        <dl className="mt-10 divide-y divide-rule border-y border-rule">
          {rows.map(([label, value]) =>
            label === "link" && value ? (
              <div
                key={label}
                className="grid gap-2 py-3 sm:grid-cols-[minmax(0,12rem)_1fr]"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                  {label}
                </dt>
                <dd className="min-w-0 text-sm leading-relaxed">
                  <a
                    href={value}
                    rel="noopener noreferrer nofollow"
                    className="inline-flex min-h-11 items-center break-all text-ink-950 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {value}
                  </a>
                </dd>
              </div>
            ) : (
              <div
                key={label}
                className="grid gap-2 py-3 sm:grid-cols-[minmax(0,12rem)_1fr]"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                  {label}
                </dt>
                <dd className="break-words text-sm leading-relaxed text-ink-950">
                  {value ?? "—"}
                </dd>
              </div>
            ),
          )}
        </dl>

        {event.description ? (
          <section className="mt-12" aria-labelledby="details-heading">
            <h2
              id="details-heading"
              className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl"
            >
              Details
            </h2>
            <div className="mt-6 max-w-prose space-y-4 leading-relaxed text-ink-800">
              {event.description.split(/\r?\n\s*\r?\n/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
