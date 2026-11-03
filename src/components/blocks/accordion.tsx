import { Plus } from "lucide-react";
import type { Faq } from "@/content/types";

/**
 * FAQ accordion on native <details>/<summary>: zero JS, keyboard/screen-reader accessible,
 * and answers stay in the HTML for search engines (FAQPage schema mirrors them).
 */
export function Accordion({ items }: { items: Faq[] }) {
  return (
    <div className="border-t border-[var(--line)]">
      {items.map((f) => (
        <details key={f.q} name="faq" className="group border-b border-[var(--line)]">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-display text-xl font-bold [&::-webkit-details-marker]:hidden">
            <h3 className="text-xl">{f.q}</h3>
            <Plus aria-hidden strokeWidth={1.5} className="size-6 shrink-0 transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <div className="pb-6 text-[var(--fg-muted)]">
            <p className="max-w-[68ch]">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
