import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { matchesDocumentSignature, pageSchema, validateDocument, validateReview } from "./document-rules";

const idInput = z.object({ documentId: z.string().uuid() });
export const processDocument = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(idInput).handler(async ({ data, context }) => {
  const { data: doc, error } = await context.supabase.from("documents").select("*").eq("id", data.documentId).eq("user_id", context.userId).single();
  if (error || !doc) throw new Error("Document not found or access denied.");
  // Only result/status writes are privileged; ownership was verified through user RLS above.
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { extractDocument, explainDocument, processingError } = await import("./document-ai.server");
  if (doc.status === "ready") return { ok: true, error: null };
  const { data: locked, error: lockError } = await supabaseAdmin.from("documents").update({ status: "extracting", processing_error: null }).eq("id", doc.id).eq("user_id", context.userId).in("status", ["uploaded", "failed", "extracted"]).select("id").maybeSingle();
  if (lockError) return { ok: false, error: "Could not start processing. Your file is saved; please try again." };
  if (!locked) return { ok: false, error: "This document is already processing. If interrupted, release it before retrying." };
  try {
    const validation = validateDocument({ type: doc.mime_type, size: doc.size_bytes });
    if (validation) throw new Error(validation);
    const { data: blob, error: downloadError } = await context.supabase.storage.from("documents").download(doc.storage_path);
    if (downloadError || !blob) throw new Error("Could not read the saved file. Please check your connection and try again.");
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const contentValidation = validateDocument({ type: doc.mime_type, size: bytes.length });
    if (contentValidation) throw new Error(contentValidation);
    if (!matchesDocumentSignature(bytes, doc.mime_type)) throw new Error("The file contents do not match its PDF or image type.");
    const { data: previous } = await context.supabase.from("document_analyses").select("id, pages").eq("document_id", doc.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    let pages = previous ? z.array(pageSchema).parse(previous.pages) : [];
    if (!pages.some((p) => p.text.trim())) pages = await extractDocument(bytes, doc.mime_type, doc.file_name);
    const extractedText = pages.map((p) => `[Page ${p.page}]\n${p.text}`).join("\n\n");
    const base = { document_id: doc.id, user_id: context.userId, pages, extracted_text: extractedText, warnings: pages.filter((p) => p.warning).map((p) => `Page ${p.page}: ${p.warning}`) };
    const stored = previous ? await supabaseAdmin.from("document_analyses").update(base).eq("id", previous.id).eq("user_id", context.userId).select("id").single() : await supabaseAdmin.from("document_analyses").insert(base).select("id").single();
    if (stored.error || !stored.data) throw new Error("Could not save extracted text privately.");
    if (!pages.some((p) => p.text.trim())) throw new Error("No readable text was found. Upload a clearer scan or photo; extraction warnings have been saved.");
    const { error: analysisStatusError } = await supabaseAdmin.from("documents").update({ status: "analysing" }).eq("id", doc.id).eq("user_id", context.userId);
    if (analysisStatusError) throw new Error("Text is saved, but analysis could not start. Please retry.");
    const result = await explainDocument(pages);
    const { error: saveError } = await supabaseAdmin.from("document_analyses").update({ simple_explanation: result.explanation, document_type: result.document_type, extracted_fields: result.fields, important_dates: result.dates, requirements: result.details }).eq("id", stored.data.id).eq("user_id", context.userId);
    if (saveError) throw new Error("Text was extracted, but the explanation could not be saved. Please retry.");
    const { error: statusError } = await supabaseAdmin.from("documents").update({ status: "ready", processing_error: null }).eq("id", doc.id).eq("user_id", context.userId);
    if (statusError) throw new Error("Results saved, but the processing status could not be updated.");
    return { ok: true, error: null };
  } catch (error) {
    const message = processingError(error);
    await supabaseAdmin.from("documents").update({ status: "failed", processing_error: message }).eq("id", doc.id).eq("user_id", context.userId);
    return { ok: false, error: message };
  }
});

export const releaseDocument = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(idInput).handler(async ({ data, context }) => {
  const { data: doc } = await context.supabase.from("documents").select("id, updated_at, status").eq("id", data.documentId).single();
  if (!doc) throw new Error("Document not found.");
  if (Date.now() - new Date(doc.updated_at).getTime() < 10 * 60 * 1000) throw new Error("Processing may still be running. Please wait 10 minutes before releasing an interrupted request.");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("documents").update({ status: "failed", processing_error: "Previous request interrupted. Retry explicitly when ready." }).eq("id", doc.id).eq("user_id", context.userId).in("status", ["extracting", "analysing"]);
  if (error) throw new Error("Could not release interrupted processing.");
  return { ok: true };
});

export const reviewDocument = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input: { documentId: string; fields: unknown }) => ({ ...idInput.parse(input), fields: validateReview(input.fields) })).handler(async ({ data, context }) => {
  const { data: doc } = await context.supabase.from("documents").select("id, status").eq("id", data.documentId).single();
  if (!doc || doc.status !== "ready") throw new Error("Wait for successful analysis before confirming your information.");
  const { data: result } = await context.supabase.from("document_analyses").select("id").eq("document_id", doc.id).order("created_at", { ascending: false }).limit(1).single();
  if (!result) throw new Error("No saved extraction to review.");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("document_analyses").update({ reviewed_fields: data.fields, reviewed_at: new Date().toISOString() }).eq("id", result.id).eq("user_id", context.userId);
  if (error) throw new Error("Could not save your review.");
  return { ok: true };
});

export const deleteDocument = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(idInput).handler(async ({ data, context }) => {
  const { data: doc } = await context.supabase.from("documents").select("id, storage_path, status").eq("id", data.documentId).single();
  if (!doc) throw new Error("Document not found.");
  if (["extracting", "analysing"].includes(doc.status)) throw new Error("Wait for processing to finish, or release the interrupted request, before deleting.");
  const { error: storageError } = await context.supabase.storage.from("documents").remove([doc.storage_path]);
  if (storageError) throw new Error("Could not remove the private file. Please retry.");
  // The database cleanup trigger deletes dependent analyses and conversations atomically.
  const { error } = await context.supabase.from("documents").delete().eq("id", doc.id);
  if (error) throw new Error("The file was removed, but its record remains. Please retry deletion.");
  return { ok: true };
});

export const askDocument = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ documentId: z.string().uuid(), question: z.string().trim().min(1).max(2000) })).handler(async ({ data, context }) => {
  const { data: doc } = await context.supabase.from("documents").select("id, file_name").eq("id", data.documentId).single();
  if (!doc) throw new Error("Document not found.");
  const { data: result } = await context.supabase.from("document_analyses").select("pages").eq("document_id", doc.id).order("created_at", { ascending: false }).limit(1).single();
  const pages = z.array(pageSchema).parse(result?.pages ?? []);
  if (!pages.some((p) => p.text.trim())) throw new Error("Extract readable text before asking questions.");
  const { answerDocument, processingError } = await import("./document-ai.server");
  try {
    const answer = await answerDocument(pages, data.question);
    const { data: existing } = await context.supabase.from("conversations").select("id").eq("document_id", doc.id).limit(1).maybeSingle();
    const conversation = existing ?? (await context.supabase.from("conversations").insert({ user_id: context.userId, document_id: doc.id, title: doc.file_name }).select("id").single()).data;
    if (!conversation) throw new Error("Could not save conversation.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("conversation_messages").insert([{ user_id: context.userId, conversation_id: conversation.id, role: "user", content: data.question }, { user_id: context.userId, conversation_id: conversation.id, role: "assistant", content: answer }]);
    if (error) throw new Error("Answer generated, but could not be saved. Please check your connection.");
    return { answer, error: null };
  } catch (error) { return { answer: null, error: processingError(error) }; }
});