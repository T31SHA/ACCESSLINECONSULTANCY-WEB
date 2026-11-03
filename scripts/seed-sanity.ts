/**
 * Imports src/content into Sanity (idempotent: deterministic _ids + createOrReplace).
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=… SANITY_API_WRITE_TOKEN=… npm run sanity:seed
 * Sample flags are preserved, so placeholder content stays gated in the CMS too.
 * Run with HIDE_SAMPLE_CONTENT unset so sample entries are imported (and marked).
 */
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";
import * as local from "../src/content";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");
if (!dryRun && (!projectId || !token)) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN to seed (or pass --dry-run).");
  process.exit(1);
}
const client = createClient({
  projectId: projectId || "dry-run",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-10-01",
  token,
  useCdn: false,
});

const key = () => randomUUID().slice(0, 12);
const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });
const strings = (xs: readonly string[]) => [...xs];
const slug = (s: string) => ({ _type: "slug", current: s });
const id = (type: string, s: string) => `${type}.${s}`;

type Doc = { _id: string; _type: string; [k: string]: unknown };
const docs: Doc[] = [];

docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  stats: local.stats.map((s) => ({ ...s, _key: key() })),
  socials: { ...local.site.socials },
  ...(local.site.calUrl ? { calUrl: local.site.calUrl } : {}),
});

local.services.forEach((s, i) => {
  const faqRefs = s.faqs.map((f, j) => {
    const fid = id("faq", `${s.slug}-${j}`);
    docs.push({ _id: fid, _type: "faq", question: f.q, answer: f.a });
    return ref(fid);
  });
  docs.push({
    _id: id("service", s.slug), _type: "service", title: s.title, slug: slug(s.slug), order: i, short: s.short, icon: s.icon,
    problem: s.problem, outcome: s.outcome, deliverables: strings(s.deliverables),
    process: s.process.map((p) => ({ ...p, _key: key() })), faqs: faqRefs, seo: s.seo,
  });
});

local.industries.forEach((ind, i) =>
  docs.push({
    _id: id("industry", ind.slug), _type: "industry", title: ind.title, slug: slug(ind.slug), order: i, short: ind.short,
    challenges: strings(ind.challenges), approach: ind.approach, seo: ind.seo,
  }),
);

local.team.forEach((m, i) =>
  docs.push({
    _id: id("teamMember", m.slug), _type: "teamMember", name: m.name, slug: slug(m.slug), order: i, role: m.role,
    department: m.department, linkedin: m.linkedin, bio: m.bio, leadership: !!m.leadership, sample: !!m.sample,
  }),
);

local.caseStudies.forEach((c) =>
  docs.push({
    _id: id("caseStudy", c.slug), _type: "caseStudy", title: c.title, slug: slug(c.slug), client: c.client, summary: c.summary,
    services: c.services.map((s) => ref(id("service", s))), industry: { _type: "reference", _ref: id("industry", c.industry) },
    year: c.year, challenge: c.challenge, approach: strings(c.approach), metrics: c.metrics.map((m) => ({ ...m, _key: key() })),
    ...(c.quote ? { quote: c.quote } : {}), sample: !!c.sample,
  }),
);

local.posts.forEach((p) =>
  docs.push({
    _id: id("post", p.slug), _type: "post", title: p.title, slug: slug(p.slug), excerpt: p.excerpt, category: p.category,
    publishedAt: p.date, readingMinutes: p.readingMinutes, featured: !!p.featured,
    ...(local.team.some((m) => m.slug === p.author) ? { author: { _type: "reference", _ref: id("teamMember", p.author) } } : {}),
    body: p.body.map((b) => ({ _type: "section", _key: key(), heading: b.heading, paragraphs: strings(b.paragraphs) })),
    sample: !!p.sample,
  }),
);

local.jobs.forEach((j) =>
  docs.push({
    _id: id("job", j.slug), _type: "job", title: j.title, slug: slug(j.slug), department: j.department, location: j.location, type: j.type,
    posted: j.posted, validThrough: j.validThrough, summary: j.summary, responsibilities: strings(j.responsibilities),
    requirements: strings(j.requirements), sample: !!j.sample,
  }),
);

local.testimonials.forEach((t, i) => docs.push({ _id: id("testimonial", String(i)), _type: "testimonial", ...t, sample: !!t.sample }));
local.clientLogos.forEach((l, i) => docs.push({ _id: id("clientLogo", String(i)), _type: "clientLogo", name: l.name, order: i, sample: !!l.sample }));

async function main() {
  const tx = client.transaction();
  for (const d of docs) tx.createOrReplace(d);
  await tx.commit({ visibility: "async" });
  const counts = docs.reduce<Record<string, number>>((a, d) => ((a[d._type] = (a[d._type] ?? 0) + 1), a), {});
  console.log(`Seeded ${docs.length} documents:`, counts);
}

if (dryRun) {
  const counts = docs.reduce<Record<string, number>>((a, d) => ((a[d._type] = (a[d._type] ?? 0) + 1), a), {});
  console.log(`[dry run] would seed ${docs.length} documents:`, counts);
} else {
  main().catch((e) => { console.error(e); process.exit(1); });
}
