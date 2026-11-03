import Image from "next/image";
import type { ClientLogo } from "@/content/types";

/** CSS-only marquee (pauses on hover / reduced motion). */
export function LogoMarquee({ logos, label = "Trusted by organisations across Africa" }: { logos: ClientLogo[]; label?: string }) {
  if (!logos.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={hidden || undefined}>
      {logos.map((l) => (
        <li key={l.name} className="flex h-12 items-center text-[var(--fg-muted)] opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0">
          {l.src ? (
            <Image src={l.src} alt={hidden ? "" : l.name} width={140} height={48} className="h-10 w-auto object-contain" />
          ) : (
            <span className="whitespace-nowrap font-display text-2xl font-bold tracking-tight">{l.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label} className="border-y border-[var(--line)] py-10">
      <p className="eyebrow container-site mb-8 text-center text-[var(--fg-muted)]">{label}</p>
      <div className="group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
