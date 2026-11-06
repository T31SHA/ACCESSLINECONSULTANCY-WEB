import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { SectionHeading } from "@/components/ui/section-heading";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceIcon } from "@/components/ui/icons";
import { getCaseStudies, getIndustries, getIndustry, getServices } from "@/lib/content";
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
  const [caseStudies, services] = await Promise.all([getCaseStudies(), getServices()]);
  const related = caseStudies.filter((c) => c.industry === ind.slug);
  // Disciplines proven in this sector; every discipline when there is no published work yet.
  const used = new Set(related.flatMap((c) => c.services));
  const disciplines = used.size ? services.filter((s) => used.has(s.slug)) : services;

  return (
    <>
      <PageHero
        crumbs={[{ name: "Industries", path: "/industries" }, { name: ind.title, path: `/industries/${ind.slug}` }]}
        overline="Industry"
        title={ind.title}
        lede={ind.short}
        image={industryImages[ind.slug]}
      />
      <section className="container-site grid gap-12 pb-[var(--section-y)] lg:grid-cols-12" aria-labelledby="challenges-title">
        <div className="lg:col-span-5" data-reveal>
          <div className="lg:sticky lg:top-28">
            <p className="readout mb-5 text-[var(--fg-muted)]">Sector brief · {String(ind.challenges.length).padStart(2, "0")} challenges</p>
            <h2 id="challenges-title" className="text-h2">The challenges</h2>
          </div>
        </div>
        <ol className="lg:col-span-7">
          {ind.challenges.map((c, i) => (
            <li key={c} data-reveal className="flex items-start gap-6 border-t border-[var(--line)] py-6">
              <span aria-hidden className="readout mt-1 inline-flex h-8 min-w-11 shrink-0 items-center justify-center rounded-pill bg-mint-50 px-3 text-forest-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-xl font-bold leading-snug">{c}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="theme-forest relative isolate overflow-hidden section bg-[var(--surface)] text-[var(--fg)]" aria-labelledby="approach-title">
        <div aria-hidden className="topo pointer-events-none absolute inset-0 -z-10 text-sand-50 opacity-[0.04]" />
        <div className="container-site grid gap-8 lg:grid-cols-12">
          <h2 id="approach-title" className="readout flex items-center gap-3 self-start text-accent-400 lg:col-span-4">
            <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-accent-400" />Our approach
          </h2>
          <p className="font-display text-h2 font-bold lg:col-span-8" data-reveal>{ind.approach}</p>
        </div>
      </section>
      <section className="section container-site" aria-labelledby="disciplines-title">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="disciplines-title" className="text-h3">Disciplines we bring to {ind.title.toLowerCase()}</h2>
          <Link href="/services" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline">
            All services <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map((d) => (
            <li key={d.slug}>
              <Link href={`/services/${d.slug}`} className="group flex min-h-11 items-center gap-3 rounded-md border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 text-[0.9375rem] font-semibold transition-colors hover:border-forest-700 hover:text-forest-700">
                <ServiceIcon name={d.icon} className="size-5 shrink-0 text-forest-500" />
                <span className="flex-1">{d.title}</span>
                <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 shrink-0 opacity-50 transition group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {related.length > 0 && (
        <section className="section container-site pt-0">
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
