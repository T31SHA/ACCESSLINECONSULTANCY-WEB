import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/content/types";
import { ServiceIcon } from "@/components/ui/icons";

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      data-reveal
      className="group relative flex min-h-[280px] flex-col justify-between border-t border-[var(--line)] bg-[var(--surface)] p-6 transition-colors duration-300 hover:bg-forest-700 hover:text-sand-50 md:p-8"
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-sm font-bold text-[var(--fg-muted)] group-hover:text-mint-200">{String(index + 1).padStart(2, "0")}</span>
        <ServiceIcon name={service.icon} className="size-7 text-forest-500 group-hover:text-mint-200" />
      </div>
      <div>
        <h3 className="text-[clamp(1.25rem,1rem+0.5vw,1.5rem)] leading-[1.1] [overflow-wrap:break-word]">{service.title}</h3>
        <p className="mt-3 text-[var(--fg-muted)] group-hover:text-mint-200">{service.short}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
          Explore <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
