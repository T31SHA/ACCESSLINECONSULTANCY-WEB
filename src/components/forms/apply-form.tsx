"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { CV_MAX_BYTES, CV_TYPES } from "@/lib/careers-schema";
import { Field, Input, Textarea } from "./fields";
import { Turnstile } from "./turnstile";

type Status = { kind: "idle" | "loading" | "ok" | "error"; message?: string };

export function ApplyForm({ jobSlug, jobTitle }: { jobSlug: string; jobTitle: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [active, setActive] = useState(false);
  const [token, setToken] = useState<string>();
  const [fileError, setFileError] = useState<string>();

  if (status.kind === "ok") {
    return (
      <div role="status" className="rounded-lg border border-[var(--line)] bg-mint-50 p-8">
        <p className="font-display text-h3 font-bold">Application received.</p>
        <p className="mt-3 text-[var(--fg-muted)]">Thanks for applying for {jobTitle}. We review every application and reply within ten working days.</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onFocus={() => setActive(true)}
      className="grid gap-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const file = fd.get("cv") as File | null;
        if (!file || file.size === 0) return setFileError("Attach your CV (PDF or DOCX).");
        if (!(file.type in CV_TYPES)) return setFileError("CV must be a PDF or DOCX file.");
        if (file.size > CV_MAX_BYTES) return setFileError("CV must be 5MB or smaller.");
        setFileError(undefined);
        setStatus({ kind: "loading", message: "Uploading CV…" });
        try {
          const presign = await fetch("/api/careers/upload-url", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ jobSlug, contentType: file.type, size: file.size }),
          });
          const p = await presign.json();
          if (!presign.ok) throw new Error(p.error);
          const put = await fetch(p.url, { method: "PUT", body: file, headers: { "content-type": file.type } });
          if (!put.ok) throw new Error("Upload failed. Please try again.");
          setStatus({ kind: "loading", message: "Submitting…" });
          const res = await fetch("/api/careers/apply", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              jobSlug, cvObjectKey: p.key, turnstileToken: token,
              fullName: fd.get("fullName"), email: fd.get("email"), phone: fd.get("phone"),
              linkedinUrl: fd.get("linkedinUrl"), coverNote: fd.get("coverNote"),
            }),
          });
          const r = await res.json();
          if (!res.ok) throw new Error(r.error);
          track("Job Application", { job: jobSlug });
          setStatus({ kind: "ok" });
        } catch (err) {
          setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
        }
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="ap-name" label="Full name" required><Input id="ap-name" name="fullName" autoComplete="name" required /></Field>
        <Field id="ap-email" label="Email" required><Input id="ap-email" name="email" type="email" autoComplete="email" required /></Field>
        <Field id="ap-phone" label="Phone"><Input id="ap-phone" name="phone" type="tel" autoComplete="tel" placeholder="+254" /></Field>
        <Field id="ap-li" label="LinkedIn URL"><Input id="ap-li" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/" /></Field>
      </div>
      <Field id="ap-cv" label="CV" required hint="PDF or DOCX, up to 5MB" error={fileError}>
        <Input id="ap-cv" name="cv" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-describedby={fileError ? "ap-cv-error ap-cv-hint" : "ap-cv-hint"} aria-invalid={!!fileError} className="file:mr-4 file:rounded-pill file:border-0 file:bg-forest-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sand-50" />
      </Field>
      <Field id="ap-note" label="Why you, why now?"><Textarea id="ap-note" name="coverNote" rows={5} /></Field>
      <Turnstile active={active} onToken={setToken} />
      <p aria-live="polite" className={status.kind === "error" ? "text-sm font-medium text-[#B42318]" : "text-sm text-[var(--fg-muted)]"}>{status.message}</p>
      <div><Button type="submit" size="lg" withArrow disabled={status.kind === "loading"}>Submit application</Button></div>
    </form>
  );
}
