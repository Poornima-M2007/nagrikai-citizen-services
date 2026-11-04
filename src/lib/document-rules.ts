import { z } from "zod";

export const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
export function validateDocument(file: { type: string; size: number }): string | null {
  if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) return "Unsupported file type. Please upload a PDF, PNG, JPG or WEBP file.";
  if (file.size > MAX_DOCUMENT_BYTES) return "File is larger than 10 MB. Please upload a smaller file.";
  if (file.size === 0) return "This file is empty.";
  return null;
}
export function matchesDocumentSignature(bytes: Uint8Array, mime: string) {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (mime === "application/pdf") return ascii(0, 5) === "%PDF-";
  if (mime === "image/png") return bytes[0] === 137 && ascii(1, 4) === "PNG";
  if (mime === "image/jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  return mime === "image/webp" && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
}
export const pageSchema = z.object({ page: z.number().int().positive(), text: z.string().max(100000), method: z.enum(["digital", "vision_ocr"]), warning: z.string().nullable() });
export type ExtractedPage = z.infer<typeof pageSchema>;
export const FIELD_NAMES = ["Date of birth", "Age", "State", "District", "Annual family income", "Educational qualification", "Current student status", "Occupation", "Category"] as const;
export const fieldSchema = z.object({ name: z.enum(FIELD_NAMES), value: z.string().max(500), page: z.number().int().positive(), confidence: z.enum(["high", "uncertain"]), evidence: z.string().min(1).max(1000) });
export type ExtractedField = z.infer<typeof fieldSchema>;
export const detailSchema = z.object({ text: z.string().max(3000), page: z.number().int().positive(), evidence: z.string().min(1).max(1000) });
export const analysisSchema = z.object({ document_type: z.string().nullable(), explanation: z.string().max(20000), fields: z.array(fieldSchema).max(50), dates: z.array(detailSchema).max(100), details: z.array(detailSchema).max(100) });
export type DocumentAnalysis = z.infer<typeof analysisSchema>;
const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
export function hasEvidence(pages: ExtractedPage[], item: { page: number; evidence: string }) {
  const page = pages.find((p) => p.page === item.page);
  return !!page && normalize(page.text).includes(normalize(item.evidence));
}
export function groundAnalysis(pages: ExtractedPage[], analysis: DocumentAnalysis) {
  return { ...analysis, fields: analysis.fields.filter((f) => hasEvidence(pages, f)), dates: analysis.dates.filter((d) => hasEvidence(pages, d)), details: analysis.details.filter((d) => hasEvidence(pages, d)) };
}
export const reviewSchema = z.array(z.object({ name: z.enum(FIELD_NAMES), value: z.string().trim().max(500), confirmed: z.literal(true) })).length(FIELD_NAMES.length);
export function validateReview(value: unknown) {
  const fields = reviewSchema.parse(value);
  if (new Set(fields.map((f) => f.name)).size !== FIELD_NAMES.length) throw new Error("Review every field once.");
  return fields;
}