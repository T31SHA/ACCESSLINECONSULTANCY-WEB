import { afterEach, describe, expect, it, vi } from "vitest";
import { calLinkForLead } from "@/lib/integrations/cal";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe("Cal.com", () => {
  it("pre-fills booking links with the visitor's details", () => {
    const u = new URL(calLinkForLead("https://cal.com/acc/intro", { name: "Jane Doe", email: "j@x.co" }));
    expect(u.searchParams.get("email")).toBe("j@x.co");
    expect(u.searchParams.get("name")).toBe("Jane Doe");
  });
});

describe("email", () => {
  it("renders every non-empty field and escapes HTML", async () => {
    const { renderFields } = await import("@/lib/server/email");
    const { html, text } = renderFields("New enquiry", { Name: "<b>Jane</b>", Services: ["sbcc", "events"], Empty: "", Missing: undefined });
    expect(html).toContain("&lt;b&gt;Jane&lt;/b&gt;");
    expect(html).not.toContain("<b>Jane</b>");
    expect(text).toContain("Services: sbcc, events");
    expect(text).not.toContain("Empty");
  });

  it("picks the transport from env: none → smtp → resend; dry-run is dev-only", async () => {
    for (const k of ["RESEND_API_KEY", "SMTP_HOST", "SMTP_USER", "SMTP_PASS", "EMAIL_DRY_RUN", "ALLOW_EMAIL_DRY_RUN"]) vi.stubEnv(k, "");
    let m = await import("@/lib/server/email");
    expect(m.emailTransport()).toBeNull();
    vi.stubEnv("SMTP_HOST", "smtp.gmail.com"); vi.stubEnv("SMTP_USER", "me@gmail.com"); vi.stubEnv("SMTP_PASS", "app-password");
    expect(m.emailTransport()).toBe("smtp");
    expect(m.leadsInbox()).toBe("me@gmail.com");
    vi.stubEnv("LEADS_INBOX", "leads@gmail.com");
    expect(m.leadsInbox()).toBe("leads@gmail.com");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    expect(m.emailTransport()).toBe("resend");
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("EMAIL_DRY_RUN", "1");
    vi.resetModules(); m = await import("@/lib/server/email");
    expect(m.emailTransport()).toBe("resend");
  });
});
