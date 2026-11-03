import { createHmac, randomUUID } from "node:crypto";
import { expect, type APIRequestContext, type Page } from "@playwright/test";
import { E2E } from "./env";

export const uniqueEmail = (tag: string) => `${tag}-${randomUUID().slice(0, 8)}@example.com`;

export async function createLead(request: APIRequestContext, over: Partial<Record<string, unknown>> = {}) {
  const email = (over.email as string) ?? uniqueEmail("lead");
  const res = await request.post("/api/leads", {
    data: {
      variant: "full",
      data: {
        serviceInterest: ["pr-media-relations"], organisation: "E2E Org", industry: "health", budgetBand: "2m_5m", timeline: "asap",
        fullName: "E2E Tester", email, phone: "+254 712 345 678", consent: true, ...over,
      },
      meta: { sourcePage: "/contact", utmSource: "e2e" },
    },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.id).toMatch(/^[0-9a-f-]{36}$/);
  return { id: body.id as string, email };
}

export async function login(page: Page, email: string = E2E.admin.email, password: string = E2E.admin.password) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  // Wait for the server action to finish (cookie set + redirect) before navigating elsewhere.
  await page.waitForURL((u) => u.pathname !== "/admin/login" || u.searchParams.has("error"));
}

/** Sanity webhook signature: t=<ms>,v1=base64url(HMAC-SHA256(secret, `${t}.${body}`)). */
export function sanitySignature(body: string, secret: string, t = Date.now()) {
  const sig = createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url");
  return `t=${t},v1=${sig}`;
}

/** Cal.com signature: hex(HMAC-SHA256(secret, rawBody)). */
export const calSignature = (body: string, secret: string) => createHmac("sha256", secret).update(body).digest("hex");
