import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Contact | AIMDB",
  description:
    "Contact AIMDB, the AI & In-Memory Database Club at UT Dallas, Naveen Jindal School of Management.",
};

const CHANNELS = [
  {
    label: "email",
    value: "naser.islam@utdallas.edu",
    href: "mailto:naser.islam@utdallas.edu",
  },
  { label: "phone", value: "972.883.5025", href: "tel:+19728835025" },
  { label: "office", value: "JSOM 2.415", href: null },
];

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <section className="py-16 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
            contact
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-ink-950 sm:text-5xl">
            Get in touch.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-800">
            Questions about joining, the subject matter, or the club in general
            . Reach out and we will point you in the right direction.
          </p>
        </section>

        <section className="grid gap-10 border-y border-rule py-14 md:grid-cols-12 md:py-16">
          <div className="md:col-span-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
              academic advisor
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
              Naser Islam
            </h2>
            <p className="mt-3 leading-relaxed text-ink-800">
              Associate Professor of Practice in Information Systems, Academic
              Advisor of the AIMDB. Previously an SAP functional consultant.
            </p>
          </div>

          <div className="md:col-span-6">
            <dl className="divide-y divide-rule border-t border-rule">
              {CHANNELS.map((c) => (
                <div
                  key={c.label}
                  className="flex flex-wrap items-baseline justify-between gap-4 py-4"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                    {c.label}
                  </dt>
                  <dd className="text-sm text-ink-950">
                    {c.href ? (
                      <a
                        href={c.href}
                        className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      >
                        {c.value}
                      </a>
                    ) : (
                      c.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="grid gap-10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
              joining?
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
              Start with the process.
            </h2>
            <p className="mt-5 max-w-prose leading-relaxed text-ink-800">
              If your question is about applying, the joining page explains every
              step and status before you start.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/join"
                className="inline-flex min-h-11 items-center px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-950 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Read the joining process
              </Link>
              <Link
                href="/apply"
                className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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