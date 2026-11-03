/** CV attachment constraints (shared by the client form and the apply route; no zod import). */
export const CV_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
} as const;
export const CV_MAX_BYTES = 5 * 1024 * 1024;

export type CvCheck = { ok: true; ext: "pdf" | "docx"; contentType: keyof typeof CV_TYPES } | { ok: false; error: string };

/** Accepts by MIME type or extension (some browsers send an empty type for .docx). */
export function checkCvFile(file: { name: string; type: string; size: number }): CvCheck {
  if (file.size > CV_MAX_BYTES) return { ok: false, error: "CV must be 5MB or smaller." };
  const byType = CV_TYPES[file.type as keyof typeof CV_TYPES];
  const byName = /\.pdf$/i.test(file.name) ? "pdf" : /\.docx$/i.test(file.name) ? "docx" : undefined;
  const ext = byType ?? (file.type === "" || file.type === "application/octet-stream" ? byName : undefined);
  if (!ext) return { ok: false, error: "CV must be a PDF or DOCX file." };
  const contentType = ext === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return { ok: true, ext, contentType };
}
