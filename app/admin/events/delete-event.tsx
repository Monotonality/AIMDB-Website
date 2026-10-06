"use client";

import { deleteEvent } from "./actions";

export default function DeleteEvent({ id }: { id: string }) {
  return (
    <form
      action={deleteEvent}
      className="mt-6"
      onSubmit={(event) => {
        if (!window.confirm("Delete this event for good?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex min-h-11 items-center border border-ink-800 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-950 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        Delete event
      </button>
    </form>
  );
}
