import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Notice, PageHeader, SampleBadge } from "@/components/common";
import { SAMPLE_UPDATES } from "@/data/sample-data";

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

const CATS = ["All", ...new Set(SAMPLE_UPDATES.map((u) => u.category))];

function Updates() {
  const [cat, setCat] = useState("All");
  const list = SAMPLE_UPDATES.filter((u) => cat === "All" || u.category === cat);
  return (
    <>
      <PageHeader eyebrow="Government Updates" title="Announcements & notifications" description="Official announcements, each with its publication date and source." />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Notice tone="warn">No official feed is connected yet. The cards below are labelled samples that show the layout — they are not real announcements.</Notice>
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Categories">
          {CATS.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-card border hover:bg-secondary"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {list.map((u) => (
            <article key={u.id} className="rounded-2xl border bg-card p-6 shadow-soft">
              <div className="flex flex-wrap items-center gap-2 text-xs"><SampleBadge /><span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">{u.category}</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground"><CalendarDays className="size-3" /> {u.publishedAt ?? "Date pending"}</span></div>
              <h2 className="mt-3 text-lg font-semibold">{u.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{u.summary}</p>
              <p className="mt-4 text-sm">{u.sourceUrl ? <a href={u.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-accent hover:underline">{u.sourceName} <ExternalLink className="size-3" /></a> : <span className="text-muted-foreground">Source: {u.sourceName}</span>}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
