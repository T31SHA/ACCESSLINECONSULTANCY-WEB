"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";

export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setState("loading");
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: fd.get("email"), website: fd.get("website") || undefined }),
        }).catch(() => null);
        if (res?.ok) { setState("ok"); setMsg("Check your inbox to confirm your subscription."); track("Newsletter Signup"); }
        else { setState("error"); setMsg((await res?.json().catch(() => null))?.error ?? "Something went wrong. Try again."); }
      }}
    >
      <div className="relative flex rounded-pill border border-[var(--line)] focus-within:border-mint-200">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder="you@organisation.com"
          className="min-h-12 w-full rounded-pill bg-transparent pl-5 pr-14 text-[0.9375rem] placeholder:text-[var(--fg-muted)] focus-visible:outline-none" />
        <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <button type="submit" disabled={state === "loading"} aria-label="Subscribe"
          className="absolute right-1 top-1 inline-flex size-10 items-center justify-center rounded-pill bg-accent-400 text-ink-950 hover:bg-[#f5b674]">
          <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-[var(--fg-muted)]">{msg}</p>
    </form>
  );
}
