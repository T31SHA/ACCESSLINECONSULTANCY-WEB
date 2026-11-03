import { expect, test } from "@playwright/test";
import { uniqueEmail } from "./helpers";

test.describe("Newsletter double opt-in", () => {
  test("subscribe → confirm page → confirmed; token is single-use", async ({ page, request }) => {
    const res = await request.post("/api/newsletter", { data: { email: uniqueEmail("nl") } });
    expect(res.status()).toBe(200);
    const { debugToken } = await res.json();
    expect(debugToken).toMatch(/^[A-Za-z0-9_-]{20,64}$/);

    await page.goto(`/newsletter/confirm?token=${debugToken}`);
    await expect(page.getByRole("heading", { level: 1, name: "Confirm your subscription" })).toBeVisible();
    await page.getByRole("button", { name: "Confirm subscription" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "You're subscribed." })).toBeVisible();

    await page.goto(`/newsletter/confirm?token=${debugToken}`);
    await expect(page.getByRole("heading", { level: 1, name: "This link has expired." })).toBeVisible();
  });

  test("GET alone never confirms (link-scanner safe)", async ({ page, request }) => {
    const email = uniqueEmail("scan");
    const { debugToken } = await (await request.post("/api/newsletter", { data: { email } })).json();
    await request.get(`/newsletter/confirm?token=${debugToken}`); // scanner prefetch
    await page.goto(`/newsletter/confirm?token=${debugToken}`);
    await expect(page.getByRole("button", { name: "Confirm subscription" })).toBeVisible();
  });

  test("invalid token shows the expired state", async ({ page }) => {
    await page.goto("/newsletter/confirm?token=not-a-real-token-123456");
    await expect(page.getByRole("heading", { level: 1, name: "This link has expired." })).toBeVisible();
  });

  test("footer form subscribes with a polite status message", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Email address").fill(uniqueEmail("footer"));
    await page.getByRole("button", { name: "Subscribe" }).click();
    await expect(page.getByText("Check your inbox and click the link to confirm.")).toBeVisible();
  });

  test("rejects invalid emails", async ({ request }) => {
    expect((await request.post("/api/newsletter", { data: { email: "nope" } })).status()).toBe(422);
  });
});
