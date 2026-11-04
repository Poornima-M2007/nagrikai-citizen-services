import { describe, expect, it } from "vitest";
import { FIELD_NAMES, groundAnalysis, matchesDocumentSignature, validateDocument, validateReview, type ExtractedPage } from "@/lib/document-rules";
const pages: ExtractedPage[] = [{ page: 1, text: "State: Karnataka. Annual family income: INR 120000.", method: "digital", warning: null }];
describe("document intelligence rules", () => {
  it("accepts supported PDF JPG PNG files and rejects empty or oversized files", () => {
    for (const type of ["application/pdf", "image/jpeg", "image/png"]) expect(validateDocument({ type, size: 1024 })).toBeNull();
    expect(validateDocument({ type: "application/pdf", size: 10 * 1024 * 1024 })).toBeNull();
    expect(validateDocument({ type: "application/pdf", size: 10 * 1024 * 1024 + 1 })).not.toBeNull();
    expect(validateDocument({ type: "image/png", size: 0 })).not.toBeNull();
  });
  it("rejects a renamed invalid PDF by its file contents", () => {
    expect(matchesDocumentSignature(new TextEncoder().encode("not a PDF"), "application/pdf")).toBe(false);
    expect(matchesDocumentSignature(new TextEncoder().encode("%PDF-1.7"), "application/pdf")).toBe(true);
  });
  it("retains fields only when their source page and exact quote exist", () => {
    const result = groundAnalysis(pages, { document_type: "certificate", explanation: "", dates: [], details: [], fields: [
      { name: "State", value: "Karnataka", page: 1, confidence: "high", evidence: "State: Karnataka" },
      { name: "Age", value: "22", page: 2, confidence: "high", evidence: "Age: 22" },
      { name: "Category", value: "SC", page: 1, confidence: "high", evidence: "Category: SC" },
    ] });
    expect(result.fields).toEqual([{ name: "State", value: "Karnataka", page: 1, confidence: "high", evidence: "State: Karnataka" }]);
  });
  it("requires explicit review of every field including missing details", () => {
    const fields = FIELD_NAMES.map((name) => ({ name, value: "", confirmed: true }));
    expect(validateReview(fields)).toHaveLength(9);
    expect(() => validateReview(fields.slice(1))).toThrow();
    expect(() => validateReview(fields.map((f, i) => i === 0 ? { ...f, confirmed: false } : f))).toThrow();
    expect(() => validateReview(fields.map((f) => ({ ...f, name: "State" })))).toThrow();
  });
});