import type { Metadata } from "next";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { IndustryCard } from "@/components/cards/industry-card";
import { images } from "@/lib/images";
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
        image={images["industries-hero-nairobi-cityscape"]}
        imageRatio="aspect-[16/9] md:aspect-[4/3]"
      />
      <section className="container-site pb-[var(--section-y)]">
        <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 sm:gap-y-14 md:grid-cols-3">
          {industries.map((ind, i) => <IndustryCard key={ind.slug} industry={ind} index={i} />)}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
