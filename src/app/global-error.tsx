"use client";

import { useEffect } from "react";

/** Last-resort error boundary (root layout failures). Reports to Sentry when configured. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) import("@sentry/nextjs").then((S) => S.captureException(error));
  }, [error]);
  return (
    <html lang="en-KE">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#F7F4EE", color: "#0B1A13", padding: "15vh 24px" }}>
        <main style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1 style={{ fontSize: 40, lineHeight: 1.1 }}>Something went wrong.</h1>
          <p style={{ color: "#4A5550" }}>Please try again. If it keeps happening, email info@accesslineconsultancy.com.</p>
          <button onClick={reset} style={{ marginTop: 24, minHeight: 44, padding: "0 24px", borderRadius: 999, border: 0, background: "#F2A65A", fontWeight: 600 }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
