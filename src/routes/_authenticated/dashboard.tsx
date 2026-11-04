import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Bookmark, FileText, Lock, MessageSquare, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Notice, SampleBadge } from "@/components/common";
import { SAMPLE_SCHEMES } from "@/data/sample-data";
import { useSavedSchemes } from "@/lib/saved-schemes";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — NagrikAI" },
      { name: "description", content: "Your documents, saved schemes, conversations and notifications." },
      { property: "og:title", content: "My Dashboard — NagrikAI" },
      { property: "og:description", content: "Your personal NagrikAI space." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Panel({ icon: Icon, title, children }: { icon: typeof Bell; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-soft">
      <h2 className="flex items-center gap-2 font-semibold"><Icon className="size-5 text-accent" /> {title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Dashboard() {
  const { ids, toggle } = useSavedSchemes();
  const saved = SAMPLE_SCHEMES.filter((s) => ids.includes(s.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl bg-gradient-navy p-8 text-primary-foreground md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-saffron">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Namaste 👋</h1>
        <p className="mt-2 text-primary-foreground/75">Your documents, saved schemes and conversations in one place.</p>
      </div>
      <div className="mt-6">
        <Notice tone="warn"><span className="inline-flex items-center gap-2"><Lock className="size-4" /> This page will require sign-in once accounts are connected. Saved schemes are currently kept on this device only.</span></Notice>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel icon={FileText} title="Recently uploaded documents">
          <EmptyState icon={FileText} title="No documents yet" description="Documents you upload will be listed here after sign-in." action={<Button asChild variant="soft"><Link to="/documents">Open Document Assistant</Link></Button>} />
        </Panel>
        <Panel icon={Bookmark} title="Saved schemes">
          {saved.length === 0 ? (
            <EmptyState icon={Bookmark} title="Nothing saved" description="Save schemes from their detail page to find them here." action={<Button asChild variant="soft"><Link to="/schemes">Explore schemes</Link></Button>} />
          ) : (
            <ul className="space-y-2">
              {saved.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                  <div className="min-w-0"><Link to="/schemes/$schemeId" params={{ schemeId: s.id }} className="block truncate font-medium hover:text-accent">{s.name}</Link><SampleBadge /></div>
                  <Button variant="ghost" size="sm" onClick={() => toggle(s.id)}>Remove</Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel icon={MessageSquare} title="Recent conversations">
          <EmptyState icon={MessageSquare} title="No conversations" description="Your chats with the assistant will appear here after sign-in." action={<Button asChild variant="soft"><Link to="/voice">Open Voice Assistant</Link></Button>} />
        </Panel>
        <Panel icon={Bell} title="Notifications">
          <EmptyState icon={Bell} title="You're all caught up" description="Notifications about saved schemes will show here." />
        </Panel>
        <Panel icon={UserCog} title="Profile settings">
          <p className="text-sm text-muted-foreground">Profile name, preferred language and state will be editable after sign-in.</p>
          <Button asChild variant="hero" className="mt-4"><Link to="/auth">Login / Sign Up</Link></Button>
        </Panel>
      </div>
    </div>
  );
}
