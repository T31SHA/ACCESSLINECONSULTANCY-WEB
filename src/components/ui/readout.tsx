import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Instrument-readout label: `CODE ──── meta`. Mono, uppercase, thin connector line. */
export function Readout({ code, meta, className }: { code: ReactNode; meta?: ReactNode; className?: string }) {
  return (
    <p className={cn("readout flex items-center gap-3 text-[var(--fg-muted)]", className)}>
      <span className="text-[var(--fg)]">{code}</span>
      <span aria-hidden className="readout-line" />
      {meta && <span className="shrink-0">{meta}</span>}
    </p>
  );
}

export const code = (prefix: string, i: number) => `${prefix}_${String(i + 1).padStart(2, "0")}`;
