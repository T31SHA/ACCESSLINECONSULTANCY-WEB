import { z } from "zod";

export const CV_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
} as const;
export const CV_MAX_BYTES = 5 * 1024 * 1024;

export const applicationSchema = z.object({
  jobSlug: z.string(),
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.email("Enter a valid email").max(254),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  linkedinUrl: z.url("Enter a full URL, e.g. https://linkedin.com/in/you").max(300).optional().or(z.literal("")),
  cvObjectKey: z.string().regex(/^cvs\/[a-z0-9-]+\/[0-9a-f-]{36}\.(pdf|docx)$/),
  coverNote: z.string().trim().max(3000).optional(),
  turnstileToken: z.string().optional(),
});
