# NagrikAI homepage refinement

## Changed files
- `src/routes/index.tsx`: full-width citizen-services photograph, clear brand and headline, refined CTAs, trust strip, service cards, unframed numbered steps, navy credibility band and closing CTAs.
- `src/styles.css`: homepage overlay tokens, compact-screen adjustments, zero heading letter spacing and reduced-motion support.
- `src/components/layout/SiteHeader.tsx`: mobile-menu Escape dismissal, focus return, accessible menu relationship and logo dismissal.
- `src/components/layout/SiteFooter.tsx`: cleaner columns, existing navigation plus authentication link, translated unavailable-contact notice instead of fake contact details.
- `src/components/layout/Logo.tsx`: refined existing mark shape and spacing.
- `src/i18n/translations.ts`: menu accessibility and unavailable-contact strings in all five languages.
- `src/assets/citizen-services-home.jpg`: new generated illustrative photograph; it does not depict an actual government office or endorsement.
- `roadmap.md`: focused task checklist.
- `docs/homepage-refinement-report.md`: this report.

## Verified navigation and presentation
- Clicked all 24 homepage links across header, service cards, hero/closing CTAs and footer; each reached its existing destination.
- Logo/Home, Scheme Finder, Document Assistant, Voice Assistant, Government Updates, About and authentication destinations loaded.
- Existing authentication page switches between Login and Sign up forms; no accounts were created for this visual task.
- Signed-out Dashboard redirects to authentication; restored the user's managed session and confirmed the homepage Dashboard link opens the protected dashboard.
- Mobile menu opens, closes on destination selection, and closes on Escape with focus returning to the menu button.
- Checked 390px mobile, 778px tablet and 1536px desktop; no horizontal overflow. All five homepage languages fit the mobile width.
- All 18 existing tests passed; preview reported build OK and no browser page errors.

## Existing limitations, unchanged
- Voice page captures speech/text but does not generate AI answers; browser speech availability varies. Its destination works, not its future AI-answer service.
- Government Updates destination is connected but has no verified announcements available.
- Contact information has not been supplied; the footer now clearly states it is unavailable and contains no fake contact actions.
- Four existing scheme application links remain unverified/unavailable; this task did not change them.
- Login/signup form navigation was tested; registration, confirmation email and password recovery delivery were not re-tested.

## Backend preservation
No backend files, database records/schemas, authentication logic/configuration, storage settings, AI processing, API integrations, security policies or access controls were changed. No new routes or dependencies were added. Other content pages were not redesigned; shared header/footer/logo refinements appear consistently throughout the existing application.