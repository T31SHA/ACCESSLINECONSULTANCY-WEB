import type { MetadataRoute } from "next";
import { industries } from "@/content/industries";
import { posts } from "@/content/insights";
import { jobs } from "@/content/people";
import { services } from "@/content/services";
import { absoluteUrl } from "@/lib/seo";
import { caseStudies } from "@/content/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics = ["/", "/about", "/services", "/industries", "/work", "/team", "/insights", "/careers", "/contact", "/privacy", "/terms"];
  return [
    ...statics.map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: now, priority: 0.9 })),
    ...industries.map((i) => ({ url: absoluteUrl(`/industries/${i.slug}`), lastModified: now, priority: 0.7 })),
    ...caseStudies.map((c) => ({ url: absoluteUrl(`/work/${c.slug}`), lastModified: now, priority: 0.6 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/insights/${p.slug}`), lastModified: new Date(p.date), priority: 0.6 })),
    ...jobs.map((j) => ({ url: absoluteUrl(`/careers/${j.slug}`), lastModified: new Date(j.posted), priority: 0.5 })),
  ];
}
