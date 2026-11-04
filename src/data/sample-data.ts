// SAMPLE DATA — for UI development only.
// These are NOT real government schemes or announcements. Names, eligibility
// rules and dates are illustrative placeholders. Official links are left
// empty on purpose and must be replaced with verified data from the backend.

export type Scheme = {
  id: string;
  name: string;
  level: "Central" | "State";
  state?: string;
  category: string;
  beneficiary: string;
  description: string;
  eligibilitySummary: string;
  benefits: string;
  eligibility: string[];
  documents: string[];
  officialUrl: string | null;
  source: string;
  lastVerified: string | null;
  isSample: true;
};

export const SAMPLE_SCHEMES: Scheme[] = [
  {
    id: "sample-farmer-income-support",
    name: "Sample: Farmer Income Support",
    level: "Central",
    category: "Agriculture",
    beneficiary: "Farmers",
    description: "Illustrative example of a direct income support scheme for small farming households.",
    eligibilitySummary: "Example: small and marginal landholding families.",
    benefits: "Example: periodic direct bank transfer.",
    eligibility: ["Example: Indian citizen", "Example: owns cultivable land", "Example: has an active bank account"],
    documents: ["Identity proof", "Land record", "Bank account details"],
    officialUrl: null,
    source: "Placeholder — pending verification",
    lastVerified: null,
    isSample: true,
  },
  {
    id: "sample-girl-student-scholarship",
    name: "Sample: Girl Student Scholarship",
    level: "State",
    state: "Karnataka",
    category: "Education",
    beneficiary: "Students",
    description: "Illustrative example of a state scholarship for girl students in higher education.",
    eligibilitySummary: "Example: girl students enrolled in recognised colleges.",
    benefits: "Example: annual tuition assistance.",
    eligibility: ["Example: resident of the state", "Example: enrolled in a recognised institution", "Example: family income below a set limit"],
    documents: ["Identity proof", "Admission letter", "Income certificate", "Residence certificate"],
    officialUrl: null,
    source: "Placeholder — pending verification",
    lastVerified: null,
    isSample: true,
  },
  {
    id: "sample-senior-pension",
    name: "Sample: Senior Citizen Pension",
    level: "Central",
    category: "Social Welfare",
    beneficiary: "Senior Citizens",
    description: "Illustrative example of a monthly pension for elderly citizens.",
    eligibilitySummary: "Example: citizens above a set age from low-income households.",
    benefits: "Example: monthly pension amount.",
    eligibility: ["Example: above a minimum age", "Example: low-income household"],
    documents: ["Age proof", "Identity proof", "Bank account details"],
    officialUrl: null,
    source: "Placeholder — pending verification",
    lastVerified: null,
    isSample: true,
  },
  {
    id: "sample-health-cover",
    name: "Sample: Family Health Cover",
    level: "Central",
    category: "Health",
    beneficiary: "Families",
    description: "Illustrative example of a hospital insurance cover for eligible families.",
    eligibilitySummary: "Example: families listed in a socio-economic database.",
    benefits: "Example: cashless hospital treatment up to a limit.",
    eligibility: ["Example: family listed in the eligible database"],
    documents: ["Identity proof", "Family / ration card"],
    officialUrl: null,
    source: "Placeholder — pending verification",
    lastVerified: null,
    isSample: true,
  },
  {
    id: "sample-small-business-loan",
    name: "Sample: Small Business Loan",
    level: "State",
    state: "Tamil Nadu",
    category: "Employment",
    beneficiary: "Entrepreneurs",
    description: "Illustrative example of a subsidised loan for first-time entrepreneurs.",
    eligibilitySummary: "Example: first-generation entrepreneurs within an age band.",
    benefits: "Example: loan with partial interest subsidy.",
    eligibility: ["Example: resident of the state", "Example: first business venture", "Example: project report submitted"],
    documents: ["Identity proof", "Project report", "Educational certificate", "Bank statement"],
    officialUrl: null,
    source: "Placeholder — pending verification",
    lastVerified: null,
    isSample: true,
  },
  {
    id: "sample-housing-assistance",
    name: "Sample: Rural Housing Assistance",
    level: "State",
    state: "Telangana",
    category: "Housing",
    beneficiary: "Families",
    description: "Illustrative example of financial help for building a house in rural areas.",
    eligibilitySummary: "Example: houseless rural families.",
    benefits: "Example: construction grant in instalments.",
    eligibility: ["Example: no pucca house owned", "Example: rural resident"],
    documents: ["Identity proof", "Residence proof", "Bank account details"],
    officialUrl: null,
    source: "Placeholder — pending verification",
    lastVerified: null,
    isSample: true,
  },
];

export type Update = {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string | null;
  sourceUrl: string | null;
  sourceName: string;
  isSample: true;
};

export const SAMPLE_UPDATES: Update[] = [
  { id: "u1", title: "Sample: Application window opens for a scholarship", summary: "Placeholder layout for a scholarship announcement. Real announcements will appear once an official feed is connected.", category: "Education", publishedAt: null, sourceUrl: null, sourceName: "Pending official source", isSample: true },
  { id: "u2", title: "Sample: Deadline reminder for document update", summary: "Placeholder layout for a deadline notification.", category: "Documents", publishedAt: null, sourceUrl: null, sourceName: "Pending official source", isSample: true },
  { id: "u3", title: "Sample: New health camp schedule", summary: "Placeholder layout for a health notice.", category: "Health", publishedAt: null, sourceUrl: null, sourceName: "Pending official source", isSample: true },
  { id: "u4", title: "Sample: Crop advisory issued", summary: "Placeholder layout for an agriculture advisory.", category: "Agriculture", publishedAt: null, sourceUrl: null, sourceName: "Pending official source", isSample: true },
];

export const STATES = ["Karnataka", "Tamil Nadu", "Telangana", "Andhra Pradesh", "Maharashtra", "Uttar Pradesh"];

export function filterSchemes(
  list: Scheme[],
  f: { q: string; level: string; state: string; category: string; beneficiary: string },
) {
  const q = f.q.trim().toLowerCase();
  return list.filter(
    (s) =>
      (!q || `${s.name} ${s.description} ${s.category}`.toLowerCase().includes(q)) &&
      (!f.level || s.level === f.level) &&
      (!f.state || s.state === f.state) &&
      (!f.category || s.category === f.category) &&
      (!f.beneficiary || s.beneficiary === f.beneficiary),
  );
}
