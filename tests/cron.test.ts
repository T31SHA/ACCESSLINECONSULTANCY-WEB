import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe("/api/cron/retention auth", () => {
  it("503 when unconfigured, 401 on bad token, 200 skipped without DB", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("CRON_SECRET", "");
    let { GET } = await import("@/app/api/cron/retention/route");
    expect((await GET(new NextRequest("http://x/api/cron/retention"))).status).toBe(503);

    vi.resetModules();
    vi.stubEnv("CRON_SECRET", "abc");
    ({ GET } = await import("@/app/api/cron/retention/route"));
    expect((await GET(new NextRequest("http://x/api/cron/retention", { headers: { authorization: "Bearer nope" } }))).status).toBe(401);
    const ok = await GET(new NextRequest("http://x/api/cron/retention", { headers: { authorization: "Bearer abc" } }));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ ok: true, skipped: "no database" });
  });
});
