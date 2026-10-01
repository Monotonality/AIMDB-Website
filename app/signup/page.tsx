import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "../auth/auth-form";
import { getAuthUser } from "@/lib/auth";
import { graduationYears } from "@/lib/profile-details";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Create account | AIMDB",
  description:
    "Create an AIMDB account with a .edu email. An account is not membership.",
};

export default async function SignupPage() {
  const user = await getAuthUser();
  if (user) redirect("/profile");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          account
        </p>
        <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          Create an account.
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-800">
          Sign up with a .edu email. That gives you an account, not membership.
          Membership starts when you complete the application.
        </p>
        <AuthForm mode="signup" graduationYears={graduationYears()} />
      </main>
      <SiteFooter />
    </>
  );
}
