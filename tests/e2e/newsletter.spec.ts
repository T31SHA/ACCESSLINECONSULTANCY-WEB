import { expect, test } from "@playwright/test";
import { mailFor, uniqueEmail } from "./helpers";

test.describe("Newsletter sign-up (email)", () => {
  test("footer form emails the sign-up to the inbox", async ({ page }) => {
    const email = uniqueEmail("footer");
    await page.goto("/");
    await page.getByLabel("Email address").fill(email);
    await page.getByRole("button", { name: "Subscribe" }).click();
    await expect(page.getByText("Thanks — you're on the list.")).toBeVisible();
    const mail = await mailFor(email);
    expect(mail.subject).toContain(email);
  });

  test("rejects invalid emails", async ({ request }) => {
    expect((await request.post("/api/newsletter", { data: { email: "nope" } })).status()).toBe(422);
  });
});
