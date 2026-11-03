# Launch checklist

Work top to bottom. Nothing goes live until every box in sections 1–3 is ticked.

## 1. Content the client must supply (blocks launch)

Full detail and file locations are in **CONTENT.md**. In Studio, every item below is currently marked *Sample / unverified*.

- [ ] **Case studies:** 3–6 real, approved, with metrics, photography and quote permission
- [ ] **Testimonials:** 3+ attributable (name, role, organisation, written approval)
- [ ] **Team:** real names, roles, bios, LinkedIn URLs and portraits (4:5, ≥1200 px)
- [ ] **Client logos:** only those the client has written permission to display (SVG)
- [ ] **Stats:** verified figures (years, campaigns, sectors, countries) or remove the section
- [ ] **Company history:** confirm founding year and milestones for the About timeline
- [ ] **Credentials/memberships** (e.g. PRSK) if any
- [ ] **Insights:** proofread articles (or launch with none; the section hides itself)
- [ ] **Jobs:** live vacancies (or none; the page says "No open roles right now")
- [ ] **Photography:** authentic Nairobi/team/work imagery (hero, case studies, insights)
- [ ] **Social profiles:** real URLs (Studio → Site settings)
- [ ] **WhatsApp:** confirm WhatsApp is active on +254 727 684443
- [ ] **Legal review** of /privacy and /terms (Kenya DPA 2019); register with the ODPC if required
- [ ] Final **proofread** of all copy

Already settled: company name *Accessline Consultancy Limited*; contacts info@accesslineconsultancy.com · 10th Floor, Ecobank Towers, Nairobi · +254 727 684443.

## 2. Accounts & environment keys (Vercel → Production)

| | Key(s) | Done |
|---|---|---|
| Launch gate | `HIDE_SAMPLE_CONTENT=true` | [ ] |
| Site URL | `NEXT_PUBLIC_SITE_URL=https://accesslineconsultancy.com` | [ ] |
| Neon | `DATABASE_URL` + run `npm run db:migrate` | [ ] |
| Sanity | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_REVALIDATE_SECRET` (+ seed, editors invited, CORS origin) | [ ] |
| Admin | `AUTH_SECRET`, `ADMIN_EMAILS`, `ADMIN_PASSWORD_HASH` | [ ] |
| Resend | `RESEND_API_KEY`, `EMAIL_FROM`, `LEADS_INBOX` (domain verified: SPF/DKIM/DMARC) | [ ] |
| Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | [ ] |
| Upstash | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | [ ] |
| R2 | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` (private + CORS) | [ ] |
| Cal.com | `NEXT_PUBLIC_CAL_URL`, `CAL_WEBHOOK_SECRET` (+ webhook created) | [ ] |
| Cron | `CRON_SECRET` | [ ] |
| Plausible | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (+ site added in Plausible; goals: Lead Submitted, WhatsApp Click, Newsletter Signup, Job Application) | [ ] |
| Sentry | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN` (optional: `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`) | [ ] |
| Slack (optional) | `SLACK_WEBHOOK_URL` | [ ] |
| Chromatic (optional) | project token → add a Chromatic step to CI | [ ] |

Must **not** be set in Production: `ADMIN_PASSWORD`, `E2E_EXPOSE_TOKENS`, `SANITY_API_WRITE_TOKEN`.

## 3. Pre-launch verification (on the Vercel preview URL)

- [ ] CI green on `main` (typecheck, lint, unit, build, Playwright + axe, Lighthouse)
- [ ] Submit the contact form → lead appears in `/admin`, notification arrives at info@, auto-reply arrives with booking link
- [ ] Book via the auto-reply link → booking shows on the lead in `/admin`
- [ ] Newsletter signup → confirmation email → confirm page works
- [ ] Apply for a job with a PDF → row in DB, file in R2
- [ ] Publish an edit in Studio → page updates within ~10 s
- [ ] `/admin` CSV export opens correctly in Excel
- [ ] No sample content visible anywhere (spot-check home, work, team, insights, careers)
- [ ] Design QA at 375 / 768 / 1280 / 1536 px

## 4. DNS & go-live

- [ ] Lower TTL on existing DNS records to 300 s, 24 h before cutover
- [ ] Add `accesslineconsultancy.com` and `www.accesslineconsultancy.com` in Vercel → Domains; redirect `www` → apex
- [ ] At the registrar/DNS host: apex `A 76.76.21.21`, `www CNAME cname.vercel-dns.com` (or as shown by Vercel)
- [ ] **Keep MX/SPF/DKIM records for email untouched**; add Resend's DKIM/SPF records
- [ ] SSL certificate issued (automatic) → HSTS header active
- [ ] Verify legacy redirects return **301**: `/about-us → /about`, `/our-services → /services`, `/our-partners → /industries`, `/gis-remote-sensing → /team`, `/logistics-support → /careers`, `/wp-json/* → /`, `/wp-admin/* → /`
- [ ] Crawl the old sitemap for any other indexed WordPress URLs and add redirects in `next.config.ts`

## 5. After launch

- [ ] Google Search Console: verify domain, submit `/sitemap.xml`, request indexing of key pages
- [ ] Bing Webmaster Tools: import from Search Console
- [ ] Google Business Profile: NAP must match exactly (Accessline Consultancy Limited · 10th Floor, Ecobank Towers, Nairobi · +254 727 684443)
- [ ] Sentry receives a test error; Plausible shows traffic and goal conversions
- [ ] Confirm the first retention cron run in Vercel → Cron logs (and `audit_log`)
- [ ] Retire WordPress: export a final backup, then shut down hosting (the public `/wp-json/wp/v2/users` exposure ends here)
- [ ] After 2–4 weeks: check field Core Web Vitals (CrUX / Search Console) against LCP < 2.0 s, INP < 200 ms, CLS < 0.05
