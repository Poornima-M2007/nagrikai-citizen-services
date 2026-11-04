<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- UI strings for shared chrome/home live in `src/i18n/translations.ts`; every language dictionary is typed against English so missing keys fail typecheck.
- Placeholder content lives only in `src/data/sample-data.ts`, flagged `isSample`, with null official URLs — never present it as real government data.
- Auth state comes from `AuthProvider`/`useAuth` in `src/lib/auth.tsx` (the only auth listener); signed-in pages live under `src/routes/_authenticated/`.
- User data is read/written from the browser client under per-user RLS; uploaded files go to the private `documents` bucket at `<user_id>/<uuid>.<ext>` so storage policies can scope by folder.
- AI processing must run server-side (createServerFn); the browser never holds AI keys.
- Document processing uses owner-authenticated server functions, edge-safe per-page PDF parsing and a distinct vision transcription stage before text-only analysis; this separates extraction evidence from AI interpretation.
- Server-managed document statuses and analysis writes use privileged access only after owner RLS verification; a document-delete trigger removes dependent analyses and chats to avoid retaining orphaned personal data.
- Official-source scheme imports retain a dated provenance snapshot in `docs/`; the live UI continues reading the existing `schemes` table, so imported data remains auditable without a second frontend data source.
- Scheme listings distinguish record types and store labelled information/status references separately from the existing application URL; shared official-link validation prevents unsafe or unrelated destinations from becoming clickable.
