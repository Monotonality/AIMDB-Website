import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700">
          AIMDB &middot; Naveen Jindal School of Management
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-600 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Contact
          </Link>
          <p className="font-mono text-[11px] text-ink-600">UT Dallas</p>
        </div>
      </div>
    </footer>
  );
}