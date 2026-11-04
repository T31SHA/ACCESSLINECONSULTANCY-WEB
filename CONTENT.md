# Client content checklist (blocks launch)

Everything unverified is marked **Sample / unverified** (`sample: true` in code, a toggle in Studio) and disappears when `HIDE_SAMPLE_CONTENT=true`. Replace each item in **Studio** (`/studio`) once Sanity is connected, or in `src/content/*` before that.

| Item | Studio type / file | Status |
|---|---|---|
| Company name | fixed in code | ✅ Accessline Consultancy Limited |
| Email · address · phone | fixed in code | ✅ 10th Floor, Ecobank Towers, Nairobi · +254 729 963 218 · email via `NEXT_PUBLIC_CONTACT_EMAIL` (default info@accesslineconsultancy.com; ☐ confirm still valid) |
| WhatsApp on +254 729 963 218 | `src/content/site.ts` | ☐ client to confirm it's active |
| Social profile URLs | Site settings → Socials | ☐ none shown until supplied |
| Booking link | Site settings → Cal.com URL / `NEXT_PUBLIC_CAL_URL` | ☐ |
| Stats (years, campaigns, sectors, countries) | Site settings → Stats | ☐ sample |
| Founding year & milestones | `src/app/(site)/about/page.tsx` | ☐ sample (hidden at launch) |
| Memberships / credentials | About page | ☐ supply if any |
| Team: names, roles, photos (4:5, ≥1200 px), bios, LinkedIn | Team member | ☐ 4 role-only samples |
| 3–6 case studies with metrics, photos, quote approval | Case study | ☐ 3 illustrative samples |
| 3+ attributable testimonials | Testimonial | ☐ 3 samples |
| Permitted client logos (SVG) | Client logo | ☐ "Partner One…" placeholders |
| Authentic Nairobi photography | image fields | ☐ licensed Pexels/Unsplash stock in use (`src/lib/images.ts`); team keeps monograms |
| Insights articles (proofread) | Insight | ☐ 3 samples |
| Live vacancies | Job | ☐ 2 samples |
| Privacy & Terms legal review | `src/app/(site)/privacy`, `terms` | ☐ draft |
| Service & industry copy proofread | Service / Industry | ☐ written by us, client to approve |
