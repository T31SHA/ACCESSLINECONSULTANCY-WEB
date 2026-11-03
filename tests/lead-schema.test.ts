import { describe, expect, it } from "vitest";
import { leadPayloadSchema, leadSchema, shortLeadSchema } from "@/lib/lead-schema";

const valid = {
  serviceInterest: ["sbcc"], organisation: "Org", industry: "health", budgetBand: "2m_5m", timeline: "asap",
  fullName: "Jane Doe", email: "jane@example.com", phone: "+254 712 345 678", consent: true,
};

describe("leadSchema", () => {
  it("accepts a complete lead", () => expect(leadSchema.safeParse(valid).success).toBe(true));
  it("requires consent", () => expect(leadSchema.safeParse({ ...valid, consent: false }).success).toBe(false));
  it("requires at least one service", () => expect(leadSchema.safeParse({ ...valid, serviceInterest: [] }).success).toBe(false));
  it("rejects bad phone numbers", () => expect(leadSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false));
  it("allows empty optional phone", () => expect(leadSchema.safeParse({ ...valid, phone: "" }).success).toBe(true));
});

describe("shortLeadSchema", () => {
  it("requires a meaningful message", () =>
    expect(shortLeadSchema.safeParse({ fullName: "Jo Bo", email: "a@b.co", organisation: "Org", message: "hi", consent: true }).success).toBe(false));
});

describe("leadPayloadSchema", () => {
  it("defaults meta", () => expect(leadPayloadSchema.parse({ variant: "short", data: {} }).meta).toEqual({}));
});
