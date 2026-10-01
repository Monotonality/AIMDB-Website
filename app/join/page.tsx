import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Joining | AIMDB",
  description:
    "How joining AIMDB works: what the application asks for, the statuses your submission moves through, and who reviews it.",
};

const STEPS = [
  {
    state: "draft",
    title: "Start your application",
    body: "Your application saves as you go, so you can finish it later instead of losing work. Nothing is sent for review until you submit.",
  },
  {
    state: "submitted / awaiting review",
    title: "Club administration reviews it",
    body: "Once submitted, your application enters review. You can see that it is awaiting review, so you are never left guessing where it stands.",
  },
  {
    state: "accepted / denied",
    title: "You get a decision",
    body: "You see the outcome. Acceptance is what makes you an active member of the club.",
  },
];

const ASKS = [
  "Contact information",
  "Academic details: year, expected graduation, major or track",
  "Technical interests",
];

export default function JoinPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <section className="py-16 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
            joining
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-ink-950 sm:text-5xl">
            How joining works.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-800">
            Joining runs through a tracked pipeline rather than an open sign-up.
            Your application moves through a small number of clear states, and
            you can see which one it is in.
          </p>
        </section>

        <section className="border-y border-rule py-14 md:py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
            the pipeline
          </p>
          <ol className="mt-6 divide-y divide-rule border-t border-rule">
            {STEPS.map((step, i) => (
              <li
                key={step.state}
                className="grid gap-3 py-8 md:grid-cols-12 md:gap-8"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-600 md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="md:col-span-4">
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-950">
                    {step.state}
                  </h2>
                </div>
                <div className="md:col-span-7">
                  <h3 className="text-xl font-bold tracking-tight text-ink-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-prose leading-relaxed text-ink-800">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
              what we ask for
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
              A short application.
            </h2>
            <ul className="mt-6 space-y-3">
              {ASKS.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 leading-relaxed text-ink-800"
                >
                  <span
                    aria-hidden="true"
                    className="mt-3 h-px w-3 shrink-0 bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="md:col-span-6">
            <div className="border border-ink-800 bg-white/70 p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
                ready?
              </p>
              <p className="mt-4 leading-relaxed text-ink-800">
                Applications open at the semester kickoff, when activities and
                expectations for the term are set.
              </p>
              <Link
                href="/apply"
                className="mt-6 flex w-full items-center justify-center bg-ink-950 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Apply to join
              </Link>
              <p className="mt-5 border-t border-rule pt-5 text-sm leading-relaxed text-ink-700">
                Questions first?{" "}
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center text-ink-950 underline underline-offset-4 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Contact us
                </Link>{" "}
                and we will point you in the right direction.
              </p>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}