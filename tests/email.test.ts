import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// ── Email transports are mocked: nothing in this file touches the network. ──
const smtpSend = vi.fn();
const createTransport = vi.fn((opts: unknown) => { void opts; return { sendMail: smtpSend }; });
vi.mock("nodemailer", () => ({ default: { createTransport } }));

const resendSend = vi.fn();
vi.mock("resend", () => ({
  Resend: class { emails = { send: resendSend }; },
}));

const EMAIL_ENV = ["RESEND_API_KEY", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "EMAIL_FROM", "EMAIL_TEST_OUTBOX", "TURNSTILE_SECRET_KEY", "UPSTASH_REDIS_REST_URL"];

beforeEach(() => {
  for (const k of EMAIL_ENV) vi.stubEnv(k, "");
  vi.stubEnv("LEADS_INBOX", "leads@example.com");
  smtpSend.mockReset().mockResolvedValue({ messageId: "x" });
  resendSend.mockReset().mockResolvedValue({ data: { id: "x" }, error: null });
  createTransport.mockClear();
});
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

const useSmtp = () => {
  vi.stubEnv("SMTP_HOST", "smtp.hostinger.com");
  vi.stubEnv("SMTP_PORT", "465");
  vi.stubEnv("SMTP_USER", "forms@example.com");
  vi.stubEnv("SMTP_PASS", "secret");
};

const mail = { subject: "Hi", replyTo: "jane@example.org", text: "t", html: "<p>t</p>" };

describe("sendMail", () => {
  it("throws when no transport is configured", async () => {
    const { sendMail, emailConfigured, EmailNotConfiguredError } = await import("@/lib/server/email");
    expect(emailConfigured()).toBe(false);
    await expect(sendMail(mail)).rejects.toBeInstanceOf(EmailNotConfiguredError);
  });

  it("uses Resend when RESEND_API_KEY is set (even if SMTP is also set)", async () => {
    useSmtp();
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const { sendMail } = await import("@/lib/server/email");
    await sendMail(mail);
    expect(resendSend).toHaveBeenCalledOnce();
    expect(resendSend.mock.calls[0]![0]).toMatchObject({ to: "leads@example.com", replyTo: "jane@example.org", subject: "Hi" });
    expect(smtpSend).not.toHaveBeenCalled();
  });

  it("surfaces Resend errors", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    resendSend.mockResolvedValue({ data: null, error: { message: "domain not verified" } });
    const { sendMail } = await import("@/lib/server/email");
    await expect(sendMail(mail)).rejects.toThrow(/domain not verified/);
  });

  it("falls back to SMTP, From = authenticated mailbox, implicit TLS on 465", async () => {
    useSmtp();
    const { sendMail } = await import("@/lib/server/email");
    await sendMail({ ...mail, subject: "Line\r\nBcc: evil@example.com" });
    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({
      host: "smtp.hostinger.com", port: 465, secure: true, auth: { user: "forms@example.com", pass: "secret" },
    }));
    const sent = smtpSend.mock.calls[0]![0];
    expect(sent).toMatchObject({ to: "leads@example.com", replyTo: "jane@example.org", from: expect.stringContaining("<forms@example.com>") });
    expect(sent.subject).not.toMatch(/[\r\n]/);
  });

  it("uses STARTTLS on 587 and honours EMAIL_FROM", async () => {
    useSmtp();
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("EMAIL_FROM", "Website <web@example.com>");
    const { sendMail } = await import("@/lib/server/email");
    await sendMail(mail);
    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({ port: 587, secure: false }));
    expect(smtpSend.mock.calls[0]![0].from).toBe("Website <web@example.com>");
  });

  it("renders fields as text + escaped HTML, skipping empties", async () => {
    const { renderFields } = await import("@/lib/server/email");
    const { text, html } = renderFields("New lead", [["Name", "<b>Jo</b>"], ["Phone", ""], ["Services", ["a", "b"]], ["Consent", true]]);
    expect(text).toContain("Name: <b>Jo</b>");
    expect(text).not.toContain("Phone");
    expect(text).toContain("Services: a, b");
    expect(text).toContain("Consent: Yes");
    expect(html).toContain("&lt;b&gt;Jo&lt;/b&gt;");
  });
});

// ── Routes ──
const json = (url: string, body: unknown) =>
  new NextRequest(`http://localhost${url}`, { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } });

const shortLead = {
  variant: "short",
  data: { fullName: "Jane Doe", email: "jane@example.org", organisation: "Acme", message: "We need a campaign.", consent: true },
  meta: { sourcePage: "/" },
};

describe("POST /api/leads", () => {
  it("returns 503 with a clear message when email isn't configured", async () => {
    const { POST } = await import("@/app/api/leads/route");
    const res = await POST(json("/api/leads", shortLead));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toMatch(/temporarily unavailable.*email/i);
  });

  it("emails every field to the inbox with reply-to = submitter", async () => {
    useSmtp();
    const { POST } = await import("@/app/api/leads/route");
    const res = await POST(json("/api/leads", {
      variant: "full",
      data: {
        serviceInterest: ["sbcc", "events"], organisation: "Acme Ltd", industry: "health", budgetBand: "2m_5m", timeline: "asap",
        fullName: "Jane Doe", email: "jane@example.org", phone: "+254 712 345 678", role: "Head of Comms", message: "Hello", consent: true, consentMarketing: true,
      },
      meta: { sourcePage: "/contact", utmSource: "linkedin", referrer: "https://google.com" },
    }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const sent = smtpSend.mock.calls[0]![0];
    expect(sent.to).toBe("leads@example.com");
    expect(sent.replyTo).toBe("jane@example.org");
    expect(sent.subject).toContain("Acme Ltd");
    for (const v of ["Jane Doe", "+254 712 345 678", "Head of Comms", "Social & Behaviour Change Communication, Events & Experiential", "Sector: Health", "KES 2M – 5M", "As soon as possible", "Hello", "/contact", "linkedin", "https://google.com", "Marketing consent: Yes"]) {
      expect(sent.text).toContain(v);
    }
  });

  it("honeypot: silently accepted, nothing sent", async () => {
    useSmtp();
    const { POST } = await import("@/app/api/leads/route");
    const res = await POST(json("/api/leads", { ...shortLead, website: "bot" }));
    expect(await res.json()).toEqual({ ok: true });
    expect(smtpSend).not.toHaveBeenCalled();
  });

  it("422 on invalid fields", async () => {
    useSmtp();
    const { POST } = await import("@/app/api/leads/route");
    const res = await POST(json("/api/leads", { variant: "short", data: { email: "x" } }));
    expect(res.status).toBe(422);
    expect(smtpSend).not.toHaveBeenCalled();
  });

  it("rejects a missing Turnstile token when a secret is set", async () => {
    useSmtp();
    vi.stubEnv("TURNSTILE_SECRET_KEY", "ts");
    const { POST } = await import("@/app/api/leads/route");
    expect((await POST(json("/api/leads", shortLead))).status).toBe(400);
  });

  it("502 when the provider fails", async () => {
    useSmtp();
    smtpSend.mockRejectedValue(new Error("535 auth failed"));
    const { POST } = await import("@/app/api/leads/route");
    const res = await POST(json("/api/leads", shortLead));
    expect(res.status).toBe(502);
  });
});

describe("POST /api/newsletter", () => {
  it("emails the sign-up to the inbox", async () => {
    useSmtp();
    const { POST } = await import("@/app/api/newsletter/route");
    const res = await POST(json("/api/newsletter", { email: "Reader@Example.org" }));
    expect(res.status).toBe(200);
    expect(smtpSend.mock.calls[0]![0]).toMatchObject({ to: "leads@example.com", replyTo: "reader@example.org" });
  });
  it("503 when email isn't configured; 422 on invalid email", async () => {
    const { POST } = await import("@/app/api/newsletter/route");
    expect((await POST(json("/api/newsletter", { email: "a@b.co" }))).status).toBe(503);
    expect((await POST(json("/api/newsletter", { email: "nope" }))).status).toBe(422);
  });
});

describe("POST /api/careers/apply", () => {
  const JOB = "sbcc-programme-officer";
  const form = (extra: Record<string, string | Blob> = {}, cv?: File) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries({ jobSlug: JOB, fullName: "Ann Applicant", email: "ann@example.org", coverNote: "Hire me", ...extra })) fd.set(k, v);
    if (cv) fd.set("cv", cv);
    return new NextRequest("http://localhost/api/careers/apply", { method: "POST", body: fd });
  };
  const pdf = (bytes = 100) => new File([Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(bytes)])], "my cv.pdf", { type: "application/pdf" });

  it("emails the application with the CV attached", async () => {
    useSmtp();
    const { POST } = await import("@/app/api/careers/apply/route");
    const res = await POST(form({}, pdf()));
    expect(res.status).toBe(200);
    const sent = smtpSend.mock.calls[0]![0];
    expect(sent).toMatchObject({ to: "leads@example.com", replyTo: "ann@example.org" });
    expect(sent.text).toContain("Hire me");
    expect(sent.attachments).toHaveLength(1);
    expect(sent.attachments[0]).toMatchObject({ filename: "CV-Ann-Applicant.pdf", contentType: "application/pdf" });
  });

  it("CV is optional", async () => {
    useSmtp();
    const { POST } = await import("@/app/api/careers/apply/route");
    expect((await POST(form())).status).toBe(200);
    expect(smtpSend.mock.calls[0]![0].attachments).toEqual([]);
  });

  it("rejects CVs over 5MB, wrong types and spoofed content", async () => {
    useSmtp();
    const { POST } = await import("@/app/api/careers/apply/route");
    expect((await POST(form({}, pdf(5 * 1024 * 1024)))).status).toBe(422);
    expect((await POST(form({}, new File(["hello"], "cv.txt", { type: "text/plain" })))).status).toBe(422);
    expect((await POST(form({}, new File(["not a pdf"], "cv.pdf", { type: "application/pdf" })))).status).toBe(422);
    expect(smtpSend).not.toHaveBeenCalled();
  });

  it("rejects unknown roles and honours the honeypot", async () => {
    useSmtp();
    const { POST } = await import("@/app/api/careers/apply/route");
    expect((await POST(form({ jobSlug: "no-such-job" }))).status).toBe(400);
    expect(await (await POST(form({ website: "bot" }))).json()).toEqual({ ok: true });
    expect(smtpSend).not.toHaveBeenCalled();
  });

  it("503 when email isn't configured", async () => {
    const { POST } = await import("@/app/api/careers/apply/route");
    expect((await POST(form())).status).toBe(503);
  });
});
