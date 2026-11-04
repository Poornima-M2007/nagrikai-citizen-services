import { describe, expect, it } from "vitest";
import { officialGovernmentUrl, officialReferences } from "@/lib/official-links";

describe("official government destinations", () => {
  it("accepts the requested official scholarship destinations", () => {
    expect(officialGovernmentUrl("https://ssp.postmatric.karnataka.gov.in/")).toBe("https://ssp.postmatric.karnataka.gov.in/");
    expect(officialGovernmentUrl("https://scholarships.gov.in/Students")).toBe("https://scholarships.gov.in/Students");
  });
  it("rejects unsafe and unrelated destinations", () => {
    for (const value of ["javascript:alert(1)", "http://pmkisan.gov.in/", "https://pmkisan.gov.in.example.com/", "https://example.com/", "https://user:password@pmkisan.gov.in/", "/schemes", null]) {
      expect(officialGovernmentUrl(value)).toBeNull();
    }
  });
  it("preserves the status-only purpose of Gruha Lakshmi lookup", () => {
    expect(officialReferences([{ label: "Gruha Lakshmi application status", url: "https://sevasindhugs1.karnataka.gov.in/gl-stat-sns/", kind: "status" }])).toEqual([{ label: "Gruha Lakshmi application status", url: "https://sevasindhugs1.karnataka.gov.in/gl-stat-sns/", kind: "status" }]);
    expect(officialReferences([{ label: "Apply", url: "https://example.com", kind: "application" }])).toEqual([]);
  });
});