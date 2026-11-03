import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@/content/types";

export function IndustryTile({ industry }: { industry: Industry }) {
  return (
    <li data-reveal>
      <Link href={`/industries/${industry.slug}`} className="group grid min-h-11 grid-cols-[1fr_auto] items-center gap-6 border-b border-[var(--line)] py-6 transition-[padding] duration-300 hover:pl-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto]">
        <span className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.5rem)] font-bold leading-tight">{industry.title}</span>
        <span className="hidden text-sm text-[var(--fg-muted)] md:block">{industry.short}</span>
        <ArrowRight aria-hidden strokeWidth={1.5} className="size-6 shrink-0 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
      </Link>
    </li>
  );
}
