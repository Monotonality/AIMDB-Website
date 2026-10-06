"use client";

import dynamic from "next/dynamic";
import type { CalendarEntry } from "./calendar";

// FullCalendar is large and its server markup does not hydrate cleanly, so it
// renders in the browser only; the upcoming list below it is server-rendered.
const Calendar = dynamic(() => import("./calendar"), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[28rem] items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700"
      role="status"
    >
      Loading calendar…
    </div>
  ),
});

export default function CalendarLoader({ entries }: { entries: CalendarEntry[] }) {
  return <Calendar entries={entries} />;
}
