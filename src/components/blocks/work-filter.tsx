"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import type { CaseStudy } from "@/content/types";
import { cn } from "@/lib/utils";

type Opt = { slug: string; title: string };

/** URL-synced filter (?service=&industry=) so filtered views are shareable. */
export function WorkFilter({ items, services, industries }: { items: CaseStudy[]; services: Opt[]; industries: Opt[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const service = params.get("service") ?? "";
  const industry = params.get("industry") ?? "";

  const set = (key: string, value: string) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value); else p.delete(key);
    router.replace(`?${p.toString()}`, { scroll: false });
  };

  const filtered = items.filter((c) => (!service || c.services.includes(service)) && (!industry || c.industry === industry));
  const usedServices = services.filter((s) => items.some((c) => c.services.includes(s.slug)));
  const usedIndustries = industries.filter((i) => items.some((c) => c.industry === i.slug));

  const Chips = ({ label, k, opts, value }: { label: string; k: string; opts: Opt[]; value: string }) => (
    <fieldset>
      <legend className="eyebrow mb-3 text-[var(--fg-muted)]">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {[{ slug: "", title: "All" }, ...opts].map((o) => (
          <button key={o.slug || "all"} type="button" aria-pressed={value === o.slug} onClick={() => set(k, o.slug)}
            className={cn("min-h-11 rounded-pill border px-4 text-sm font-medium transition-colors",
              value === o.slug
                ? "border-forest-900 bg-forest-900 font-semibold text-sand-50"
                : "border-[var(--line)] bg-[var(--surface-raised)] hover:border-forest-700 hover:text-forest-700")}>
            {o.title}
          </button>
        ))}
      </div>
    </fieldset>
  );

  return (
    <>
      <div className="mb-14 grid gap-8 rounded-lg border border-[var(--line)] bg-mint-50 p-6 md:grid-cols-2 md:p-8">
        <Chips label="Service" k="service" opts={usedServices} value={service} />
        <Chips label="Industry" k="industry" opts={usedIndustries} value={industry} />
      </div>
      <p aria-live="polite" className="readout mb-8 text-[var(--fg-muted)]">{filtered.length} {filtered.length === 1 ? "case study" : "case studies"} shown</p>
      {filtered.length ? (
        <div className="grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => <CaseStudyCard key={c.slug} index={i} cs={c} industryTitle={industries.find((x) => x.slug === c.industry)?.title} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[var(--line)] px-6 py-16 text-center">
          <p className="text-[var(--fg-muted)]">No case studies match that combination yet.</p>
          <button type="button" onClick={() => router.replace("?", { scroll: false })} className="mt-4 inline-flex min-h-11 items-center rounded-pill px-4 text-sm font-semibold text-forest-700 underline-offset-4 hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
