import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, Bookmark, BookmarkCheck, CalendarCheck, CheckCircle2, ExternalLink, FileCheck2, Info, ListOrdered, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common";
import { schemeQuery } from "@/lib/gov-data";
import { useSavedSchemes } from "@/lib/saved-schemes";
import { officialGovernmentUrl } from "@/lib/official-links";

export const Route = createFileRoute("/schemes/$schemeId")({
  head: () => ({
    meta: [
      { title: "Scheme details — NagrikAI" },
      { name: "description", content: "Eligibility, benefits, required documents and how to apply for this government scheme." },
      { property: "og:title", content: "Scheme details — NagrikAI" },
      { property: "og:description", content: "Eligibility, benefits, required documents and how to apply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SchemeDetail,
});

function NotFoundView() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-primary">Scheme not found</h1>
      <Button asChild variant="soft" className="mt-6"><Link to="/schemes">Back to schemes</Link></Button>
    </div>
  );
}

function SchemeDetail() {
  const { schemeId } = Route.useParams();
  const { data: s, isLoading, error, refetch } = useQuery(schemeQuery(schemeId));
  const { isSaved, toggle, signedIn, pending } = useSavedSchemes();
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  if (isLoading) return <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground"><Loader2 className="size-5 animate-spin" /> Loading scheme…</div>;
  if (error) return <div className="mx-auto max-w-xl px-4 py-16"><EmptyState icon={AlertTriangle} title="Could not load scheme" description={(error as Error).message} action={<Button variant="soft" onClick={() => refetch()}>Try again</Button>} /></div>;
  if (!s) return <NotFoundView />;

  const onSave = async () => {
    if (!signedIn) { toast("Please log in to save schemes"); navigate({ to: "/auth" }); return; }
    try { const now = await toggle(s.id); toast.success(now ? "Saved to your account" : "Removed from saved"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not update saved schemes"); }
  };
  const saved = isSaved(s.id);
  const metCount = Object.values(checked).filter(Boolean).length;
  const sourceUrl = officialGovernmentUrl(s.source);
  const isPortal = s.recordType === "scholarship_portal";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <title>{`${s.name} — NagrikAI`}</title>
      <Link to="/schemes" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"><ArrowLeft className="size-4" /> All schemes</Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2"><span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{s.level === "Central" ? "Central Government" : `${s.state} Government`}</span><span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">{s.category}</span><span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{s.beneficiary}</span></div>
          <h1 className="mt-3 text-3xl font-bold text-primary md:text-4xl">{s.name}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{s.description}</p>
          {isPortal && <p className="mt-2 text-sm font-medium text-accent">Scholarship portal · Multiple schemes with separate rules</p>}
        </div>
        <Button variant={saved ? "teal" : "soft"} onClick={onSave} disabled={pending}>
          {saved ? <BookmarkCheck /> : <Bookmark />} {saved ? "Remove saved scheme" : "Save scheme"}
        </Button>
      </div>

      {s.verificationStatus && <div className="mt-6 text-sm text-muted-foreground"><p className="font-medium">{s.verificationStatus === "verified" ? "Verified against official sources" : s.verificationStatus === "partially_verified" ? "Partially verified" : "Pending verification"}</p>{s.dataQualityNotes && <p className="mt-1">{s.dataQualityNotes}</p>}</div>}

      {s.benefits && (
        <section className="mt-8 rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Benefits</h2>
          <p className="mt-2 text-sm text-muted-foreground">{s.benefits}</p>
        </section>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><CheckCircle2 className="size-5 text-accent" /> {isPortal ? "Scheme-specific eligibility" : "Eligibility checklist"}</h2>
          {!isPortal && <p className="mt-1 text-sm text-muted-foreground">Tick what applies to you. This is a guide, not an official decision.</p>}
          {s.eligibility.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">{s.eligibilitySummary ?? "See the official website for eligibility."}</p> : (
            <>
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
            </>
          )}
        </section>
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><FileCheck2 className="size-5 text-accent" /> Required documents</h2>
          {s.documents.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">See the official website for the document list.</p> : (
            <ul className="mt-4 space-y-2 text-sm">
              {s.documents.map((d) => <li key={d} className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2.5"><span className="size-1.5 rounded-full bg-saffron" />{d}</li>)}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><ListOrdered className="size-5 text-accent" /> How to apply</h2>
        {s.applicationSteps.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Follow the steps on the official website.</p> : (
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">{s.applicationSteps.map((st, i) => <li key={i}>{st}</li>)}</ol>
        )}
        <div className="mt-6 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-start gap-2"><Info className="size-4 mt-0.5 shrink-0" />{sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">Official information / source <ExternalLink className="size-3 shrink-0" /></a> : <span className="break-words">Source: {s.source}</span>}</p>
          <p className="flex gap-2"><CalendarCheck className="size-4 mt-0.5" /> Last verified: {s.lastVerified ?? "Not yet verified"}</p>
        </div>
        {s.officialUrl ? (
          <Button asChild variant="hero" className="mt-6"><a href={s.officialUrl} target="_blank" rel="noopener noreferrer">{isPortal ? "Open scholarship application portal" : "Apply on official website"} <ExternalLink /></a></Button>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">{s.id === "karnataka-shakti" ? "Use the benefit during eligible travel with accepted identity proof; no online application is needed." : "Online application link not verified. Follow the official guidance above."}</p>
        )}
        {(s.relatedLinks ?? []).map((link) => <p key={link.url} className="mt-4 text-sm"><a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">{link.label} {link.kind === "status" && "(status only)"}<ExternalLink className="size-3 shrink-0" /></a></p>)}
      </section>
    </div>
  );
}
