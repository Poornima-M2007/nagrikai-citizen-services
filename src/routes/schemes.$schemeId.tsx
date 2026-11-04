import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, BookmarkCheck, CalendarCheck, CheckCircle2, ExternalLink, FileCheck2, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Notice, SampleBadge } from "@/components/common";
import { SAMPLE_SCHEMES } from "@/data/sample-data";
import { useSavedSchemes } from "@/lib/saved-schemes";

export const Route = createFileRoute("/schemes/$schemeId")({
  loader: ({ params }) => {
    const scheme = SAMPLE_SCHEMES.find((s) => s.id === params.schemeId);
    if (!scheme) throw notFound();
    return { scheme };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.scheme.name} — NagrikAI` },
          { name: "description", content: loaderData.scheme.description },
          { property: "og:title", content: `${loaderData.scheme.name} — NagrikAI` },
          { property: "og:description", content: loaderData.scheme.description },
        ]
      : [{ title: "Scheme unavailable — NagrikAI" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-primary">Scheme not found</h1>
      <Button asChild variant="soft" className="mt-6"><Link to="/schemes">Back to schemes</Link></Button>
    </div>
  ),
  component: SchemeDetail,
});

function SchemeDetail() {
  const { scheme: s } = Route.useLoaderData();
  const { isSaved, toggle, signedIn, pending } = useSavedSchemes();
  const navigate = useNavigate();
  const onSave = async () => {
    if (!signedIn) { toast("Please log in to save schemes"); navigate({ to: "/auth" }); return; }
    try { const now = await toggle(s.id); toast.success(now ? "Saved to your account" : "Removed from saved"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not update saved schemes"); }
  };
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const saved = isSaved(s.id);
  const metCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/schemes" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"><ArrowLeft className="size-4" /> All schemes</Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2"><SampleBadge /><span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{s.level === "Central" ? "Central Government" : `${s.state} Government`}</span><span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">{s.category}</span></div>
          <h1 className="mt-3 text-3xl font-bold text-primary md:text-4xl">{s.name}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{s.description}</p>
        </div>
        <Button variant={saved ? "teal" : "soft"} onClick={onSave} disabled={pending}>
          {saved ? <BookmarkCheck /> : <Bookmark />} {saved ? "Saved" : "Save scheme"}
        </Button>
      </div>

      <div className="mt-8"><Notice tone="warn">This is a sample entry. Eligibility, documents and links shown here are placeholders, not real government requirements.</Notice></div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><CheckCircle2 className="size-5 text-accent" /> Eligibility checklist</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tick what applies to you. This is a guide, not an official decision.</p>
          <ul className="mt-4 space-y-2">
            {s.eligibility.map((e, i) => (
              <li key={i}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 hover:bg-secondary/60">
                  <input type="checkbox" className="mt-1 size-4 accent-[var(--accent)]" checked={!!checked[i]} onChange={(ev) => setChecked({ ...checked, [i]: ev.target.checked })} />
                  <span className="text-sm">{e}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-medium" aria-live="polite">{metCount} of {s.eligibility.length} conditions ticked</p>
        </section>
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><FileCheck2 className="size-5 text-accent" /> Required documents</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {s.documents.map((d) => <li key={d} className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2.5"><span className="size-1.5 rounded-full bg-saffron" />{d}</li>)}
          </ul>
          <div className="mt-6 space-y-1.5 text-sm text-muted-foreground">
            <p className="flex gap-2"><Info className="size-4 mt-0.5" /> Source: {s.source}</p>
            <p className="flex gap-2"><CalendarCheck className="size-4 mt-0.5" /> Last verified: {s.lastVerified ?? "Not yet verified"}</p>
          </div>
          {s.officialUrl ? (
            <Button asChild variant="hero" className="mt-6"><a href={s.officialUrl} target="_blank" rel="noopener noreferrer">Apply on official website <ExternalLink /></a></Button>
          ) : (
            <Button variant="soft" className="mt-6" disabled>Official link pending verification</Button>
          )}
        </section>
      </div>
    </div>
  );
}
