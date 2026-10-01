import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Officers | AIMDB",
  description:
    "The AIMDB executive board and faculty advisor: interim leadership serving the club while the next board is formed.",
};

type Person = {
  name: string;
  role: string;
  image: string;
  alt: string;
  detail: string;
  links?: { label: string; href: string }[];
};

const PRESIDENT: Person = {
  name: "Adam Torres",
  role: "Interim President",
  image: "/officers/adam.webp",
  alt: "Portrait of Adam Torres",
  detail:
    "B.S. Business Analytics & AI candidate. Applied AI Researcher at Actriant, developing novel applications of NLP in Rapid Serial Visual Presentation. Executive Director, Applied Artificial Intelligence Labs at UTD.",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/adam-venegas-torres/" },
    { label: "Website", href: "https://www.gardenofadam.com/" },
  ],
};

const BOARD: Person[] = [
  {
    name: "Miguel A. Jaimes",
    role: "Interim Vice President",
    image: "/officers/miguel.webp",
    alt: "Portrait of Miguel Jaimes",
    detail: "B.S. Business Analytics & AI candidate",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/migueljaimesprofile/" },
    ],
  },
];

const ADVISOR: Person = {
  name: "Naser Islam",
  role: "Faculty Advisor",
  image: "/officers/naser.webp",
  alt: "Portrait of Naser Islam",
  detail:
    "Associate Professor of Practice, Information Systems. Previously an SAP functional consultant.",
  links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/naser-islam/" }],
};

function PersonLinks({ links }: { links: NonNullable<Person["links"]> }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700 underline decoration-rule-strong underline-offset-4 hover:text-ink-950 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function PresidentCard({ person }: { person: Person }) {
  return (
    <article className="grid bg-sheet md:grid-cols-12">
      <div className="relative aspect-[4/5] overflow-hidden border-b border-rule bg-white/50 md:col-span-5 md:aspect-auto md:min-h-[28rem] md:border-r md:border-b-0">
        <Image
          src={person.image}
          alt={person.alt}
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center px-6 py-8 md:col-span-7 md:px-10 md:py-12">
        <h2 className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
          {person.name}
        </h2>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700">
          {person.role}
        </p>
        <p className="mt-5 max-w-prose leading-relaxed text-ink-800">
          {person.detail}
        </p>
        {person.links ? <PersonLinks links={person.links} /> : null}
      </div>
    </article>
  );
}

function OfficerCard({ person }: { person: Person }) {
  return (
    <article className="bg-sheet md:grid md:grid-cols-[auto_1fr] md:items-start md:gap-5 md:px-6 md:py-7">
      <div className="relative mx-auto aspect-square w-full max-w-44 overflow-hidden border-b border-rule bg-white/50 md:mx-0 md:w-28 md:max-w-none md:shrink-0 md:border">
        <Image
          src={person.image}
          alt={person.alt}
          fill
          sizes="(max-width: 768px) 176px, 112px"
          className="object-cover"
        />
      </div>
      <div className="px-6 py-7 md:px-0 md:py-0">
        <h2 className="text-lg font-bold tracking-tight text-ink-950">
          {person.name}
        </h2>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700">
          {person.role}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-800">
          {person.detail}
        </p>
        {person.links ? <PersonLinks links={person.links} /> : null}
      </div>
    </article>
  );
}

export default function OfficersPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <section className="py-16 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
            officers
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-ink-950 sm:text-5xl">
            The executive board.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-800">
            AIMDB is run by its members, with faculty guidance from the school.
            The club is currently served by an interim board while the next set
            of officers is formed from the membership.
          </p>
        </section>

        <section className="border-y border-rule">
          <PresidentCard person={PRESIDENT} />
          <div className="grid gap-px border-t border-rule bg-rule md:grid-cols-2">
            {[...BOARD, ADVISOR].map((person) => (
              <OfficerCard key={person.role} person={person} />
            ))}
          </div>
        </section>

        <section className="py-14 md:py-16">
          <div className="border border-rule bg-white/60 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
              more roles
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-800">
              The rest of the board is being formed from the membership.
              Interested in taking on a role? Joining is the first step.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
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
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}