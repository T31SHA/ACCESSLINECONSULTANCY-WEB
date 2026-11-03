"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
let scriptPromise: Promise<void> | null = null;
const loadScript = () =>
  (scriptPromise ??= new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  }));

/**
 * Lazily-loaded Cloudflare Turnstile (managed / mostly invisible).
 * Only loads once `active` is true (first interaction) so it never blocks render.
 */
export function Turnstile({ active, onToken }: { active: boolean; onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);
  useEffect(() => {
    if (!SITE_KEY || !active || rendered.current) return;
    rendered.current = true;
    loadScript().then(() => {
      if (ref.current && window.turnstile) {
        window.turnstile.render(ref.current, { sitekey: SITE_KEY, callback: onToken, appearance: "interaction-only" });
      }
    });
  }, [active, onToken]);
  if (!SITE_KEY) return null;
  return <div ref={ref} className="min-h-0" />;
}
