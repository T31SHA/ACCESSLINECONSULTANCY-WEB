import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { Overline } from "@/components/ui/section-heading";
import { Photo, PhotoScrim } from "@/components/ui/photo";
import type { SiteImage } from "@/lib/images";

/**
 * Statement hero for inner pages: always the dark forest theme, full-bleed photo background
 * when one is supplied (deep scrim keeps text ≥ 8.9:1), oversized H1 + lede on top — the same
 * bold, dark treatment as the home hero and CTA band, applied consistently across the site.
 */
export function PageHero({ crumbs, overline, title, lede, children, image }: {
  crumbs: Crumb[]; overline?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode;
  image?: SiteImage;
}) {
  return (
    <section className="theme-forest on-photo grain relative isolate overflow-hidden bg-[var(--surface)] text-[var(--fg)]">
      <div aria-hidden className="topo pointer-events-none absolute -right-40 -top-20 -z-10 h-[640px] w-[900px] text-sand-50 opacity-[0.05]" />
      {image && (
        <>
          <Photo image={image} ratio="" sizes="100vw" quality={50} className="absolute inset-0 -z-10" />
          <PhotoScrim className="-z-10" />
        </>
      )}
      <div className="container-site relative pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="max-w-[72ch]">
          <Breadcrumbs items={crumbs} />
          {overline && <Overline className="mb-6">{overline}</Overline>}
          <h1 className="max-w-[18ch] text-h1 text-sand-50">{title}</h1>
          {lede && <p className="mt-8 max-w-[60ch] text-lg text-mint-200 md:text-xl">{lede}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
