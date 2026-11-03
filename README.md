# Accessline Consultancy Limited · website

Custom-built replacement for the old WordPress/Elementor site. *Lead the Change.*

**Stack:** Next.js 15 (App Router, TypeScript strict) · Tailwind v4 (CSS-variable tokens) · Sanity v4 (embedded Studio) · React Hook Form + Zod · email delivery (SMTP via nodemailer, or Resend) · Cloudflare Turnstile · Upstash · Cal.com links · Plausible · Sentry · Storybook 10 · Playwright + axe · Vitest · Lighthouse CI.

See **DECISIONS.md** for why things are the way they are, **LAUNCH.md** for go-live, and **CONTENT.md** for what the client must supply.

---

## 1. Local setup

Requirements: Node 22+, npm 10+.

```bash
npm install
cp .env.example .env.local
# Forms work locally without sending real email:
echo 'EMAIL_DRY_RUN=1' >> .env.local
npm run dev                         # http://localhost:3000
```

There is **no database**. Form submissions are emailed to `LEADS_INBOX` (see §2).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Develop / production build / serve |
| `npm run typecheck` · `lint` · `test` | tsc · ESLint · Vitest unit tests |
| `npm run test:e2e` | Playwright (needs `npm run build` first). Email runs in dry-run mode: axe WCAG 2.2 AA, SEO, Sanity webhook, newsletter, careers, lead pipeline |
| `npm run storybook` / `build-storybook` | Component library on :6006 |
| `npm run sanity:seed` | Import `src/content` into Sanity (`-- --dry-run` to preview) |

---

## 2. Environment variables

Every variable is documented inline in **`.env.example`**. All are optional; this is what works without each:

| Service | Without its keys |
|---|---|
| Email (`LEADS_INBOX` + `SMTP_*` or `RESEND_API_KEY`) | Pages work; contact, careers and newsletter forms return a clear 503 telling visitors to email the contact address |
| Sanity | Site serves `src/content`; `/studio` shows a setup notice |
| Turnstile | Bot check skipped (honeypot + rate limit still apply if configured) |
| Upstash | No rate limiting |
| Cal.com | No "Book a call" CTAs ("Call us" shown) |
| Plausible / Sentry | Scripts/SDK not loaded at all |

---

## 3. Deploy to Hostinger (Node.js web app)

1. **hPanel → Websites → Add website → Node.js app**, connect GitHub repo `T31SHA/ACCESSLINECONSULTANCY-WEB`, branch `main`, framework Next.js, Node 22.x. Build `npm run build`, start `npm run start`. Auto-deploy on push.
2. **Environment variables** (hPanel → the app → Environment variables), then redeploy:
   - `LEADS_INBOX` — the Gmail address that receives every submission
   - `EMAIL_FROM` — e.g. `Accessline <you@gmail.com>`
   - `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER` (the Gmail address), `SMTP_PASS` (a Gmail **App Password**; needs 2-Step Verification) — *or* `RESEND_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`, `HIDE_SAMPLE_CONTENT=true`
   - optional: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_CAL_URL`, Sanity, Plausible, Sentry
   - `NEXT_PUBLIC_*` values are inlined at build time: redeploy after changing them.
3. **Sanity webhook** (optional): URL `<NEXT_PUBLIC_SITE_URL>/api/revalidate`, projection `{_type, "slug": slug.current}`, secret = `SANITY_REVALIDATE_SECRET`.
4. **Domain & DNS:** see LAUNCH.md.

CI (`.github/workflows/ci.yml`) runs typecheck → lint → unit → build → Playwright/axe → Lighthouse CI on every push and PR.

---

## 4. Editing content (Sanity Studio)

1. Create a Sanity project at sanity.io/manage and set `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`. Under *API → CORS origins*, add the site origin (with credentials) and `http://localhost:3000`.
2. Seed it with the current content (one-off, idempotent):
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=… SANITY_API_WRITE_TOKEN=… npm run sanity:seed
   ```
3. Editors go to **`<NEXT_PUBLIC_SITE_URL>/studio`** and sign in with their Sanity account (invite them in sanity.io/manage → Members).
4. What's editable: **Services, Industries, Case studies, Team, Testimonials, Client logos, Insights, Jobs, FAQs, Site settings** (stats, social links, booking URL). Company name, address, phone and email are fixed in code on purpose (they feed legal pages and structured data).
5. **Publishing:** hit *Publish* and the webhook refreshes the affected pages within seconds. New slugs (e.g. a new job) go live without a redeploy.
6. **The "Sample / unverified" toggle:** every document has one. Anything ticked is hidden on the live site (`HIDE_SAMPLE_CONTENT=true`). Untick it only once the client has approved the content.
7. **Images:** upload authentic photography where possible (bundled stock lives in `src/lib/images.ts`) and always fill in *Alt text* (required). Portraits 4:5 ≥1200 px; case-study heroes 16:9 ≥2000 px.

---

## 5. Project structure

```
src/app/(site)/          public pages (header/footer chrome)
src/app/studio/          embedded Sanity Studio
src/app/api/             leads · newsletter · careers/apply · revalidate (all form routes email LEADS_INBOX)
src/components/          ui · layout · cards · blocks · forms  (+ *.stories in src/stories)
src/content/             typed local content (fallback + seed source)
src/lib/content.ts       data layer: Sanity → fallback to src/content, sample gating
src/sanity/              schemas, GROQ queries, client
src/lib/server/email.ts  email transport (Resend or SMTP/nodemailer), field rendering
tests/                   Vitest unit tests + Playwright E2E
```

Design tokens (colour, fluid type scale, spacing, radii, breakpoints, motion) live in `src/app/globals.css` under `@theme`.
