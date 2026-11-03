"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_<>#";

/**
 * Text-scramble reveal (igloo-style). Server-renders the real text (SEO, no-JS, LCP);
 * after hydration the visible copy resolves left→right from random glyphs.
 * Screen readers always get the plain text. Skipped under prefers-reduced-motion.
 */
export function ScrambleText({ text, duration = 900, delay = 0, className }: { text: string; duration?: number; delay?: number; className?: string }) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t + delay;
      const p = Math.max(0, Math.min(1, (t - start) / duration));
      const fixed = Math.floor(p * text.length);
      let s = text.slice(0, fixed);
      for (let i = fixed; i < text.length; i++) {
        const c = text[i];
        s += c === " " || p === 0 ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text, duration, delay]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
