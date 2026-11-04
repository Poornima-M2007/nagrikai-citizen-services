import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice } from "@/components/common";
import { Logo } from "@/components/layout/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a New Password — NagrikAI" },
      { name: "description", content: "Choose a new password for your NagrikAI account." },
      { property: "og:title", content: "Set a New Password — NagrikAI" },
      { property: "og:description", content: "Reset your NagrikAI password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

const schema = z.object({ password: z.string().min(8, "Use at least 8 characters"), confirm: z.string() }).refine((v) => v.password === v.confirm, { message: "Passwords do not match", path: ["confirm"] });

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<boolean | null>(null);
  const [v, setV] = useState({ password: "", confirm: "" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    const { data } = supabase.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") setReady(true); });
    supabase.auth.getSession().then(({ data: s }) => setReady((r) => r ?? (isRecovery || !!s.session)));
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(v);
    if (!r.success) { setErr(r.error.issues[0]?.message ?? "Invalid input"); return; }
    setErr(null); setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: r.data.password });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="bg-gradient-hero">
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <div className="rounded-3xl border bg-card p-8 shadow-elegant">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold text-primary">Set a new password</h1>
          {ready === false ? (
            <div className="mt-5"><Notice tone="warn">This reset link is invalid or has expired. Request a new one from the login page.</Notice></div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div className="space-y-1.5"><Label htmlFor="np">New password</Label><Input id="np" type="password" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} className="h-11 rounded-xl" /></div>
              <div className="space-y-1.5"><Label htmlFor="cp">Confirm password</Label><Input id="cp" type="password" value={v.confirm} onChange={(e) => setV({ ...v, confirm: e.target.value })} className="h-11 rounded-xl" /></div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>Update password</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
