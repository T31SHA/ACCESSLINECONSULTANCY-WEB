/** Full-bleed, high-contrast marquee of sector names — a bold band between hero and body. CSS-only (pauses on hover / reduced motion). */
export function SectorTicker({ items }: { items: { title: string }[] }) {
  if (!items.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={`${it.title}-${i}`} className="flex items-center gap-8 whitespace-nowrap px-8 font-display text-2xl font-bold uppercase tracking-tight sm:text-4xl">
          {it.title}
          <span aria-hidden className="size-2 rounded-full bg-forest-900/50" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="group relative overflow-hidden border-y border-[var(--line)] bg-accent-400 py-6 text-forest-900 sm:py-8">
      <div className="flex animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
