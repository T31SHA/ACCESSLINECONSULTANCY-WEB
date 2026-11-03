import { z } from "zod";

export const budgetBands = ["under_500k", "500k_2m", "2m_5m", "5m_plus", "undecided"] as const;
export const timelines = ["asap", "1_3_months", "3_6_months", "exploring"] as const;

export const budgetLabels: Record<(typeof budgetBands)[number], string> = {
  under_500k: "Under KES 500K (≈ $4K)",
  "500k_2m": "KES 500K – 2M ($4K – 15K)",
  "2m_5m": "KES 2M – 5M ($15K – 40K)",
  "5m_plus": "KES 5M+ ($40K+)",
  undecided: "Not sure yet",
};
export const timelineLabels: Record<(typeof timelines)[number], string> = {
  asap: "As soon as possible",
  "1_3_months": "1–3 months",
  "3_6_months": "3–6 months",
  exploring: "Just exploring",
};

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number, e.g. +254 712 345 678");

/** Full multi-step lead (contact page). Steps validate subsets of this schema. */
export const leadSchema = z.object({
  serviceInterest: z.array(z.string()).min(1, "Choose at least one service"),
  organisation: z.string().trim().min(2, "Enter your organisation").max(160),
  industry: z.string().min(1, "Choose a sector"),
  budgetBand: z.enum(budgetBands, { message: "Choose a budget range" }),
  timeline: z.enum(timelines, { message: "Choose a timeline" }),
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.email("Enter a valid email address").max(254),
  phone: phone.optional().or(z.literal("")),
  role: z.string().trim().max(120).optional(),
  message: z.string().trim().max(4000).optional(),
  consent: z.literal(true, { message: "Please accept the privacy policy to continue" }),
  consentMarketing: z.boolean().optional(),
});

/** Home-page short form: posts to the same endpoint. */
export const shortLeadSchema = z.object({
  fullName: leadSchema.shape.fullName,
  email: leadSchema.shape.email,
  organisation: leadSchema.shape.organisation,
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(4000),
  consent: leadSchema.shape.consent,
});

export const leadStepFields = [
  ["serviceInterest"],
  ["organisation", "industry", "budgetBand", "timeline"],
  ["fullName", "email", "phone", "message", "consent"],
] as const;

/** Server payload: either form variant + tracking meta + Turnstile token. */
export const leadPayloadSchema = z.object({
  variant: z.enum(["full", "short"]),
  data: z.unknown(),
  meta: z
    .object({
      sourcePage: z.string().max(300).optional(),
      utmSource: z.string().max(120).optional(),
      utmMedium: z.string().max(120).optional(),
      utmCampaign: z.string().max(120).optional(),
      referrer: z.string().max(500).optional(),
    })
    .default({}),
  turnstileToken: z.string().optional(),
  /** honeypot — any value marks the submission as a bot (handled in the route) */
  website: z.string().max(500).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type ShortLeadInput = z.infer<typeof shortLeadSchema>;
