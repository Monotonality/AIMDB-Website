import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "What is an in-memory database? | AIMDB",
  description:
    "A plain-English explanation of in-memory databases, how they compare to disk-based databases, and why they matter for AI and analytics.",
};

const POINTS = [
  {
    title: "Disk-based vs in-memory",
    body: "Traditional databases store data on disk. In-memory databases keep working data in RAM, so reads and writes can happen much faster.",
  },
  {
    title: "Speed enables more interaction",
    body: "Lower latency means it's practical to explore data interactively and to serve workloads where waiting for disk I/O would be a bottleneck.",
  },
  {
    title: "Why it matters for AI",
    body: "Some AI and analytics workloads benefit from fast access to large working sets. Speed helps with iteration and with serving timely results.",
  },
  {
    title: "Why it matters for analytics",
    body: "Enterprise analytics often needs to scan, aggregate, or join across large datasets quickly. In-memory approaches can keep those queries responsive.",
  },
];

export default function ImdbPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6">
        <section className="py-16 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
            explainer
          </p>
          <h1 className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight text-ink-950 sm:text-5xl">
            What is an in-memory database?
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-800">
            An in-memory database stores its working data primarily in RAM
            rather than on disk. That difference is mostly about speed and
            responsiveness.
          </p>
        </section>

        <section className="grid gap-6 border-y border-rule py-10 md:grid-cols-2 md:py-14">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="border border-rule bg-white/60 p-6"
            >
              <h2 className="text-lg font-bold tracking-tight text-ink-950">
                {p.title}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-800">{p.body}</p>
            </div>
          ))}
        </section>

        <section className="py-14 md:py-16">
          <div className="border border-ink-800 bg-white/70 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
              where this fits
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-800">
              AIMDB focuses on the intersection of artificial intelligence and
              in-memory database technology. If you&apos;re curious about getting
              hands-on with this, check out the joining process or apply.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/join"
                className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Joining process
              </Link>
              <Link
                href="/apply"
                className="inline-flex min-h-11 items-center px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Apply
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}