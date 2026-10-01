import Link from "next/link";

export default function ImdbTerm({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href="/what-is-in-memory-db"
      className={`underline decoration-rule-strong underline-offset-4 hover:text-ink-950 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${className}`}
    >
      {children}
    </Link>
  );
}