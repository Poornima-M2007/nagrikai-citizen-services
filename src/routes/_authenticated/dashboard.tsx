import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Bookmark, FileText, Loader2, LogOut, MessageSquare, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState, Notice, SampleBadge } from "@/components/common";
import { SAMPLE_SCHEMES } from "@/data/sample-data";
import { useSavedSchemes } from "@/lib/saved-schemes";
import { useAuth, useSignOut } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { LANGUAGES } from "@/i18n/translations";

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

const Loading = () => <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading…</p>;
const Failed = ({ msg }: { msg: string }) => <Notice tone="warn">Could not load: {msg}</Notice>;

const profileSchema = z.object({ full_name: z.string().trim().max(80), preferred_language: z.string(), state: z.string().trim().max(60) });

function ProfileForm() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("full_name, preferred_language, state").maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const [v, setV] = useState({ full_name: "", preferred_language: "en", state: "" });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (q.data) setV({ full_name: q.data.full_name ?? "", preferred_language: q.data.preferred_language, state: q.data.state ?? "" });
  }, [q.data]);

  if (q.isLoading) return <Loading />;
  if (q.error) return <Failed msg={(q.error as Error).message} />;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = profileSchema.safeParse(v);
    if (!r.success) { toast.error(r.error.issues[0].message); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user!.id, full_name: r.data.full_name || null, preferred_language: r.data.preferred_language, state: r.data.state || null });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile", user?.id] });
  };

  return (
    <form onSubmit={save} className="space-y-3">
      <p className="text-sm text-muted-foreground">{user?.email}</p>
      <div className="space-y-1.5"><Label htmlFor="pf-name">Full name</Label><Input id="pf-name" value={v.full_name} onChange={(e) => setV({ ...v, full_name: e.target.value })} className="h-10 rounded-xl" /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5"><Label htmlFor="pf-lang">Preferred language</Label>
          <select id="pf-lang" value={v.preferred_language} onChange={(e) => setV({ ...v, preferred_language: e.target.value })} className="h-10 w-full rounded-xl border bg-background px-3 text-sm">
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
          </select>
        </div>
        <div className="space-y-1.5"><Label htmlFor="pf-state">State</Label><Input id="pf-state" value={v.state} onChange={(e) => setV({ ...v, state: e.target.value })} className="h-10 rounded-xl" /></div>
      </div>
      <Button type="submit" variant="hero" disabled={saving}>{saving && <Loader2 className="animate-spin" />} Save profile</Button>
    </form>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const signOut = useSignOut();
  const { ids, toggle, loading: savedLoading, error: savedError } = useSavedSchemes();
  const saved = ids.map((id) => SAMPLE_SCHEMES.find((s) => s.id === id)).filter((s): s is (typeof SAMPLE_SCHEMES)[number] => !!s);

  const docs = useQuery({
    queryKey: ["documents", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("documents").select("id, file_name, status, created_at").order("created_at", { ascending: false }).limit(5);
      if (error) throw error;
      return data;
    },
  });
  const convs = useQuery({
    queryKey: ["conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("conversations").select("id, title, updated_at").order("updated_at", { ascending: false }).limit(5);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl bg-gradient-navy p-8 text-primary-foreground md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-saffron">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Namaste 👋</h1>
            <p className="mt-2 text-primary-foreground/75">Your documents, saved schemes and conversations in one place.</p>
          </div>
          <Button variant="soft" onClick={signOut}><LogOut /> Logout</Button>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel icon={FileText} title="Recently uploaded documents">
          {docs.isLoading ? <Loading /> : docs.error ? <Failed msg={(docs.error as Error).message} /> : !docs.data?.length ? (
            <EmptyState icon={FileText} title="No documents yet" description="Documents you upload will be listed here." action={<Button asChild variant="soft"><Link to="/documents">Open Document Assistant</Link></Button>} />
          ) : (
            <ul className="space-y-2">
              {docs.data.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm">
                  <span className="truncate font-medium">{d.file_name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()} · {d.status === "uploaded" ? "Not analysed yet" : d.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel icon={Bookmark} title="Saved schemes">
          {savedLoading ? <Loading /> : savedError ? <Failed msg={savedError.message} /> : saved.length === 0 ? (
            <EmptyState icon={Bookmark} title="Nothing saved" description="Save schemes from their detail page to find them here." action={<Button asChild variant="soft"><Link to="/schemes">Explore schemes</Link></Button>} />
          ) : (
            <ul className="space-y-2">
              {saved.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                  <div className="min-w-0"><Link to="/schemes/$schemeId" params={{ schemeId: s.id }} className="block truncate font-medium hover:text-accent">{s.name}</Link><SampleBadge /></div>
                  <Button variant="ghost" size="sm" onClick={() => toggle(s.id).catch((e: Error) => toast.error(e.message))}>Remove</Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel icon={MessageSquare} title="Recent conversations">
          {convs.isLoading ? <Loading /> : convs.error ? <Failed msg={(convs.error as Error).message} /> : !convs.data?.length ? (
            <EmptyState icon={MessageSquare} title="No conversations" description="Your chats with the assistant will appear here." action={<Button asChild variant="soft"><Link to="/voice">Open Voice Assistant</Link></Button>} />
          ) : (
            <ul className="space-y-2">{convs.data.map((c) => <li key={c.id} className="rounded-xl border p-3 text-sm font-medium">{c.title}</li>)}</ul>
          )}
        </Panel>
        <Panel icon={Bell} title="Notifications">
          <EmptyState icon={Bell} title="You're all caught up" description="Notifications about saved schemes will show here." />
        </Panel>
        <Panel icon={UserCog} title="Profile settings">
          <ProfileForm />
        </Panel>
      </div>
    </div>
  );
}
