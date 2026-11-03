import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { Overline } from "@/components/ui/section-heading";

/** Statement hero for inner pages: eyebrow + oversized H1 + lede. */
export function PageHero({ crumbs, overline, title, lede, children }: {
  crumbs: Crumb[]; overline?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="topo pointer-events-none absolute -right-40 -top-20 h-[640px] w-[900px] opacity-[0.07]" />
      <div className="container-site relative pb-16 pt-10 md:pb-24 md:pt-16">
        <Breadcrumbs items={crumbs} />
        {overline && <Overline className="mb-6">{overline}</Overline>}
        <h1 className="max-w-[16ch] text-h1">{title}</h1>
        {lede && <p className="mt-8 max-w-[60ch] text-lg text-[var(--fg-muted)] md:text-xl">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
