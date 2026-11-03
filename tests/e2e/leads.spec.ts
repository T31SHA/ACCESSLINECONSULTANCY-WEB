import { expect, test } from "@playwright/test";
import { mailFor, uniqueEmail } from "./helpers";

test.describe("Lead pipeline (email)", () => {
  test("contact form: 3 steps → /thank-you → enquiry emailed to the inbox", async ({ page }) => {
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

    const mail = await mailFor(email);
    expect(mail.to).toBe("leads@example.com");
    expect(mail.subject).toContain("Contact Flow Org");
    for (const v of ["Contact Flow Person", "Social & Behaviour Change Communication", "NGOs & Development", "KES 5M+", "As soon as possible", "/contact"]) expect(mail.text).toContain(v);
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
});
