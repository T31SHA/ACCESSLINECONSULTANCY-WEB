import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { E2E } from "./env";
import { calSignature, createLead, login, sanitySignature } from "./helpers";

const calPost = (request: import("@playwright/test").APIRequestContext, payload: unknown, secret: string = E2E.env.CAL_WEBHOOK_SECRET) => {
  const body = JSON.stringify(payload);
  return request.post("/api/webhooks/cal", { data: body, headers: { "content-type": "application/json", "x-cal-signature-256": calSignature(body, secret) } });
};
const booking = (trigger: string, email: string, extra: Record<string, unknown> = {}) => ({
  triggerEvent: trigger,
  createdAt: new Date().toISOString(),
  payload: { uid: randomUUID(), startTime: "2026-12-01T07:00:00.000Z", endTime: "2026-12-01T07:30:00.000Z", attendees: [{ email, name: "E2E" }], ...extra },
});

test.describe("Cal.com webhook", () => {
  test("rejects a bad signature", async ({ request }) => {
    const res = await calPost(request, booking("BOOKING_CREATED", "x@example.com"), "wrong-secret");
    expect(res.status()).toBe(401);
  });

  test("rejects a missing signature", async ({ request }) => {
    const res = await request.post("/api/webhooks/cal", { data: booking("BOOKING_CREATED", "x@example.com") });
    expect(res.status()).toBe(401);
  });

  test("links a booking to the lead by attendee email and logs it", async ({ request, page }) => {
    const lead = await createLead(request);
    const res = await calPost(request, booking("BOOKING_CREATED", lead.email.toUpperCase()));
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.leadId).toBe(lead.id);
    expect(body.bookingId).toMatch(/^[0-9a-f-]{36}$/);

    await login(page);
    await page.goto(`/admin/leads/${lead.id}`);
    await expect(page.getByText(/^Call booked/)).toBeVisible();
    await expect(page.getByText(/^contacted$/i).first()).toBeVisible(); // new → contacted
  });

  test("prefers metadata.leadId over email and handles reschedule + cancel", async ({ request }) => {
    const lead = await createLead(request);
    const created = booking("BOOKING_CREATED", "someone-else@example.com", { metadata: { leadId: lead.id } });
    const r1 = await (await calPost(request, created)).json();
    expect(r1.leadId).toBe(lead.id);

    const moved = booking("BOOKING_RESCHEDULED", "someone-else@example.com", { metadata: { leadId: lead.id }, rescheduleUid: created.payload.uid });
    expect((await calPost(request, moved)).status()).toBe(200);
    const cancel = { ...moved, triggerEvent: "BOOKING_CANCELLED" };
    const r3 = await (await calPost(request, cancel)).json();
    expect(r3.bookingId).toBeTruthy();
  });

  test("ignores unrelated triggers", async ({ request }) => {
    const res = await calPost(request, { triggerEvent: "FORM_SUBMITTED", payload: { uid: "x", startTime: "", endTime: "" } });
    expect((await res.json()).ignored).toBe("FORM_SUBMITTED");
  });
});

test.describe("Sanity revalidate webhook", () => {
  test("rejects unsigned requests", async ({ request }) => {
    const res = await request.post("/api/revalidate", { data: { _type: "service" } });
    expect(res.status()).toBe(401);
  });

  test("rejects a signature made with the wrong secret", async ({ request }) => {
    const body = JSON.stringify({ _type: "service", slug: "sbcc" });
    const res = await request.post("/api/revalidate", { data: body, headers: { "content-type": "application/json", "sanity-webhook-signature": sanitySignature(body, "nope") } });
    expect(res.status()).toBe(401);
  });

  test("revalidates on a valid signature", async ({ request }) => {
    const body = JSON.stringify({ _type: "service", slug: "sbcc" });
    const res = await request.post("/api/revalidate", { data: body, headers: { "content-type": "application/json", "sanity-webhook-signature": sanitySignature(body, E2E.env.SANITY_REVALIDATE_SECRET) } });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ revalidated: true, type: "service", slug: "sbcc" });
    // Regression: detail pages must still render after a purge (dynamicParams=false used to 404 here).
    for (const path of ["/services/sbcc", "/industries/health", "/work/fintech-market-entry", "/insights/sbcc-beyond-awareness"]) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
    expect((await request.get("/services/not-a-service")).status()).toBe(404);
  });
});

test.describe("Retention cron", () => {
  test("requires the cron secret", async ({ request }) => {
    expect((await request.get("/api/cron/retention")).status()).toBe(401);
    expect((await request.get("/api/cron/retention", { headers: { authorization: "Bearer wrong" } })).status()).toBe(401);
  });

  test("runs with the cron secret and reports counts", async ({ request }) => {
    const res = await request.get("/api/cron/retention", { headers: { authorization: `Bearer ${E2E.env.CRON_SECRET}` } });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, spamLeadsDeleted: expect.any(Number), applicationsDeleted: expect.any(Number) });
  });
});
