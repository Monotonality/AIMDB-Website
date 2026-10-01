import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getAuthUser,
  getProfile,
  type Application,
  type Profile,
} from "@/lib/auth";
import { degreeLabel } from "@/lib/membership";
import {
  academicYearLabel,
  displayName,
  graduationLabel,
} from "@/lib/profile-details";
import AccountAction from "../../account-action";
import SiteFooter from "../../../site-footer";
import SiteHeader from "../../../site-header";

export const metadata: Metadata = {
  title: "Account | AIMDB admin",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Verifier = { first_name: string | null; last_name: string | null };

type AccountApplication = Omit<Application, "id" | "user_id"> & {
  verifier: Verifier | Verifier[] | null;
};

type Account = Profile & {
  email: string | null;
  created_at: string;
  applications: AccountApplication[] | AccountApplication | null;
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null) {
  return value ? dateFormat.format(new Date(value)) : null;
}

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function Details({ rows }: { rows: [string, string | null][] }) {
  return (
    <dl className="mt-6 divide-y divide-rule border-y border-rule">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid gap-2 py-3 sm:grid-cols-[minmax(0,12rem)_1fr]"
        >
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
            {label}
          </dt>
          <dd className="break-words text-sm leading-relaxed text-ink-950">
            {value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ControlRow({
  label,
  state,
  note,
  children,
}: {
  label: string;
  state: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-start">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
          {label}
        </p>
        <p className="mt-1 text-lg font-bold tracking-tight text-ink-950">
          {state}
        </p>
        {note ? (
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-800">
            {note}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const viewer = await getProfile();
  if (viewer?.role !== "admin") redirect("/profile");

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, email, role, is_member, first_name, last_name, academic_year, major, graduation_semester, graduation_year, deactivated_at, created_at, applications!applications_user_id_fkey(status, personal_email, phone, degree_level, transaction_id, accepted_rules, paid_fee, accepted_communication, submitted_at, payment_verified, payment_verified_at, verifier:profiles!applications_payment_verified_by_fkey(first_name, last_name))",
    )
    .eq("id", id)
    .maybeSingle();

  const account = data as Account | null;
  if (!account) notFound();

  const application = one(account.applications);
  const submitted = application?.status === "submitted";
  const isSelf = account.id === user.id;
  const isAdmin = account.role === "admin";
  const active = !account.deactivated_at;
  const name = displayName(account) ?? account.email ?? "Unnamed account";
  const verifierName = displayName(one(application?.verifier ?? null));

  const yesNo = (value: boolean | undefined) => (value ? "Yes" : "No");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 md:py-24">
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ← All accounts
        </Link>
        <h1 className="mt-4 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          {name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-800">
          {[
            isAdmin ? "Admin" : "User",
            account.is_member ? "Member" : "Not a member",
            active ? "Active" : "Deactivated",
          ].join(" · ")}
        </p>

        <section className="mt-12" aria-labelledby="manage-heading">
          <h2
            id="manage-heading"
            className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl"
          >
            Manage
          </h2>
          <div className="mt-6 divide-y divide-rule border-y border-rule">
            <ControlRow
              label="payment"
              state={
                application?.payment_verified
                  ? "Approved"
                  : submitted
                    ? "Not approved"
                    : "No submitted application"
              }
              note={
                application?.payment_verified
                  ? [
                      formatDate(application.payment_verified_at),
                      verifierName ? `by ${verifierName}` : null,
                    ]
                      .filter(Boolean)
                      .join(" ")
                  : submitted
                    ? `Check transaction ID ${application?.transaction_id ?? "—"} against the Zelle payments received.`
                    : undefined
              }
            >
              <AccountAction
                userId={account.id}
                operation="payment"
                value={!application?.payment_verified}
                label={application?.payment_verified ? "Mark unpaid" : "Approve payment"}
                tone={application?.payment_verified ? "secondary" : "primary"}
                disabledReason={
                  submitted ? undefined : "Available once the application is submitted."
                }
              />
            </ControlRow>

            <ControlRow
              label="membership"
              state={account.is_member ? "Member" : "Not a member"}
              note={
                !account.is_member && submitted && !application?.payment_verified
                  ? "Payment has not been approved yet."
                  : !account.is_member && !submitted
                    ? "This account has not submitted an application."
                    : undefined
              }
            >
              <AccountAction
                userId={account.id}
                operation="member"
                value={!account.is_member}
                label={account.is_member ? "Revoke membership" : "Accept as member"}
                tone={account.is_member ? "secondary" : "primary"}
                confirmMessage={
                  account.is_member
                    ? `Revoke ${name}'s membership?`
                    : !application?.payment_verified
                      ? `Payment has not been approved. Accept ${name} as a member anyway?`
                      : undefined
                }
              />
            </ControlRow>

            <ControlRow
              label="role"
              state={isAdmin ? "Admin" : "User"}
              note={
                isAdmin
                  ? "Admins can see every account and manage memberships."
                  : undefined
              }
            >
              <AccountAction
                userId={account.id}
                operation="admin"
                value={!isAdmin}
                label={isAdmin ? "Remove admin" : "Promote to admin"}
                confirmMessage={
                  isAdmin
                    ? `Remove admin access from ${name}?`
                    : `Give ${name} admin access? They will be able to manage every account.`
                }
                disabledReason={isSelf ? "You cannot change your own role." : undefined}
              />
            </ControlRow>

            <ControlRow
              label="account"
              state={active ? "Active" : "Deactivated"}
              note={
                active
                  ? undefined
                  : `Deactivated ${formatDate(account.deactivated_at)}. This account cannot log in or make changes.`
              }
            >
              <AccountAction
                userId={account.id}
                operation="active"
                value={!active}
                label={active ? "Deactivate account" : "Reactivate account"}
                confirmMessage={
                  active
                    ? `Deactivate ${name}? They will be logged out and unable to log in until reactivated.`
                    : undefined
                }
                disabledReason={
                  isSelf ? "You cannot deactivate your own account." : undefined
                }
              />
            </ControlRow>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="profile-heading">
          <h2
            id="profile-heading"
            className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl"
          >
            Profile
          </h2>
          <Details
            rows={[
              ["school email", account.email],
              ["academic year", academicYearLabel(account.academic_year)],
              ["major", account.major],
              [
                "graduation",
                graduationLabel(account.graduation_semester, account.graduation_year),
              ],
              ["joined", formatDate(account.created_at)],
            ]}
          />
        </section>

        <section className="mt-14" aria-labelledby="application-heading">
          <h2
            id="application-heading"
            className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl"
          >
            Application
          </h2>
          {application ? (
            <Details
              rows={[
                [
                  "status",
                  submitted
                    ? `Submitted ${formatDate(application.submitted_at) ?? ""}`.trim()
                    : "Draft",
                ],
                ["personal email", application.personal_email],
                ["phone", application.phone],
                ["degree level", degreeLabel(application.degree_level)],
                ["transaction id", application.transaction_id],
                ["accepted rules", yesNo(application.accepted_rules)],
                ["says fee paid", yesNo(application.paid_fee)],
                ["teams agreement", yesNo(application.accepted_communication)],
              ]}
            />
          ) : (
            <p className="mt-6 leading-relaxed text-ink-800">
              This account has not started an application.
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
