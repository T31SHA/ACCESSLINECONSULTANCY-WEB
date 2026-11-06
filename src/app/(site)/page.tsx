import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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
import { Readout } from "@/components/ui/readout";
import { Overline, SectionHeading } from "@/components/ui/section-heading";
import { approach, site } from "@/content/site";
import { getCaseStudies, getClientLogos, getIndustries, getPosts, getServices, getSiteSettings, getTestimonials } from "@/lib/content";
import { images } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "PR & Brand Strategy Agency in Nairobi",
  description: "Nairobi PR agency for media relations, strategic communications and brand strategy across Africa. Lead the change.",
  path: "/",
});

const heroLines = ["Lead the change.", "We build brands", "Africa trusts."];

const pillars = [
  { title: "Nairobi HQ · Pan-African Reach", body: "Headquartered in Nairobi, working with partners and audiences across the continent." },
  { title: "Boardroom & Field Fluency", body: "At home in executive briefings and in community-level campaigns." },
  { title: "Principal-Led Execution", body: "Senior people lead your account from first brief to final report." },
] as const;

export default async function HomePage() {
  const [services, industries, caseStudies, posts, testimonials, clientLogos, { stats }] = await Promise.all([
    getServices(), getIndustries(), getCaseStudies(), getPosts(), getTestimonials(), getClientLogos(), getSiteSettings(),
  ]);
  const industryTitle = (slug: string) => industries.find((i) => i.slug === slug)?.title;
  return (
    <>
      {/* ─── Hero: editorial 12-col split on deep forest ─── */}
      <section className="theme-forest hero-grid relative isolate overflow-hidden bg-[var(--surface)] text-[var(--fg)]" aria-labelledby="hero-title">
        <div aria-hidden className="topo pointer-events-none absolute inset-0 -z-10 text-sand-50 opacity-[0.04]" />
        <div className="container-site relative flex flex-col gap-12 pb-10 pt-10 md:gap-16 md:pt-16">
          {/* Telemetry bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            {/* Single line at every width (a re-wrap on font swap would shift the hero). */}
            <Readout
              code="ACL · NAIROBI"
              meta={<><span className="sm:hidden">Ecobank Towers</span><span className="hidden sm:inline">{site.address.street}</span></>}
              className="flex-1 whitespace-nowrap sm:max-w-2xl"
            />
            <p className="readout inline-flex items-center gap-2 self-start rounded-pill border border-[var(--line)] px-3 py-1.5 text-[var(--fg-muted)] sm:ml-auto sm:self-auto">
              <span aria-hidden className="size-1.5 rounded-pill bg-accent-400" />
              {services.length} disciplines · {industries.length} sectors
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-8">
              <Overline className="mb-8">{site.positioning}</Overline>
              {/* One line per phrase at every width (widest line ≈ 9.1em in Syne), so the font swap can't
                  change the line count and shift the content below (CLS). */}
              <h1 id="hero-title" className="text-h1 whitespace-nowrap [font-size:min(var(--text-h1),calc((100vw-48px)/9.4))]">
                {heroLines.map((line, i) => (
                  <span key={line} className="split-line" style={{ ["--line-i" as string]: i }}>
                    <span className={i === 0 ? "text-accent-400" : "text-sand-50"}>{line}</span>
                  </span>
                ))}
              </h1>
              <p className="mt-8 max-w-[52ch] text-lg text-mint-200 md:text-xl">
                Strategic communications, PR and behaviour change for corporates, NGOs and governments, built in Nairobi for audiences across the continent.
              </p>
              {/* Stacked full-width on mobile so the row count never depends on which font has loaded. */}
              <div className="mt-10 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
                <Magnetic><ButtonLink href="/contact" size="lg" withArrow className="w-full sm:w-auto">Start a project</ButtonLink></Magnetic>
                <ButtonLink href={caseStudies.length ? "/work" : "/services"} variant="outline" size="lg" prefetch={false} className="w-full sm:w-auto">
                  {caseStudies.length ? "See our work" : "Explore services"}
                </ButtonLink>
              </div>
            </div>

            {/* Editorial dispatch card */}
            <aside aria-label="From our Nairobi office" className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-hover lg:col-span-4">
              <div className="relative">
                <Photo image={images["hero-nairobi-skyline"]} hero ratio="aspect-[16/10]" className="rounded-md"
                  sizes="(min-width: 1320px) 400px, (min-width: 1024px) 30vw, calc(100vw - 72px)" />
                <p className="readout absolute bottom-3 left-3 rounded-sm bg-forest-900/90 px-2.5 py-1.5 text-sand-50">Nairobi CBD · 1.29°S 36.82°E</p>
              </div>
              <div className="px-2 pb-1 pt-5">
                <Readout code="DISPATCH_01" meta="Ecobank Towers" />
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
                  Counsel for boardrooms, ministries and NGOs, delivered by senior people from our Nairobi headquarters.
                </p>
                <Link href="/about" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent-400 underline-offset-4 hover:underline">
                  Inside Accessline <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
                </Link>
              </div>
            </aside>
          </div>

          {/* Credibility pillars (independent of sample content) */}
          <ul className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
            {pillars.map((p, i) => (
              <li key={p.title} className="bg-[var(--surface)] p-5 md:p-6">
                <p className="readout text-accent-400">{`0${i + 1}`}</p>
                <p className="mt-3 font-display text-lg font-bold leading-tight">{p.title}</p>
                <p className="mt-1.5 text-[0.9375rem] text-[var(--fg-muted)]">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Separate Suspense boundary: React hydrates everything below the hero as its own unit,
          splitting one long hydration task (TBT) without changing the server HTML. */}
      <Suspense>
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
      <section className={cn("section container-site", stats.length > 0 && "pt-0")} aria-labelledby="services-title">
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
              {caseStudies.slice(0, 3).map((cs, i) => <CaseStudyCard key={cs.slug} index={i} cs={cs} industryTitle={industryTitle(cs.industry)} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── Approach ─── */}
      {/* Dark band when there are no case studies, so light and dark sections still alternate. */}
      <section className={cn("section", !caseStudies.length && "theme-dark bg-[var(--surface)] text-[var(--fg)]")} aria-labelledby="approach-title">
        <div className="container-site">
          <SectionHeading overline="How we work" title={<span id="approach-title">Four steps from noise to narrative.</span>} />
          <ol className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 lg:grid-cols-4">
            {approach.map((a) => (
              <li key={a.n} data-reveal className="flex flex-col bg-[var(--surface-raised)] p-8">
                <Readout code={`STEP_${a.n}`} className={caseStudies.length ? "[&>span:first-child]:text-forest-500" : "[&>span:first-child]:text-accent-400"} />
                <h3 className="mt-10 text-h3">{a.title}</h3>
                <p className="mt-3 text-[var(--fg-muted)]">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
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
            {industries.map((ind, i) => <IndustryTile key={ind.slug} industry={ind} index={i} />)}
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
              <li><Link href="/contact" prefetch={false} className="inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"><ArrowDownRight aria-hidden className="size-4" /> Detailed brief form</Link></li>
            </ul>
          </div>
          <div className="rounded-lg bg-sand-50 p-6 text-ink-950 [--fg:var(--color-ink-950)] [--fg-muted:var(--color-slate-600)] [--line:rgb(15_23_20/0.12)] [--surface-raised:#fff] md:p-10 lg:col-span-7">
            <LazyShortLeadForm />
          </div>
        </div>
      </section>
      </Suspense>
    </>
  );
}
