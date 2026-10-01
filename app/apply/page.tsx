import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Apply | AIMDB",
  description:
    "The AIMDB application pipeline opens at the semester kickoff. Track your submission from draft to decision.",
};

export default function ApplyPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 md:py-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          application pipeline
        </p>
        <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          Applications are not open yet.
        </h1>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-ink-800">
          The application form is built to open at the semester kickoff meeting,
          once activities and membership expectations are set for the term. Until
          then, this page is intentionally empty rather than pretending to collect
          your details.
        </p>

        <ol className="mt-10 divide-y divide-rule border-y border-rule">
          {[
            ["draft", "Start your application and save it for later."],
            [
              "submitted / awaiting review",
              "Club administration reviews every submission.",
            ],
            ["accepted / denied", "You see your decision, and why you are a member."],
          ].map(([state, body]) => (
            <li
              key={state}
              className="grid gap-2 py-4 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                {state}
              </span>
              <span className="text-sm leading-relaxed text-ink-800">{body}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/join"
            className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            How joining works
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Ask a question
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}