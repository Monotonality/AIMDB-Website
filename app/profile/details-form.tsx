"use client";

import { useActionState } from "react";
import type { ProfileDetailsInput } from "@/lib/profile-details";
import ProfileFields from "../auth/profile-fields";
import { updateDetails, type DetailsFormState } from "./actions";

const INITIAL: DetailsFormState = { error: null };

export default function DetailsForm({
  current,
  years,
}: {
  current: Partial<ProfileDetailsInput>;
  years: number[];
}) {
  const [state, formAction, pending] = useActionState(updateDetails, INITIAL);

  return (
    <form action={formAction} className="mt-8 max-w-xl">
      <ProfileFields defaults={state.details ?? current} years={years} />
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {pending ? "Saving…" : "Save details"}
        </button>
        <p className="text-sm leading-relaxed text-ink-800" role="status">
          {state.error ?? (state.saved && !pending ? "Saved." : null)}
        </p>
      </div>
    </form>
  );
}
