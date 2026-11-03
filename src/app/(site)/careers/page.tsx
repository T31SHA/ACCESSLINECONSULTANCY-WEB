import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/blocks/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { culture, departments } from "@/content/people";
import { getJobs } from "@/lib/content";
import { site } from "@/content/site";
import { Photo } from "@/components/ui/photo";
import { images } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Careers — PR & Comms Jobs in Nairobi",
  description: "Join a senior-led communications agency in Nairobi. Open roles in PR, strategy, SBCC, creative and events.",
  path: "/careers",
});

export default async function CareersPage() {
  const jobs = await getJobs();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Careers", path: "/careers" }]}
        overline="Careers"
        title="Do the best work of your career. In Nairobi."
        lede="Real clients, real responsibility, real growth. We hire curious people who care about Africa's story."
        image={images["careers-hero-westlands"]}
        imageRatio="aspect-[3/2]"
      />
      <section className="container-site pb-[var(--section-y)]">
        <SectionHeading overline="Why join" title="What you can expect" />
        <div className="grid gap-12 md:grid-cols-12 md:items-start">
        <Photo image={images["careers-team-collaboration"]} ratio="aspect-[4/3]" className="rounded-lg md:col-span-5"
          sizes="(min-width: 1320px) 520px, (min-width: 1024px) 40vw, 100vw" />
        <ul className="grid gap-8 sm:grid-cols-2 md:col-span-7">
          {culture.map((c) => (
            <li key={c.title} data-reveal className="border-t-2 border-ink-950 pt-6">
              <h3 className="text-xl">{c.title}</h3>
              <p className="mt-2 text-[var(--fg-muted)]">{c.body}</p>
            </li>
          ))}
        </ul>
        </div>
      </section>
      <section className="section bg-mint-50">
        <div className="container-site">
          <SectionHeading overline="Departments" title="Six teams, one firm" />
          <ul className="grid gap-px overflow-hidden rounded-lg bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((d) => (
              <li key={d.name} className="bg-mint-50 p-8">
                <h3 className="text-xl">{d.name}</h3>
                <p className="mt-2 text-[var(--fg-muted)]">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section container-site" id="roles">
        <SectionHeading overline="Open roles" title={jobs.length ? `${jobs.length} open ${jobs.length === 1 ? "role" : "roles"}` : "No open roles right now"} />
        {jobs.length ? (
          <ul className="border-t border-[var(--line)]">
            {jobs.map((j) => (
              <li key={j.slug}>
                <Link href={`/careers/${j.slug}`} className="group grid gap-2 border-b border-[var(--line)] py-8 md:grid-cols-12 md:items-center">
                  <span className="font-display text-h3 font-bold group-hover:underline group-hover:underline-offset-4 md:col-span-6">{j.title}</span>
                  <span className="text-[var(--fg-muted)] md:col-span-2">{j.department}</span>
                  <span className="text-[var(--fg-muted)] md:col-span-3">{j.location} · {j.type}</span>
                  <ArrowRight aria-hidden strokeWidth={1.5} className="hidden size-6 justify-self-end transition-transform group-hover:translate-x-1 md:col-span-1 md:block" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--fg-muted)]">Send a speculative CV to <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
        )}
      </section>
    </>
  );
}
