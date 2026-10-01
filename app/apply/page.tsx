import type { Metadata } from "next";
import Link from "next/link";
import ApplicationForm from "./application-form";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getProfile, type Application } from "@/lib/auth";
import {
  academicYearLabel,
  displayName,
  graduationLabel,
} from "@/lib/profile-details";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Apply | AIMDB",
  description:
    "Complete the AIMDB membership form. Membership starts once your payment is verified.",
};

export default async function ApplyPage() {
  const user = await getAuthUser();
  const profile = user ? await getProfile() : null;

  let application: Application | null = null;
  if (user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("applications")
      .select(
        "id, user_id, status, personal_email, phone, degree_level, transaction_id, accepted_rules, paid_fee, accepted_communication, submitted_at, payment_verified, payment_verified_at",
      )
      .eq("user_id", user.id)
      .maybeSingle();
    application = data as Application | null;
  }

  const submitted = application?.status === "submitted";
  const member = profile?.is_member === true;
  const paymentApproved = application?.payment_verified === true;
  const isAdmin = profile?.role === "admin";
  const done = submitted || member || isAdmin;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          application
        </p>
        <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          {member && !isAdmin
            ? "You're a member."
            : submitted
              ? "Application submitted."
              : isAdmin
                ? "You already have admin access."
                : "AIMDB membership form."}
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-800">
          {user
            ? member && !isAdmin
              ? "Your application has been accepted and your account is marked as a member."
              : submitted
                ? paymentApproved
                  ? "Your payment has been approved. An officer will accept your membership shortly, and a confirmation email follows."
                  : "We are verifying your payment. Your account becomes a member once an officer confirms it and accepts your application, and a confirmation email follows."
                : isAdmin
                  ? "The first account on this site is an administrator. You do not need to apply to hold that role."
                  : "Complete the form below to become an AIMDB member. Until your payment is verified, you are an account holder, not a member."
            : "Create an account with a .edu email, then complete this form. Signing up does not make you a member."}
        </p>

        {!user ? (
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Log in
            </Link>
          </div>
        ) : done ? (
          <Link
            href="/profile"
            className="mt-10 inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            View account
          </Link>
        ) : (
          <>
            <dl className="mt-10 max-w-xl divide-y divide-rule border-y border-rule">
              {[
                ["name", displayName(profile)],
                ["academic year", academicYearLabel(profile?.academic_year ?? null)],
                ["major", profile?.major ?? null],
                [
                  "graduation",
                  graduationLabel(
                    profile?.graduation_semester ?? null,
                    profile?.graduation_year ?? null,
                  ),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-2 py-3 sm:grid-cols-[minmax(0,10rem)_1fr]"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                    {label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-ink-800">
                    {value ?? "Missing"}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm leading-relaxed text-ink-800">
              These come from your account.{" "}
              <Link
                href="/profile"
                className="text-ink-950 underline underline-offset-4 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Edit them on your account page
              </Link>
              .
            </p>
            <ApplicationForm application={application} />
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
