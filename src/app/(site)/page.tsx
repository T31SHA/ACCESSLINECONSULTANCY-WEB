import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { LogoMarquee } from "@/components/blocks/logo-marquee";
import { StatCounter } from "@/components/blocks/stat-counter";
import { TestimonialSlider } from "@/components/blocks/testimonial-slider";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { IndustryTile } from "@/components/cards/industry-tile";
import { PostCard } from "@/components/cards/post-card";
import { ServiceCard } from "@/components/cards/service-card";
import { LazyShortLeadForm } from "@/components/forms/lazy-short-lead-form";
import { ButtonLink } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Photo, PhotoScrim } from "@/components/ui/photo";
import { Overline, SectionHeading } from "@/components/ui/section-heading";
import { approach, site } from "@/content/site";
import { getCaseStudies, getClientLogos, getIndustries, getPosts, getServices, getSiteSettings, getTestimonials } from "@/lib/content";
import { images } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "PR & Brand Strategy Agency in Nairobi",
  description: "Nairobi PR agency for media relations, strategic communications and brand strategy across Africa. Lead the change.",
  path: "/",
});

const heroLines = ["Lead the change.", "We build brands", "Africa trusts."];

export default async function HomePage() {
  const [services, industries, caseStudies, posts, testimonials, clientLogos, { stats }] = await Promise.all([
    getServices(), getIndustries(), getCaseStudies(), getPosts(), getTestimonials(), getClientLogos(), getSiteSettings(),
  ]);
  const industryTitle = (slug: string) => industries.find((i) => i.slug === slug)?.title;
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="on-photo relative isolate overflow-hidden bg-forest-900">
        <Photo image={images["hero-nairobi-skyline"]} hero sizes="100vw" ratio="" quality={50} className="absolute inset-0 -z-10" />
        <PhotoScrim className="-z-10" />
        <div className="container-site relative pb-20 pt-12 md:pt-20 lg:pb-28">
          <Overline className="mb-8">{site.positioning}</Overline>
          <h1 className="text-display">
            {heroLines.map((line, i) => (
              <span key={line} className="split-line lg:whitespace-nowrap" style={{ ["--line-i" as string]: i }}>
                <span className={i === 0 ? "text-mint-200" : undefined}>{line}</span>
              </span>
            ))}
          </h1>
          <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col justify-between gap-10 lg:col-span-5">
              <p className="max-w-[46ch] text-lg text-[var(--fg-muted)] md:text-xl">
                Strategic communications, PR and behaviour change for corporates, NGOs and governments — built in Nairobi for audiences across the continent.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Magnetic><ButtonLink href="/contact" size="lg" withArrow>Start a project</ButtonLink></Magnetic>
                <ButtonLink href="/work" variant="outline" size="lg" className="hover:text-forest-900">See our work</ButtonLink>
              </div>
            </div>
            <div className="flex lg:col-span-4 lg:col-start-9 lg:items-end lg:justify-end">
              <div className="max-w-[260px] rounded-md bg-sand-50 p-5 text-ink-950 shadow-hover">
                <p className="font-display text-2xl font-bold leading-none text-forest-700">Nairobi HQ</p>
                <p className="mt-2 text-sm text-slate-600">{site.address.street} — the heart of the city.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LogoMarquee logos={clientLogos} />

      {/* ─── Stats ─── */}
      {stats.length > 0 && (
        <section className="section container-site" aria-labelledby="stats-title">
          <h2 id="stats-title" className="sr-only">Accessline in numbers</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {stats.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </section>
      )}

      {/* ─── Services ─── */}
      <section className="section container-site pt-0" aria-labelledby="services-title">
        <SectionHeading
          overline="What we do"
          title={<span id="services-title">Eight disciplines. One clear narrative.</span>}
          action={<ButtonLink href="/services" variant="arrow">All services</ButtonLink>}
        />
        <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} mobileThumb={false} />)}
        </div>
      </section>

      {/* ─── Work ─── */}
      {caseStudies.length > 0 && (
        <section className="theme-dark section bg-[var(--surface)] text-[var(--fg)]" aria-labelledby="work-title">
          <div className="container-site">
            <SectionHeading
              overline="Selected work"
              title={<span id="work-title">Outcomes, not output.</span>}
              action={<ButtonLink href="/work" variant="arrow">All case studies</ButtonLink>}
            />
            <div className="grid gap-12 md:grid-cols-3 md:gap-6">
              {caseStudies.slice(0, 3).map((cs) => <CaseStudyCard key={cs.slug} cs={cs} industryTitle={industryTitle(cs.industry)} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── Approach ─── */}
      <section className="section container-site" aria-labelledby="approach-title">
        <SectionHeading overline="How we work" title={<span id="approach-title">Four steps from noise to narrative.</span>} />
        <ol className="grid gap-px overflow-hidden rounded-lg bg-[var(--line)] md:grid-cols-4">
          {approach.map((a) => (
            <li key={a.n} data-reveal className="bg-[var(--surface)] p-8">
              <p className="font-display text-sm font-bold text-forest-500">{a.n}</p>
              <h3 className="mt-10 text-h3">{a.title}</h3>
              <p className="mt-3 text-[var(--fg-muted)]">{a.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── Industries ─── */}
      <section className="section bg-mint-50" aria-labelledby="industries-title">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Overline className="mb-5">Industries</Overline>
              <h2 id="industries-title" className="text-h2">Fluent in your sector.</h2>
              <p className="mt-6 text-[var(--fg-muted)]">{industries.length} sectors, each with its own regulators, audiences and unwritten rules. We know them.</p>
            </div>
          </div>
          <ul className="border-t border-[var(--line)] lg:col-span-8">
            {industries.map((ind) => <IndustryTile key={ind.slug} industry={ind} />)}
          </ul>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      {testimonials.length > 0 && (
        <section className="section container-site">
          <TestimonialSlider items={testimonials} />
        </section>
      )}

      {/* ─── Insights ─── */}
      {posts.length > 0 && (
        <section className="section container-site border-t border-[var(--line)]" aria-labelledby="insights-title">
          <SectionHeading
            overline="Insights"
            title={<span id="insights-title">Thinking from the front line.</span>}
            action={<ButtonLink href="/insights" variant="arrow">All insights</ButtonLink>}
          />
          <div className="grid gap-12 md:grid-cols-3 md:gap-6">
            {posts.slice(0, 3).map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}

      {/* ─── CTA + short form ─── */}
      <section className="theme-forest on-photo relative isolate overflow-hidden bg-[var(--surface)]" aria-labelledby="cta-title">
        <Photo image={images["home-cta-nairobi-cbd-night"]} sizes="100vw" ratio="" quality={50} className="absolute inset-0 -z-10" />
        <PhotoScrim className="-z-10" />
        <div className="container-site section relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="cta-title" className="text-display">Let&apos;s talk.</h2>
            <p className="mt-6 max-w-[40ch] text-lg text-[var(--fg-muted)]">A senior reply, not an account-exec relay.</p>
            <ul className="mt-10 space-y-3">
              <li><a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"><ArrowDownRight aria-hidden className="size-4" /> {site.email}</a></li>
              <li><Link href="/contact" className="inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"><ArrowDownRight aria-hidden className="size-4" /> Detailed brief form</Link></li>
            </ul>
          </div>
          <div className="rounded-lg bg-sand-50 p-6 text-ink-950 [--fg:var(--color-ink-950)] [--fg-muted:var(--color-slate-600)] [--line:rgb(11_26_19/0.12)] [--surface-raised:#fff] md:p-10 lg:col-span-7">
            <LazyShortLeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
