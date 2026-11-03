import { expect, test } from "@playwright/test";
import { uniqueEmail } from "./helpers";

test.describe("Lead pipeline", () => {
  test("contact form: 3 steps → emailed → /thank-you", async ({ page }) => {
    const email = uniqueEmail("contact");
    await page.goto("/contact?service=sbcc");
    await expect(page.getByRole("checkbox", { name: /Social & Behaviour Change/ })).toBeChecked();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.locator("#lead-organisation").fill("Contact Flow Org");
    await page.locator("#lead-industry").selectOption("ngos");
    await page.locator("#lead-budgetBand").selectOption("5m_plus");
    await page.locator("#lead-timeline").selectOption("asap");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.locator("#lead-fullName").fill("Contact Flow Person");
    await page.locator("#lead-email").fill(email);
    await page.getByLabel(/I agree to Accessline/).check();
    await page.getByRole("button", { name: "Send brief" }).click();
    await expect(page).toHaveURL(/\/thank-you$/);
  });

  test("step validation shows an error summary", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Please fix" })).toContainText("Choose at least one service");
  });

  test("API: honeypot is silently accepted, invalid data is 422", async ({ request }) => {
    expect((await (await request.post("/api/leads", { data: { variant: "short", data: {}, website: "bot" } })).json())).toEqual({ ok: true });
    expect((await request.post("/api/leads", { data: { variant: "short", data: { email: "x" } } })).status()).toBe(422);
  });

  test("API: a valid short enquiry is emailed (dry-run) and returns ok", async ({ request }) => {
    const res = await request.post("/api/leads", { data: { variant: "short", data: { fullName: "E2E Tester", email: uniqueEmail("short"), organisation: "E2E Org", message: "Hello from the E2E suite", consent: true }, meta: { sourcePage: "/" } } });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test("API: careers application accepts multipart with an optional CV", async ({ request }) => {
    const res = await request.post("/api/careers/apply", {
      multipart: { jobSlug: "sbcc-programme-officer", fullName: "E2E Applicant", email: uniqueEmail("apply"),
        cv: { name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 test") } },
    });
    expect(res.status()).toBe(200);
    const bad = await request.post("/api/careers/apply", { multipart: { jobSlug: "sbcc-programme-officer", fullName: "E2E", email: uniqueEmail("apply"), cv: { name: "cv.txt", mimeType: "text/plain", buffer: Buffer.from("x") } } });
    expect(bad.status()).toBe(422);
  });
});
