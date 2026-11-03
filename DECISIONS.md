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
