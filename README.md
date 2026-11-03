# Accessline Consultancy Limited · website

Custom-built site, hosted on Hostinger (Node.js). *Lead the Change.* There is **no database**: every form is emailed to `LEADS_INBOX`.

**Stack:** Next.js 15 (App Router, TypeScript strict) · Tailwind v4 (CSS-variable tokens) · Sanity v4 (embedded Studio) · React Hook Form + Zod · email delivery via Resend or SMTP (nodemailer) · Cloudflare Turnstile · Upstash · Cal.com links · Plausible · Sentry · Storybook 10 · Playwright + axe · Vitest · Lighthouse CI.

See **DECISIONS.md** for why things are the way they are, **LAUNCH.md** for go-live, and **CONTENT.md** for what the client must supply.

---

## 1. Local setup

Requirements: Node 22+, npm 10+.

```bash
npm install
cp .env.example .env.local
# Forms need an email transport. For local work, write emails to disk instead of sending:
echo 'EMAIL_TEST_OUTBOX=.email-outbox-dev' >> .env.local
npm run dev                         # http://localhost:3000
```

Submissions then appear as JSON files in `.email-outbox-dev/` (git-ignored). To send real mail locally, set the `SMTP_*` or `RESEND_API_KEY` variables instead (see §2).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Develop / production build / serve |
| `npm run typecheck` · `lint` · `test` | tsc · ESLint · Vitest unit tests |
| `npm run test:e2e` | Playwright (needs `npm run build` first). Email is mocked: the server writes messages to `.email-outbox-e2e/` and specs assert on them. Covers axe WCAG 2.2 AA, SEO, contact/quick forms, job application with CV, newsletter, Sanity webhook |
| `npm run storybook` / `build-storybook` | Component library on :6006 |
| `npm run sanity:seed` | Import `src/content` into Sanity (`-- --dry-run` to preview) |

---

## 2. Environment variables

Every variable is documented inline in **`.env.example`**. Only email is needed for the forms; everything else is optional. This is what happens without each:

| Service | Without its keys |
|---|---|
| Email (`RESEND_API_KEY` or `SMTP_*`) | Pages work; the contact, application and newsletter endpoints return a clear 503 ("please email info@…") rather than accepting a submission nobody will receive |
| Sanity | Site serves `src/content`; `/studio` shows a setup notice |
| Turnstile | Bot check skipped (honeypot + rate limit still apply if configured) |
| Upstash | No rate limiting |
| Cal.com (`NEXT_PUBLIC_CAL_URL`) | No "Book a call" CTAs ("Call us" shown) |
| Plausible / Sentry | Scripts/SDK not loaded at all |

---

## 3. Deploy to Hostinger

The site is a standard Next.js server app (`next build` + `next start`), deployed as a **Node.js app** on Hostinger (a plan with Node.js support, e.g. Business/Cloud web hosting or a VPS).

1. **Create the Node.js app** in hPanel and connect this GitHub repo (or upload a build). Node version **22**, build command `npm ci && npm run build`, start command `npm start`. Hostinger sets `PORT`; `next start` honours it.
2. **Email (required for forms):** create a mailbox in hPanel → Emails (e.g. `forms@yourdomain.com`), then set
   `SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`, `SMTP_USER=forms@yourdomain.com`, `SMTP_PASS=<mailbox password>` and `LEADS_INBOX=<where submissions should land>`.
   Alternatively set `RESEND_API_KEY` (and verify the domain in Resend); Resend wins when both are set.
3. **Environment variables:** add the rest of `.env.example` in the app's environment settings. Set **`HIDE_SAMPLE_CONTENT=true`** and `NEXT_PUBLIC_SITE_URL` to the live origin. `NEXT_PUBLIC_*` values are baked in at build time, so rebuild after changing them. Never set `EMAIL_TEST_OUTBOX` in production.
4. **Smoke test:** submit the contact form, a job application with a PDF CV, and a newsletter sign-up. Each should arrive at `LEADS_INBOX`; hitting *Reply* should address the submitter.
5. **Sanity webhook** (after the first deploy): sanity.io/manage → API → Webhooks: URL `<NEXT_PUBLIC_SITE_URL>/api/revalidate`, trigger on create/update/delete, projection `{_type, "slug": slug.current}`, secret = `SANITY_REVALIDATE_SECRET`.
6. **Domain & DNS:** see LAUNCH.md.

**Data retention** now lives in the inbox, not the app: delete enquiries after 24 months and applications (with CVs) after 12 months, as promised on /privacy.

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
src/app/api/             leads · newsletter · careers/apply · revalidate  (forms → src/lib/server/email.ts)
src/components/          ui · layout · cards · blocks · forms  (+ *.stories in src/stories)
src/content/             typed local content (fallback + seed source)
src/lib/content.ts       data layer: Sanity → fallback to src/content, sample gating
src/sanity/              schemas, GROQ queries, client
tests/                   Vitest unit tests + Playwright E2E
```

Design tokens (colour, fluid type scale, spacing, radii, breakpoints, motion) live in `src/app/globals.css` under `@theme`.
