/** Lead-form options and step layout. Zod-free, so client components can import them cheaply. */

export const budgetBands = ["under_500k", "500k_2m", "2m_5m", "5m_plus", "undecided"] as const;
export const timelines = ["asap", "1_3_months", "3_6_months", "exploring"] as const;

export const budgetLabels: Record<(typeof budgetBands)[number], string> = {
  under_500k: "Under KES 500K (≈ $4K)",
  "500k_2m": "KES 500K to 2M ($4K to 15K)",
  "2m_5m": "KES 2M to 5M ($15K to 40K)",
  "5m_plus": "KES 5M+ ($40K+)",
  undecided: "Not sure yet",
};
export const timelineLabels: Record<(typeof timelines)[number], string> = {
  asap: "As soon as possible",
  "1_3_months": "1–3 months",
  "3_6_months": "3–6 months",
  exploring: "Just exploring",
};

/** Fields validated by each step of the multi-step contact form. */
export const leadStepFields = [
  ["serviceInterest"],
  ["organisation", "industry", "budgetBand", "timeline"],
  ["fullName", "email", "phone", "message", "consent"],
] as const;
