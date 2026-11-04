# NagrikAI — Verified government scheme population

Verification date: **4 November 2026 (UTC)**.

## Records inserted

10 genuine schemes: 5 Central and 5 Karnataka, in the existing `schemes` table. No duplicate table was created. The existing page design and account features were preserved.

| Scheme | Government | Official source URL | Checked |
|---|---|---|---|
| Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) | Central | https://pmkisan.gov.in/Documents/RevisedFAQ.pdf | 2026-11-04 |
| Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY) | Central | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2110780&lang=1&reg=3 | 2026-11-04 |
| Pradhan Mantri Awas Yojana – Urban 2.0 (PMAY-U 2.0) | Central | https://pmay-urban.gov.in/uploads/guidelines/Operational-Guidelines-of-PMAY-U-2.pdf | 2026-11-04 |
| PM Vishwakarma | Central | https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=155216&lang=1&reg=48 | 2026-11-04 |
| PM Young Achievers’ Scholarship Award Scheme for Vibrant India (PM-YASASVI) | Central | https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=153359 | 2026-11-04 |
| Shakti Scheme | State — Karnataka | https://bengaluruurban.nic.in/en/scheme/shakti-scheme/ | 2026-11-04 |
| Anna Bhagya | State — Karnataka | https://chikkamagaluru.nic.in/en/food-civil-supplies-and-consumer-affairs-department/ | 2026-11-04 |
| Yuva Nidhi | State — Karnataka | https://bangalorerural.nic.in/en/district-skill-development-office-2/ | 2026-11-04 |
| Gruha Lakshmi Yojana | State — Karnataka | https://chamrajnagar.nic.in/en/welfareschemes/ | 2026-11-04 |
| Vidyasiri — Food and Accommodation Scholarship Scheme | State — Karnataka | https://chamrajnagar.nic.in/en/welfareschemes/ | 2026-11-04 |

## Tests and results

- Dataset, filter, validation and navigation tests: 14 passed.
- Finder displays all 10 records.
- Search tested with every inserted scheme name: passed.
- Central and State filters return 5 records each; Karnataka returns 5.
- Every populated category filter returns the expected records.
- All 10 detail pages show the expected name, verification date and application link.
- Signed-in save persisted after page reload; the saved name appeared on the dashboard.
- Removal from the dashboard and removal from the detail page both persisted. Test saves were removed.
- Government Updates remains empty with its proper empty state; no announcements inserted.
- Mobile finder has no horizontal overflow. No browser page errors observed.
- Preview compilation checked successfully.

## Link reachability

Application/source destinations were checked independently without completing applications or providing personal data. HTTP success only establishes reachability, not that an application window is open.

| URL | Result |
|---|---|
| https://bangalorerural.nic.in/en/district-skill-development-office-2/ | 200 |
| https://beneficiary.nha.gov.in/ | 403 |
| https://bengaluruurban.nic.in/en/scheme/shakti-scheme/ | 200 |
| https://chamrajnagar.nic.in/en/welfareschemes/ | 200 |
| https://chikkamagaluru.nic.in/en/food-civil-supplies-and-consumer-affairs-department/ | 200 |
| https://pmay-urban.gov.in/uploads/guidelines/Operational-Guidelines-of-PMAY-U-2.pdf | 200 |
| https://pmaymis.gov.in/PMAYMIS2_2024/PMAY_SURVEY/EligiblityCheck.aspx | 200 |
| https://pmkisan.gov.in/Documents/RevisedFAQ.pdf | ConnectTimeout |
| https://pmkisan.gov.in/RegistrationFormupdated.aspx | ConnectTimeout |
| https://pmvishwakarma.gov.in/ | ConnectTimeout |
| https://scholarships.gov.in/ | 200 |
| https://sevasindhugs.karnataka.gov.in/ | ConnectTimeout |
| https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=153359 | 200 |
| https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=155216&lang=1&reg=48 | 200 |
| https://www.pib.gov.in/PressReleasePage.aspx?PRID=2110780&lang=1&reg=3 | 200 |

## Limitations and remaining issues

- Checked means the cited official material was reviewed on 4 November 2026, not that all guidelines were newly published that day. Historical source dates and live intake availability are distinct.
- Unverified document lists are intentionally unavailable, not guessed. Any partial list is explicitly qualified in the record.
- PM Vishwakarma fresh-registration availability and scholarship application windows were not verified as open. The records direct citizens to confirm current notifications.
- PM-YASASVI is an umbrella programme; component-specific selection, institutions and benefits differ.
- Anna Bhagya official sources describe different subsequent food-distribution arrangements. No ₹170 cash promise or exact current statewide top-up entitlement is asserted; citizens should confirm the current allocation with the Food Department.
- Existing user data was not cleaned or replaced. A legacy saved illustrative scheme from earlier development may still show its ID because it has no corresponding genuine record; it can be removed using the existing Remove action.
- Four schemes have no verified online application URL: Shakti, Anna Bhagya, Gruha Lakshmi and Vidyasiri. Their source URLs and available offline guidance are retained, and the existing pending-link state remains in place.
- Gruha Lakshmi detailed eligibility/exclusion rules and Vidyasiri benefit amount could not be verified and remain unavailable.
- An official portal that blocks automated checks or times out is reported above as unverified reachability, not represented as working.
- No government application was submitted; access to an external service may require identity verification or an open intake window.
