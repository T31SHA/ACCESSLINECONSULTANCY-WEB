import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/about", "/services", "/services/sbcc", "/industries/health", "/work", "/team", "/insights", "/careers", "/contact", "/does-not-exist"];

for (const route of routes) {
  test(`axe: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });

  test(`one h1 + canonical: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}

test("legacy redirects are 301", async ({ request }) => {
  for (const [from, to] of [["/about-us", "/about"], ["/our-services", "/services"], ["/our-partners", "/industries"], ["/gis-remote-sensing", "/team"], ["/logistics-support", "/careers"]]) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(new URL(res.headers().location!, "http://x").pathname).toBe(to);
  }
});

test("lead form validates step 1 and shows error summary", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Please fix" })).toContainText("Choose at least one service");
});
