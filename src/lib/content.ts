import "server-only";
import { cache } from "react";
import * as local from "@/content";
import { published, type CaseStudy, type ClientLogo, type Industry, type Job, type Post, type Service, type TeamMember, type Testimonial } from "@/content/types";
import { sanityFetch } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import * as q from "@/sanity/queries";

/**
 * Data layer. Reads Sanity when SANITY env vars are configured; otherwise (or if Sanity
 * errors) falls back to the typed files in src/content. Sample gating applies to both.
 */
async function load<T extends { sample?: boolean }>(query: string, tag: string, fallback: T[]): Promise<T[]> {
  if (!isSanityConfigured) return fallback;
  try {
    const rows = await sanityFetch<T[]>(query, {}, [tag]);
    return published((rows ?? []).map(stripNulls));
  } catch (err) {
    console.error(`[content] Sanity fetch failed for ${tag}; using local content`, err);
    return fallback;
  }
}

/** GROQ returns null for missing fields; our types use undefined. */
function stripNulls<T>(row: T): T {
  if (Array.isArray(row)) return row.map(stripNulls) as T;
  if (row && typeof row === "object") {
    return Object.fromEntries(
      Object.entries(row).filter(([, v]) => v !== null).map(([k, v]) => [k, stripNulls(v)]),
    ) as T;
  }
  return row;
}

export const getServices = cache(() => load<Service>(q.services, "service", local.services));
export const getIndustries = cache(() => load<Industry>(q.industries, "industry", local.industries));
export const getCaseStudies = cache(() => load<CaseStudy>(q.caseStudies, "caseStudy", local.caseStudies));
export const getTeam = cache(() => load<TeamMember>(q.team, "teamMember", local.team));
export const getPosts = cache(() => load<Post>(q.posts, "post", local.posts));
export const getJobs = cache(() => load<Job>(q.jobs, "job", local.jobs));
export const getTestimonials = cache(() => load<Testimonial>(q.testimonials, "testimonial", local.testimonials));
export const getClientLogos = cache(() => load<ClientLogo>(q.clientLogos, "clientLogo", local.clientLogos));

const bySlug = <T extends { slug: string }>(list: () => Promise<T[]>) => async (slug: string) =>
  (await list()).find((x) => x.slug === slug);

export const getService = bySlug(getServices);
export const getIndustry = bySlug(getIndustries);
export const getCaseStudy = bySlug(getCaseStudies);
export const getPost = bySlug(getPosts);
export const getJob = bySlug(getJobs);

export type Stat = { value: number; suffix: string; label: string; sample?: boolean };
export type SiteSettings = {
  stats: Stat[];
  socials: Partial<Record<"linkedin" | "x" | "instagram" | "facebook", string>>;
  calUrl?: string;
};

/** Editable site settings (stats, socials, booking link). Verified NAP stays in code. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const fallback: SiteSettings = { stats: local.stats, socials: { ...local.site.socials }, calUrl: local.site.calUrl };
  if (!isSanityConfigured) return fallback;
  try {
    const s = stripNulls(await sanityFetch<Partial<SiteSettings> | null>(q.siteSettings, {}, ["siteSettings"]));
    if (!s) return fallback;
    return {
      stats: published(s.stats ?? fallback.stats),
      socials: { ...fallback.socials, ...(s.socials ?? {}) },
      calUrl: s.calUrl || fallback.calUrl,
    };
  } catch (err) {
    console.error("[content] Sanity siteSettings failed; using local", err);
    return fallback;
  }
});
