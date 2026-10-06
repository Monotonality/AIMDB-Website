import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getProfile, type Application } from "@/lib/auth";
import { eventWhenLabel, isUpcoming, type EventRecord } from "@/lib/events";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Admin | AIMDB",
  description: "Manage AIMDB accounts, memberships, and events.",
};

type AccountSummary = {
  is_member: boolean;
  applications: Pick<Application, "status">[] | Pick<Application, "status"> | null;
};

type EventSummary = Pick<
  EventRecord,
  "id" | "title" | "starts_at" | "ends_at" | "all_day" | "published"
>;

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

function SectionCard({
  href,
  label,
  title,
  stats,
  note,
  action,
}: {
  href: string;
  label: string;
  title: string;
  stats: string;
  note?: ReactNode;
  action: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex h-full flex-col border border-ink-950 bg-white/50 p-6 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          {label}
        </span>
        <span className="mt-3 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
          {title}
        </span>
        <span className="mt-3 leading-relaxed text-ink-800">{stats}</span>
        {note ? (
          <span className="mt-2 text-sm leading-relaxed text-ink-800">{note}</span>
        ) : null}
        <span className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-950 group-hover:underline group-hover:underline-offset-4">
          {action} →
        </span>
      </Link>
    </li>
  );
}

export default async function AdminPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/profile");

  const supabase = await createClient();
  const [accountsResult, eventsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("is_member, applications!applications_user_id_fkey(status)"),
    supabase
      .from("events")
      .select("id, title, starts_at, ends_at, all_day, published")
      .order("starts_at", { ascending: true }),
  ]);

  const accounts = (accountsResult.data ?? []) as AccountSummary[];
  let members = 0;
  let waiting = 0;
  for (const account of accounts) {
    if (account.is_member) {
      members++;
      continue;
    }
    const application = Array.isArray(account.applications)
      ? account.applications[0]
      : account.applications;
    if (application?.status === "submitted") waiting++;
  }

  const events = (eventsResult.data ?? []) as EventSummary[];
  let published = 0;
  let next: EventSummary | null = null;
  for (const event of events) {
    if (!event.published) continue;
    published++;
    if (!next && isUpcoming(event)) next = event;
  }
  const drafts = events.length - published;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          admin
        </p>
        <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          Admin.
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-800">
          Review applications, manage accounts, and keep the public calendar up
          to date.
        </p>

        {waiting > 0 ? (
          <p className="mt-8 max-w-prose border-l-2 border-ink-950 pl-4 leading-relaxed text-ink-950">
            <span className="font-bold">
              {plural(waiting, "application is", "applications are")} waiting for
              review.
            </span>{" "}
            <Link
              href="/admin/accounts"
              className="underline underline-offset-4 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Review now
            </Link>
          </p>
        ) : null}

        {accountsResult.error || eventsResult.error ? (
          <p className="mt-8 text-sm leading-relaxed text-ink-800" role="alert">
            Some figures could not load:{" "}
            {accountsResult.error?.message ?? eventsResult.error?.message}
          </p>
        ) : null}

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          <SectionCard
            href="/admin/accounts"
            label="accounts"
            title="Accounts and members"
            stats={`${plural(accounts.length, "account", "accounts")}, ${plural(members, "member", "members")}.`}
            note={
              waiting > 0
                ? `${plural(waiting, "application", "applications")} waiting for review.`
                : "No applications waiting for review."
            }
            action="Manage accounts"
          />
          <SectionCard
            href="/admin/events"
            label="events"
            title="Events calendar"
            stats={`${plural(published, "published event", "published events")}, ${plural(drafts, "draft", "drafts")}.`}
            note={
              next
                ? `Next up: ${next.title}, ${eventWhenLabel(next)}.`
                : "Nothing upcoming is published."
            }
            action="Manage events"
          />
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
