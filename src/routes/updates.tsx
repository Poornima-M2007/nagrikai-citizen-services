import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CalendarDays, ExternalLink, Inbox, Loader2, Search, SearchX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHeader } from "@/components/common";
import { filterUpdates, updatesQuery } from "@/lib/gov-data";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Government Updates — NagrikAI" },
      { name: "description", content: "Government announcements and important notifications with official source links." },
      { property: "og:title", content: "Government Updates — NagrikAI" },
      { property: "og:description", content: "Stay informed with official government announcements." },
    ],
  }),
  component: Updates,
});

function Updates() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const { data, isLoading, error, refetch } = useQuery(updatesQuery);
  const all = data ?? [];
  const cats = ["All", ...new Set(all.map((u) => u.category))];
  const list = filterUpdates(all, q, cat);
  return (
    <>
      <PageHeader eyebrow="Government Updates" title="Announcements & notifications" description="Official announcements, each with its publication date and source." />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground"><Loader2 className="size-5 animate-spin" /> Loading updates…</div>
        ) : error ? (
          <EmptyState icon={AlertTriangle} title="Could not load updates" description={(error as Error).message} action={<Button variant="soft" onClick={() => refetch()}>Try again</Button>} />
        ) : all.length === 0 ? (
          <EmptyState icon={Inbox} title="No updates available yet" description="Announcements are published here only after they are checked against official government sources." />
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
              <Input aria-label="Search updates" placeholder="Search updates…" value={q} onChange={(e) => setQ(e.target.value)} className="h-11 rounded-xl pl-9" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Categories">
              {cats.map((c) => (
                <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-card border hover:bg-secondary"}`}>{c}</button>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              {list.length === 0 ? <EmptyState icon={SearchX} title="No updates match" description="Try a different keyword or category." /> : list.map((u) => (
                <article key={u.id} className="rounded-2xl border bg-card p-6 shadow-soft">
                  <div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">{u.category}</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground"><CalendarDays className="size-3" /> {u.publishedOn}</span></div>
                  <h2 className="mt-3 text-lg font-semibold">{u.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{u.summary}</p>
                  <p className="mt-4 text-sm">{u.officialUrl ? <a href={u.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-accent hover:underline">{u.source} <ExternalLink className="size-3" /></a> : <span className="text-muted-foreground">Source: {u.source}</span>}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
