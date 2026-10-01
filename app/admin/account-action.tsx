"use client";

import { useActionState } from "react";
import { updateAccount, type AccountActionState } from "./actions";

const INITIAL: AccountActionState = { error: null };

const toneClass = {
  primary:
    "bg-ink-950 text-sheet hover:bg-ink-800 disabled:opacity-60",
  secondary:
    "border border-ink-800 text-ink-950 hover:bg-white disabled:opacity-60",
};

export default function AccountAction({
  userId,
  operation,
  value,
  label,
  tone = "secondary",
  confirmMessage,
  disabledReason,
}: {
  userId: string;
  operation: "member" | "payment" | "admin" | "active";
  value: boolean;
  label: string;
  tone?: keyof typeof toneClass;
  confirmMessage?: string;
  disabledReason?: string;
}) {
  const [state, formAction, pending] = useActionState(updateAccount, INITIAL);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className="flex flex-col items-start gap-2 sm:items-end"
    >
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="operation" value={operation} />
      <input type="hidden" name="value" value={String(value)} />
      <button
        type="submit"
        disabled={pending || Boolean(disabledReason)}
        className={`inline-flex min-h-11 items-center px-5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed ${toneClass[tone]}`}
      >
        {pending ? "Working…" : label}
      </button>
      {disabledReason ? (
        <p className="text-sm leading-relaxed text-ink-700">{disabledReason}</p>
      ) : null}
      {state.error ? (
        <p className="text-sm leading-relaxed text-ink-800" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
