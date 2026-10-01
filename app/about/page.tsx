import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ImdbTerm from "../imdb-term";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "About | AIMDB",
  description:
    "AIMDB explores artificial intelligence and in-memory database technology through hands-on projects, workshops, and industry-focused discussion.",
};

const FOCUS = [
  {
    kicker: "the subject",
    title: "AI and in-memory databases",
    body: (
      <>
        The intersection of artificial intelligence and{" "}
        <ImdbTerm>in-memory database technology</ImdbTerm>, and how the two
        reinforce each other underneath everything else.
      </>
    ),
  },
  {
    kicker: "the layer above",
    title: "Enterprise analytics",
    body: "The analytics systems built on those foundations, and the problems they are actually used to solve.",
  },
  {
    kicker: "the method",
    title: "Hands-on, not lecture",
    body: "Hands-on projects, workshops, industry-focused discussions, and networking. You build things rather than watch them.",
  },
];

const SCENES = [
  {
    src: "/images/laptops.webp",
    alt: "Members working at laptops during a club session",
    caption: "Hands-on sessions. You build things rather than watch them.",
  },
  {
    src: "/images/crowd.webp",
    alt: "A crowd of people gathered in a room for a club event",
    caption: "Industry-focused discussion and networking events.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <section className="py-16 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
            about
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-ink-950 sm:text-5xl">
            We bridge theory and application.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-800">
            AIMDB is a student-run club at UT Dallas, exploring the intersection
            of artificial intelligence and{" "}
            <ImdbTerm>in-memory database technology</ImdbTerm> through
            hands-on projects, industry-focused discussion, networking events,
            and workshops.
          </p>
        </section>

        <section className="grid gap-px border-y border-rule bg-rule md:grid-cols-3">
          {FOCUS.map((item) => (
            <div key={item.kicker} className="bg-sheet px-6 py-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
                {item.kicker}
              </p>
              <h2 className="mt-4 text-xl font-bold tracking-tight text-ink-950">
                {item.title}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-800">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="border-t border-rule py-16 md:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
            in the room
          </p>
          <div className="mt-7 grid gap-px border border-rule bg-rule md:grid-cols-2">
            {SCENES.map((scene) => (
              <figure key={scene.src} className="bg-sheet">
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-white/50">
                  <Image
                    src={scene.src}
                    alt={scene.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-5 py-4 text-sm leading-relaxed text-ink-800">
                  {scene.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="grid gap-10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
              need help joining?
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
              How the application works.
            </h2>
            <p className="mt-5 leading-relaxed text-ink-800">
              Not sure what to expect, or what happens after you submit? The
              full process is explained step by step, including what each status
              means, who reviews it, and what happens next.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/join"
                className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Read the joining process
              </Link>
              <Link
                href="/apply"
                className="inline-flex min-h-11 items-center px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Apply instead
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}