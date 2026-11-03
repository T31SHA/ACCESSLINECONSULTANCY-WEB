"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { track, trackingMeta } from "@/lib/analytics";
import { shortLeadSchema } from "@/lib/lead-schema";
import { describedBy, Field, Honeypot, Input, Textarea } from "./fields";
import { Turnstile } from "./turnstile";

type In = z.input<typeof shortLeadSchema>;
type Out = z.output<typeof shortLeadSchema>;

/** Home-page quick enquiry — posts to the same /api/leads endpoint. */
export function ShortLeadForm() {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [token, setToken] = useState<string>();
  const [serverError, setServerError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<In, unknown, Out>({
    resolver: zodResolver(shortLeadSchema),
    mode: "onTouched",
  });

  return (
    <form
      noValidate
      onFocus={() => setActive(true)}
      onSubmit={handleSubmit(async (data) => {
        setServerError(undefined);
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ variant: "short", data, meta: trackingMeta(), turnstileToken: token, website: (document.getElementById("short-website") as HTMLInputElement)?.value || undefined }),
        }).catch(() => null);
        if (!res?.ok) {
          setServerError((await res?.json().catch(() => null))?.error ?? "Something went wrong. Please try again.");
          return;
        }
        track("Lead Submitted", { variant: "short" });
        router.push("/thank-you");
      })}
      className="grid gap-5 sm:grid-cols-2"
    >
      <Field id="short-fullName" label="Name" required error={errors.fullName?.message}>
        <Input id="short-fullName" autoComplete="name" aria-invalid={!!errors.fullName} aria-describedby={describedBy("short-fullName", errors.fullName?.message)} {...register("fullName")} />
      </Field>
      <Field id="short-email" label="Work email" required error={errors.email?.message}>
        <Input id="short-email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy("short-email", errors.email?.message)} {...register("email")} />
      </Field>
      <Field id="short-organisation" label="Organisation" required error={errors.organisation?.message} className="sm:col-span-2">
        <Input id="short-organisation" autoComplete="organization" aria-invalid={!!errors.organisation} aria-describedby={describedBy("short-organisation", errors.organisation?.message)} {...register("organisation")} />
      </Field>
      <Field id="short-message" label="What do you want to change?" required error={errors.message?.message} className="sm:col-span-2">
        <Textarea id="short-message" rows={4} aria-invalid={!!errors.message} aria-describedby={describedBy("short-message", errors.message?.message)} {...register("message")} />
      </Field>
      <div className="sm:col-span-2">
        <label className="flex min-h-11 items-start gap-3 text-sm">
          <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-forest-700" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "short-consent-error" : undefined} {...register("consent")} />
          <span>I agree to the <a href="/privacy" className="underline">privacy policy</a>.</span>
        </label>
        {errors.consent && <p id="short-consent-error" className="mt-1 text-sm font-medium text-[#B42318]">{errors.consent.message}</p>}
      </div>
      <Honeypot id="short-website" />
      <Turnstile active={active} onToken={setToken} />
      <p aria-live="assertive" className="text-sm font-medium text-[#B42318] sm:col-span-2 empty:hidden">{serverError}</p>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting} withArrow>{isSubmitting ? "Sending…" : "Send"}</Button>
      </div>
    </form>
  );
}
