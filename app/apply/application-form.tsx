"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveApplication, type ApplicationFormState } from "./actions";
import type { Application } from "@/lib/auth";
import {
  DEGREE_LEVELS,
  MEMBERSHIP_FEE,
  MEMBERSHIP_RULES,
  ZELLE_EMAIL,
  type MembershipInput,
} from "@/lib/membership";

const INITIAL: ApplicationFormState = { error: null };

const labelClass =
  "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700";

const sectionClass = "border-t border-rule pt-8";

const headingClass =
  "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-950";

const fieldClass =
  "mt-2 w-full border border-ink-800 bg-white px-3 py-3 text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const checkboxClass =
  "mt-1 size-4 shrink-0 accent-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const linkClass =
  "text-ink-950 underline underline-offset-4 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

function fromApplication(application: Application | null): MembershipInput {
  return {
    personal_email: application?.personal_email ?? "",
    phone: application?.phone ?? "",
    degree_level: application?.degree_level ?? "",
    transaction_id: application?.transaction_id ?? "",
    accepted_rules: application?.accepted_rules ?? false,
    paid_fee: application?.paid_fee ?? false,
    accepted_communication: application?.accepted_communication ?? false,
  };
}

export default function ApplicationForm({
  application,
}: {
  application: Application | null;
}) {
  const [state, formAction, pending] = useActionState(saveApplication, INITIAL);
  const values = state.input ?? fromApplication(application);

  return (
    <form action={formAction} className="mt-12 max-w-xl space-y-10">
      <section className={`${sectionClass} space-y-6`}>
        <h2 className={headingClass}>contact</h2>
        <label className="block">
          <span className={labelClass}>personal email</span>
          <input
            className={fieldClass}
            type="email"
            name="personal_email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            defaultValue={values.personal_email}
          />
        </label>
        <label className="block">
          <span className={labelClass}>phone number</span>
          <input
            className={fieldClass}
            type="tel"
            name="phone"
            autoComplete="tel"
            required
            defaultValue={values.phone}
          />
        </label>
        <fieldset>
          <legend className={labelClass}>current degree level</legend>
          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
            {DEGREE_LEVELS.map((level) => (
              <label
                key={level.value}
                className="flex min-h-11 items-center gap-3 text-ink-950"
              >
                <input
                  type="radio"
                  name="degree_level"
                  value={level.value}
                  required
                  defaultChecked={values.degree_level === level.value}
                  className="size-4 accent-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
                {level.label}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>membership rules</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-ink-800">
          {MEMBERSHIP_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>lifetime membership fee</h2>
        <div className="mt-4 border border-ink-800 bg-white/70 p-6">
          <p className="text-3xl font-bold tracking-tight text-ink-950">
            {MEMBERSHIP_FEE}
          </p>
          <p className="mt-4 leading-relaxed text-ink-800">
            To complete your registration, send the fee by Zelle to{" "}
            <span className="font-mono text-sm text-ink-950">{ZELLE_EMAIL}</span>
            .
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-800">
            Your registration will not be processed until we receive the
            payment. A confirmation email will be sent once your payment is
            verified.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-800">
            After completing the payment, continue filling out the form.
          </p>
        </div>
        <label className="mt-6 block">
          <span className={labelClass}>transaction id</span>
          <span
            id="transaction-id-hint"
            className="mt-1 block text-sm leading-relaxed text-ink-700"
          >
            Write the ID from the transaction confirmation Zelle sends after
            you pay. You can copy it from the confirmation email or the
            confirmation screen in your banking app.
          </span>
          <input
            className={fieldClass}
            type="text"
            name="transaction_id"
            autoComplete="off"
            spellCheck={false}
            required
            maxLength={100}
            aria-describedby="transaction-id-hint"
            defaultValue={values.transaction_id}
          />
        </label>
      </section>

      <fieldset className={sectionClass}>
        <legend className={`${headingClass} float-left w-full`}>
          declaration
        </legend>
        <div className="clear-left space-y-4 pt-4">
          <label className="flex gap-3 leading-relaxed text-ink-800">
            <input
              type="checkbox"
              name="accepted_rules"
              required
              defaultChecked={values.accepted_rules}
              className={checkboxClass}
            />
            I have read, understood, and accepted the rules for membership.
          </label>
          <label className="flex gap-3 leading-relaxed text-ink-800">
            <input
              type="checkbox"
              name="paid_fee"
              required
              defaultChecked={values.paid_fee}
              className={checkboxClass}
            />
            I have paid the membership fee.
          </label>
          <label className="flex gap-3 leading-relaxed text-ink-800">
            <input
              type="checkbox"
              name="accepted_communication"
              required
              defaultChecked={values.accepted_communication}
              className={checkboxClass}
            />
            <span>
              I understand Microsoft Teams will be the primary form of
              communication, and that if I am not added to the AIMDB chat
              within 3 days, I will reach out to the{" "}
              <Link href="/contact" className={linkClass}>
                advisor
              </Link>
              .
            </span>
          </label>
        </div>
      </fieldset>

      <p className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink-800">
        Photos may be taken during meetings and events. By submitting this
        form, you agree that AIMDB may use those photos for marketing purposes.
      </p>

      {state.error ? (
        <p className="text-sm leading-relaxed text-ink-800" role="alert">
          {state.error}
        </p>
      ) : state.saved && !pending ? (
        <p className="text-sm leading-relaxed text-ink-800" role="status">
          Draft saved.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          name="intent"
          value="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {pending ? "Working…" : "Submit application"}
        </button>
        <button
          type="submit"
          name="intent"
          value="save"
          formNoValidate
          disabled={pending}
          className="inline-flex min-h-11 items-center px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Save draft
        </button>
      </div>
    </form>
  );
}
