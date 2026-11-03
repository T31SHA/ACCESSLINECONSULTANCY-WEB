import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@/content/types";
import { Photo } from "@/components/ui/photo";
import { industryImages } from "@/lib/images";

/**
 * Photo card for the /industries grid. Mobile: compact row with a thumbnail (keeps the h1 as the
 * LCP element instead of a lazy image). ≥768px: 4:3 card, 2-up; ≥1024px: 3-up.
 */
export function IndustryCard({ industry }: { industry: Industry }) {
  const photo = industryImages[industry.slug];
  return (
    <li data-reveal className="group relative flex gap-5 sm:block">
      {photo ? (
        <Photo image={photo} ratio="aspect-square sm:aspect-[4/3]" className="w-24 shrink-0 rounded-md sm:w-full sm:rounded-lg"
          sizes="(min-width: 1320px) 420px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 96px"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      ) : (
        <div aria-hidden className="aspect-square w-24 shrink-0 rounded-md bg-mint-50 sm:aspect-[4/3] sm:w-full sm:rounded-lg" />
      )}
      <div className="min-w-0">
        <h2 className="text-[clamp(1.25rem,1.1rem+0.6vw,1.75rem)] leading-tight sm:mt-6">
          <Link href={`/industries/${industry.slug}`} className="inline-flex min-h-11 items-center gap-2 after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4">
            {industry.title}
            <ArrowRight aria-hidden strokeWidth={1.5} className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </h2>
        <p className="mt-1 text-[var(--fg-muted)] max-sm:text-[0.9375rem] sm:mt-2">{industry.short}</p>
      </div>
    </li>
  );
}
