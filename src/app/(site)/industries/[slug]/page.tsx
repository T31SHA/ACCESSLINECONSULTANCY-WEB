import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCaseStudies, getIndustries, getIndustry } from "@/lib/content";
import { industryImages } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// CMS can add slugs after deploy: render unknown params on demand (notFound() guards bad slugs).
export const dynamicParams = true;
export const generateStaticParams = async () => (await getIndustries()).map((i) => ({ slug: i.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const i = await getIndustry((await params).slug);
  if (!i) return {};
  return pageMetadata({ ...i.seo, path: `/industries/${i.slug}` });
}

export default async function IndustryPage({ params }: Props) {
  const ind = await getIndustry((await params).slug);
  if (!ind) notFound();
  const related = (await getCaseStudies()).filter((c) => c.industry === ind.slug);

  return (
    <>
      <PageHero
        crumbs={[{ name: "Industries", path: "/industries" }, { name: ind.title, path: `/industries/${ind.slug}` }]}
        overline="Industry"
        title={ind.title}
        lede={ind.short}
        image={industryImages[ind.slug]}
      />
      <section className="container-site grid gap-12 pb-[var(--section-y)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-h2" data-reveal>The challenges</h2>
        </div>
        <ol className="lg:col-span-7">
          {ind.challenges.map((c, i) => (
            <li key={c} data-reveal className="flex gap-6 border-t border-[var(--line)] py-6">
              <span className="font-display text-sm font-bold text-forest-500">0{i + 1}</span>
              <p className="font-display text-xl font-bold leading-snug">{c}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="theme-dark section bg-[var(--surface)] text-[var(--fg)]">
        <div className="container-site grid gap-8 lg:grid-cols-12">
          <p className="eyebrow text-[var(--fg-muted)] lg:col-span-4">Our approach</p>
          <p className="font-display text-h2 font-bold lg:col-span-8" data-reveal>{ind.approach}</p>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section container-site">
          <SectionHeading overline="Related work" title={`${ind.title} in practice`} />
          <div className="grid gap-12 md:grid-cols-3 md:gap-6">
            {related.map((c, i) => <CaseStudyCard key={c.slug} index={i} cs={c} industryTitle={ind.title} />)}
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
