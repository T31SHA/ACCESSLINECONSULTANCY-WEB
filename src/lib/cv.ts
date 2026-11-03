/** CV upload constraints (shared by the client form and the presign route; no zod import). */
export const CV_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
} as const;
export const CV_MAX_BYTES = 5 * 1024 * 1024;
