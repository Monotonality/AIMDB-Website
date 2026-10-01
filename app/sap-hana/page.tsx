import type { Metadata } from "next";
import Link from "next/link";
import ImdbTerm from "../imdb-term";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "SAP HANA | AIMDB",
  description:
    "What SAP HANA is, how its in-memory architecture works, and why it matters for analytics and AI workloads.",
};

const POINTS = [
  {
    title: "An in-memory database",
    body: "HANA stores data in memory rather than relying on disk for most operations, which is the same core idea behind in-memory database technology more broadly.",
  },
  {
    title: "Built for analytics",
    body: "It is designed to run complex queries and aggregations over large volumes of business data quickly, which is the kind of work enterprise analytics depends on.",
  },
  {
    title: "Part of a platform",
    body: "HANA sits inside SAP's business application ecosystem, so it is tied to the systems where a lot of enterprise data actually lives.",
  },
  {
    title: "A concrete example",
    body: "Studying a real system like this makes the theory concrete. You can see how an in-memory architecture changes what queries become practical.",
  },
];

export default function SapHanaPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6">
        <section className="py-16 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
            explainer
          </p>
          <h1 className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight text-ink-950 sm:text-5xl">
            What is SAP HANA?
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-800">
            SAP HANA is an in-memory database platform from SAP. It is one of
            the most widely deployed examples of the technology AIMDB works
            with, and it shows what that architecture looks like at scale.
          </p>
        </section>

        <section className="grid gap-6 border-y border-rule py-10 md:grid-cols-2 md:py-14">
          {POINTS.map((p) => (
            <div key={p.title} className="border border-rule bg-white/60 p-6">
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
              the bigger picture
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-800">
              HANA is one example of a much wider category. If the architecture
              is new to you, start with{" "}
              <ImdbTerm>what an in-memory database is</ImdbTerm>, then come back
              here.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/join"
                className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Joining process
              </Link>
              <Link
                href="/what-is-in-memory-db"
                className="inline-flex min-h-11 items-center px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                In-memory databases
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}