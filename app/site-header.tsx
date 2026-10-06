import Link from "next/link";
import Logo from "./logo";
import { getAuthUser, getProfile } from "@/lib/auth";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/join", label: "Join" },
  { href: "/events", label: "Events" },
  { href: "/officers", label: "Officers" },
  { href: "/contact", label: "Contact" },
];

export default async function SiteHeader() {
  const user = await getAuthUser();
  const profile = user ? await getProfile() : null;
  const isAdmin = profile?.role === "admin" && !profile.deactivated_at;

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
        <Link href="/" aria-label="AIMDB home" className="flex shrink-0 items-center">
          <Logo />
        </Link>

        <nav
          aria-label="Primary"
          className="order-last flex w-full items-center justify-between gap-4 sm:order-none sm:w-auto sm:justify-end sm:gap-7"
        >
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {user ? (
            <div className="flex shrink-0 items-center gap-2">
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="inline-flex min-h-11 items-center bg-ink-950 px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                href="/profile"
                className="inline-flex min-h-11 items-center border border-ink-950 px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-950 transition-colors hover:bg-ink-950 hover:text-sheet focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Account
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-11 shrink-0 items-center border border-ink-950 px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-950 transition-colors hover:bg-ink-950 hover:text-sheet focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
