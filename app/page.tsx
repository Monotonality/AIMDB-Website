import Image from "next/image";
import Link from "next/link";
import HanaTerm from "./hana-term";
import ImdbTerm from "./imdb-term";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

const FOCUS = [
  { id: "subject", body: "Artificial intelligence and in-memory database technology" },
  {
    id: "analytics",
    body: "Enterprise analytics built on those foundations, including SAP HANA",
  },
  { id: "projects", body: "Hands-on projects and workshops" },
  { id: "industry", body: "Industry-focused discussion and networking" },
];

const LEADERSHIP = [
  {
    name: "Adam Torres",
    role: "Interim President",
    detail: "B.S. Business Analytics & AI candidate",
    image: "/officers/adam.webp",
    alt: "Portrait of Adam Torres",
  },
  {
    name: "Naser Islam",
    role: "Faculty Advisor",
    detail: "Previously an SAP functional consultant",
    image: "/officers/naser.webp",
    alt: "Portrait of Naser Islam",
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <section className="py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
                AI &amp; in-memory database club &middot; ut dallas
              </p>
              <h1 className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight text-ink-950 sm:text-6xl">
                Where theory meets the system that runs it.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-800 sm:text-xl">
                We bridge theory and application across data analytics and
                in-memory systems. We build the understanding behind
                artificial intelligence, then putting it to work.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/apply"
                  className="inline-flex items-center justify-center bg-ink-950 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Apply to join
                </Link>
                <Link
                  href="/join"
                  className="inline-flex min-h-11 items-center px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  How joining works
                </Link>
              </div>
            </div>

            <aside className="md:col-span-4">
              <div className="border border-ink-800 bg-white/70 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
                  what we run
                </p>
                <ul className="mt-5 space-y-3">
                  {FOCUS.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 text-sm leading-relaxed text-ink-800"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-px w-3 shrink-0 bg-accent"
                      />
                      {item.body}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-px border-y border-rule bg-rule md:grid-cols-2">
          <div className="bg-sheet px-6 py-10 md:px-10 md:py-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
              theory
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
              The mechanics underneath.
            </h2>
            <p className="mt-4 max-w-prose leading-relaxed text-ink-800">
              How artificial intelligence and{" "}
              <ImdbTerm>in-memory database technology</ImdbTerm> actually work,
              and the foundations that make everything else possible.
            </p>
          </div>
          <div className="bg-sheet px-6 py-10 md:px-10 md:py-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
              application
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
              The enterprise analytics on top.
            </h2>
            <p className="mt-4 max-w-prose leading-relaxed text-ink-800">
              Hands-on projects, workshops, and industry-focused discussion
              where that understanding meets real problems. Systems like{" "}
              <HanaTerm>SAP HANA</HanaTerm> show what the architecture looks like
              at scale.
            </p>
          </div>
        </section>

        <section className="border-t border-rule py-14 md:py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
            leadership
          </p>
          <div className="mt-7 grid gap-8 sm:grid-cols-2">
            {LEADERSHIP.map((person) => (
              <div key={person.role} className="sm:grid sm:grid-cols-[auto_1fr] sm:items-start sm:gap-5">
                <div className="relative aspect-square w-28 shrink-0 overflow-hidden border border-rule bg-white/50">
                  <Image
                    src={person.image}
                    alt={person.alt}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 sm:mt-0">
                  <h2 className="text-xl font-bold tracking-tight text-ink-950">
                    {person.name}
                  </h2>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700">
                    {person.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-800">
                    {person.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <figure className="mt-10">
            <div className="relative aspect-[3/2] w-full overflow-hidden border border-rule bg-white/50">
              <Image
                src="/images/president-group.webp"
                alt="AIMDB members, including the club president, gathered for a group photo"
                fill
                sizes="(max-width: 768px) 100vw, 1152px"
                quality={90}
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-sm leading-relaxed text-ink-800">
              The club is led by students with real experience, with faculty
              guidance from experts in the field.
            </figcaption>
          </figure>
          <p className="mt-8 max-w-prose leading-relaxed text-ink-800">
            Questions about the club or joining? Reach out to{" "}
            <Link
              href="/contact"
              className="text-ink-950 underline underline-offset-4 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              club administration
            </Link>{" "}
            or see the{" "}
            <Link
              href="/officers"
              className="text-ink-950 underline underline-offset-4 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              full board
            </Link>
            .
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}