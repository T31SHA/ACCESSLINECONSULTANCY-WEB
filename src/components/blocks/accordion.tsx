"use client";

import * as A from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import type { Faq } from "@/content/types";

export function Accordion({ items }: { items: Faq[] }) {
  return (
    <A.Root type="single" collapsible className="border-t border-[var(--line)]">
      {items.map((f, i) => (
        <A.Item key={f.q} value={`i${i}`} className="border-b border-[var(--line)]">
          <A.Header asChild>
            <h3>
              <A.Trigger className="group flex min-h-11 w-full items-center justify-between gap-6 py-6 text-left font-display text-xl font-bold">
                {f.q}
                <Plus aria-hidden strokeWidth={1.5} className="size-6 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-45" />
              </A.Trigger>
            </h3>
          </A.Header>
          <A.Content className="overflow-hidden pb-6 text-[var(--fg-muted)]">
            <p className="max-w-[68ch]">{f.a}</p>
          </A.Content>
        </A.Item>
      ))}
    </A.Root>
  );
}
