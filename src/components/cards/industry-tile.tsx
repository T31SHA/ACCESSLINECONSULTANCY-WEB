import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@/content/types";

/** Row in the home "Fluent in your sector" index. `index` adds a mono sector number. */
export function IndustryTile({ industry, index }: { industry: Industry; index?: number }) {
  return (
    <li data-reveal>
      <Link
        href={`/industries/${industry.slug}`}
        className="group grid min-h-11 grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 border-b border-[var(--line)] py-6 transition-[padding,color] duration-300 hover:pl-3 hover:text-forest-700 focus-visible:pl-3 md:grid-cols-[auto_minmax(0,1.1fr)_minmax(0,1fr)_auto] md:gap-x-6"
      >
        <span className="readout w-8 text-[var(--fg-muted)] group-hover:text-forest-700">{index !== undefined ? String(index + 1).padStart(2, "0") : "·"}</span>
        <span className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.5rem)] font-bold leading-tight">{industry.title}</span>
        <span className="hidden text-sm text-[var(--fg-muted)] md:block">{industry.short}</span>
        <ArrowRight aria-hidden strokeWidth={1.5} className="size-6 shrink-0 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
      </Link>
    </li>
  );
}
