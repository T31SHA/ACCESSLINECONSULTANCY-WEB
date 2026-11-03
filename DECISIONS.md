# Decisions log

Decisions made autonomously during the build. Each lists the choice and why.

## Content & facts
- **One company name:** "Accessline Consultancy Limited" in all body copy, legal pages, schema, emails and the footer. The short mark "Accessline" survives only in the logo wordmark and the `<title>` suffix, because the full name (31 chars) breaks the ≤60-char title budget.
- **Verified contacts only:** info@accesslineconsultancy.com · 10th Floor, Ecobank Towers, Nairobi · +254 727 684443. Removed: street name, postcode, map coordinates, office hours and all social URLs (none were verified). The WhatsApp link uses the same verified number; the client must confirm WhatsApp is active on it (LAUNCH.md).
- **Unverified claims:** "since 2012", years in business, stats, timeline and memberships are now `sample: true` (or removed from copy outright). They disappear when `HIDE_SAMPLE_CONTENT=true`. "Reply within one working day" was an unconfirmed SLA, so it became "reply personally".
- **Booking CTAs** render only when `NEXT_PUBLIC_CAL_URL` is set; otherwise a "Call us" link takes their place.
- Git: commits go straight to `main` as instructed (fresh repo, no PR workflow yet).
