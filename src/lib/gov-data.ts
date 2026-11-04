import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Verified scheme and update records live in the public `schemes` and
// `government_updates` tables (public read, no client writes).
export type DbScheme = {
  id: string;
  name: string;
  level: string;
  state: string | null;
  category: string;
  beneficiary: string;
  description: string;
  eligibilitySummary: string | null;
  benefits: string | null;
  eligibility: string[];
  documents: string[];
  applicationSteps: string[];
  officialUrl: string | null;
  source: string;
  lastVerified: string | null;
};

export type DbUpdate = {
  id: string;
  title: string;
  summary: string;
  category: string;
  state: string | null;
  officialUrl: string | null;
  source: string;
  publishedOn: string;
  lastVerified: string | null;
};

export type SchemeFilters = { q: string; level: string; state: string; category: string; beneficiary: string };

export function filterDbSchemes(list: DbScheme[], f: SchemeFilters) {
  const q = f.q.trim().toLowerCase();
  return list.filter(
    (s) =>
      (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) &&
      (!f.level || s.level === f.level) &&
      (!f.state || s.state === f.state) &&
      (!f.category || s.category === f.category) &&
      (!f.beneficiary || s.beneficiary === f.beneficiary),
  );
}

export function filterUpdates(list: DbUpdate[], q: string, cat: string) {
  const t = q.trim().toLowerCase();
  return list.filter(
    (u) => (cat === "All" || u.category === cat) && (!t || u.title.toLowerCase().includes(t) || u.summary.toLowerCase().includes(t)),
  );
}

type SchemeRow = {
  id: string; name: string; level: string; state: string | null; category: string; beneficiary: string;
  description: string; eligibility_summary: string | null; benefits: string | null; eligibility: string[];
  documents: string[]; application_steps: string[]; official_url: string | null; source: string; last_verified: string | null;
};
const mapScheme = (r: SchemeRow): DbScheme => ({
  id: r.id, name: r.name, level: r.level, state: r.state, category: r.category, beneficiary: r.beneficiary,
  description: r.description, eligibilitySummary: r.eligibility_summary, benefits: r.benefits,
  eligibility: r.eligibility ?? [], documents: r.documents ?? [], applicationSteps: r.application_steps ?? [],
  officialUrl: r.official_url, source: r.source, lastVerified: r.last_verified,
});

export const schemesQuery = queryOptions({
  queryKey: ["schemes"],
  queryFn: async () => {
    const { data, error } = await supabase.from("schemes").select("*").order("name");
    if (error) throw error;
    return (data as SchemeRow[]).map(mapScheme);
  },
});

export const schemeQuery = (id: string) =>
  queryOptions({
    queryKey: ["schemes", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("schemes").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapScheme(data as SchemeRow) : null;
    },
  });

export const updatesQuery = queryOptions({
  queryKey: ["government-updates"],
  queryFn: async () => {
    const { data, error } = await supabase.from("government_updates").select("*").order("published_on", { ascending: false });
    if (error) throw error;
    return data.map((r) => ({
      id: r.id, title: r.title, summary: r.summary, category: r.category, state: r.state,
      officialUrl: r.official_url, source: r.source, publishedOn: r.published_on, lastVerified: r.last_verified,
    })) as DbUpdate[];
  },
});
