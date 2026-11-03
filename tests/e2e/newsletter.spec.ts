import { expect, test } from "@playwright/test";
import { uniqueEmail } from "./helpers";

test.describe("Newsletter (emailed to LEADS_INBOX)", () => {
  test("footer form subscribes with a polite status message", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Email address").fill(uniqueEmail("footer"));
    await page.getByRole("button", { name: "Subscribe" }).click();
    await expect(page.getByText("Thanks — you’re on the list.")).toBeVisible();
  });

  test("API accepts a valid email and rejects invalid ones", async ({ request }) => {
    expect((await request.post("/api/newsletter", { data: { email: uniqueEmail("nl") } })).status()).toBe(200);
    expect((await request.post("/api/newsletter", { data: { email: "nope" } })).status()).toBe(422);
  });
});
