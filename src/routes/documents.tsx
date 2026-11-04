import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Loader2, AlertCircle, CalendarDays, CheckCircle2, FileText, ImageIcon, ListChecks, MessageSquare, Send, Sparkles, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, Notice, PageHeader } from "@/components/common";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "AI Document Assistant — NagrikAI" },
      { name: "description", content: "Upload a government document as PDF or image and get a simple-language explanation." },
      { property: "og:title", content: "AI Document Assistant — NagrikAI" },
      { property: "og:description", content: "Understand official documents in plain language." },
    ],
  }),
  component: Documents,
});

const ACCEPTED = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

export function validateDocument(file: { type: string; size: number }): string | null {
  if (!ACCEPTED.includes(file.type)) return "Unsupported file type. Please upload a PDF, PNG, JPG or WEBP file.";
  if (file.size > MAX_BYTES) return "File is larger than 10 MB. Please upload a smaller file.";
  if (file.size === 0) return "This file is empty.";
  return null;
}

const fmtSize = (b: number) => (b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`);

function Documents() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const pick = (f: File | undefined) => {
    if (!f) return;
    const err = validateDocument(f);
    if (err) { setError(err); return; }
    setError(null);
    setUploaded(false);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const clear = () => { setFile(null); setPreview(null); setError(null); setUploaded(false); if (inputRef.current) inputRef.current.value = ""; };

  const upload = async () => {
    if (!file || !user) return;
    const err = validateDocument(file);
    if (err) { setError(err); return; }
    setUploading(true); setError(null);
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const up = await supabase.storage.from("documents").upload(path, file, { contentType: file.type, upsert: false });
    if (up.error) { setUploading(false); setError(`Upload failed: ${up.error.message}`); return; }
    const { error: dbErr } = await supabase.from("documents").insert({ user_id: user.id, file_name: file.name.slice(0, 200), storage_path: path, mime_type: file.type, size_bytes: file.size });
    setUploading(false);
    if (dbErr) { await supabase.storage.from("documents").remove([path]); setError(`Could not save document: ${dbErr.message}`); return; }
    setUploaded(true);
    queryClient.invalidateQueries({ queryKey: ["documents", user.id] });
    toast.success("Document saved privately to your account");
  };

  return (
    <>
      <PageHeader eyebrow="AI Document Assistant" title="Understand any official document" description="Upload a notice, form or letter as a PDF or photo. NagrikAI will explain it in simple language, highlight dates and answer your questions." />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
            className={`flex flex-col items-center rounded-2xl border-2 border-dashed p-8 text-center transition ${drag ? "border-accent bg-accent/5" : "bg-card"}`}
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-gradient-primary shadow-elegant"><UploadCloud className="size-7 text-primary-foreground" /></span>
            <h2 className="mt-4 font-semibold">Drag & drop your document</h2>
            <p className="mt-1 text-sm text-muted-foreground">PDF, PNG, JPG or WEBP · up to 10 MB</p>
            <Button variant="hero" className="mt-5" onClick={() => inputRef.current?.click()}>Choose file</Button>
            <input ref={inputRef} type="file" accept={ACCEPTED.join(",")} className="sr-only" aria-label="Upload document" onChange={(e) => pick(e.target.files?.[0])} />
          </div>

          {error && (
            <div role="alert" className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="size-4 mt-0.5 shrink-0" /> {error}</div>
          )}

          {file && (
            <div className="rounded-2xl border bg-card p-5 shadow-soft animate-rise">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">{file.type === "application/pdf" ? <FileText className="size-5 text-primary" /> : <ImageIcon className="size-5 text-primary" />}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{fmtSize(file.size)} · {file.type === "application/pdf" ? "PDF" : "Image"}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={clear} aria-label="Remove file"><X /></Button>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {uploaded ? (
                  <p className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" /> Saved privately to your account</p>
                ) : (
                  <p className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" /> Selected and ready (kept on your device)</p>
                )}
                <p className="flex items-center gap-2 text-muted-foreground"><AlertCircle className="size-4" /> Not analysed — AI processing is not connected yet</p>
              </div>
              {!uploaded && (
                user ? (
                  <Button variant="hero" className="mt-4" onClick={upload} disabled={uploading}>{uploading ? <Loader2 className="animate-spin" /> : <UploadCloud />} Save to my account</Button>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground"><Link to="/auth" className="font-medium text-accent hover:underline">Log in</Link> to store this document privately in your account.</p>
                )
              )}
              {preview && file.type.startsWith("image/") && <img src={preview} alt={`Preview of ${file.name}`} className="mt-4 max-h-64 w-full rounded-xl border object-contain" />}
              {preview && file.type === "application/pdf" && <a href={preview} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">Open PDF preview</a>}
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-3">
          <Notice>AI analysis needs the secure backend, which will be connected in the next step. Until then, no explanation is generated — nothing below is invented.</Notice>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: FileText, title: "Extracted text" },
              { icon: Sparkles, title: "Simple explanation" },
              { icon: CalendarDays, title: "Important dates & details" },
              { icon: ListChecks, title: "Eligibility & requirements" },
            ].map((b) => (
              <section key={b.title} className="rounded-2xl border bg-card p-5 shadow-soft">
                <h3 className="flex items-center gap-2 font-semibold"><b.icon className="size-4 text-accent" /> {b.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{file ? "Waiting for analysis service." : "Upload a document to see results here, with page references."}</p>
              </section>
            ))}
          </div>
          <section className="rounded-2xl border bg-card shadow-soft">
            <h3 className="flex items-center gap-2 border-b px-5 py-4 font-semibold"><MessageSquare className="size-4 text-accent" /> Ask about this document</h3>
            <div className="p-5">
              <EmptyState icon={MessageSquare} title="No conversation yet" description={file ? "Questions will be enabled once document analysis is connected." : "Upload a document first, then ask questions about it."} />
            </div>
            <form className="flex gap-2 border-t p-4" onSubmit={(e) => e.preventDefault()}>
              <Input disabled placeholder="Ask a question about your document…" className="h-11 rounded-xl" aria-label="Question" />
              <Button disabled variant="hero" size="icon" className="size-11" aria-label="Send"><Send /></Button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
