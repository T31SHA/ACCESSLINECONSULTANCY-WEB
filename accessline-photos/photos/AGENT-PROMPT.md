# Task: wire Accessline stock photos into the Next.js site

**Inputs:** the `*.webp` files and `MANIFEST.md` in this folder. MANIFEST.md lists the target section and alt text for every file.

1. Copy all `*.webp` files into `public/images/` (for example `public/images/services/`, `public/images/industries/`). Keep the filenames. Leave out `contact-sheet.jpg` and the `.md` files.
2. Create one typed map, such as `src/lib/images.ts`, that links each slug to `{ src, alt, width, height }`. Take the alt text exactly from MANIFEST.md and the dimensions from the Size column. Sections must read from this map; don't hard-code paths.
3. Place each image in the section MANIFEST.md names: home hero and closing CTA; About; the 8 service cards and service detail pages; the 9 industry cards; Work (featured case study); Insights (default/hero image); Careers (hero and culture section); Contact.
4. Use `next/image` everywhere:
   - **Hero only** (`hero-nairobi-skyline`): `priority`, `fetchPriority="high"`, `sizes="100vw"`. No other image gets `priority`.
   - All other images: default lazy loading, `placeholder="empty"` or a tiny blur, and accurate `sizes`, e.g. cards `"(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"`, half-width splits `"(min-width:1024px) 50vw, 100vw"`, full-bleed bands `"100vw"`.
   - Use `fill` with `object-cover` inside an aspect-ratio box (for example `aspect-[4/3]`, `aspect-[16/9]`), or pass explicit width and height, so CLS stays at 0.
   - Put text over photos only on a deep-green gradient overlay (#014F29 at 60–80%). Text must reach WCAG AA contrast.
   - `next.config`: `images.formats = ['image/avif','image/webp']`. Add no remote patterns; every image is local.
5. **Team page:** keep the current placeholders, such as initials or monogram tiles on cream with a green or amber accent. Don't use real names, don't put stock faces on team members, and don't invent bios.
6. Add a "Photo credits" note to `/terms` or the footer. It is optional under the Pexels/Unsplash licences, but list the photographers from MANIFEST.md.
7. Verify: `next build` passes. Run Lighthouse (mobile) on `/`, `/services`, `/industries` and `/about`: Performance ≥ 95, CLS < 0.1, LCP < 2.5 s, no "properly size images" or "offscreen images" warnings. Fix anything that falls short before you open the PR.
