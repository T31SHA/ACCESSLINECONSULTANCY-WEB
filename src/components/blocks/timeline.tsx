export type Milestone = { year: string; title: string; body: string };

export function Timeline({ items }: { items: Milestone[] }) {
  return (
    <ol className="relative grid gap-0 border-l border-[var(--line)] md:grid-cols-4 md:border-l-0 md:border-t">
      {items.map((m) => (
        <li key={m.year} data-reveal className="relative pb-10 pl-8 md:pl-0 md:pr-8 md:pt-10">
          <span aria-hidden className="absolute -left-[5px] top-1.5 size-[9px] rounded-pill bg-accent-400 md:-top-[5px] md:left-0" />
          <p className="font-display text-h2 font-bold text-forest-700">{m.year}</p>
          <h3 className="mt-3 text-xl">{m.title}</h3>
          <p className="mt-2 text-[var(--fg-muted)]">{m.body}</p>
        </li>
      ))}
    </ol>
  );
}
