"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, signUp, type AuthFormState } from "./actions";
import ProfileFields from "./profile-fields";

const INITIAL: AuthFormState = { error: null };

const fieldClass =
  "mt-2 w-full border border-ink-800 bg-white px-3 py-3 text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function AuthForm({
  mode,
  graduationYears = [],
}: {
  mode: "login" | "signup";
  graduationYears?: number[];
}) {
  const action = mode === "signup" ? signUp : signIn;
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const isSignup = mode === "signup";

  if (state.needsConfirm) {
    return (
      <p className="max-w-prose leading-relaxed text-ink-800">
        Check your .edu inbox and confirm the address. Creating an account does
        not make you a member — you still need to complete the application.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-10 max-w-md">
      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          .edu email
        </span>
        <input
          className={fieldClass}
          type="email"
          name="email"
          autoComplete="email"
          required
          inputMode="email"
          defaultValue={state.email}
        />
      </label>
      <label className="mt-6 block">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          password
        </span>
        <input
          className={fieldClass}
          type="password"
          name="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={isSignup ? 8 : undefined}
        />
      </label>
      {isSignup ? (
        <div className="mt-10 border-t border-rule pt-8">
          <ProfileFields defaults={state.details} years={graduationYears} />
        </div>
      ) : null}
      {state.error ? (
        <p className="mt-4 text-sm leading-relaxed text-ink-800" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {pending ? "Working…" : isSignup ? "Create account" : "Log in"}
      </button>
      <p className="mt-6 text-sm leading-relaxed text-ink-800">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-ink-950 underline underline-offset-4 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Log in
            </Link>
          </>
        ) : (
          <>
            Need an account?{" "}
            <Link
              href="/signup"
              className="text-ink-950 underline underline-offset-4 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Create one
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
