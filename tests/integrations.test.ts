import { createHmac, randomBytes, scryptSync } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toCsv } from "@/lib/admin/leads";
import { calLinkForLead, verifyCalSignature } from "@/lib/integrations/cal";
import { verifyAdminPassword } from "@/lib/server/password";

describe("toCsv", () => {
  const row = (o: Record<string, unknown>) => ({ id: "1", createdAt: new Date("2026-01-01T00:00:00Z"), ...o });
  const body = (csv: string) => csv.replace(/^﻿/, "").trimEnd().split("\r\n");

  it("starts with a BOM and a fixed header", () => {
    const csv = toCsv([]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(body(csv)[0]!.split(",")[0]).toBe("id");
  });
  it("escapes quotes, commas and newlines (RFC 4180)", () => {
    const line = body(toCsv([row({ organisation: 'A "B", C', message: "x\ny" })]))[1]!;
    expect(line).toContain('"A ""B"", C"');
    expect(toCsv([row({ message: "x\ny" })])).toContain('"x\ny"');
  });
  it("neutralises spreadsheet formulas", () => {
    for (const evil of ["=1+1", "+cmd", "-2", "@SUM(A1)"]) expect(toCsv([row({ fullName: evil })])).toContain(`'${evil}`);
  });
  it("joins arrays and serialises dates", () => {
    const line = body(toCsv([row({ serviceInterest: ["sbcc", "events"] })]))[1]!;
    expect(line).toContain("sbcc; events");
    expect(line).toContain("2026-01-01T00:00:00.000Z");
  });
});

describe("Cal.com", () => {
  const secret = "s3cret";
  const sign = (b: string, s = secret) => createHmac("sha256", s).update(b).digest("hex");
  it("accepts a valid signature and rejects tampering", () => {
    const b = JSON.stringify({ triggerEvent: "BOOKING_CREATED" });
    expect(verifyCalSignature(b, sign(b), secret)).toBe(true);
    expect(verifyCalSignature(b + " ", sign(b), secret)).toBe(false);
    expect(verifyCalSignature(b, sign(b, "other"), secret)).toBe(false);
    expect(verifyCalSignature(b, null, secret)).toBe(false);
    expect(verifyCalSignature(b, "short", secret)).toBe(false);
  });
  it("pre-fills booking links with lead metadata", () => {
    const u = new URL(calLinkForLead("https://cal.com/acc/intro", { id: "abc", name: "Jane Doe", email: "j@x.co" }));
    expect(u.searchParams.get("metadata[leadId]")).toBe("abc");
    expect(u.searchParams.get("email")).toBe("j@x.co");
    expect(u.searchParams.get("name")).toBe("Jane Doe");
  });
});

describe("verifyAdminPassword", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("verifies scrypt hashes", async () => {
    const salt = randomBytes(16);
    vi.stubEnv("ADMIN_PASSWORD_HASH", `scrypt:${salt.toString("hex")}:${scryptSync("correct horse battery", salt, 64).toString("hex")}`);
    expect(await verifyAdminPassword("correct horse battery")).toBe(true);
    expect(await verifyAdminPassword("wrong")).toBe(false);
  });
  it("rejects malformed hashes", async () => {
    vi.stubEnv("ADMIN_PASSWORD_HASH", "bcrypt:nope");
    expect(await verifyAdminPassword("x")).toBe(false);
  });
  it("falls back to plain ADMIN_PASSWORD only without a hash", async () => {
    vi.stubEnv("ADMIN_PASSWORD_HASH", "");
    vi.stubEnv("ADMIN_PASSWORD", "dev-only");
    expect(await verifyAdminPassword("dev-only")).toBe(true);
    expect(await verifyAdminPassword("dev-onlyx")).toBe(false);
  });
  it("denies everything when nothing is configured", async () => {
    vi.stubEnv("ADMIN_PASSWORD_HASH", "");
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(await verifyAdminPassword("")).toBe(false);
  });
});
