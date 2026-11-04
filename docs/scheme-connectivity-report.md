# NagrikAI — Connectivity and scheme completeness report

Checked: 4 November 2026 UTC. Existing design preserved. The actual scheme table is `schemes`, not `government_schemes`; it was reused.

## Results and counts

- **33 distinct existing destinations checked:** 18 rendered internal destinations (including ten scheme detail pages) and 15 distinct external destinations from the original scheme records. The initial browser inventory covered 19 page states and 351 repeated link occurrences; shared header/footer links recur on each page. Password-reset navigation was also opened separately. All 24 homepage/header/footer link occurrences were clicked.
- **11 broken or missing connections fixed:** ten existing scheme information/source URLs made clickable, plus the dashboard’s missing-record saved-scheme link is no longer sent to a nonexistent detail page. Its Remove action and saved row remain intact. One legacy missing scheme ID exists in the database; no personal data was removed.
- **1 additional destination improved:** PM-YASASVI now points to the student-specific NSP page rather than the general homepage. No existing internal route was broken. No external URL was proven invalid by a full page request, so none was replaced merely because of an automated timeout.
- **2 new records added:** Karnataka State Scholarship Portal (SSP) – Post-Matric and National Scholarship Portal (NSP), each explicitly classified as a scholarship portal, not a universal scholarship. All ten original IDs preserved; twelve unique records total, six Central and six Karnataka State listings. No duplicate schemes added for PM-KISAN, PM Vishwakarma, Anna Bhagya, Shakti or Gruha Lakshmi.
- **Other focused fixes:** safe HTTPS official-domain checks for clickable external links; separate information references for Ahara and the supplied Gruha Lakshmi lookup; no disabled placeholder pretending an application is available; Shakti’s travel-based access explained; tablet filter layout widened without redesign.

## Verification classification

| Record | Status | Important limitation |
|---|---|---|
| PM-KISAN | Verified | Existing source-supported facts retained; portal and FAQ time out here. Specific registration URL retained. |
| PMAY-U 2.0 | Verified | Official guidelines and specific eligibility-check destination retained; submission/intake not tested. |
| Shakti | Verified | Dedicated official information page works; travel-based access, not an online application. |
| NSP | Verified **as a portal listing** | Student information, OTR and application access verified; no universal scholarship eligibility/award or open window claimed. |
| AB PM-JAY | Partially verified | Beneficiary portal blocks automated requests; document list/general-route details incomplete. |
| PM Vishwakarma | Partially verified | Portal times out; fresh registration and document list unverified. |
| PM-YASASVI | Partially verified | Components have separate rules; no current open window asserted. |
| Anna Bhagya | Partially verified | Current allocation/documents unverified; Ahara is information/ration services, not a verified application form. |
| Yuva Nidhi | Partially verified | Current cohort and intake unverified; official portal times out. |
| Gruha Lakshmi | Partially verified | Full eligibility/exclusions/documents/application unverified; supplied lookup has historical schedule references only. |
| Vidyasiri | Partially verified | Benefit amount/documents/current application window unverified; department notifications must be checked. |
| SSP Post-Matric | Partially verified **as a portal listing** | Purpose supported by official NeGD directory; supplied endpoint and live workflow unavailable here. No shared eligibility or benefit invented. |

**Totals: 4 verified, 8 partially verified, 0 entirely pending/unverified records.** Unsupported details remain qualified or empty; verification describes source support, not guaranteed live intake or payment.

## External links and remaining unavailable destinations

24 distinct existing/new/candidate official URLs checked. Full GET requests corrected misleading HEAD responses on NSP, PMAY and PIB (HEAD returned 404/401 but GET returned 200). These are not counted as broken URLs.

| Destination | Observed result |
|---|---|
| https://scholarships.gov.in/Students | GET 200; application button opened this exact destination in a new tab |
| https://scholarships.gov.in/ | GET 200; replaced with Students only where more specific |
| https://scholarships.gov.in/public/FAQ/NSP_FAQsORApplicationUsermanul_V2.2.pdf | GET 200 |
| https://bengaluruurban.nic.in/en/scheme/shakti-scheme/ | 200; dedicated scheme source retained |
| https://bengaluruurban.nic.in/en/schemes/ | 200; general listing not substituted for dedicated source |
| https://pmaymis.gov.in/PMAYMIS2_2024/PMAY_SURVEY/EligiblityCheck.aspx | GET 200 |
| PMAY guidelines PDF, three existing PIB sources, Bengaluru Rural Skill Development source, Chamarajanagar welfare source and Chikkamagaluru Food Department source | 200 |
| https://beneficiary.nha.gov.in/ | 403; client-specific access restriction, not proven down |
| https://negd.gov.in/isl/Directory/statedata/391 | 403 on direct check; official indexed content supports SSP’s portal purpose |
| https://pmkisan.gov.in/ | Connection timeout |
| https://pmkisan.gov.in/RegistrationFormupdated.aspx | Connection timeout; specific registration destination retained |
| https://pmkisan.gov.in/Documents/RevisedFAQ.pdf | Connection timeout; original source retained |
| https://pmvishwakarma.gov.in/ | Connection timeout |
| https://ahara.karnataka.gov.in/ | Connection timeout; separately labelled information link |
| https://sevasindhugs.karnataka.gov.in/ | Connection timeout |
| https://sevasindhugs1.karnataka.gov.in/gl-stat-sns/ | Connection timeout; current function unverified, not labelled Apply |
| https://ssp.karnataka.gov.in/ | DNS timeout; separate main-portal reference |
| https://ssp.postmatric.karnataka.gov.in/ | DNS timeout; clearly disclosed on SSP record |

Thus **11 destinations remain unconfirmed usable here: nine timeouts and two access restrictions**. These are not represented as proven broken or fixed. No government application was submitted and no citizen information entered externally.

Four original schemes still have no verified application URL: Shakti (online application not needed for the described travel route), Anna Bhagya, Gruha Lakshmi and Vidyasiri. Their official information links are now usable controls; unknown application URLs remain empty. Contact details were not supplied, so the footer retains its honest unavailable notice rather than an invented contact link. Government Updates has no records and retains the real empty state.

## Functional tests

- Every one of the twelve official-name searches passed; SSP/NSP, education and Karnataka keyword searches passed. NSP also matches Shakti through the word Transport, which contains “nsp”; this is normal substring search.
- Central/State filters return six each; Education returns four. All twelve detail pages render correct names, source destinations and available application links.
- Both new portals: signed-in save, reload persistence, dashboard name/link, detail-page unsave and dashboard removal passed. Initial saved state restored; no test saves left behind.
- All six mobile navigation destinations passed at 390 × 844 and 778 × 529. Language selectors switched through all five languages; login/signup forms switch correctly; signed-out dashboard redirects to login. Registration/email-delivery settings were not changed or retested.
- No browser page errors; mobile no horizontal overflow. All 26 unit tests passed. Latest preview compilation checked successfully.

## Preservation and changed scope

Authentication, account/profile behavior, private storage, document upload/AI processing, security policies and unrelated server functions were not modified. Shared header/footer/homepage design and navigation were not redesigned. Only the existing scheme table received additive record-type/reference-link fields and targeted listing changes; existing save/unsave operations remain unchanged. The dashboard change only prevents navigation to absent scheme records. The updates data mapper now refuses unsafe external URLs; no announcements inserted.

Source/audit snapshot: `docs/scheme-connectivity-snapshot-2026-11-04.json`. The original ten-record provenance snapshot is intentionally retained unchanged. New SSP purpose source: https://negd.gov.in/isl/Directory/statedata/391; NSP source: https://scholarships.gov.in/Students. Official indexed department guidance at https://bcwd.karnataka.gov.in/74/online--application/en was also reviewed; its displayed dates/open labels were inconsistent for the check date, so no deadline or active intake was imported.