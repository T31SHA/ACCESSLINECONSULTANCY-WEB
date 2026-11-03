# Client content checklist (blocks launch)

Search the code for `CLIENT TO CONFIRM` / `CLIENT TO SUPPLY` / `sample: true`.

| Item | Where | Status |
|---|---|---|
| One legal name (currently "Accessline Consultancy Ltd") | `src/content/site.ts` | ☐ confirm |
| Phone, WhatsApp number, office hours | `src/content/site.ts` | ☐ placeholder `+254 700 000 000` |
| Social URLs (LinkedIn, X, Instagram) | `src/content/site.ts` | ☐ confirm |
| Real stats (years, campaigns, sectors, countries) | `src/content/site.ts → stats` | ☐ verify |
| Company milestones 2012→now | `src/app/about/page.tsx` | ☐ confirm |
| Professional memberships / credentials | `src/app/about/page.tsx` | ☐ supply |
| Team: names, roles, photos (4:5, ≥1200px), bios, LinkedIn | `src/content/people.ts` | ☐ sample roles only |
| 3–6 case studies with metrics + photos + quote approval | `src/content/work.ts` | ☐ 3 illustrative samples |
| 3+ attributable testimonials | `src/content/work.ts` | ☐ samples |
| Permitted client logos (SVG) | `src/content/work.ts → clientLogos` | ☐ "Partner One…" wordmarks |
| Authentic Nairobi photography (hero, case studies, insights) | `MediaFrame src` | ☐ topo fallback in use |
| Insights articles (proofread) | `src/content/insights.ts` | ☐ samples |
| Live vacancies | `src/content/people.ts → jobs` | ☐ samples |
| Privacy & Terms legal review | `src/app/privacy`, `src/app/terms` | ☐ draft |
| Cal.com booking URL | `NEXT_PUBLIC_CAL_URL` | ☐ |
