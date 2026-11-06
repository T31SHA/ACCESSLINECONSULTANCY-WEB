import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/content/types";
import { MediaFrame } from "@/components/ui/media-frame";
import { Photo } from "@/components/ui/photo";
import { caseStudyImages } from "@/lib/images";

// Card has p-4 + border, so the image is ~34px narrower than the column.
const SIZES = "(min-width: 1320px) 390px, (min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw";

export function CaseStudyCard({ cs, industryTitle, index }: { cs: CaseStudy; industryTitle?: string; index?: number }) {
  const metric = cs.metrics[0];
  const photo = !cs.image ? caseStudyImages[cs.slug] : undefined;
  const zoom = "transition-transform duration-700 ease-out group-hover:scale-[1.03]";
  return (
    <article
      data-reveal
      className="group relative flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-4 transition-[border-color,box-shadow] duration-300 hover:border-accent-400/50 hover:shadow-hover"
    >
      <div className="relative overflow-hidden rounded-md">
        {photo ? (
          <Photo image={photo} ratio="aspect-[4/3]" sizes={SIZES} className="rounded-md" imgClassName={zoom} />
        ) : (
          <MediaFrame src={cs.image} alt={cs.imageAlt} ratio="aspect-[4/3]" sizes={SIZES} className={zoom} />
        )}
        {metric && (
          <div className="absolute bottom-3 left-3 rounded-md bg-sand-50/95 px-4 py-3 text-ink-950 shadow-hover backdrop-blur-md">
            <p className="font-mono-ui text-2xl font-medium leading-none text-forest-700">{metric.value}</p>
            <p className="readout mt-1.5 !text-[0.625rem] text-slate-600">{metric.label}</p>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 pt-5">
        <p className="readout flex items-center gap-3 text-[var(--fg-muted)]">
          <span className="text-[var(--fg)]">{`CASE_${String((index ?? 0) + 1).padStart(2, "0")}`}</span>
          <span aria-hidden className="readout-line" />
          <span className="min-w-0 text-right">{cs.client}{industryTitle ? ` · ${industryTitle}` : ""}{cs.year ? ` · ${cs.year}` : ""}</span>
        </p>
        <h3 className="mt-3 text-[1.5rem] leading-tight">
          <Link href={`/work/${cs.slug}`} className="after:absolute after:inset-0 after:rounded-lg group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
            {cs.title}
          </Link>
        </h3>
        {cs.summary && <p className="mt-3 line-clamp-2 text-[0.9375rem] text-[var(--fg-muted)]">{cs.summary}</p>}
        <div className="mt-auto pt-6">
          <p aria-hidden className="readout flex items-center justify-between border-t border-[var(--line)] pt-4">
            Read case study
            <ArrowUpRight strokeWidth={1.5} className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </p>
        </div>
      </div>
    </article>
  );
}
