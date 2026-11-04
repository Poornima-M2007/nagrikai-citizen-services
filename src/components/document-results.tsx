import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, CheckCircle2, FileText, ListChecks, Loader2, MessageSquare, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/common";
import { askDocument, reviewDocument } from "@/lib/documents.functions";
import { FIELD_NAMES, fieldSchema, pageSchema, detailSchema } from "@/lib/document-rules";
import { z } from "zod";

export function DocumentResults({ documentId, userId }: { documentId: string; userId: string }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["analysis", userId, documentId], queryFn: async () => {
    const { data, error } = await supabase.from("document_analyses").select("*").eq("document_id", documentId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    return data;
  } });
  const chats = useQuery({ queryKey: ["document-chat", userId, documentId], queryFn: async () => {
    const { data: convs, error } = await supabase.from("conversations").select("id").eq("document_id", documentId);
    if (error) throw error;
    if (!convs?.length) return [];
    const messages = await supabase.from("conversation_messages").select("id, role, content").in("conversation_id", convs.map((c) => c.id)).order("created_at");
    if (messages.error) throw messages.error;
    return messages.data;
  } });
  const ask = useServerFn(askDocument);
  const review = useServerFn(reviewDocument);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const fields = z.array(fieldSchema).safeParse(q.data?.extracted_fields);
    const saved = z.array(z.object({ name: z.string(), value: z.string() })).safeParse(q.data?.reviewed_fields);
    setValues(Object.fromEntries(FIELD_NAMES.map((name) => [name, (saved.success ? saved.data.find((f) => f.name === name)?.value : undefined) ?? (fields.success ? fields.data.find((f) => f.name === name)?.value : undefined) ?? ""])));
    setConfirmed(Object.fromEntries(FIELD_NAMES.map((name) => [name, !!q.data?.reviewed_at])));
  }, [q.data?.id, q.data?.reviewed_at]);
  if (q.isLoading) return <p className="flex gap-2"><Loader2 className="animate-spin" /> Loading saved results…</p>;
  if (q.error) return <Notice tone="warn">Could not load your saved analysis.</Notice>;
  const result = q.data;
  const parsedPages = z.array(pageSchema).safeParse(result?.pages);
  const pages = parsedPages.success ? parsedPages.data : [];
  const parsedFields = z.array(fieldSchema).safeParse(result?.extracted_fields);
  const fields = parsedFields.success ? parsedFields.data : [];
  const dates = z.array(detailSchema).safeParse(result?.important_dates);
  const details = z.array(detailSchema).safeParse(result?.requirements);
  const warnings = z.array(z.string()).safeParse(result?.warnings);
  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault(); if (!question.trim() || asking) return;
    setAsking(true);
    try { const response = await ask({ data: { documentId, question } }); if (response.error) throw new Error(response.error); setQuestion(""); await qc.invalidateQueries({ queryKey: ["document-chat", userId, documentId] }); qc.invalidateQueries({ queryKey: ["conversations", userId] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not answer your question."); }
    finally { setAsking(false); }
  };
  return <div className="space-y-6">
    {warnings.success && warnings.data.map((warning, i) => <Notice key={i} tone="warn">{warning}</Notice>)}
    <div className="grid gap-4 sm:grid-cols-2">
      <section className="rounded-2xl border bg-card p-5 shadow-soft"><h3 className="flex items-center gap-2 font-semibold"><FileText className="size-4 text-accent" /> Extracted text</h3><div className="mt-3 max-h-80 overflow-auto space-y-3 text-sm">{pages.length ? pages.map((p) => <div key={p.page}><p className="font-semibold">Page {p.page} · {p.method === "digital" ? "PDF text" : "Vision OCR"}</p><p className="whitespace-pre-wrap break-words">{p.text || "No readable text."}</p></div>) : <p className="text-muted-foreground">No extracted text yet.</p>}</div></section>
      <section className="rounded-2xl border bg-card p-5 shadow-soft"><h3 className="flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-accent" /> Simple explanation</h3>{result?.document_type && <p className="mt-3 font-medium">{result.document_type}</p>}<p className="mt-3 whitespace-pre-wrap break-words text-sm">{result?.simple_explanation || "Waiting for successful analysis."}</p></section>
      <section className="rounded-2xl border bg-card p-5 shadow-soft"><h3 className="flex items-center gap-2 font-semibold"><CalendarDays className="size-4 text-accent" /> Important dates & details</h3><ul className="mt-3 space-y-3 text-sm">{dates.success && dates.data.map((d, i) => <li key={i}>{d.text}<p className="text-xs text-muted-foreground">Page {d.page}: “{d.evidence}”</p></li>)}</ul>{(!dates.success || !dates.data.length) && <p className="mt-3 text-sm text-muted-foreground">No dates identified.</p>}</section>
      <section className="rounded-2xl border bg-card p-5 shadow-soft"><h3 className="flex items-center gap-2 font-semibold"><ListChecks className="size-4 text-accent" /> Requirements & amounts</h3><ul className="mt-3 space-y-3 text-sm">{details.success && details.data.map((d, i) => <li key={i}>{d.text}<p className="text-xs text-muted-foreground">Page {d.page}: “{d.evidence}”</p></li>)}</ul>{(!details.success || !details.data.length) && <p className="mt-3 text-sm text-muted-foreground">No supported requirements identified.</p>}</section>
    </div>
    {result?.simple_explanation && <section className="border-t pt-6"><h3 className="font-semibold">Review your information</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{FIELD_NAMES.map((name) => { const source = fields.find((f) => f.name === name); return <div key={name} className="min-w-0 space-y-2"><label htmlFor={`field-${name}`} className="text-sm font-medium">{name}</label><Input id={`field-${name}`} value={values[name] ?? ""} placeholder="Not found — optional" onChange={(e) => { setValues({ ...values, [name]: e.target.value }); setConfirmed({ ...confirmed, [name]: false }); }} /><p className="text-xs text-muted-foreground break-words">{source ? `Page ${source.page} · ${source.confidence} · “${source.evidence}”` : "Not present in the document"}</p><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={confirmed[name] ?? false} onChange={(e) => setConfirmed({ ...confirmed, [name]: e.target.checked })} />{values[name] ? "I confirm this value" : "I reviewed this missing detail"}</label></div>; })}</div><Button className="mt-5" variant="hero" disabled={saving || !FIELD_NAMES.every((n) => confirmed[n])} onClick={async () => { setSaving(true); try { await review({ data: { documentId, fields: FIELD_NAMES.map((name) => ({ name, value: values[name] ?? "", confirmed: true })) } }); await qc.invalidateQueries({ queryKey: ["analysis", userId, documentId] }); toast.success("Your reviewed information is saved privately"); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not save review"); } finally { setSaving(false); } }}><CheckCircle2 />{saving ? "Saving…" : "Confirm reviewed information"}</Button>{result.reviewed_at && <p className="mt-3 text-sm text-success">Review saved. Scheme matching has not been performed.</p>}</section>}
    <section className="rounded-2xl border bg-card shadow-soft"><h3 className="flex items-center gap-2 border-b px-5 py-4 font-semibold"><MessageSquare className="size-4 text-accent" /> Ask about this document</h3><div className="max-h-96 overflow-auto p-5 space-y-4">{chats.error && <Notice tone="warn">Could not load saved questions.</Notice>}{!chats.data?.length && <p className="text-sm text-muted-foreground">No conversation yet.</p>}{chats.data?.map((m) => <div key={m.id} className="text-sm"><p className="font-semibold text-accent">{m.role === "user" ? "You" : "NagrikAI"}</p><p className="whitespace-pre-wrap break-words">{m.content}</p></div>)}{asking && <p className="flex gap-2 text-sm"><Loader2 className="size-4 animate-spin" /> Reading the extracted document…</p>}</div><form className="flex gap-2 border-t p-4" onSubmit={submitQuestion}><Input value={question} onChange={(e) => setQuestion(e.target.value)} disabled={asking || !pages.some((p) => p.text)} maxLength={2000} placeholder="Ask a question about your document…" aria-label="Question" /><Button type="submit" disabled={asking || !question.trim() || !pages.some((p) => p.text)} variant="hero" size="icon" aria-label="Send"><Send /></Button></form></section>
  </div>;
}
