"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { track, trackingMeta } from "@/lib/analytics";
import { budgetBands, budgetLabels, leadStepFields, timelineLabels, timelines } from "@/lib/lead-options";
import type { leadSchema } from "@/lib/lead-schema";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { describedBy, Field, Honeypot, Input, Select, Textarea } from "./fields";
import { Turnstile } from "./turnstile";

type In = z.input<typeof leadSchema>;
type Out = z.output<typeof leadSchema>;
/** Zod + the resolver load on first validation (blur, Continue or submit), not with the page. */
const resolver: Resolver<In, unknown, Out> = async (...args) => {
  const [{ zodResolver }, { leadSchema: schema }] = await Promise.all([import("@hookform/resolvers/zod"), import("@/lib/lead-schema")]);
  return zodResolver(schema)(...args);
};
const STORAGE_KEY = "alc:lead-draft:v1";
const steps = ["What you need", "About your organisation", "How to reach you"] as const;

const fieldLabels: Record<string, string> = {
  serviceInterest: "Services", organisation: "Organisation", industry: "Sector", budgetBand: "Budget",
  timeline: "Timeline", fullName: "Full name", email: "Email", phone: "Phone", message: "Message", consent: "Privacy consent",
};

type Option = { slug: string; title: string };

export function LeadForm({ services, industries }: { services: Option[]; industries: Option[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const [token, setToken] = useState<string>();
  const [serverError, setServerError] = useState<string>();
  const [summary, setSummary] = useState<{ name: string; message: string }[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<In, unknown, Out>({
    resolver,
    mode: "onTouched",
    defaultValues: { serviceInterest: [], phone: "", message: "", consentMarketing: false },
  });
  const { register, handleSubmit, trigger, watch, reset, formState: { errors, isSubmitting } } = form;

  // Restore autosaved draft (never consent), then apply ?service= from service-page CTAs.
  // Read from window (not useSearchParams) so the form is server-rendered on this static page.
  useEffect(() => {
    let draft: Partial<In> = {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) draft = { ...JSON.parse(saved), consent: undefined };
    } catch { /* ignore corrupt drafts */ }
    const svc = new URLSearchParams(window.location.search).get("service");
    if (svc && services.some((s) => s.slug === svc)) {
      draft.serviceInterest = Array.from(new Set([...(draft.serviceInterest ?? []), svc]));
    }
    if (Object.keys(draft).length) reset(draft, { keepDefaultValues: true });
  }, [reset, services]);
  useEffect(() => {
    const sub = watch((values) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...values, consent: undefined }));
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const showSummary = useCallback((errs: FieldErrors<In>, names: readonly string[]) => {
    const list = names
      .filter((n) => errs[n as keyof In])
      .map((n) => ({ name: n, message: String(errs[n as keyof In]?.message ?? `${fieldLabels[n]} is required`) }));
    setSummary(list);
    if (list.length) requestAnimationFrame(() => summaryRef.current?.focus());
  }, []);

  const next = async () => {
    const names = leadStepFields[step];
    const ok = await trigger(names as unknown as (keyof In)[], { shouldFocus: false });
    // Read errors live: the `formState` proxy captured by this closure is from the previous render.
    if (!ok) return showSummary(Object.fromEntries(names.map((n) => [n, form.getFieldState(n as keyof In).error])) as FieldErrors<In>, names);
    setSummary([]);
    setStep((s) => s + 1);
    track("Lead Form Step", { step: step + 2 });
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const onSubmit = handleSubmit(
    async (data) => {
      setServerError(undefined);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ variant: "full", data, meta: trackingMeta(), turnstileToken: token, website: (document.getElementById("lead-website") as HTMLInputElement)?.value || undefined }),
      }).catch(() => null);
      if (!res?.ok) {
        const body = await res?.json().catch(() => null);
        setServerError(body?.error ?? `We couldn't send your brief. Please try again or email ${site.email}.`);
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      track("Lead Submitted", { variant: "full", services: data.serviceInterest.join(",") });
      router.push("/thank-you");
    },
    (errs) => showSummary(errs, leadStepFields[step]),
  );

  const selected = watch("serviceInterest") ?? [];

  return (
    <form noValidate onSubmit={onSubmit} onFocus={() => setTouched(true)} className="relative" aria-labelledby="lead-step-title">
      {/* Progress */}
      <ol className="mb-10 grid grid-cols-3 gap-2" aria-label="Form progress">
        {steps.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <span className={cn("block h-1 rounded-pill transition-colors duration-300", i <= step ? "bg-forest-700" : "bg-[var(--line)]")} />
            <span className={cn("mt-3 flex items-center gap-2 text-sm", i === step ? "font-semibold" : "text-[var(--fg-muted)]")}>
              <span aria-hidden className={cn(
                "readout inline-flex size-6 shrink-0 items-center justify-center rounded-pill border transition-colors",
                i < step ? "border-forest-700 bg-forest-700 text-sand-50" : i === step ? "border-forest-700 text-forest-700" : "border-[var(--line)]",
              )}>
                {i < step ? <Check className="size-3.5" strokeWidth={2.5} /> : i + 1}
              </span>
              <span className="sr-only sm:not-sr-only">{label}{i < step ? <span className="sr-only"> (complete)</span> : null}</span>
            </span>
          </li>
        ))}
      </ol>

      <h2 id="lead-step-title" ref={headingRef} tabIndex={-1} className="mb-8 text-h3 focus-visible:outline-none">
        <span className="sr-only">Step {step + 1} of 3: </span>{steps[step]}
      </h2>

      {summary.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-8 rounded-md border border-[#B42318]/40 border-l-4 border-l-[#B42318] bg-[#FEF3F2] p-5 text-[#7A271A]">
          <p className="font-semibold">Please fix {summary.length === 1 ? "this" : `these ${summary.length}`} before continuing:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {summary.map((e) => (
              <li key={e.name}><a href={`#lead-${e.name}`} className="underline">{fieldLabels[e.name]}: {e.message}</a></li>
            ))}
          </ul>
        </div>
      )}

      <div hidden={step !== 0}>
        <fieldset aria-describedby={errors.serviceInterest ? "lead-serviceInterest-error" : undefined}>
          <legend className="mb-4 text-sm font-semibold">Which services are you interested in? <span aria-hidden className="text-forest-500">*</span></legend>
          <div id="lead-serviceInterest" className="flex flex-wrap gap-2">
            {services.map((s) => {
              const on = selected.includes(s.slug);
              return (
                <label key={s.slug} className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-400",
                  on ? "border-forest-900 bg-forest-900 text-sand-50" : "border-[var(--line)] bg-[var(--surface-raised)] hover:border-forest-700 hover:text-forest-700",
                )}>
                  <input type="checkbox" value={s.slug} className="sr-only" {...register("serviceInterest")} />
                  {on && <Check aria-hidden className="size-4" strokeWidth={2} />}
                  {s.title}
                </label>
              );
            })}
          </div>
          {errors.serviceInterest && <p id="lead-serviceInterest-error" className="mt-3 text-sm font-medium text-[#B42318]">{errors.serviceInterest.message}</p>}
        </fieldset>
      </div>

      <div hidden={step !== 1} className="grid gap-6 sm:grid-cols-2">
        <Field id="lead-organisation" label="Organisation" required error={errors.organisation?.message}>
          <Input id="lead-organisation" autoComplete="organization" aria-invalid={!!errors.organisation} aria-describedby={describedBy("lead-organisation", errors.organisation?.message)} {...register("organisation")} />
        </Field>
        <Field id="lead-industry" label="Sector" required error={errors.industry?.message}>
          <Select id="lead-industry" aria-invalid={!!errors.industry} aria-describedby={describedBy("lead-industry", errors.industry?.message)} {...register("industry")} defaultValue="">
            <option value="" disabled>Select a sector</option>
            {industries.map((i) => <option key={i.slug} value={i.slug}>{i.title}</option>)}
            <option value="other">Other</option>
          </Select>
        </Field>
        <Field id="lead-budgetBand" label="Budget (KES / USD)" required error={errors.budgetBand?.message}>
          <Select id="lead-budgetBand" aria-invalid={!!errors.budgetBand} aria-describedby={describedBy("lead-budgetBand", errors.budgetBand?.message)} {...register("budgetBand")} defaultValue="">
            <option value="" disabled>Select a range</option>
            {budgetBands.map((b) => <option key={b} value={b}>{budgetLabels[b]}</option>)}
          </Select>
        </Field>
        <Field id="lead-timeline" label="Timeline" required error={errors.timeline?.message}>
          <Select id="lead-timeline" aria-invalid={!!errors.timeline} aria-describedby={describedBy("lead-timeline", errors.timeline?.message)} {...register("timeline")} defaultValue="">
            <option value="" disabled>When do you want to start?</option>
            {timelines.map((t) => <option key={t} value={t}>{timelineLabels[t]}</option>)}
          </Select>
        </Field>
      </div>

      <div hidden={step !== 2} className="grid gap-6 sm:grid-cols-2">
        <Field id="lead-fullName" label="Full name" required error={errors.fullName?.message}>
          <Input id="lead-fullName" autoComplete="name" aria-invalid={!!errors.fullName} aria-describedby={describedBy("lead-fullName", errors.fullName?.message)} {...register("fullName")} />
        </Field>
        <Field id="lead-email" label="Work email" required error={errors.email?.message}>
          <Input id="lead-email" type="email" autoComplete="email" inputMode="email" aria-invalid={!!errors.email} aria-describedby={describedBy("lead-email", errors.email?.message)} {...register("email")} />
        </Field>
        <Field id="lead-phone" label="Phone" hint="Include country code, e.g. +254" error={errors.phone?.message}>
          <Input id="lead-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+254 7XX XXX XXX" aria-invalid={!!errors.phone} aria-describedby={describedBy("lead-phone", errors.phone?.message, "hint")} {...register("phone")} />
        </Field>
        <Field id="lead-role" label="Your role">
          <Input id="lead-role" autoComplete="organization-title" {...register("role")} />
        </Field>
        <Field id="lead-message" label="What outcome are you after?" className="sm:col-span-2" error={errors.message?.message}>
          <Textarea id="lead-message" rows={5} aria-invalid={!!errors.message} {...register("message")} />
        </Field>
        <div className="space-y-3 sm:col-span-2">
          <label className="flex min-h-11 items-start gap-3 text-sm">
            <input id="lead-consent" type="checkbox" className="mt-0.5 size-5 shrink-0 accent-forest-700" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "lead-consent-error" : undefined} {...register("consent")} />
            <span>I agree to Accessline processing my details to respond to this enquiry, per the <a href="/privacy" className="underline">privacy policy</a> (Kenya Data Protection Act 2019). <span aria-hidden className="text-forest-500">*</span></span>
          </label>
          {errors.consent && <p id="lead-consent-error" className="text-sm font-medium text-[#B42318]">{errors.consent.message}</p>}
          <label className="flex min-h-11 items-start gap-3 text-sm text-[var(--fg-muted)]">
            <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-forest-700" {...register("consentMarketing")} />
            <span>Send me occasional insights. Unsubscribe anytime.</span>
          </label>
        </div>
        <Honeypot id="lead-website" name="website" />
        <div className="sm:col-span-2"><Turnstile active={touched} onToken={setToken} /></div>
      </div>

      <p aria-live="assertive" className="mt-6 text-sm font-medium text-[#B42318]">{serverError}</p>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-8">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => { setSummary([]); setStep((s) => s - 1); }}>Back</Button>
        ) : <span />}
        {step < 2 ? (
          <Button type="button" onClick={next} withArrow>Continue</Button>
        ) : (
          <Button type="submit" disabled={isSubmitting} withArrow>{isSubmitting ? "Sending…" : "Send brief"}</Button>
        )}
      </div>
      <p className="mt-4 text-xs text-[var(--fg-muted)]">Your progress is saved on this device.</p>
    </form>
  );
}
