import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Loader2, AlertCircle, FileText, UploadCloud, X, Trash2, Play, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Notice, PageHeader } from "@/components/common";
import { ACCEPTED_DOCUMENT_TYPES, validateDocument } from "@/lib/document-rules";
import { processDocument, deleteDocument, releaseDocument } from "@/lib/documents.functions";
import { DocumentResults } from "@/components/document-results";
export { validateDocument } from "@/lib/document-rules";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [
    { title: "AI Document Assistant — NagrikAI" },
    { name: "description", content: "Privately upload PDFs and photos, extract readable text, review your information and ask grounded document questions." },
    { property: "og:title", content: "AI Document Assistant — NagrikAI" },
    { property: "og:description", content: "Understand official documents in plain language with private extraction and citizen review." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Documents,
});
type SelectedFile = { id: string; file: File; status: string; error?: string | undefined };
const fmtSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`;
function Documents() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const qc = useQueryClient();
  const process = useServerFn(processDocument);
  const remove = useServerFn(deleteDocument);
  const release = useServerFn(releaseDocument);
  const docs = useQuery({ queryKey: ["document-library", user?.id], enabled: !!user, refetchInterval: working ? 2000 : false, queryFn: async () => {
    const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    if (error) throw error; return data;
  } });
  const refresh = async (id?: string) => { await qc.invalidateQueries({ queryKey: ["document-library", user?.id] }); qc.invalidateQueries({ queryKey: ["documents", user?.id] }); if (id) await qc.invalidateQueries({ queryKey: ["analysis", user?.id, id] }); };
  const pick = (list: FileList | null) => {
    if (!list) return;
    const added = Array.from(list).map((file) => ({ id: crypto.randomUUID(), file, status: "Selected", error: validateDocument(file) ?? undefined }));
    setFiles((old) => [...old, ...added]); setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };
  const run = async (id: string) => {
    setActive(id); setWorking(id); setError(null);
    try { const result = await process({ data: { documentId: id } }); if (!result.ok) setError(result.error); return result; }
    catch { const message = "The request was interrupted. Your file remains saved; processing may still be running."; setError(message); return { ok: false, error: message }; }
    finally { setWorking(null); await refresh(id); }
  };
  const uploadAll = async () => {
    if (!user || busy) return; setBusy(true); setError(null);
    for (const item of files.filter((f) => !f.error && f.status !== "Saved")) {
      const update = (status: string, error?: string) => setFiles((old) => old.map((f) => f.id === item.id ? { ...f, status, error } : f));
      try {
        update("Uploading…");
        const ext = item.file.type === "application/pdf" ? "pdf" : item.file.type.split("/")[1];
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const up = await supabase.storage.from("documents").upload(path, item.file, { contentType: item.file.type, upsert: false });
        if (up.error) throw new Error("Upload failed. Check your connection and retry.");
        const result = await supabase.from("documents").insert({ user_id: user.id, file_name: item.file.name.slice(0, 200), storage_path: path, mime_type: item.file.type, size_bytes: item.file.size }).select("id").single();
        if (result.error || !result.data) { await supabase.storage.from("documents").remove([path]); throw new Error("Could not save the document record. Please retry upload."); }
        update("Saved"); await refresh(); const processed = await run(result.data.id);
        if (processed?.error?.includes("credits") || processed?.error?.includes("does not allow")) break;
      } catch (e) { update("Failed", e instanceof Error ? e.message : "Upload failed."); }
    }
    setBusy(false);
  };
  return <>
    <PageHeader eyebrow="AI Document Assistant" title="Understand any official document" description="Upload a notice, form or letter as a PDF or photo. NagrikAI will explain it in simple language, highlight dates and answer your questions." />
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-2">
        <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); if (!busy) pick(e.dataTransfer.files); }} className={`flex flex-col items-center rounded-2xl border-2 border-dashed p-8 text-center transition ${drag ? "border-accent bg-accent/5" : "bg-card"}`}>
          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-primary shadow-elegant"><UploadCloud className="size-7 text-primary-foreground" /></span>
          <h2 className="mt-4 font-semibold">Drag & drop your documents</h2><p className="mt-1 text-sm text-muted-foreground">PDF, PNG, JPG or WEBP · up to 10 MB each</p>
          <Button variant="hero" className="mt-5" disabled={busy} onClick={() => inputRef.current?.click()}>Choose files</Button><input ref={inputRef} type="file" multiple accept={ACCEPTED_DOCUMENT_TYPES.join(",")} className="sr-only" aria-label="Upload documents" onChange={(e) => pick(e.target.files)} />
        </div>
        {files.map((f) => <div key={f.id} className="rounded-2xl border bg-card p-5 shadow-soft"><div className="flex items-start gap-3"><FileText className="size-5 shrink-0 text-accent" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{f.file.name}</p><p className="text-xs text-muted-foreground">{fmtSize(f.file.size)} · {f.status}</p></div><Button variant="ghost" size="icon" aria-label={`Remove ${f.file.name}`} disabled={busy} onClick={() => setFiles((old) => old.filter((item) => item.id !== f.id))}><X /></Button></div>{f.error && <p role="alert" className="mt-3 text-sm text-destructive">{f.error}</p>}{f.status === "Failed" && <Button variant="ghost" size="sm" disabled={busy} onClick={() => setFiles((old) => old.map((item) => item.id === f.id ? { ...item, status: "Selected", error: validateDocument(item.file) ?? undefined } : item))}><RotateCcw />Retry upload</Button>}{f.status === "Uploading…" && <progress className="mt-3 w-full" aria-label={`Uploading ${f.file.name}`} />}</div>)}
        {files.some((f) => !f.error && f.status !== "Saved") && (user ? <Button variant="hero" disabled={busy || !!working} onClick={uploadAll}>{busy ? <Loader2 className="animate-spin" /> : <UploadCloud />}{busy ? "Uploading and processing…" : "Upload & process documents"}</Button> : <p className="text-sm"><Link to="/auth" className="font-medium text-accent hover:underline">Log in</Link> to upload and process documents privately.</p>)}
        {error && <div role="alert" className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="size-4 shrink-0" />{error}</div>}
        {user && <section><h2 className="mb-3 font-semibold">My private documents</h2>{docs.isLoading && <Loader2 className="animate-spin" />}{docs.error && <Notice tone="warn">Could not load your documents.</Notice>}{!docs.isLoading && !docs.error && !docs.data?.length && <p className="text-sm text-muted-foreground">No saved documents yet.</p>}<div className="space-y-3">{docs.data?.map((d) => { const processing = ["extracting", "analysing"].includes(d.status); return <div key={d.id} className={`rounded-xl border bg-card p-4 ${active === d.id ? "border-accent" : ""}`}><Button variant="ghost" className="h-auto w-full justify-start px-0 text-left" onClick={() => setActive(d.id)}><FileText className="shrink-0" /><span className="min-w-0 truncate">{d.file_name}</span></Button><p className="mt-2 text-xs text-muted-foreground">{fmtSize(d.size_bytes)} · {d.status}{processing && <Loader2 className="ml-2 inline size-3 animate-spin" />}</p>{d.processing_error && <p className="mt-2 text-sm text-destructive break-words">{d.processing_error}</p>}<div className="mt-3 flex flex-wrap gap-2">{!processing && d.status !== "ready" && <Button size="sm" variant="soft" disabled={!!working || busy} onClick={() => run(d.id)}><Play />{d.status === "failed" ? "Retry processing" : "Process"}</Button>}{processing && <Button size="sm" variant="ghost" disabled={!!working} onClick={async () => { try { await release({ data: { documentId: d.id } }); await refresh(d.id); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not release request"); } }}><RotateCcw />Release interrupted request</Button>}<Button size="sm" variant="ghost" disabled={processing || busy || !!working} onClick={async () => { if (!window.confirm(`Delete ${d.file_name}, its analysis and questions permanently?`)) return; try { await remove({ data: { documentId: d.id } }); if (active === d.id) setActive(null); await refresh(); toast.success("Document, analysis and questions deleted"); } catch (e) { toast.error(e instanceof Error ? e.message : "Deletion failed"); } }}><Trash2 />Delete</Button></div></div>; })}</div></section>}
      </div>
      <div className="space-y-6 min-w-0 lg:col-span-3">{active && user ? <DocumentResults key={active} documentId={active} userId={user.id} /> : <><Notice>Documents and saved results remain private to your account. AI extraction can make mistakes; review important information before using it.</Notice><div className="grid gap-4 sm:grid-cols-2">{["Extracted text", "Simple explanation", "Important dates & details", "Eligibility & requirements"].map((title) => <section key={title} className="rounded-2xl border bg-card p-5 shadow-soft"><h3 className="font-semibold">{title}</h3><p className="mt-3 text-sm text-muted-foreground">No document selected.</p></section>)}</div></>}</div>
    </div>
  </>;
}
