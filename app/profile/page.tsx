import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "../auth/actions";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getProfile, type Application } from "@/lib/auth";
import { displayName, graduationYears } from "@/lib/profile-details";
import DetailsForm from "./details-form";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Account | AIMDB",
  description: "Your AIMDB account, membership status, and application.",
};

export default async function ProfilePage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("applications")
    .select("status, submitted_at, payment_verified")
    .eq("user_id", user.id)
    .maybeSingle();
  const application = data as Pick<
    Application,
    "status" | "submitted_at" | "payment_verified"
  > | null;

  const membership = profile?.is_member
    ? profile.role === "admin"
      ? "Admin member"
      : "Member"
    : "Account holder — not a member";

  const applicationState = application?.status ?? "none";
  const detailsMissing =
    !profile?.first_name ||
    !profile.last_name ||
    !profile.academic_year ||
    !profile.major ||
    !profile.graduation_semester ||
    !profile.graduation_year;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          account
        </p>
        <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          {displayName(profile) ?? user.email}
        </h1>
        {profile?.deactivated_at ? (
          <p className="mt-5 max-w-prose border-l-2 border-accent pl-4 leading-relaxed text-ink-800" role="status">
            This account has been deactivated. You cannot make changes. Contact
            an officer if you think this is a mistake.
          </p>
        ) : null}
        <dl className="mt-10 divide-y divide-rule border-y border-rule">
          {[
            ["email", user.email ?? "—"],
            ["status", membership],
            [
              "application",
              applicationState === "submitted"
                ? profile?.is_member
                  ? "Accepted"
                  : application?.payment_verified
                    ? "Submitted — payment approved, awaiting acceptance"
                    : "Submitted — verifying your payment"
                : applicationState === "draft"
                  ? "Draft"
                  : "Not started",
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid gap-2 py-4 sm:grid-cols-[minmax(0,12rem)_1fr]"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                {label}
              </dt>
              <dd className="text-sm leading-relaxed text-ink-800">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          {!profile?.is_member &&
          !profile?.deactivated_at &&
          (applicationState === "none" || applicationState === "draft") ? (
            <Link
              href="/apply"
              className="inline-flex min-h-11 items-center bg-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-sheet transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Complete application
            </Link>
          ) : null}
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Log out
            </button>
          </form>
        </div>

        {profile?.deactivated_at ? null : (
        <section className="mt-16 border-t border-rule pt-10" aria-labelledby="details-heading">
          <h2
            id="details-heading"
            className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl"
          >
            Your details
          </h2>
          {detailsMissing ? (
            <p className="mt-4 max-w-prose leading-relaxed text-ink-800">
              Add your name, academic year, major, and expected graduation. You need these before
              you can submit an application.
            </p>
          ) : null}
          <DetailsForm
            current={{
              first_name: profile?.first_name ?? "",
              last_name: profile?.last_name ?? "",
              academic_year: profile?.academic_year ?? "",
              major: profile?.major ?? "",
              graduation_semester: profile?.graduation_semester ?? "",
              graduation_year: profile?.graduation_year
                ? String(profile.graduation_year)
                : "",
            }}
            years={graduationYears(profile?.graduation_year)}
          />
        </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
