import { describe, expect, it } from "vitest";
import records from "../../docs/verified-schemes.json";
import { filterDbSchemes, type DbScheme } from "@/lib/gov-data";

const schemes: DbScheme[] = records.map((r) => ({
  id: r.id, name: r.name, level: r.level, state: r.state,
  category: r.category, beneficiary: r.beneficiary, description: r.description,
  eligibilitySummary: r.eligibility_summary, benefits: r.benefits,
  eligibility: r.eligibility, documents: r.documents,
  applicationSteps: r.application_steps, officialUrl: r.official_url,
  source: r.source, lastVerified: r.last_verified,
}));
const empty = { q: "", level: "", state: "", category: "", beneficiary: "" };

describe("verified government scheme import", () => {
  it("contains five Central government schemes", () => {
    expect(filterDbSchemes(schemes, { ...empty, level: "Central" })).toHaveLength(5);
    expect(schemes.filter((s) => s.level === "Central").every((s) => s.state === null)).toBe(true);
  });
  it("contains five Karnataka State government schemes", () => {
    expect(filterDbSchemes(schemes, { ...empty, level: "State", state: "Karnataka" })).toHaveLength(5);
  });
  it("has ten unique records without duplicate names", () => {
    expect(schemes).toHaveLength(10);
    expect(new Set(schemes.map((s) => s.id)).size).toBe(10);
    expect(new Set(schemes.map((s) => s.name)).size).toBe(10);
  });
  it("uses only official government source and application domains", () => {
    for (const s of schemes) {
      for (const value of [s.source, s.officialUrl]) {
        if (value === null) continue;
        const url = new URL(value);
        expect(url.protocol).toBe("https:");
        expect(/\.(gov|nic)\.in$/.test(url.hostname)).toBe(true);
      }
    }
  });
  it("retains the actual review date", () => {
    expect(schemes.map((s) => s.lastVerified)).toEqual(Array(10).fill("2026-11-04"));
  });
  it("finds every imported scheme by its official name", () => {
    for (const s of schemes) {
      expect(filterDbSchemes(schemes, { ...empty, q: s.name }).map((r) => r.id)).toEqual([s.id]);
    }
  });
});