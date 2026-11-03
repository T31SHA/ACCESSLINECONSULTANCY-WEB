import Link from "next/link";
import type { CaseStudy } from "@/content/types";
import { MediaFrame } from "@/components/ui/media-frame";

export function CaseStudyCard({ cs, priority, industryTitle }: { cs: CaseStudy; priority?: boolean; industryTitle?: string }) {
  const metric = cs.metrics[0];
  return (
    <article data-reveal className="group relative">
      <div className="relative overflow-hidden rounded-lg">
        <MediaFrame src={cs.image} alt={cs.imageAlt} ratio="aspect-[4/3]" priority={priority} sizes="(min-width: 1024px) 33vw, 100vw"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
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
