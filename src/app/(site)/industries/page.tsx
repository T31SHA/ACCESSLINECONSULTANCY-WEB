import type { Metadata } from "next";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { IndustryTile } from "@/components/cards/industry-tile";
import { getIndustries } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Industries We Serve Across Africa",
  description: "Sector-fluent communications for corporates, NGOs, government, health, education, technology, sustainability, FMCG and financial services.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Industries", path: "/industries" }]}
        overline="Industries"
        title="Sector fluency, from boardroom to county."
        lede="Every sector has its own regulators, audiences and unwritten rules. We know them."
      />
      <section className="container-site pb-[var(--section-y)]">
        <ul className="border-t border-[var(--line)]">
          {industries.map((i) => <IndustryTile key={i.slug} industry={i} />)}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
