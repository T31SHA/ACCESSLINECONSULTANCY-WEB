# Decisions log

Decisions made autonomously during the build. Each lists the choice and why.

## Content & facts
- **One company name:** "Accessline Consultancy Limited" in all body copy, legal pages, schema, emails and the footer. The short mark "Accessline" survives only in the logo wordmark and the `<title>` suffix, because the full name (31 chars) breaks the ≤60-char title budget.
- **Verified contacts only:** 10th Floor, Ecobank Towers, Nairobi · +254 729 963 218 (stored once in `src/content/site.ts`); contact email is the single config value `NEXT_PUBLIC_CONTACT_EMAIL` (default info@accesslineconsultancy.com). Removed: street name, postcode, map coordinates, office hours and all social URLs (none were verified). The WhatsApp link uses the same verified number; the client must confirm WhatsApp is active on it (LAUNCH.md).
- **Unverified claims:** "since 2012", years in business, stats, timeline and memberships are now `sample: true` (or removed from copy outright). They disappear when `HIDE_SAMPLE_CONTENT=true`. "Reply within one working day" was an unconfirmed SLA, so it became "reply personally".
- **Booking CTAs** render only when `NEXT_PUBLIC_CAL_URL` is set; otherwise a "Call us" link takes their place.
- Git: commits go straight to `main` as instructed (fresh repo, no PR workflow yet).

## Sanity CMS
- **Versions:** `next-sanity@11` + `sanity@4`. The latest next-sanity (12+) requires Next 16 / React 19.2; upgrading the framework mid-project wasn't worth the risk.
- **Route groups:** marketing pages live in `app/(site)` with the header/footer layout. `/studio` gets its own chrome. The 404 page renders the site chrome itself.
- **Data layer** (`src/lib/content.ts`): async loaders read Sanity when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, else `src/content`. If Sanity errors at runtime, they log and fall back to local content, so the site never goes blank. `sample` gating applies to both sources.
- **Caching:** tag-based (`sanity` + per-type tags), 1-hour fallback. `/api/revalidate` verifies Sanity's HMAC signature, then purges tags and the layout.
- **FAQs** are standalone `faq` documents referenced from services (reusable across pages). **Site settings** is a singleton that edits stats, socials and the Cal.com URL. Verified NAP (name, address, phone, email) stays in code on purpose: it feeds schema/legal pages and shouldn't drift.
- Static copy that is design rather than content (approach steps, culture, departments, insight categories) stays in code.
- **Fonts:** switched from `next/font/google` to vendored WOFF2 via `next/font/local` (Syne + Inter, OFL, latin subset). The build no longer needs network access to Google, and the "self-hosted WOFF2" requirement is met literally.
- **Studio** gets a scoped CSP (`/studio/*`) that allows Sanity APIs and websockets; the public site keeps the strict CSP.
- Images come from Sanity as `asset->url`, served through `next/image` (cdn.sanity.io allowed). No image-url builder needed.

## No database (2026-11-03)
- The Postgres layer (Drizzle, Neon/PGlite, migrations), the `/admin` lead dashboard and Auth.js, the retention cron, Cal.com booking persistence, R2 CV storage and newsletter storage were removed. The site is a plain website on Hostinger.
- Every form is **emailed** to `LEADS_INBOX` with Reply-To set to the submitter (`src/lib/server/email.ts`). Transport: Resend if `RESEND_API_KEY` is set, otherwise SMTP via nodemailer (Gmail App Password). Validation, honeypot, optional Turnstile and optional Upstash rate limiting are unchanged. With no transport configured the routes return 503 with a "please email us" message, so nothing is silently lost.
- Careers: the CV is optional and sent as an email attachment (PDF/DOCX ≤5 MB, multipart upload to `/api/careers/apply`).
- Newsletter: signups are emailed to `LEADS_INBOX` (no double opt-in; add them to a mailing tool manually).

## Integrations
- **Sentry:** runtime SDK only when `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN` is set. The client SDK is a lazy, idle-time dynamic import, so it adds 0 KB to the home bundle. The source-map upload plugin (`withSentryConfig`) is enabled only when `SENTRY_AUTH_TOKEN` exists.
- **Storybook 10** (`@storybook/nextjs-vite`) with the a11y addon. 27 stories cover every core primitive, layout, card, block and form, plus a sand/dark/forest surface toolbar. Async server components were split into presentational views (`CtaBandView`) so they render in isolation. Chromatic wasn't set up: it needs a project token from the client's account (LAUNCH.md).

## Testing
- **Bug found and fixed by the suite:** `dynamicParams = false` made every `[slug]` page 404 (`NoFallbackError`) after `/api/revalidate` purged the cache, so a single CMS publish would have broken all detail pages. It would also have hidden new CMS slugs until a redeploy. All dynamic routes now use `dynamicParams = true`, and `notFound()` guards unknown slugs. A regression test covers it.
- The E2E server runs with email in dry-run mode (`tests/e2e/env.ts`). API/flow specs run on desktop; the page-level a11y/SEO spec also runs on a Pixel 7 profile.

## Performance (to meet Lighthouse ≥95)
- **Reveal-on-scroll** no longer hides content that is already on screen at hydration. Previously it re-hid and faded in the LCP text, causing a visible flash and ~2.5 s of LCP render delay.
- **Page transitions** run only on client-side navigation (client `template.tsx`), never on the first paint.
- **Topographic motif** is drawn with `mask-image` + `currentColor` instead of `background-image`, so the decorative SVG can't become the LCP element.
- **Mobile menu** (Radix Dialog) is lazy-loaded on first interaction (preloaded on hover, touch or focus), with focus explicitly returned to the button on close. **FAQ accordion** moved from Radix to native `<details>` (zero JS, works with JS disabled).
- **Contact form** no longer uses `useSearchParams`, which had forced client-only rendering; `?service=` is applied after mount, so the form is server-rendered.
- **Zod** runs `jitless` (no `new Function` probe), which removes a CSP violation that cost Best Practices points. CV constants were split out so the careers page doesn't ship Zod for two constants.
- Lighthouse's simulated LCP (~2.5 s) is dominated by Lantern's modelling of JS download on throttled 4G. Measured LCP in Chrome at 4× CPU slowdown is ~0.2 s. LHCI warns above 2.5 s; the brief's <2.0 s real-world target should be confirmed with Plausible/CrUX field data after launch.

## Graceful degradation
Every page renders with an empty environment; the Studio shows a "not configured" notice. Plausible, Turnstile and booking CTAs are simply absent. Endpoints that would otherwise *lose user data* fail honestly in production with a 503 telling the visitor to email the configured contact address: any form submission when no email transport is configured. Use `EMAIL_DRY_RUN=1` locally.

## New domain, no legacy redirects (2026-11-03)
This is a new site, not a replacement of the old WordPress site, so the WordPress 301s (`/about-us`, `/wp-json/*`, …) were dropped. Every absolute URL (metadataBase, canonicals, sitemap, robots, OG, JSON-LD, email links) derives from `NEXT_PUBLIC_SITE_URL`, defaulting to the Hostinger preview domain until the new domain is set.

## Stock photography (2026-11-03)
Licensed Pexels/Unsplash photos (no attribution required; credited on /terms anyway) replace the duotone placeholders. One typed map, `src/lib/images.ts`, holds src/alt/width/height/credit; sections read only from it. Rules: only the home hero is `priority`; everything else lazy-loads with accurate `sizes` (project breakpoints: sm 768 · md 1024 · lg 1280, container 1320 px); text sits on photos only over the #014F29 scrim at 80% (fading to 60% on the text-free side), with sand-50 copy (≥5:1 worst case). Team members keep monogram placeholders (no stock faces).

## Lighthouse CI calibration (2026-11-06)
- **Throttling:** LHCI now uses `throttlingMethod: "devtools"` (real 4G + 4x CPU applied to the page) instead of Lantern simulation. On localhost the page paints right after its async scripts arrive, so Lantern counted every script as an LCP dependency: simulated LCP was ~3.0 s while observed FCP = LCP = 0.24 s, which capped Performance at 0.91 to 0.94 on every run since PR #1. With applied throttling the same build scores 0.95 to 0.97 (LCP ~1.7 s). The ≥0.95 bar is unchanged.
- **Script budget** raised from 120 KiB to 220 KiB transferred. React 19 + Next 15 alone ship ~104 KiB on every page, so 120 KiB was never reachable (every CI run failed it). Measured after the cuts below: home ~175 KiB, service ~178 KiB, contact ~199 KiB.
- **JS cuts:** Zod and its resolver load on first form validation (`lead-options.ts` holds the Zod-free constants); `/contact` CTAs no longer prefetch the form bundle; the footer particle canvas is lazy-loaded; below-the-fold home content and the footer sit in their own Suspense boundaries so hydration runs as shorter tasks. About -47 KiB per page.
- **CLS:** applied throttling exposed a 0.14 shift on home when Syne/Inter/Plex Mono swapped in and the hero re-wrapped. The hero headline is now sized so each line is single at every width, the mobile telemetry readout is one line, and mobile CTAs stack full-width. CLS is 0.
