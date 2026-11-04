/**
 * Browser Sentry, loaded lazily (separate chunk, after hydration) and only when
 * NEXT_PUBLIC_SENTRY_DSN is set, which keeps the SDK out of the critical bundle.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  const start = () =>
    import("@sentry/nextjs").then((Sentry) =>
      Sentry.init({
        dsn,
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
        tracesSampleRate: 0,
      }),
    );
  if ("requestIdleCallback" in window) window.requestIdleCallback(start, { timeout: 4000 });
  else setTimeout(start, 2000);
}
