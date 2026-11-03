import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe("sample gating", () => {
  it("shows sample content by default", async () => {
    const c = await import("@/content");
    expect(c.caseStudies.length).toBeGreaterThan(0);
    expect(c.stats.length).toBeGreaterThan(0);
  });
  it("hides every sample entry when HIDE_SAMPLE_CONTENT=true, keeps real content", async () => {
    vi.stubEnv("HIDE_SAMPLE_CONTENT", "true");
    const c = await import("@/content");
    for (const list of [c.caseStudies, c.testimonials, c.clientLogos, c.team, c.posts, c.jobs, c.stats]) expect(list).toHaveLength(0);
    expect(c.sampleFacts).toBeUndefined();
    expect(c.services).toHaveLength(8);
    expect(c.industries).toHaveLength(9);
  });
});

describe("site facts", () => {
  it("uses one legal name and verified contacts only", async () => {
    const { site } = await import("@/content/site");
    expect(site.name).toBe("Accessline Consultancy Limited");
    expect(site.legalName).toBe("Accessline Consultancy Limited");
    expect(site.email).toBe("info@accesslineconsultancy.com");
    expect(site.phone).toBe("+254 729 963 218");
    expect(site.phoneHref).toBe("tel:+254729963218");
    expect(site.whatsapp).toBe("https://wa.me/254729963218");
    expect(site.address.street).toBe("10th Floor, Ecobank Towers");
    expect(JSON.stringify(site)).not.toMatch(/gmail|700 000|Ltd"|727 ?684 ?443/);
    if (!process.env.NEXT_PUBLIC_SITE_URL) expect(site.url).toBe("https://slategrey-deer-824136.hostingersite.com");
    expect(site.url).not.toMatch(/accesslineconsultancy\.com|\/$/);
  });
});

describe("data layer", () => {
  it("falls back to local content when Sanity is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");
    const { getServices, getSiteSettings } = await import("@/lib/content");
    expect((await getServices()).map((s) => s.slug)).toContain("pr-media-relations");
    expect((await getSiteSettings()).stats.length).toBeGreaterThanOrEqual(0);
  });
});
