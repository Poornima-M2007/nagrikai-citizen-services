# NagrikAI — Scheme data audit and eligibility-matching preparation

Audit date: **4 November 2026 (UTC)**. Scope: the 10 existing records in the `schemes` table. No UI changes, no duplicate tables, no records deleted, no authentication or document-upload changes.

## 1. Schemes inspected

10 records inspected (5 Central, 5 Karnataka). Each was checked against its cited official source and the provenance snapshot in `docs/verified-schemes.json`.

## 2. Verification classification

| Scheme | Status | Basis |
|---|---|---|
| PM-KISAN | Verified | Eligibility, exclusions, documents and process verified against the official PM-KISAN FAQ. |
| PMAY-U 2.0 | Verified | Income limits (EWS ₹3L / LIG ₹6L / MIG ₹9L), ownership and prior-benefit conditions verified against the operational guidelines. |
| Shakti Scheme | Verified | Eligibility, identity-document requirement and exclusions verified against the official district NIC page. |
| AB PM-JAY | Partially verified | Core cover and age-70 extension verified via PIB; document list unavailable; general-route eligibility depends on beneficiary identification. |
| PM Vishwakarma | Partially verified | Eligibility and benefits verified via PIB; document list unavailable; fresh-registration availability unverified. |
| PM-YASASVI | Partially verified | Income limit (₹2.5L) and OBC/EBC/DNT category verified; component-specific rules and documents differ and were not individually verified. |
| Anna Bhagya | Partially verified | Ration-card eligibility verified; current allocation and document list unverified. |
| Yuva Nidhi | Partially verified | Benefit amounts and broad eligibility verified; current cohort conditions and document list unverified. |
| Gruha Lakshmi Yojana | Partially verified | Name, ₹2,000/month benefit and women-head-of-household targeting verified; detailed eligibility/exclusion rules unverified. |
| Vidyasiri | Partially verified | Student group, post-matric requirement and hostel exclusion verified; current benefit amount and document list unverified. |

**Totals: 3 verified, 7 partially verified, 0 unverified.** Every record has an official source URL and a last-verified date; none is source-less.

## 3. Missing eligibility information

- Gruha Lakshmi: full eligibility and exclusion checklist unavailable (structured eligibility intentionally left empty).
- Anna Bhagya: current allocation/top-up entitlement unverified.
- Yuva Nidhi: current graduating-cohort and other notified conditions unverified.
- PM-YASASVI: component-specific institution, class and selection rules not individually verified (umbrella programme).
- PM-JAY: detailed general-route criteria are not public; eligibility is by beneficiary identification.

## 4. Missing official application links

4 records have no verified online application URL: Shakti, Anna Bhagya, Gruha Lakshmi and Vidyasiri. They retain the existing pending-link state; source URLs and offline guidance are kept.

## 5. Database changes made

Additive changes to the existing `schemes` table only — no new or duplicate tables:

- `verification_status` (verified | partially_verified | unverified), backfilled per the audit above.
- `eligibility_rules` (structured JSON: income limits, age, education, occupation, residence, category), backfilled only with source-verified facts; NULL where eligibility is unverified.
- `data_quality_notes` (text), recording exactly which fields are missing or unverified for each record.

This structure supports a future rule-based matcher that can distinguish **potentially eligible**, **more information required** (NULL or incomplete rules) and **likely not eligible** (a verified rule is contradicted). No matching logic was implemented in this task.

## 6. Remaining limitations

- "Verified" means the cited official material was reviewed on 4 November 2026, not that intake windows are currently open.
- Document lists are unavailable for 7 of 10 records; they are intentionally empty rather than guessed.
- Four official portals blocked or timed out automated reachability checks earlier; that is reported as unverified reachability, not as working links.
- The frontend does not yet display the new audit fields; they are stored for the future eligibility-matching feature.
