import Link from "next/link";
import type { CaseStudy } from "@/content/types";
import { MediaFrame } from "@/components/ui/media-frame";
import { Photo } from "@/components/ui/photo";
import { caseStudyImages } from "@/lib/images";

const SIZES = "(min-width: 1320px) 420px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

export function CaseStudyCard({ cs, industryTitle }: { cs: CaseStudy; industryTitle?: string }) {
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
            <p className="font-display text-2xl font-bold leading-none">{metric.value}</p>
            <p className="mt-1 text-xs">{metric.label}</p>
          </div>
        )}
      </div>
      <p className="eyebrow mt-6 text-[var(--fg-muted)]">{cs.client}{industryTitle ? ` · ${industryTitle}` : ""}</p>
      <h3 className="mt-3 text-[1.5rem] leading-tight">
        <Link href={`/work/${cs.slug}`} className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
          {cs.title}
        </Link>
      </h3>
    </article>
  );
}
