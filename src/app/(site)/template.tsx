"use client";

import { useEffect } from "react";

let firstPaint = true;

/**
 * Re-mounts per navigation → page-in transition for client-side navigations only.
 * The first (server-rendered) page is never faded in, so FCP/LCP aren't delayed.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = !firstPaint;
  useEffect(() => {
    firstPaint = false;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
