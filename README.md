# Accessline Consultancy — accesslineconsultancy.com

Custom rebuild replacing the WordPress/Elementor site. *Lead the Change.*

**Stack:** Next.js 15 (App Router, TS strict) · Tailwind v4 (CSS-var tokens) · Radix · RHF + Zod · Drizzle + Neon Postgres · Resend · Turnstile · Upstash · R2 · Plausible · Playwright + axe · Vitest · Lighthouse CI.

## Quick start
```bash
cp .env.example .env.local   # every integration degrades gracefully when unset
npm install
npm run dev                  # http://localhost:3000
```

| Script | |
|---|---|
| `npm run build` / `start` | production build / serve |
| `npm run typecheck` · `lint` · `test` | tsc · eslint · vitest |
| `npm run test:e2e` | Playwright: axe (WCAG 2.2 AA), one-H1, 301s, form validation (desktop + mobile) |
| `npm run db:generate` · `db:migrate` | Drizzle migrations (`drizzle/`) |

## Structure
```
src/app/                 routes (full sitemap), API (leads, newsletter, careers), sitemap/robots/OG images
src/components/ui        Button (primary/outline/ghost/arrow), MediaFrame (duotone), Magnetic, RevealObserver, JsonLd
src/components/layout    Header (mega-menu + full-screen mobile), Footer, Breadcrumbs (+schema), Logo
src/components/blocks    StatCounter, LogoMarquee, TestimonialSlider, Timeline, Accordion, CtaBand, TeamGrid+drawer, WorkFilter, MapEmbed
src/components/forms     LeadForm (3-step, autosave, error summary), ShortLeadForm (lazy), Newsletter, ApplyForm (R2 presigned)
src/content/             typed content layer — mirrors CMS document types; swap for Sanity adapter in P3
src/db/                  Drizzle schema (7 tables, enums, indexes), retention.sql (Kenya DPA)
src/lib/                 seo (metadata), schema (JSON-LD), lead-schema (Zod), server/ (turnstile, rate-limit, email, r2)
```

## Design tokens
Defined once in `src/app/globals.css` (`@theme`): ink/forest/mint/sand/accent/slate palette, fluid type scale (Display 56→112 … Overline 12), radii 4/12/24/999, breakpoints 480/768/1024/1280/1536, one hover shadow. Surface themes: default (sand), `.theme-dark` (ink), `.theme-forest`. Amber is reserved for primary CTAs and the focus ring.

Fonts: **Syne 600/700** (display) + **Inter** variable (body), self-hosted WOFF2 via `next/font`, preloaded. Swap Syne → Clash Display by dropping the licensed WOFF2 into `next/font/local` in `layout.tsx`.

## Lead flow
`POST /api/leads` → rate-limit (Upstash) → Zod payload → honeypot → Turnstile → Zod form schema → insert `leads` (with score) → notify `info@` (+Slack) → auto-reply with Cal.com link → log `lead_events` → client routes to `/thank-you` + Plausible `Lead Submitted`.

## Launch gate
Unapproved placeholder content is flagged `sample: true`. Set `HIDE_SAMPLE_CONTENT=true` to strip it all; launch requires that flag on with real content present. See **CONTENT.md**.

## Performance (current)
Home First Load JS **116 KB gz** (budget 120). RHF+Zod lazy-loaded on scroll; Turnstile/Maps/Plausible load only on interaction or idle; marquee + reveals are CSS-only.
