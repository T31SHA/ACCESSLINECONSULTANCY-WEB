import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Accordion } from "@/components/blocks/accordion";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCaseStudies, getIndustries, getService, getServices } from "@/lib/content";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { serviceImages } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// CMS can add slugs after deploy: render unknown params on demand (notFound() guards bad slugs).
export const dynamicParams = true;
export const generateStaticParams = async () => (await getServices()).map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getService((await params).slug);
  if (!s) return {};
  return pageMetadata({ ...s.seo, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const s = await getService((await params).slug);
  if (!s) notFound();
  const [caseStudies, industries] = await Promise.all([getCaseStudies(), getIndustries()]);
  const related = caseStudies.filter((c) => c.services.includes(s.slug)).slice(0, 3);

  return (
    <>
      <JsonLd data={serviceSchema(s)} />
      {s.faqs.length > 0 && <JsonLd data={faqSchema(s.faqs)} />}
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }, { name: s.title, path: `/services/${s.slug}` }]}
        overline="Service"
        title={s.title}
        lede={s.short}
        image={serviceImages[s.slug]}
      >
        <div className="mt-10"><ButtonLink href={`/contact?service=${s.slug}`} size="lg" withArrow>Discuss your brief</ButtonLink></div>
      </PageHero>

      {/* Problem → Outcome */}
      <section aria-label="Problem and outcome" className="container-site grid gap-4 md:grid-cols-2 md:gap-6">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-8 md:p-12" data-reveal>
          <p className="readout flex items-center gap-3 text-[var(--fg-muted)]">
            <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-[var(--fg-muted)]" />The problem
          </p>
          <p className="mt-6 font-display text-h3 font-bold">{s.problem}</p>
        </div>
        <div className="theme-forest relative overflow-hidden rounded-lg bg-[var(--surface)] p-8 text-[var(--fg)] md:p-12" data-reveal>
          <div aria-hidden className="topo pointer-events-none absolute inset-0 text-sand-50 opacity-[0.05]" />
          <p className="readout relative flex items-center gap-3 text-accent-400">
            <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-accent-400" />The outcome
          </p>
          <p className="relative mt-6 font-display text-h3 font-bold">{s.outcome}</p>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <p className="readout mb-5 text-[var(--fg-muted)]">Deliverables · {String(s.deliverables.length).padStart(2, "0")}</p>
          <h2 className="text-h2">What you get</h2>
        </div>
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7">
          {s.deliverables.map((d, i) => (
            <li key={d} data-reveal className="flex items-start gap-4 border-t border-[var(--line)] py-5">
              <span aria-hidden className="readout mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-sm bg-mint-50 text-forest-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{d}</span>
              <Check aria-hidden strokeWidth={1.5} className="mt-1 size-4 shrink-0 text-forest-500" />
            </li>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section className="section bg-mint-50">
        <div className="container-site">
          <SectionHeading overline="Process" title="How it runs" />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {s.process.map((p, i) => (
              <li key={p.title} data-reveal className="flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="readout inline-flex h-8 min-w-11 items-center justify-center rounded-pill bg-forest-900 px-3 text-sand-50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="readout-line text-[var(--fg-muted)]" />
                </div>
                <h3 className="mt-8 text-xl">{p.title}</h3>
                <p className="mt-2 text-[var(--fg-muted)]">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section container-site">
          <SectionHeading overline="Related work" title="Proof, not promises" />
          <div className="grid gap-12 md:grid-cols-3 md:gap-6">
            {related.map((c, i) => <CaseStudyCard key={c.slug} index={i} cs={c} industryTitle={industries.find((i) => i.slug === c.industry)?.title} />)}
          </div>
        </section>
      )}

      {s.faqs.length > 0 && (
        <section className="section container-site grid gap-12 pt-0 lg:grid-cols-12">
          <h2 className="text-h2 lg:col-span-4">Questions</h2>
          <div className="lg:col-span-8"><Accordion items={s.faqs} /></div>
        </section>
      )}

      <CtaBand title={`Let's talk ${s.title.toLowerCase()}.`} />
    </>
  );
}
