export const CLUB_TIME_ZONE = "America/Chicago";

export type EventRecord = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  link: string | null;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type EventInput = {
  title: string;
  description: string;
  location: string;
  link: string;
  all_day: boolean;
  starts_at: string;
  ends_at: string;
  starts_on: string;
  ends_on: string;
  published: boolean;
};

export const EMPTY_EVENT_INPUT: EventInput = {
  title: "",
  description: "",
  location: "",
  link: "",
  all_day: false,
  starts_at: "",
  ends_at: "",
  starts_on: "",
  ends_on: "",
  published: false,
};

/** Seeds the admin form from a stored row, undoing the exclusive `ends_at`. */
export function eventInputFrom(event: EventRecord): EventInput {
  return {
    title: event.title,
    description: event.description ?? "",
    location: event.location ?? "",
    link: event.link ?? "",
    all_day: event.all_day,
    starts_at: event.all_day ? "" : toLocalInput(event.starts_at),
    ends_at: event.all_day ? "" : toLocalInput(event.ends_at),
    starts_on: event.all_day ? toDateInput(event.starts_at) : "",
    ends_on: event.all_day ? toAllDayEndInput(event.ends_at) : "",
    published: event.published,
  };
}

/** Naive timestamps in the club's timezone, as handed to the admin functions. */
export type EventValues = {
  title: string;
  description: string | null;
  location: string | null;
  link: string | null;
  starts_local: string;
  ends_local: string;
  all_day: boolean;
  published: boolean;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOCAL_DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const LINK_PATTERN = /^https?:\/\/\S+$/i;

const dayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: CLUB_TIME_ZONE,
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: CLUB_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

const clubPartsFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: CLUB_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function isEventId(value: string) {
  return UUID_PATTERN.test(value);
}

function clubParts(iso: string) {
  const parts = clubPartsFormat.formatToParts(new Date(iso));
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

/**
 * Club-local wall clock as `YYYY-MM-DDTHH:mm`, the shape `datetime-local`
 * inputs expect. Calendar events are anchored to the club's timezone rather than
 * the reader's, so a meeting at 6 PM in Dallas reads as 6 PM everywhere.
 */
export function toLocalInput(iso: string) {
  return clubParts(iso);
}

export function toDateInput(iso: string) {
  return clubParts(iso).slice(0, 10);
}

/** `ends_at` is exclusive, so an all-day event's last day is one day earlier. */
export function toAllDayEndInput(iso: string) {
  return clubParts(new Date(Date.parse(iso) - 1).toISOString()).slice(0, 10);
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

type EventTiming = Pick<EventRecord, "starts_at" | "ends_at" | "all_day">;

export function eventDayLabel(event: EventTiming) {
  return dayFormat.format(new Date(event.starts_at));
}

export function eventTimeLabel(event: EventTiming) {
  if (event.all_day) return "All day";
  return `${timeFormat.format(new Date(event.starts_at))} – ${timeFormat.format(new Date(event.ends_at))}`;
}

export function eventWhenLabel(event: EventTiming) {
  if (!event.all_day) return `${eventDayLabel(event)} · ${eventTimeLabel(event)}`;
  const lastDay = dayFormat.format(new Date(Date.parse(event.ends_at) - 1));
  const firstDay = eventDayLabel(event);
  return firstDay === lastDay ? firstDay : `${firstDay} – ${lastDay}`;
}

/** First paragraph of the description, cut at a word boundary for previews. */
export function eventSummary(description: string | null, max = 160) {
  if (!description) return null;
  const first = description.split(/\r?\n\s*\r?\n/)[0].replace(/\s+/g, " ").trim();
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–—-]+$/, "")}…`;
}

export function isUpcoming(event: Pick<EventRecord, "ends_at">) {
  return Date.parse(event.ends_at) >= Date.now();
}

/**
 * `ends_at` is exclusive throughout, so an all-day event is stored as midnight
 * at the close of its final day. That matches what FullCalendar expects, which
 * lets the grid take `starts_at` and `ends_at` verbatim as club-local times.
 */
export function readEvent(formData: FormData): {
  input: EventInput;
  values: EventValues | null;
  error: string | null;
} {
  const input: EventInput = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "")
      .replace(/\r\n?/g, "\n")
      .trim(),
    location: String(formData.get("location") ?? "").trim(),
    link: String(formData.get("link") ?? "").trim(),
    all_day: formData.get("all_day") === "on",
    starts_at: String(formData.get("starts_at") ?? "").trim(),
    ends_at: String(formData.get("ends_at") ?? "").trim(),
    starts_on: String(formData.get("starts_on") ?? "").trim(),
    ends_on: String(formData.get("ends_on") ?? "").trim(),
    published: formData.get("published") === "on",
  };
  const fail = (error: string) => ({ input, values: null, error });

  if (!input.title) return fail("Enter an event title.");
  if (input.title.length > 120) return fail("Title must be 120 characters or fewer.");
  if (input.description.length > 2000) {
    return fail("Description must be 2000 characters or fewer.");
  }
  if (input.location.length > 200) return fail("Location must be 200 characters or fewer.");
  if (input.link.length > 500) return fail("Link must be 500 characters or fewer.");
  if (input.link && !LINK_PATTERN.test(input.link)) {
    return fail("Link must start with http:// or https://");
  }

  let starts_local: string;
  let ends_local: string;

  if (input.all_day) {
    if (
      !DATE_PATTERN.test(input.starts_on) ||
      !DATE_PATTERN.test(input.ends_on)
    ) {
      return fail("Choose the first and last day of the event.");
    }
    if (input.ends_on < input.starts_on) {
      return fail("The last day cannot be before the first day.");
    }
    starts_local = `${input.starts_on}T00:00:00`;
    ends_local = `${addDays(input.ends_on, 1)}T00:00:00`;
  } else {
    if (
      !LOCAL_DATETIME_PATTERN.test(input.starts_at) ||
      !LOCAL_DATETIME_PATTERN.test(input.ends_at)
    ) {
      return fail("Choose when the event starts and ends.");
    }
    starts_local = `${input.starts_at}:00`;
    ends_local = `${input.ends_at}:00`;
    if (ends_local <= starts_local) {
      return fail("An event must end after it starts.");
    }
  }

  return {
    input,
    error: null,
    values: {
      title: input.title,
      description: input.description || null,
      location: input.location || null,
      link: input.link || null,
      starts_local,
      ends_local,
      all_day: input.all_day,
      published: input.published,
    },
  };
}
