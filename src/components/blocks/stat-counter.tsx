"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up once when scrolled into view. Final value is server-rendered for SEO/no-JS. */
export function StatCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1400;
      const tick = (t: number) => {
        const p = Math.min((t - start) / dur, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="border-t border-[var(--line)] pt-6">
      <p className="font-mono-ui text-h1 font-medium tracking-tight tabular-nums">
        <span aria-hidden>{n}{suffix}</span>
        <span className="sr-only">{value}{suffix}</span>
      </p>
      <p className="readout mt-3 max-w-[26ch] text-[var(--fg-muted)]">{label}</p>
    </div>
  );
}
