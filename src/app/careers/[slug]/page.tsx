import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/page-hero";
import { ApplyForm } from "@/components/forms/apply-form";
import { JsonLd } from "@/components/ui/json-ld";
import { getJob, jobs } from "@/content/people";
import { jobSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => jobs.map((j) => ({ slug: j.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const j = getJob((await params).slug);
  if (!j) return {};
  return pageMetadata({ title: `${j.title} — Careers`, description: j.summary.slice(0, 155), path: `/careers/${j.slug}` });
}

export default async function JobPage({ params }: Props) {
  const j = getJob((await params).slug);
  if (!j) notFound();
  return (
    <>
      <JsonLd data={jobSchema(j)} />
      <PageHero
        crumbs={[{ name: "Careers", path: "/careers" }, { name: j.title, path: `/careers/${j.slug}` }]}
        overline={`${j.department} · ${j.location} · ${j.type}`}
        title={j.title}
        lede={j.summary}
      />
      <div className="container-site grid gap-16 pb-[var(--section-y)] lg:grid-cols-12">
        <div className="prose-site lg:col-span-6">
          <h2>What you&apos;ll do</h2>
          <ul>{j.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
          <h2>What you&apos;ll bring</h2>
          <ul>{j.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
        <section aria-labelledby="apply" className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-6 md:p-10 lg:col-span-6">
          <h2 id="apply" className="mb-8 text-h3">Apply</h2>
          <ApplyForm jobSlug={j.slug} jobTitle={j.title} />
        </section>
      </div>
    </>
  );
}
