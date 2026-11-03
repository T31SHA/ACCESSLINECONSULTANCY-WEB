"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** One global IntersectionObserver for [data-reveal] elements (12px / 400ms / 60ms stagger). */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const all = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    // Anything already on screen stays visible (no hide-then-fade flash, no LCP delay).
    const vh = window.innerHeight;
    const els = all.filter((el) => {
      const r = el.getBoundingClientRect();
      const onScreen = r.top < vh && r.bottom > 0;
      if (onScreen) el.classList.add("is-visible");
      return !onScreen;
    });
    root.classList.add("js");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--reveal-i", String(i++));
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
