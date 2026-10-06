"use client";

import { useActionState, useState } from "react";
import { EMPTY_EVENT_INPUT, type EventInput } from "@/lib/events";
import { createEvent, updateEvent, type EventFormState } from "./actions";

const INITIAL: EventFormState = { error: null, input: null };

const labelClass = "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700";

const fieldClass =
  "mt-2 w-full border border-ink-800 bg-white px-3 py-3 text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function EventForm({
  eventId,
  defaults,
}: {
  eventId?: string;
  defaults?: EventInput;
}) {
  const [state, formAction, pending] = useActionState(
    eventId ? updateEvent : createEvent,
    INITIAL,
  );
  const [allDay, setAllDay] = useState(defaults?.all_day ?? false);
  const value = state.input ?? defaults ?? EMPTY_EVENT_INPUT;

  return (
    <form action={formAction} className="mt-10 max-w-xl">
      {eventId ? <input type="hidden" name="id" value={eventId} /> : null}

      <label className="block">
        <span className={labelClass}>title</span>
        <input
          className={fieldClass}
          type="text"
          name="title"
          required
          maxLength={120}
          defaultValue={value.title}
        />
      </label>

      <fieldset className="mt-6">
        <legend className={labelClass}>when</legend>
        <label className="mt-3 flex min-h-11 items-center gap-3">
          <input
            type="checkbox"
            name="all_day"
            className="size-4 accent-ink-950"
            checked={allDay}
            onChange={(event) => setAllDay(event.target.checked)}
          />
          <span className="text-sm text-ink-950">All day, no start or end time</span>
        </label>

        {allDay ? (
          <div className="mt-3 grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>first day</span>
              <input
                className={fieldClass}
                type="date"
                name="starts_on"
                required
                defaultValue={value.starts_on}
              />
            </label>
            <label className="block">
              <span className={labelClass}>last day</span>
              <input
                className={fieldClass}
                type="date"
                name="ends_on"
                required
                defaultValue={value.ends_on}
              />
            </label>
          </div>
        ) : (
          <div className="mt-3 grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>starts</span>
              <input
                className={fieldClass}
                type="datetime-local"
                name="starts_at"
                required
                defaultValue={value.starts_at}
              />
            </label>
            <label className="block">
              <span className={labelClass}>ends</span>
              <input
                className={fieldClass}
                type="datetime-local"
                name="ends_at"
                required
                defaultValue={value.ends_at}
              />
            </label>
          </div>
        )}
        <p className="mt-3 text-sm leading-relaxed text-ink-700">
          Times are read as Central, the club&rsquo;s timezone.
        </p>
      </fieldset>

      <label className="mt-6 block">
        <span className={labelClass}>location</span>
        <input
          className={fieldClass}
          type="text"
          name="location"
          maxLength={200}
          defaultValue={value.location}
        />
      </label>

      <label className="mt-6 block">
        <span className={labelClass}>external link (optional)</span>
        <input
          className={fieldClass}
          type="url"
          name="link"
          maxLength={500}
          placeholder="https://"
          defaultValue={value.link}
          aria-describedby="link-help"
        />
        <span id="link-help" className="mt-2 block text-sm leading-relaxed text-ink-700">
          Registration, RSVP, or meeting link. Every event already gets its own
          shareable page.
        </span>
      </label>

      <label className="mt-6 block">
        <span className={labelClass}>description</span>
        <span className="mt-1 block text-sm leading-relaxed text-ink-700">
          The first paragraph is the brief summary shown on the calendar list
          and in shared links.
        </span>
        <textarea
          className={`${fieldClass} min-h-40 resize-y`}
          name="description"
          rows={6}
          maxLength={2000}
          defaultValue={value.description}
        />
      </label>

      <label className="mt-6 flex min-h-11 items-center gap-3">
        <input
          type="checkbox"
          name="published"
          className="size-4 accent-ink-950"
          defaultChecked={value.published}
        />
        <span className="text-sm text-ink-950">
          Published — visible to everyone on the public calendar
        </span>
      </label>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {pending ? "Saving…" : eventId ? "Save event" : "Create event"}
        </button>
        {state.error ? (
          <p className="text-sm leading-relaxed text-ink-800" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
