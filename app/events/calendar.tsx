"use client";

import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventDisplayInfo, EventInput } from "@fullcalendar/react";
import classicTheme from "@fullcalendar/react/themes/classic";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import listPlugin from "@fullcalendar/react/list";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { toDateInput, toLocalInput } from "@/lib/events";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";
import "./calendar.css";

export type CalendarEntry = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
  location: string | null;
  summary: string | null;
};

const PLUGINS = [classicTheme, dayGridPlugin, timeGridPlugin, listPlugin];

export default function Calendar({ entries }: { entries: CalendarEntry[] }) {
  const events = useMemo<EventInput[]>(
    () =>
      entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        // Sent as club-local wall clock so a 6 PM meeting in Dallas reads as
        // 6 PM for every reader, not 6 PM in their own timezone.
        start: entry.all_day ? toDateInput(entry.starts_at) : toLocalInput(entry.starts_at),
        end: entry.all_day ? toDateInput(entry.ends_at) : toLocalInput(entry.ends_at),
        allDay: entry.all_day,
        location: entry.location,
        summary: entry.summary,
        // A real anchor per event: shareable, keyboard reachable, middle-clickable.
        url: `/events/${entry.id}`,
      })),
    [entries],
  );

  return (
    <FullCalendar
      plugins={PLUGINS}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listMonth",
      }}
      events={events}
      eventTimeFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
      slotHeaderFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
      slotMinTime="07:00:00"
      slotMaxTime="23:00:00"
      dayHeaderFormat={{ weekday: "short" }}
      views={{
        timeGridWeek: {
          dayHeaderFormat: { weekday: "short", month: "numeric", day: "numeric", omitCommas: true },
        },
      }}
      firstDay={0}
      displayEventTime
      eventContent={renderEntry}
      height="auto"
    />
  );
}

function renderEntry({ event, timeText, isNarrow, view }: EventDisplayInfo) {
  const location = event.extendedProps.location as string | null | undefined;
  const summary = event.extendedProps.summary as string | null | undefined;
  const isList = view.type.startsWith("list");
  return (
    <span className="grid gap-0.5 text-left">
      <span className="font-bold">{event.title}</span>
      {isNarrow || !timeText ? null : (
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-80">
          {timeText}
        </span>
      )}
      {isNarrow || !location ? null : (
        <span className="text-xs opacity-80">{location}</span>
      )}
      {isList && summary ? (
        <span className="max-w-prose text-sm font-normal opacity-90">{summary}</span>
      ) : null}
    </span>
  );
}
