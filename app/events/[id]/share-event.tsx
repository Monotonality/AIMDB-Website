"use client";

import { useState } from "react";

const buttonClass =
  "inline-flex min-h-11 items-center border border-ink-950 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-950 transition-colors hover:bg-ink-950 hover:text-sheet focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export default function ShareEvent({ title, text }: { title: string; text: string }) {
  const [status, setStatus] = useState<string | null>(null);

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied.");
    } catch {
      setStatus(`Copy this link: ${url}`);
    }
  }

  async function share() {
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({ title, text, url: window.location.href });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      await copyLink();
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <button type="button" onClick={share} className={buttonClass}>
        Share event
      </button>
      <button type="button" onClick={copyLink} className={buttonClass}>
        Copy link
      </button>
      <p className="text-sm leading-relaxed text-ink-800" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
