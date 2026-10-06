import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUser, getProfile } from "@/lib/auth";
import SiteFooter from "../../../site-footer";
import SiteHeader from "../../../site-header";
import EventForm from "../event-form";

export const metadata: Metadata = {
  title: "New event | AIMDB admin",
};

export default async function NewEventPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/profile");

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
          New event.
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-800">
          Leave it unpublished to keep it as a draft. Publishing puts it on the
          public calendar and gives it a shareable link at{" "}
          <code className="font-mono text-base">/events/&lt;id&gt;</code>.
        </p>
        <EventForm />
      </main>
      <SiteFooter />
    </>
  );
}
