# Scheme data audit and eligibility-matching preparation
- [ ] Audit website navigation and current scheme URLs; fix verified connectivity issues without changing design or protected features.
- [ ] Add official SSP and NSP portal listings without duplicating existing schemes; retain IDs and distinguish information, application and status destinations.
- [ ] Test navigation, search, detail links and signed-in save/unsave; report counts, classifications and unavailable destinations.
- [x] Audit all 10 existing scheme records against their official sources.
- [x] Classify each record as verified / partially verified / unverified (3 / 7 / 0).
- [x] Extend the existing schemes table with verification status, structured eligibility rules and data-quality notes (no duplicate tables, no deletions).
- [x] Backfill structured eligibility only from source-verified facts; leave unverified records empty.
- [x] Write the audit report (docs/scheme-eligibility-audit.md and Files copy).
- [ ] Future task (not in scope): rule-based eligibility matching.

# Real document intelligence
- [x] Multiple private uploads with validation and per-file status.
- [x] Digital PDF extraction, vision OCR, explanations and grounded questions.
- [x] Private saved results, citizen review and complete document deletion.
- [x] Test digital PDF, scan, image, multiple files, missing data and invalid files; report limitations.

# Focused homepage refinement
- [x] Refine homepage imagery, typography, service sections and footer; preserve backend and other pages.
- [x] Verify homepage links, authentication destinations and mobile navigation across screen sizes.
- [x] Report changed files and existing limitations in docs/homepage-refinement-report.md.
