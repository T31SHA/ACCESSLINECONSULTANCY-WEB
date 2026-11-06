import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@/content/types";
import { Photo } from "@/components/ui/photo";
import { industryImages } from "@/lib/images";

/**
 * Photo card for the /industries grid. Mobile: compact row with a thumbnail (keeps the h1 as the
 * LCP element instead of a lazy image). ≥768px: 4:3 card, 2-up; ≥1024px: 3-up.
 */
export function IndustryCard({ industry, index }: { industry: Industry; index?: number }) {
  const photo = industryImages[industry.slug];
  return (
    <li data-reveal className="group relative flex gap-5 sm:block">
      <div className="relative w-24 shrink-0 sm:w-full">
        {photo ? (
          <Photo image={photo} ratio="aspect-square sm:aspect-[4/3]" className="rounded-md sm:rounded-lg"
            sizes="(min-width: 1320px) 420px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 96px"
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        ) : (
          <div aria-hidden className="aspect-square rounded-md bg-mint-50 sm:aspect-[4/3] sm:rounded-lg" />
        )}
        {index !== undefined && (
          <span aria-hidden className="readout absolute left-3 top-3 hidden rounded-pill bg-sand-50/95 px-2.5 py-1 text-ink-950 backdrop-blur-md sm:inline-block">
            SECTOR_{String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="min-w-0 transition-[padding] duration-300 sm:group-hover:pl-3">
        <h2 className="text-[clamp(1.25rem,1.1rem+0.6vw,1.75rem)] leading-tight sm:mt-6">
          <Link href={`/industries/${industry.slug}`} className="inline-flex min-h-11 items-center gap-2 transition-colors after:absolute after:inset-0 group-hover:text-forest-700 group-hover:underline group-hover:underline-offset-4">
            {industry.title}
            <ArrowRight aria-hidden strokeWidth={1.5} className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </h2>
        <p className="mt-1 text-[var(--fg-muted)] max-sm:text-[0.9375rem] sm:mt-2">{industry.short}</p>
      </div>
    </li>
  );
}
