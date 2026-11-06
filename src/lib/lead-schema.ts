import { z } from "zod";
import { budgetBands, timelines } from "./lead-options";

// Constants live in ./lead-options (no Zod) so client components can import them without the validator.
export { budgetBands, budgetLabels, leadStepFields, timelineLabels, timelines } from "./lead-options";

// No eval-based JIT: keeps the strict CSP (no 'unsafe-eval') violation-free in the browser.
z.config({ jitless: true });

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
  /** honeypot: any value marks the submission as a bot (handled in the route) */
  website: z.string().max(500).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type ShortLeadInput = z.infer<typeof shortLeadSchema>;
