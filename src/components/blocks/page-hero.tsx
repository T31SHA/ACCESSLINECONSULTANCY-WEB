import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { Overline } from "@/components/ui/section-heading";
import { Photo } from "@/components/ui/photo";
import type { SiteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Statement hero for inner pages: eyebrow + oversized H1 + lede, with an optional photo in a
 * right-hand column from md (1024px). Below 1024px the photo is not rendered (display:none →
 * the lazy image is never fetched): on mobile it would land in the first viewport, become a
 * lazy-loaded LCP and cost ~1 s. Only the home hero image is prioritised.
 */
export function PageHero({ crumbs, overline, title, lede, children, image, imageRatio = "aspect-[4/3]" }: {
  crumbs: Crumb[]; overline?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode;
  image?: SiteImage; imageRatio?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="topo pointer-events-none absolute -right-40 -top-20 h-[640px] w-[900px] opacity-[0.07]" />
      <div className={cn("container-site relative pb-16 pt-10 md:pb-24 md:pt-16", image && "grid gap-10 md:grid-cols-12 md:items-end md:gap-12")}>
        <div className={cn(image && "md:col-span-7")}>
          <Breadcrumbs items={crumbs} />
          {overline && <Overline className="mb-6">{overline}</Overline>}
          <h1 className="max-w-[16ch] text-h1">{title}</h1>
          {lede && <p className="mt-8 max-w-[60ch] text-lg text-[var(--fg-muted)] md:text-xl">{lede}</p>}
          {children}
        </div>
        {image && (
          <Photo image={image} ratio={imageRatio} className="hidden rounded-lg md:col-span-5 md:block"
            sizes="(min-width: 1320px) 520px, (min-width: 1024px) 40vw, 100vw" />
        )}
      </div>
    </section>
  );
}
