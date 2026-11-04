import { describe, expect, it } from "vitest";
import { SAMPLE_SCHEMES, filterSchemes } from "@/data/sample-data";
import { validateDocument } from "@/routes/documents";
import { DICTIONARIES } from "@/i18n/translations";

const none = { q: "", level: "", state: "", category: "", beneficiary: "" };

describe("rules", () => {
  it("filters schemes by state", () => {
    const r = filterSchemes(SAMPLE_SCHEMES, { ...none, state: "Karnataka" });
    expect(r.every((s) => s.state === "Karnataka")).toBe(true);
    expect(r.length).toBe(1);
  });
  it("sample schemes never carry an official URL", () => {
    expect(SAMPLE_SCHEMES.every((s) => s.officialUrl === null)).toBe(true);
  });
  it("rejects documents over 10 MB and non PDF/image types", () => {
    expect(validateDocument({ type: "application/pdf", size: 11 * 1024 * 1024 })).not.toBeNull();
    expect(validateDocument({ type: "text/plain", size: 100 })).not.toBeNull();
    expect(validateDocument({ type: "image/jpeg", size: 100 })).toBeNull();
  });
  it("every language translates every key", () => {
    const keys = Object.keys(DICTIONARIES.en);
    for (const d of Object.values(DICTIONARIES)) expect(Object.keys(d).sort()).toEqual(keys.sort());
  });
});
