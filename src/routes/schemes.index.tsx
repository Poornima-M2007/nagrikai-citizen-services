import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, Landmark, Loader2, MapPin, RotateCcw, Search, SearchX, Inbox } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHeader } from "@/components/common";
import { STATES } from "@/data/sample-data";
import { filterDbSchemes, schemesQuery } from "@/lib/gov-data";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/schemes/")({
  head: () => ({
    meta: [
      { title: "Explore Government Schemes — NagrikAI" },
      { name: "description", content: "Search and filter government schemes by state, category and beneficiary type." },
      { property: "og:title", content: "Explore Government Schemes — NagrikAI" },
      { property: "og:description", content: "Find schemes that may fit you, with eligibility and required documents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Schemes,
});

const EMPTY = { q: "", level: "", state: "", category: "", beneficiary: "" };

function Schemes() {
  const { t } = useI18n();
  const [f, setF] = useState(EMPTY);
  const { data, isLoading, error, refetch } = useQuery(schemesQuery);
  const all = data ?? [];
  const results = useMemo(() => filterDbSchemes(all, f), [all, f]);
  const unique = (k: "category" | "beneficiary") => [...new Set(all.map((s) => s[k]))].sort();
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const selectCls = "h-11 w-full rounded-xl border bg-card px-3 text-sm";

  return (
    <>
      <PageHeader eyebrow={t("quick.schemes")} title={t("nav.schemes")} description="Search by keyword and narrow down by government level, state, category and who the scheme is for." />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-3 rounded-2xl border bg-card p-4 shadow-soft md:grid-cols-6">
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
        {isLoading ? (
          <div className="mt-10 flex items-center justify-center gap-2 text-muted-foreground"><Loader2 className="size-5 animate-spin" /> Loading schemes…</div>
        ) : error ? (
          <div className="mt-6"><EmptyState icon={AlertTriangle} title="Could not load schemes" description={(error as Error).message} action={<Button variant="soft" onClick={() => refetch()}>Try again</Button>} /></div>
        ) : all.length === 0 ? (
          <div className="mt-6"><EmptyState icon={Inbox} title="No verified schemes yet" description="Scheme information is added only after it is checked against official government sources. Please check back soon." /></div>
        ) : (
          <>
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
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {s.level === "Central" ? <Landmark className="size-3" /> : <MapPin className="size-3" />} {s.level === "Central" ? "Central" : s.state}
                      </span>
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">{s.category}</span>
                    </div>
                    <h2 className="mt-4 text-lg font-semibold">{s.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                    <dl className="mt-4 space-y-2 text-sm">
                      {s.eligibilitySummary && <div><dt className="font-medium">Eligibility</dt><dd className="text-muted-foreground">{s.eligibilitySummary}</dd></div>}
                      {s.benefits && <div><dt className="font-medium">Benefits</dt><dd className="text-muted-foreground">{s.benefits}</dd></div>}
                    </dl>
                    <Button asChild variant="soft" className="mt-6 self-start">
                      <Link to="/schemes/$schemeId" params={{ schemeId: s.id }}>View details <ArrowRight /></Link>
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
