"use client";

import { useEffect, useRef } from "react";

/**
 * Footer particle field: a cheap 2D-canvas dot grid that ripples away from the pointer.
 * - Pauses when offscreen (IntersectionObserver) and when the tab is hidden.
 * - Static (single frame) under prefers-reduced-motion; CSS grid fallback if canvas is unavailable.
 * - Decorative only: aria-hidden, pointer-events none on the canvas.
 */
export function FooterField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const host = canvas.parentElement!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, visible = false;
    const t0 = performance.now();
    let pts: { x: number; y: number }[] = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      w = host.clientWidth; h = host.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 640 ? 26 : 22;
      pts = [];
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) pts.push({ x, y });
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const wave = reduce ? 0 : Math.sin(p.x * 0.012 + t * 0.9) * Math.cos(p.y * 0.015 - t * 0.6);
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const push = d2 < 16000 ? (1 - d2 / 16000) : 0;
        const d = Math.sqrt(d2) || 1;
        const x = p.x + (dx / d) * push * 14;
        const y = p.y + wave * 4 + (dy / d) * push * 14;
        const a = 0.14 + (wave + 1) * 0.1 + push * 0.55;
        ctx.fillStyle = push > 0.25 ? `rgba(239,160,75,${a})` : `rgba(207,224,214,${a})`;
        ctx.fillRect(x, y, 1.6 + push * 1.6, 1.6 + push * 1.6);
      }
    };

    const loop = (now: number) => { draw(now); if (visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const start = () => { cancelAnimationFrame(raf); if (reduce) draw(performance.now()); else raf = requestAnimationFrame(loop); };

    resize();
    draw(performance.now());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else cancelAnimationFrame(raf); });
    io.observe(host);
    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(host);
    const onMove = (e: PointerEvent) => { const r = host.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; if (reduce) draw(performance.now()); };
    const onLeave = () => { mouse.x = mouse.y = -9999; if (reduce) draw(performance.now()); };
    const onVis = () => { if (!document.hidden && visible) start(); };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    host.dataset.field = "on";
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}
