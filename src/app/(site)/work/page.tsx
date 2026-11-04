import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { WorkFilter } from "@/components/blocks/work-filter";
import { getCaseStudies, getIndustries, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Work | PR & Communications Case Studies",
  description: "Case studies in PR, SBCC, strategy and events from Accessline Consultancy Limited: the challenge, the approach and the measurable results.",
  path: "/work",
});

const opts = <T extends { slug: string; title: string }>(xs: T[]) => xs.map(({ slug, title }) => ({ slug, title }));

export default async function WorkPage() {
  const [caseStudies, services, industries] = await Promise.all([getCaseStudies(), getServices(), getIndustries()]);
  return (
    <>
      <PageHero crumbs={[{ name: "Work", path: "/work" }]} overline="Work" title="Outcomes we can put a number on." />
      <section className="container-site pb-[var(--section-y)]">
        <Suspense>
          <WorkFilter items={caseStudies} services={opts(services)} industries={opts(industries)} />
        </Suspense>
      </section>
      <CtaBand title="Your outcome next?" />
    </>
  );
}
