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
import { getService, services } from "@/content/services";
import { caseStudies } from "@/content/work";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMetadata({ ...s.seo, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
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
      >
        <div className="mt-10"><ButtonLink href={`/contact?service=${s.slug}`} size="lg" withArrow>Discuss your brief</ButtonLink></div>
      </PageHero>

      {/* Problem → Outcome */}
      <section className="container-site grid gap-px overflow-hidden rounded-lg bg-[var(--line)] md:grid-cols-2">
        <div className="bg-[var(--surface-muted)] p-8 md:p-12" data-reveal>
          <p className="eyebrow text-[var(--fg-muted)]">The problem</p>
          <p className="mt-6 font-display text-h3 font-bold">{s.problem}</p>
        </div>
        <div className="bg-forest-700 p-8 text-sand-50 md:p-12" data-reveal>
          <p className="eyebrow text-mint-200">The outcome</p>
          <p className="mt-6 font-display text-h3 font-bold">{s.outcome}</p>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section container-site grid gap-12 lg:grid-cols-12">
        <h2 className="text-h2 lg:col-span-5" data-reveal>What you get</h2>
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7">
          {s.deliverables.map((d) => (
            <li key={d} data-reveal className="flex gap-3 border-t border-[var(--line)] py-5">
              <Check aria-hidden strokeWidth={1.5} className="mt-1 size-5 shrink-0 text-forest-500" />
              {d}
            </li>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section className="section bg-mint-50">
        <div className="container-site">
          <SectionHeading overline="Process" title="How it runs" />
          <ol className="grid gap-6 md:grid-cols-4">
            {s.process.map((p, i) => (
              <li key={p.title} data-reveal className="border-t-2 border-forest-700 pt-6">
                <p className="font-display text-sm font-bold text-forest-500">0{i + 1}</p>
                <h3 className="mt-4 text-xl">{p.title}</h3>
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
            {related.map((c) => <CaseStudyCard key={c.slug} cs={c} />)}
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
