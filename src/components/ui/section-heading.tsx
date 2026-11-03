import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Overline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3 text-[var(--fg-muted)]", className)}>
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

export function SectionHeading({
  overline, title, intro, className, as: Tag = "h2", action,
}: { overline?: string; title: ReactNode; intro?: ReactNode; className?: string; as?: "h1" | "h2"; action?: ReactNode }) {
  return (
    <div className={cn("mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-8" data-reveal>
        {overline && <Overline className="mb-5">{overline}</Overline>}
        <Tag className={Tag === "h1" ? "text-h1" : "text-h2"}>{title}</Tag>
        {intro && <p className="mt-6 max-w-[58ch] text-[var(--fg-muted)]">{intro}</p>}
      </div>
      {action && <div className="md:col-span-4 md:justify-self-end" data-reveal>{action}</div>}
    </div>
  );
}
