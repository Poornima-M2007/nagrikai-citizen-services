import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Landmark, MapPin, RotateCcw, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, Notice, PageHeader, SampleBadge } from "@/components/common";
import { SAMPLE_SCHEMES, STATES, filterSchemes } from "@/data/sample-data";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/schemes/")({
  head: () => ({
    meta: [
      { title: "Explore Government Schemes — NagrikAI" },
      { name: "description", content: "Search and filter government schemes by state, category and beneficiary type." },
      { property: "og:title", content: "Explore Government Schemes — NagrikAI" },
      { property: "og:description", content: "Find schemes that may fit you, with eligibility and required documents." },
    ],
  }),
  component: Schemes,
});

const EMPTY = { q: "", level: "", state: "", category: "", beneficiary: "" };
const unique = (k: "category" | "beneficiary") => [...new Set(SAMPLE_SCHEMES.map((s) => s[k]))].sort();

function Schemes() {
  const { t } = useI18n();
  const [f, setF] = useState(EMPTY);
  const results = useMemo(() => filterSchemes(SAMPLE_SCHEMES, f), [f]);
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const selectCls = "h-11 w-full rounded-xl border bg-card px-3 text-sm";

  return (
    <>
      <PageHeader eyebrow={t("quick.schemes")} title={t("nav.schemes")} description="Search by keyword and narrow down by government level, state, category and who the scheme is for." />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Notice tone="warn">
          The schemes below are clearly labelled <strong>sample entries</strong> for layout only. Verified scheme information will be loaded from the database once connected.
        </Notice>
        <div className="mt-6 grid gap-3 rounded-2xl border bg-card p-4 shadow-soft md:grid-cols-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
            <Input aria-label={t("common.search")} placeholder="Search schemes…" value={f.q} onChange={set("q")} className="h-11 rounded-xl pl-9" />
          </div>
          <select aria-label="Government level" className={selectCls} value={f.level} onChange={set("level")}>
            <option value="">Central & State</option><option value="Central">Central</option><option value="State">State</option>
          </select>
          <select aria-label="State" className={selectCls} value={f.state} onChange={set("state")}>
            <option value="">All states</option>{STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select aria-label="Category" className={selectCls} value={f.category} onChange={set("category")}>
            <option value="">All categories</option>{unique("category").map((s) => <option key={s}>{s}</option>)}
          </select>
          <select aria-label="Beneficiary" className={selectCls} value={f.beneficiary} onChange={set("beneficiary")}>
            <option value="">All beneficiaries</option>{unique("beneficiary").map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground" aria-live="polite">{results.length} result{results.length !== 1 && "s"}</p>
          {JSON.stringify(f) !== JSON.stringify(EMPTY) && (
            <Button variant="ghost" size="sm" onClick={() => setF(EMPTY)}><RotateCcw /> Clear filters</Button>
          )}
        </div>
        {results.length === 0 ? (
          <div className="mt-4"><EmptyState icon={SearchX} title="No schemes match" description="Try a different keyword or clear some filters." action={<Button variant="soft" onClick={() => setF(EMPTY)}>Clear filters</Button>} /></div>
        ) : (
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {results.map((s) => (
              <article key={s.id} className="flex flex-col rounded-2xl border bg-card p-6 shadow-soft transition hover:shadow-elegant">
                <div className="flex flex-wrap items-center gap-2">
                  <SampleBadge />
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {s.level === "Central" ? <Landmark className="size-3" /> : <MapPin className="size-3" />} {s.level === "Central" ? "Central" : s.state}
                  </span>
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">{s.category}</span>
                </div>
                <h2 className="mt-4 text-lg font-semibold">{s.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div><dt className="font-medium">Eligibility</dt><dd className="text-muted-foreground">{s.eligibilitySummary}</dd></div>
                  <div><dt className="font-medium">Benefits</dt><dd className="text-muted-foreground">{s.benefits}</dd></div>
                </dl>
                <Button asChild variant="soft" className="mt-6 self-start">
                  <Link to="/schemes/$schemeId" params={{ schemeId: s.id }}>View details <ArrowRight /></Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
