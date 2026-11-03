import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/about", "/services", "/services/sbcc", "/industries/health", "/work", "/work/fintech-market-entry", "/team", "/insights", "/insights/sbcc-beyond-awareness", "/careers", "/careers/sbcc-programme-officer", "/contact", "/thank-you", "/privacy", "/newsletter/confirm?token=x", "/admin/login", "/does-not-exist"];

for (const route of routes) {
  test(`axe: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });

  test(`one h1: ${route}`, async ({ page }) => {
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


test("public pages: unique title ≤60, description ≤155, canonical, OG image", async ({ page }) => {
  const seen = new Set<string>();
  for (const route of ["/", "/about", "/services", "/services/sbcc", "/industries/health", "/work", "/team", "/insights", "/careers", "/contact"]) {
    const res = await page.goto(route);
    expect(res?.status(), route).toBe(200);
    const title = await page.title();
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(title.length, route).toBeLessThanOrEqual(60);
    expect(desc!.length, route).toBeLessThanOrEqual(155);
    expect(seen.has(title), `duplicate title ${title}`).toBe(false);
    seen.add(title);
    await expect(page.locator('link[rel="canonical"]'), route).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]').first(), route).toHaveAttribute("content", /opengraph-image/);
  }
});

test("company name and contacts are consistent", async ({ page }) => {
  await page.goto("/contact");
  const text = await page.locator("body").innerText();
  expect(text).toContain("info@accesslineconsultancy.com");
  expect(text).toContain("+254 727 684443");
  expect(text).toContain("10th Floor, Ecobank Towers");
  expect(text).toContain("Accessline Consultancy Limited");
  expect(text).not.toMatch(/Accessline Consultancy Ltd|ACESSLINE|Accessine|@gmail\.com/);
});

test("mobile menu lazy-loads, traps focus, closes on Escape and navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await page.getByRole("button", { name: "Open menu" }).click();
  await dialog.getByRole("link", { name: "Industries" }).click();
  await expect(page).toHaveURL(/\/industries$/);
  await expect(dialog).toBeHidden();
});

test("FAQ accordion works without JavaScript", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/services/pr-media-relations");
  const q = page.locator("summary").first();
  await q.click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await ctx.close();
});
