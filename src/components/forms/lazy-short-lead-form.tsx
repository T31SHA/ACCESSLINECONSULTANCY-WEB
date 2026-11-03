"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ShortLeadForm = dynamic(() => import("./short-lead-form").then((m) => m.ShortLeadForm), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

function FormSkeleton() {
  return (
    <div aria-hidden className="grid animate-pulse gap-5 sm:grid-cols-2">
      {[0, 1].map((i) => <div key={i} className="h-[76px] rounded-md bg-[var(--line)]" />)}
      <div className="h-[76px] rounded-md bg-[var(--line)] sm:col-span-2" />
      <div className="h-[150px] rounded-md bg-[var(--line)] sm:col-span-2" />
      <div className="h-11 w-48 rounded-md bg-[var(--line)]" />
    </div>
  );
}

/** Keeps RHF + Zod out of the home-page critical bundle: loads when the form nears the viewport. */
export function LazyShortLeadForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setShow(true); io.disconnect(); } }, { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="min-h-[480px]">{show ? <ShortLeadForm /> : <FormSkeleton />}</div>;
}
