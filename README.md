# Accessline Consultancy Limited · accesslineconsultancy.com

Custom-built replacement for the old WordPress/Elementor site. *Lead the Change.*

**Stack:** Next.js 15 (App Router, TypeScript strict) · Tailwind v4 (CSS-variable tokens) · Sanity v4 (embedded Studio) · Drizzle + Neon Postgres · Auth.js v5 · React Hook Form + Zod · Resend · Cloudflare Turnstile & R2 · Upstash · Cal.com · Plausible · Sentry · Storybook 10 · Playwright + axe · Vitest · Lighthouse CI.

See **DECISIONS.md** for why things are the way they are, **LAUNCH.md** for go-live, and **CONTENT.md** for what the client must supply.

---

## 1. Local setup

Requirements: Node 22+, npm 10+.

```bash
npm install
cp .env.example .env.local
# Optional but recommended: a zero-install local database
echo 'DATABASE_URL=pglite://.pglite-dev' >> .env.local
npm run dev                         # http://localhost:3000
```

Want to try the admin locally? Add `AUTH_SECRET=dev-secret-at-least-32-characters-long`, `ADMIN_EMAILS=you@example.com` and `ADMIN_PASSWORD=dev-password` to `.env.local`, then open `/admin`.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Develop / production build / serve |
| `npm run typecheck` · `lint` · `test` | tsc · ESLint · Vitest unit tests |
| `npm run test:e2e` | Playwright (needs `npm run build` first). Boots a fresh PGlite DB with test secrets: axe WCAG 2.2 AA, SEO, admin auth, CSV, webhooks, newsletter, retention, lead pipeline |
| `npm run storybook` / `build-storybook` | Component library on :6006 |
| `npm run db:generate` / `db:migrate` | Drizzle migrations (`drizzle/`) |
| `npm run sanity:seed` | Import `src/content` into Sanity (`-- --dry-run` to preview) |
| `npm run admin:hash -- 'passphrase'` | Generate `ADMIN_PASSWORD_HASH` |

---

## 2. Environment variables

Every variable is documented inline in **`.env.example`**. All are optional; this is what works without each:

| Service | Without its keys |
|---|---|
| `DATABASE_URL` | Pages work; in production lead/newsletter/application endpoints return a clear 503 ("please email info@") instead of losing data (leads still go through if email/Slack is set) |
| Sanity | Site serves `src/content`; `/studio` shows a setup notice |
| Auth (`AUTH_SECRET`, `ADMIN_*`) | `/admin` shows "not configured"; admin APIs 503 |
| Resend / Slack | No notification/auto-reply emails; auto-reply not logged as sent |
| Turnstile | Bot check skipped (honeypot + rate limit still apply if configured) |
| Upstash | No rate limiting |
| R2 | CV upload returns "temporarily unavailable" |
| Cal.com | No "Book a call" CTAs ("Call us" shown); webhook 503 |
| `CRON_SECRET` | Retention endpoint 503 (cron won't run) |
| Plausible / Sentry | Scripts/SDK not loaded at all |

---

## 3. Deploy to Vercel

1. **Import** the GitHub repo in Vercel (framework preset: Next.js; defaults are fine).
2. **Database:** create a Neon project (region near Nairobi users, e.g. `aws-eu-central-1`). Copy the *pooled* connection string into `DATABASE_URL` and run migrations once from your machine:
   ```bash
   DATABASE_URL='postgres://…' npm run db:migrate
   ```
3. **Environment variables:** add everything from `.env.example` for *Production* (and *Preview* with separate secrets). Set **`HIDE_SAMPLE_CONTENT=true`** in Production.
4. **Admin access:** `AUTH_SECRET` (`openssl rand -base64 32`), `ADMIN_EMAILS`, and `ADMIN_PASSWORD_HASH` (`npm run admin:hash -- '…'`).
5. **Cron:** `vercel.json` schedules `/api/cron/retention` daily at 00:00 UTC (03:00 EAT). Set `CRON_SECRET` and Vercel authenticates automatically.
6. **Webhooks** (after the first deploy):
   - *Sanity* → sanity.io/manage → API → Webhooks: URL `https://accesslineconsultancy.com/api/revalidate`, trigger on create/update/delete, projection `{_type, "slug": slug.current}`, secret = `SANITY_REVALIDATE_SECRET`.
   - *Cal.com* → Settings → Developer → Webhooks: URL `https://accesslineconsultancy.com/api/webhooks/cal`, events Booking Created / Rescheduled / Cancelled / Meeting Ended, secret = `CAL_WEBHOOK_SECRET`.
7. **R2 CORS** (CV uploads go browser → R2 directly):
   ```json
   [{ "AllowedOrigins": ["https://accesslineconsultancy.com"], "AllowedMethods": ["PUT"], "AllowedHeaders": ["content-type"], "MaxAgeSeconds": 3600 }]
   ```
8. **Domain & DNS:** see LAUNCH.md.

CI (`.github/workflows/ci.yml`) runs typecheck → lint → unit → build → Playwright/axe → Lighthouse CI on every push and PR.

---

## 4. Editing content (Sanity Studio)

1. Create a Sanity project at sanity.io/manage and set `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`. Under *API → CORS origins*, add the site origin (with credentials) and `http://localhost:3000`.
2. Seed it with the current content (one-off, idempotent):
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=… SANITY_API_WRITE_TOKEN=… npm run sanity:seed
   ```
3. Editors go to **`https://accesslineconsultancy.com/studio`** and sign in with their Sanity account (invite them in sanity.io/manage → Members).
4. What's editable: **Services, Industries, Case studies, Team, Testimonials, Client logos, Insights, Jobs, FAQs, Site settings** (stats, social links, booking URL). Company name, address, phone and email are fixed in code on purpose (they feed legal pages and structured data).
5. **Publishing:** hit *Publish* and the webhook refreshes the affected pages within seconds. New slugs (e.g. a new job) go live without a redeploy.
6. **The "Sample / unverified" toggle:** every document has one. Anything ticked is hidden on the live site (`HIDE_SAMPLE_CONTENT=true`). Untick it only once the client has approved the content.
7. **Images:** upload authentic photography (no stock) and always fill in *Alt text* (required). Portraits 4:5 ≥1200 px; case-study heroes 16:9 ≥2000 px.

---

## 5. Project structure

```
src/app/(site)/          public pages (header/footer chrome)
src/app/admin/           lead dashboard (Auth.js-protected via middleware)
src/app/studio/          embedded Sanity Studio
src/app/api/             leads · newsletter · careers · revalidate · webhooks/cal · cron/retention · admin export · auth
src/components/          ui · layout · cards · blocks · forms  (+ *.stories in src/stories)
src/content/             typed local content (fallback + seed source)
src/lib/content.ts       data layer: Sanity → fallback to src/content, sample gating
src/sanity/              schemas, GROQ queries, client
src/db/                  Drizzle schema, Neon/PGlite driver, retention.sql
tests/                   Vitest unit tests + Playwright E2E
```

Design tokens (colour, fluid type scale, spacing, radii, breakpoints, motion) live in `src/app/globals.css` under `@theme`.
