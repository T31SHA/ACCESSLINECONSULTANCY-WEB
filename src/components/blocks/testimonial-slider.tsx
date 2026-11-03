"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";
import type { Testimonial } from "@/content/types";

export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const t = items[i]!;
  const go = (d: number) => setI((p) => (p + d + items.length) % items.length);
  return (
    <section aria-roledescription="carousel" aria-label="Client testimonials" className="grid gap-10 md:grid-cols-12">
      <Quote aria-hidden strokeWidth={1.5} className="size-12 text-accent-400 md:col-span-1" />
      <div className="md:col-span-9">
        <div aria-live="polite" aria-atomic="true">
          <figure key={i} className="page-enter" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
            <blockquote className="font-display text-[clamp(1.75rem,1.3rem+1.9vw,3rem)] font-bold leading-[1.15] tracking-tight">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 text-[var(--fg-muted)]">
              <span className="font-semibold text-[var(--fg)]">{t.author}</span> — {t.organisation}
            </figcaption>
          </figure>
        </div>
      </div>
      <div className="flex items-end gap-2 md:col-span-2 md:justify-end">
        <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="inline-flex size-12 items-center justify-center rounded-pill border border-[var(--line)] hover:bg-[var(--fg)] hover:text-[var(--surface)]">
          <ChevronLeft aria-hidden strokeWidth={1.5} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="inline-flex size-12 items-center justify-center rounded-pill border border-[var(--line)] hover:bg-[var(--fg)] hover:text-[var(--surface)]">
          <ChevronRight aria-hidden strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
