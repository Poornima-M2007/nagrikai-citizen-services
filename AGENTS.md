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
