import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "../auth/auth-form";
import { getAuthUser } from "@/lib/auth";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Log in | AIMDB",
  description: "Log in to AIMDB with your .edu account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getAuthUser();
  if (user) redirect("/profile");

  const params = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          account
        </p>
        <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-ink-950 sm:text-5xl">
          Log in.
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-800">
          Use the .edu email you registered with.
        </p>
        {params.error ? (
          <p className="mt-6 text-sm leading-relaxed text-ink-800" role="alert">
            {params.error}
          </p>
        ) : null}
        <AuthForm mode="login" />
      </main>
      <SiteFooter />
    </>
  );
}
