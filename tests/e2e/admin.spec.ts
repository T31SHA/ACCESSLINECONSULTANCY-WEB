import { expect, test } from "@playwright/test";
import { E2E } from "./env";
import { createLead, login, uniqueEmail } from "./helpers";

test.describe("/admin auth", () => {
  test("unauthenticated visitors are redirected to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login\?callbackUrl=/);
    await expect(page.getByRole("heading", { name: "Sign in to leads" })).toBeVisible();
  });

  test("admin API rejects unauthenticated requests with 401", async ({ request }) => {
    const res = await request.get("/api/admin/leads/export");
    expect(res.status()).toBe(401);
  });

  test("wrong password is rejected", async ({ page }) => {
    await login(page, E2E.admin.email, "not-the-password");
    await expect(page).toHaveURL(/\/admin\/login\?error=1/);
    await expect(page.getByText("Incorrect email or password")).toBeVisible();
  });

  test("correct password but email not on allowlist is rejected", async ({ page }) => {
    await login(page, "intruder@example.com", E2E.admin.password);
    await expect(page).toHaveURL(/\/admin\/login\?error=1/);
  });

  test("allowlisted admin signs in, sees the lead, deep link survives login, and can sign out", async ({ page, request }) => {
    const lead = await createLead(request, { fullName: "Akinyi Dashboard" });
    await page.goto(`/admin/leads/${lead.id}`);
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.getByLabel("Email").fill(E2E.admin.email);
    await page.getByLabel("Password").fill(E2E.admin.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(new RegExp(`/admin/leads/${lead.id}$`));
    await expect(page.getByRole("heading", { level: 1, name: "Akinyi Dashboard" })).toBeVisible();

    await page.goto("/admin");
    await page.getByRole("searchbox").fill("Akinyi Dashboard");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page.getByRole("link", { name: "Akinyi Dashboard" })).toBeVisible();
    await expect(page.getByText(/^1 lead match$/)).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("status update and note are recorded on the lead timeline", async ({ page, request }) => {
    const lead = await createLead(request, { fullName: "Otieno Timeline" });
    await login(page);
    await page.goto(`/admin/leads/${lead.id}`);
    await page.getByLabel("Lead status").selectOption("qualified");
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByText("Status new → qualified")).toBeVisible();
    await expect(page.getByLabel("Lead status")).toHaveValue("qualified");
    await page.getByLabel("Add a note").fill("Wants a proposal by Friday.");
    await page.getByRole("button", { name: "Add note" }).click();
    await expect(page.getByText("Wants a proposal by Friday.")).toBeVisible();
  });
});

test.describe("CSV export", () => {
  test("returns filtered, escaped CSV for admins", async ({ page, request }) => {
    const email = uniqueEmail("csv");
    await createLead(request, { email, fullName: "=HYPERLINK(\"x\")", organisation: "Quote \"Org\", Ltd", message: "line1\nline2" });
    await login(page);
    await expect(page).toHaveURL(/\/admin$/);

    const res = await page.request.get(`/api/admin/leads/export?q=${encodeURIComponent(email)}`);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/csv");
    expect(res.headers()["content-disposition"]).toMatch(/attachment; filename="accessline-leads-\d{4}-\d{2}-\d{2}\.csv"/);
    const csv = (await res.text()).replace(/^﻿/, "");
    const lines = csv.trimEnd().split("\r\n");
    expect(lines[0]).toBe("id,createdAt,status,score,fullName,email,phone,organisation,role,country,serviceInterest,industry,budgetBand,timeline,message,sourcePage,utmSource,utmMedium,utmCampaign,referrer,consentMarketing,consentAt");
    expect(csv).toContain(email);
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`); // formula neutralised + quotes escaped
    expect(csv).toContain(`"Quote ""Org"", Ltd"`);
    expect(csv).toContain(`"line1\nline2"`);
    expect(csv.match(new RegExp(email, "g"))).toHaveLength(1);
  });

  test("status filter excludes non-matching leads", async ({ page, request }) => {
    const email = uniqueEmail("csvstatus");
    await createLead(request, { email });
    await login(page);
    await expect(page).toHaveURL(/\/admin$/);
    const res = await page.request.get(`/api/admin/leads/export?status=won&q=${encodeURIComponent(email)}`);
    const lines = (await res.text()).trimEnd().split("\r\n");
    expect(lines).toHaveLength(1); // header only
  });
});
