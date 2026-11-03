import { z } from "zod";

z.config({ jitless: true });

export { CV_MAX_BYTES, CV_TYPES, checkCvFile } from "./cv";

/** Text fields of a job application (the CV is an optional multipart file, checked separately). */
export const applicationSchema = z.object({
  jobSlug: z.string().min(1),
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.email("Enter a valid email").max(254),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  linkedinUrl: z.url("Enter a full URL, e.g. https://linkedin.com/in/you").max(300).optional().or(z.literal("")),
  coverNote: z.string().trim().max(3000).optional(),
  turnstileToken: z.string().optional(),
  /** honeypot */
  website: z.string().max(500).optional(),
});
