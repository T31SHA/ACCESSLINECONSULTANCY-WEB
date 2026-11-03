import Link from "next/link";
import type { CaseStudy } from "@/content/types";
import { MediaFrame } from "@/components/ui/media-frame";
import { Photo } from "@/components/ui/photo";
import { caseStudyImages } from "@/lib/images";

const SIZES = "(min-width: 1320px) 420px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

export function CaseStudyCard({ cs, industryTitle, index }: { cs: CaseStudy; industryTitle?: string; index?: number }) {
  const metric = cs.metrics[0];
  const photo = !cs.image ? caseStudyImages[cs.slug] : undefined;
  const zoom = "transition-transform duration-700 ease-out group-hover:scale-[1.03]";
  return (
    <article data-reveal className="group relative">
      <div className="relative overflow-hidden rounded-lg">
        {photo ? (
          <Photo image={photo} ratio="aspect-[4/3]" sizes={SIZES} className="rounded-lg" imgClassName={zoom} />
        ) : (
          <MediaFrame src={cs.image} alt={cs.imageAlt} ratio="aspect-[4/3]" sizes={SIZES} className={zoom} />
        )}
        {metric && (
          <div className="absolute bottom-4 left-4 rounded-md bg-sand-50/95 px-4 py-3 text-ink-950 backdrop-blur">
            <p className="font-mono-ui text-2xl font-medium leading-none">{metric.value}</p>
            <p className="readout mt-1.5 !text-[0.625rem]">{metric.label}</p>
          </div>
        )}
      </div>
      <p className="readout mt-6 flex items-center gap-3 text-[var(--fg-muted)]">
        <span className="text-[var(--fg)]">{`CASE_${String((index ?? 0) + 1).padStart(2, "0")}`}</span>
        <span aria-hidden className="readout-line" />
        <span className="truncate">{cs.client}{industryTitle ? ` · ${industryTitle}` : ""}{cs.year ? ` · ${cs.year}` : ""}</span>
      </p>
      <h3 className="mt-3 text-[1.5rem] leading-tight">
        <Link href={`/work/${cs.slug}`} className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
          {cs.title}
        </Link>
      </h3>
    </article>
  );
}
