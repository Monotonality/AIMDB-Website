import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Joining | AIMDB",
  description:
    "How joining AIMDB works: create a .edu account, then complete the application to become a member.",
};

const STEPS = [
  {
    state: "account",
    title: "Create an account first",
    body: "Before you can apply, register with your .edu email, your name, academic year, major, and expected graduation. That gives you an account. It does not make you a member.",
  },
  {
    state: "draft",
    title: "Fill in the membership form",
    body: "Pay the $15 lifetime fee by Zelle, then add the transaction ID to the form. You can save a draft and finish later. Nothing counts as complete until you submit.",
  },
  {
    state: "submitted",
    title: "We verify your payment",
    body: "An officer matches your transaction ID against the payments received. Your registration is not processed until the payment arrives.",
  },
  {
    state: "member",
    title: "You become a member",
    body: "Once your payment is verified, an officer accepts your application, your account is marked as a member, and you receive a confirmation email. Microsoft Teams is where the club talks from then on.",
  },
];

const ASKS = [
  {
    stage: "when you create an account",
    items: [
      "A .edu email and a password",
      "First and last name",
      "Academic year, major, and expected graduation semester",
    ],
  },
  {
    stage: "in the membership form",
    items: [
      "Personal email and phone number",
      "Current degree level",
      "The Zelle transaction ID for the $15 lifetime fee",
      "Agreement to the membership rules",
    ],
  },
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
            You create an account first, then apply from it. Your application
            moves through a small number of clear states, and you can see which
            one it is in from your account page.
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
              An account, then the membership form.
            </h2>
            {ASKS.map((group) => (
              <div key={group.stage} className="mt-8">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-950">
                  {group.stage}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
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
            ))}
          </div>

          <aside className="md:col-span-6">
            <div className="border border-ink-800 bg-white/70 p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
                ready?
              </p>
              <p className="mt-4 leading-relaxed text-ink-800">
                Start by creating an account with your .edu email. Once you
                confirm it, you can fill in the application. Signing up does not
                make you a member.
              </p>
              <Link
                href="/signup"
                className="mt-6 flex w-full items-center justify-center bg-ink-950 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Create an account
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-ink-700">
                Already have one?{" "}
                <Link
                  href="/apply"
                  className="inline-flex min-h-11 items-center text-ink-950 underline underline-offset-4 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Continue to the application
                </Link>
              </p>
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