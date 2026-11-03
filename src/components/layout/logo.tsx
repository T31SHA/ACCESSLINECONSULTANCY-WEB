import { cn } from "@/lib/utils";

/** Wordmark: the "access line" — a rising contour stroke under the A. Replace with final brand mark in P1. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-display text-[1.375rem] font-bold tracking-tight", className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="8" fill="currentColor" />
        <path d="M8 23 15.2 8.5a1 1 0 0 1 1.8 0L24 23" fill="none" stroke="var(--surface)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 19.5c4-2.6 8-2.6 12 0s6 1.6 8 .2" fill="none" stroke="#F2A65A" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span>
        accessline<span className="sr-only"> Consultancy</span>
      </span>
    </span>
  );
}
