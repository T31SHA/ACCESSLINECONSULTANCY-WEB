import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { MediaFrame } from "@/components/ui/media-frame";
import { Photo } from "@/components/ui/photo";
import { caseStudyImages } from "@/lib/images";
import { getCaseStudies, getCaseStudy, getIndustries, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// CMS can add slugs after deploy: render unknown params on demand (notFound() guards bad slugs).
export const dynamicParams = true;
export const generateStaticParams = async () => (await getCaseStudies()).map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCaseStudy((await params).slug);
  if (!c) return {};
  return pageMetadata({ title: c.title, description: c.summary.slice(0, 155), path: `/work/${c.slug}`, type: "article" });
}

export default async function CaseStudyPage({ params }: Props) {
  const c = await getCaseStudy((await params).slug);
  if (!c) notFound();
  const [caseStudies, services, industries] = await Promise.all([getCaseStudies(), getServices(), getIndustries()]);
  const industry = industries.find((i) => i.slug === c.industry);
  const idx = caseStudies.findIndex((x) => x.slug === c.slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <>
      <PageHero
        crumbs={[{ name: "Work", path: "/work" }, { name: c.title, path: `/work/${c.slug}` }]}
        overline={`${c.client} · ${c.year}`}
        title={c.title}
        lede={c.summary}
      >
        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
          <div><dt className="text-[var(--fg-muted)]">Industry</dt><dd className="mt-1 font-semibold"><Link href={`/industries/${c.industry}`} className="hover:underline">{industry?.title}</Link></dd></div>
          <div><dt className="text-[var(--fg-muted)]">Services</dt><dd className="mt-1 font-semibold">{c.services.map((s) => services.find((x) => x.slug === s)?.title).filter(Boolean).join(", ")}</dd></div>
        </dl>
      </PageHero>

      <div className="container-site">
        {!c.image && caseStudyImages[c.slug] ? (
          <Photo image={caseStudyImages[c.slug]!} ratio="aspect-[4/3] md:aspect-[16/9]" className="rounded-lg" sizes="(min-width: 1320px) 1280px, 100vw" />
        ) : (
          <MediaFrame src={c.image} alt={c.imageAlt} label={c.image ? undefined : `${c.title}: campaign imagery`} ratio="aspect-[16/9]" sizes="(min-width: 1320px) 1280px, 100vw" />
        )}
      </div>

      <section className="section container-site grid gap-12 lg:grid-cols-12">
        <h2 className="eyebrow text-[var(--fg-muted)] lg:col-span-3">The challenge</h2>
        <p className="font-display text-h3 font-bold lg:col-span-9" data-reveal>{c.challenge}</p>
      </section>

      <section className="container-site grid gap-12 pb-[var(--section-y)] lg:grid-cols-12">
        <h2 className="eyebrow text-[var(--fg-muted)] lg:col-span-3">Our approach</h2>
        <ol className="lg:col-span-9">
          {c.approach.map((a, i) => (
            <li key={a} data-reveal className="flex gap-6 border-t border-[var(--line)] py-6 text-lg">
              <span className="font-display text-sm font-bold text-forest-500">0{i + 1}</span>{a}
            </li>
          ))}
        </ol>
      </section>

      <section className="theme-forest section bg-[var(--surface)] text-[var(--fg)]" aria-labelledby="results">
        <div className="container-site">
          <h2 id="results" className="eyebrow mb-12 text-[var(--fg-muted)]">The results</h2>
          <dl className="grid gap-10 md:grid-cols-3">
            {c.metrics.map((m) => (
              <div key={m.label} data-reveal className="border-t border-[var(--line)] pt-6">
                <dt className="sr-only">{m.label}</dt>
                <dd className="font-display text-display font-bold">{m.value}</dd>
                <dd className="mt-3 text-[var(--fg-muted)]">{m.label}</dd>
              </div>
            ))}
          </dl>
          {c.quote && (
            <figure className="mt-24 max-w-4xl">
              <blockquote className="font-display text-h2 font-bold">&ldquo;{c.quote.text}&rdquo;</blockquote>
              <figcaption className="mt-6 text-[var(--fg-muted)]">{c.quote.author}, {c.quote.role}</figcaption>
            </figure>
          )}
        </div>
      </section>

      {next && next.slug !== c.slug && (
        <Link href={`/work/${next.slug}`} className="group block border-b border-[var(--line)]">
          <div className="container-site flex items-center justify-between gap-8 py-16">
            <div>
              <p className="eyebrow text-[var(--fg-muted)]">Next case study</p>
              <p className="mt-4 font-display text-h2 font-bold group-hover:underline group-hover:underline-offset-8">{next.title}</p>
            </div>
            <ArrowRight aria-hidden strokeWidth={1.5} className="size-12 shrink-0 transition-transform group-hover:translate-x-2" />
          </div>
        </Link>
      )}
      <CtaBand />
    </>
  );
}
