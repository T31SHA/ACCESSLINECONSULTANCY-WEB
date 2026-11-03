import { expect, test } from "@playwright/test";
import { E2E } from "./env";
import { sanitySignature } from "./helpers";

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
