# Decisions log

Decisions made autonomously during the build. Each lists the choice and why.

## Content & facts
- **One company name:** "Accessline Consultancy Limited" in all body copy, legal pages, schema, emails and the footer. The short mark "Accessline" survives only in the logo wordmark and the `<title>` suffix, because the full name (31 chars) breaks the ≤60-char title budget.
- **Verified contacts only:** info@accesslineconsultancy.com · 10th Floor, Ecobank Towers, Nairobi · +254 727 684443. Removed: street name, postcode, map coordinates, office hours and all social URLs (none were verified). The WhatsApp link uses the same verified number; the client must confirm WhatsApp is active on it (LAUNCH.md).
- **Unverified claims:** "since 2012", years in business, stats, timeline and memberships are now `sample: true` (or removed from copy outright). They disappear when `HIDE_SAMPLE_CONTENT=true`. "Reply within one working day" was an unconfirmed SLA, so it became "reply personally".
- **Booking CTAs** render only when `NEXT_PUBLIC_CAL_URL` is set; otherwise a "Call us" link takes their place.
- Git: commits go straight to `main` as instructed (fresh repo, no PR workflow yet).

## Sanity CMS
- **Versions:** `next-sanity@11` + `sanity@4`. The latest next-sanity (12+) requires Next 16 / React 19.2; upgrading the framework mid-project wasn't worth the risk.
- **Route groups:** marketing pages live in `app/(site)` with the header/footer layout. `/studio` (and `/admin`) get their own chrome. The 404 page renders the site chrome itself.
- **Data layer** (`src/lib/content.ts`): async loaders read Sanity when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, else `src/content`. If Sanity errors at runtime, they log and fall back to local content, so the site never goes blank. `sample` gating applies to both sources.
- **Caching:** tag-based (`sanity` + per-type tags), 1-hour fallback. `/api/revalidate` verifies Sanity's HMAC signature, then purges tags and the layout.
- **FAQs** are standalone `faq` documents referenced from services (reusable across pages). **Site settings** is a singleton that edits stats, socials and the Cal.com URL. Verified NAP (name, address, phone, email) stays in code on purpose: it feeds schema/legal pages and shouldn't drift.
- Static copy that is design rather than content (approach steps, culture, departments, insight categories) stays in code.
- **Fonts:** switched from `next/font/google` to vendored WOFF2 via `next/font/local` (Syne + Inter, OFL, latin subset). The build no longer needs network access to Google, and the "self-hosted WOFF2" requirement is met literally.
- **Studio** gets a scoped CSP (`/studio/*`) that allows Sanity APIs and websockets; the public site keeps the strict CSP.
- Images come from Sanity as `asset->url`, served through `next/image` (cdn.sanity.io allowed). No image-url builder needed.

## /admin
- **Auth:** Auth.js v5 (beta, the version that supports the App Router) with a **credentials** provider. It checks the `ADMIN_EMAILS` allowlist plus a scrypt `ADMIN_PASSWORD_HASH` (generate with `npm run admin:hash`), and login attempts are rate-limited per email. I chose credentials over magic links because magic links need an email provider *and* a database adapter (3 extra tables), which would leave the admin unusable without Resend. `ADMIN_PASSWORD` (plain) is accepted only as a dev/test fallback when no hash is set.
- JWT sessions (12 h). Middleware guards `/admin/*` (redirect) and `/api/admin/*` (401 JSON); every page, action and route also re-checks with `requireAdmin()`. Without `AUTH_SECRET` the admin shows a "not configured" notice instead of crashing.
- Admins are mirrored into `users` on login, so status changes, notes and exports are attributed in `lead_events` and `audit_log`.
- CSV export uses the current filters, adds a UTF-8 BOM (Excel), escapes per RFC 4180 and neutralises spreadsheet formulas (`=+-@`). Each export is audit-logged.
- **PGlite** (in-process Postgres, WASM) is selected with `DATABASE_URL=pglite://<dir>|memory` for local dev and E2E tests and auto-migrates on boot. Production uses Neon via `postgres://`. This lets the tests exercise the real lead → DB → admin → CSV path.
- The auto-reply is only logged as `email_sent` when Resend actually accepted it.

## Integrations
- **Cal.com:** HMAC-SHA256 of the raw body (`X-Cal-Signature-256`) is verified with a timing-safe compare. Bookings are linked by `metadata[leadId]`, which the auto-reply email pre-fills in the booking link, else by the newest lead with the attendee's email. A reschedule marks the old booking `rescheduled`. Booking a call moves a lead `new → contacted` (later stages are never downgraded).
- **Newsletter double opt-in:** one-time base64url token, 14-day TTL, single use. The confirm page needs a button click (POST) instead of confirming on GET, so corporate link-scanners (Outlook Safe Links etc.) can't auto-subscribe people. Re-subscribing an already-confirmed address returns the same response (no enumeration). Without Resend, the confirm link is logged in development.
- **Retention:** `/api/cron/retention` (Bearer `CRON_SECRET`, daily via `vercel.json`) implements `retention.sql` in Drizzle, because it needs the CV keys to delete R2 objects *before* rows. Runs are audit-logged. An application whose CV deletion fails is kept and retried.
- **Sentry:** runtime SDK only when `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN` is set. The client SDK is a lazy, idle-time dynamic import, so it adds 0 KB to the home bundle. The source-map upload plugin (`withSentryConfig`) is enabled only when `SENTRY_AUTH_TOKEN` exists.
- **Storybook 10** (`@storybook/nextjs-vite`) with the a11y addon. 27 stories cover every core primitive, layout, card, block and form, plus a sand/dark/forest surface toolbar. Async server components were split into presentational views (`CtaBandView`) so they render in isolation. Chromatic wasn't set up: it needs a project token from the client's account (LAUNCH.md).

## Testing
- **Bug found and fixed by the suite:** `dynamicParams = false` made every `[slug]` page 404 (`NoFallbackError`) after `/api/revalidate` purged the cache, so a single CMS publish would have broken all detail pages. It would also have hidden new CMS slugs until a redeploy. All dynamic routes now use `dynamicParams = true`, and `notFound()` guards unknown slugs. A regression test covers it.
- The E2E server boots on a fresh PGlite database with throwaway secrets (`tests/e2e/env.ts`). API/flow specs run on desktop; the page-level a11y/SEO spec also runs on a Pixel 7 profile.
- `E2E_EXPOSE_TOKENS=1` makes `/api/newsletter` return the confirm token so the opt-in flow is testable without an inbox. It is ignored when `VERCEL_ENV=production` or when Resend is configured.
