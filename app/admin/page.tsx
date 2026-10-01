import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getProfile, type Application, type Profile } from "@/lib/auth";
import { displayName, graduationLabel } from "@/lib/profile-details";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Admin | AIMDB",
  description: "AIMDB accounts, membership, and applications.",
};

type ApplicationRow = Pick<
  Application,
  "status" | "submitted_at" | "payment_verified" | "transaction_id"
>;

type AccountRow = Pick<
  Profile,
  | "id"
  | "role"
  | "is_member"
  | "first_name"
  | "last_name"
  | "major"
  | "graduation_semester"
  | "graduation_year"
  | "academic_year"
  | "deactivated_at"
> & {
  email: string | null;
  created_at: string;
  applications: ApplicationRow[] | ApplicationRow | null;
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const linkClass =
  "text-ink-950 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

function applicationOf(row: AccountRow) {
  return Array.isArray(row.applications)
    ? (row.applications[0] ?? null)
    : row.applications;
}

function statusLabel(row: AccountRow) {
  const base =
    row.role === "admin" ? "Admin" : row.is_member ? "Member" : "Account holder";
  return row.deactivated_at ? `${base} (deactivated)` : base;
}

function applicationLabel(application: ApplicationRow | null) {
  if (!application) return "Not started";
  if (application.status === "draft") return "Draft";
  return application.submitted_at
    ? `Submitted ${dateFormat.format(new Date(application.submitted_at))}`
    : "Submitted";
}

function paymentLabel(application: ApplicationRow | null) {
  if (application?.status !== "submitted") return "—";
  return application.payment_verified ? "Approved" : "Not approved";
}

export default async function AdminPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/profile");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, email, role, is_member, first_name, last_name, major, graduation_semester, graduation_year, academic_year, deactivated_at, created_at, applications!applications_user_id_fkey(status, submitted_at, payment_verified, transaction_id)",
    )
    .order("created_at", { ascending: true });

  const accounts = (data ?? []) as AccountRow[];
  let members = 0;
  const waiting: { account: AccountRow; application: ApplicationRow }[] = [];
  for (const account of accounts) {
    if (account.is_member) members++;
    const application = applicationOf(account);
    if (application?.status === "submitted" && !account.is_member) {
      waiting.push({ account, application });
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          admin
        </p>
        <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          Accounts and members.
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-800">
          {accounts.length} {accounts.length === 1 ? "account" : "accounts"},{" "}
          {members} {members === 1 ? "member" : "members"}. Select an account to
          view its application, approve its payment, accept it as a member,
          change its role, or deactivate it.
        </p>

        {waiting.length > 0 ? (
          <section className="mt-12" aria-labelledby="waiting-heading">
            <h2
              id="waiting-heading"
              className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl"
            >
              Waiting for review
            </h2>
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {waiting.map(({ account, application }) => (
                <li key={account.id}>
                  <Link
                    href={`/admin/accounts/${account.id}`}
                    className="grid gap-2 py-4 transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8"
                  >
                    <span className="font-bold text-ink-950">
                      {displayName(account) ?? account.email}
                    </span>
                    <span className="font-mono text-sm text-ink-800">
                      {application.transaction_id ?? "—"}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                      {application.payment_verified
                        ? "Payment approved · accept member"
                        : "Approve payment"}{" "}
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {error ? (
          <p className="mt-10 text-sm leading-relaxed text-ink-800" role="alert">
            Could not load accounts: {error.message}
          </p>
        ) : (
          <div className="mt-12 overflow-x-auto border-y border-rule">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead>
                <tr className="border-b border-rule">
                  {[
                    "name",
                    "email",
                    "status",
                    "application",
                    "payment",
                    "year",
                    "major",
                    "graduation",
                  ].map((label) => (
                    <th
                      key={label}
                      scope="col"
                      className="py-3 pr-6 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-ink-700"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {accounts.map((account) => {
                  const application = applicationOf(account);
                  return (
                    <tr
                      key={account.id}
                      className={account.deactivated_at ? "text-ink-600" : undefined}
                    >
                      <td className="py-3 pr-6">
                        <Link
                          href={`/admin/accounts/${account.id}`}
                          className={`${linkClass} font-bold underline`}
                        >
                          {displayName(account) ?? "Unnamed"}
                        </Link>
                      </td>
                      <td className="py-3 pr-6 text-ink-800">{account.email ?? "—"}</td>
                      <td className="py-3 pr-6 text-ink-950">{statusLabel(account)}</td>
                      <td className="py-3 pr-6 text-ink-800">
                        {applicationLabel(application)}
                      </td>
                      <td className="py-3 pr-6 text-ink-800">{paymentLabel(application)}</td>
                      <td className="py-3 pr-6 text-ink-800 capitalize">
                        {account.academic_year ?? "—"}
                      </td>
                      <td className="py-3 pr-6 text-ink-800">{account.major ?? "—"}</td>
                      <td className="py-3 pr-6 text-ink-800">
                        {graduationLabel(account.graduation_semester, account.graduation_year) ??
                          "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
