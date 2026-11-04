import { describe, expect, it } from "vitest";
import { filterDbSchemes, filterUpdates, type DbScheme, type DbUpdate } from "@/lib/gov-data";

const base = { eligibilitySummary: null, benefits: null, eligibility: [], documents: [], applicationSteps: [], officialUrl: null, source: "x", lastVerified: null };
const schemes: DbScheme[] = [
  { ...base, id: "a", name: "Farmer Support", level: "Central", state: null, category: "Agriculture", beneficiary: "Farmers", description: "income aid" },
  { ...base, id: "b", name: "Girl Scholarship", level: "State", state: "Karnataka", category: "Education", beneficiary: "Students", description: "college fees" },
];
const none = { q: "", level: "", state: "", category: "", beneficiary: "" };

describe("scheme filters", () => {
  it("searches name and description", () => {
    expect(filterDbSchemes(schemes, { ...none, q: "college" }).map((s) => s.id)).toEqual(["b"]);
    expect(filterDbSchemes(schemes, { ...none, q: "farmer" }).map((s) => s.id)).toEqual(["a"]);
  });
  it("filters by level, state, category and beneficiary", () => {
    expect(filterDbSchemes(schemes, { ...none, level: "Central" }).map((s) => s.id)).toEqual(["a"]);
    expect(filterDbSchemes(schemes, { ...none, state: "Karnataka" }).map((s) => s.id)).toEqual(["b"]);
    expect(filterDbSchemes(schemes, { ...none, category: "Agriculture", beneficiary: "Students" })).toEqual([]);
  });
  it("searches category, beneficiary and state keywords", () => {
    expect(filterDbSchemes(schemes, { ...none, q: "education" }).map((s) => s.id)).toEqual(["b"]);
    expect(filterDbSchemes(schemes, { ...none, q: "students" }).map((s) => s.id)).toEqual(["b"]);
    expect(filterDbSchemes(schemes, { ...none, q: "karnataka" }).map((s) => s.id)).toEqual(["b"]);
  });
});

describe("update filters", () => {
  const u: DbUpdate[] = [
    { id: "1", title: "Deadline extended", summary: "filing", category: "Tax", state: null, officialUrl: null, source: "s", publishedOn: "2026-01-01", lastVerified: null },
    { id: "2", title: "New portal", summary: "health", category: "Health", state: null, officialUrl: null, source: "s", publishedOn: "2026-01-02", lastVerified: null },
  ];
  it("filters by category and keyword", () => {
    expect(filterUpdates(u, "", "Tax").map((x) => x.id)).toEqual(["1"]);
    expect(filterUpdates(u, "portal", "All").map((x) => x.id)).toEqual(["2"]);
  });
});
