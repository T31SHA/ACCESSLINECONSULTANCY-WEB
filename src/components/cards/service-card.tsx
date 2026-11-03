import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/content/types";
import { ServiceIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import { serviceImages } from "@/lib/images";

/** `mobileThumb={false}` (home): no thumbnail below 768px, so nothing extra loads before the hero LCP. */
export function ServiceCard({ service, index, mobileThumb = true }: { service: Service; index: number; mobileThumb?: boolean }) {
  const photo = serviceImages[service.slug];
  return (
    <Link
      href={`/services/${service.slug}`}
      data-reveal
      className="group relative flex flex-row border-t border-[var(--line)] bg-[var(--surface)] transition-colors duration-300 hover:bg-forest-700 hover:text-sand-50 sm:flex-col"
    >
      {photo && (
        // Mobile: compact row with a thumbnail (keeps the h1 as LCP and the list short); ≥768px: 4:3 card.
        <Photo image={photo} ratio="aspect-square sm:aspect-[4/3]" className={mobileThumb ? "w-28 shrink-0 self-start sm:w-full" : "hidden w-full sm:block"}
          sizes="(min-width: 1320px) 330px, (min-width: 1280px) 25vw, (min-width: 768px) 50vw, 112px"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      )}
      <div className="flex flex-1 flex-col justify-between p-5 sm:min-h-[280px] sm:p-6 md:p-8">
      <div className="flex items-start justify-between">
        <span className="font-display text-sm font-bold text-[var(--fg-muted)] group-hover:text-mint-200">{String(index + 1).padStart(2, "0")}</span>
        <ServiceIcon name={service.icon} className="size-7 text-forest-500 group-hover:text-mint-200" />
      </div>
      <div>
        <h3 className="text-[clamp(1.25rem,1rem+0.5vw,1.5rem)] leading-[1.1] [overflow-wrap:break-word]">{service.title}</h3>
        <p className="mt-3 text-[var(--fg-muted)] group-hover:text-mint-200 max-sm:text-[0.9375rem]">{service.short}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
          Explore <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
      </div>
    </Link>
  );
}
