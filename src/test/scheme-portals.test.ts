import { describe, expect, it } from "vitest";
import records from "../../docs/scheme-connectivity-snapshot-2026-11-04.json";
import original from "../../docs/verified-schemes.json";

describe("official portal expansion", () => {
  it("preserves every existing scheme ID without duplicates", () => {
    expect(records).toHaveLength(12);
    expect(new Set(records.map((r) => r.id)).size).toBe(12);
    expect(records.filter((r) => r.record_type === "scheme").map((r) => r.id).sort()).toEqual(original.map((r) => r.id).sort());
  });
  it("keeps SSP and NSP as portals without universal eligibility or benefits", () => {
    const portals = records.filter((r) => r.record_type === "scholarship_portal");
    expect(portals.map((r) => r.id).sort()).toEqual(["karnataka-ssp-postmatric", "national-scholarship-portal"]);
    for (const r of portals) {
      expect(r.eligibility).toEqual([]);
      expect(r.eligibility_rules).toBeNull();
      expect(r.benefits).toBeNull();
      expect(r.documents).toEqual([]);
      expect(r.category).toBe("Education");
    }
  });
  it("retains a specific PM-KISAN registration destination and uses NSP Students", () => {
    expect(records.find((r) => r.id === "pmkisan")?.official_url).toBe("https://pmkisan.gov.in/RegistrationFormupdated.aspx");
    expect(records.find((r) => r.id === "pmyasasvi")?.official_url).toBe("https://scholarships.gov.in/Students");
  });
  it("does not present Karnataka information or lookup pages as application forms", () => {
    for (const id of ["karnataka-shakti", "karnataka-anna-bhagya", "karnataka-gruha-lakshmi"]) {
      expect(records.find((r) => r.id === id)?.official_url).toBeNull();
    }
    expect(records.find((r) => r.id === "karnataka-anna-bhagya")?.related_links[0]?.kind).toBe("information");
    expect(records.find((r) => r.id === "karnataka-gruha-lakshmi")?.related_links[0]?.kind).toBe("information");
  });
});