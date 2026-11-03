"use client";

import { useEffect } from "react";
import { site } from "@/content/site";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) import("@sentry/nextjs").then((S) => S.captureException(error));
  }, [error]);
  return (
    <section className="container-site section">
      <p className="eyebrow text-[var(--fg-muted)]">Error</p>
      <h1 className="mt-6 max-w-[16ch] text-h1">Something went wrong.</h1>
      <p className="mt-6 max-w-[52ch] text-lg text-[var(--fg-muted)]">Please try again, or email {site.email}.</p>
      <button onClick={reset} className="mt-10 inline-flex min-h-11 items-center rounded-pill bg-accent-400 px-7 font-semibold text-ink-950 hover:bg-[#f5b674]">Try again</button>
    </section>
  );
}
