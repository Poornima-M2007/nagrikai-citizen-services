# NagrikAI document intelligence — implementation and verification

Tested 4 November 2026 against the existing NagrikAI app and private Lovable Cloud storage.

## Implemented
- Multiple PDF, JPG/JPEG, PNG and existing WEBP uploads, drag-and-drop, per-file names/sizes, selection removal, indeterminate upload progress and real per-document processing states.
- 10 MB per-file limit enforced in the browser, server and existing private bucket. Server checks file signatures as well as recorded MIME types and actual downloaded sizes.
- Files uploaded to the existing `documents` bucket under the owner's ID; metadata uses the existing documents table. No duplicate bucket or tables were created.
- Digital PDFs genuinely parsed with `unpdf`, retaining every extracted page and original page number.
- A separate AI vision transcription stage handles images and PDF pages lacking substantial digital text. The explanation operation receives extracted text, not the original file.
- Saved extracted pages, warnings, explanations, source-backed profile fields, dates and details in the existing private analysis records.
- Editable citizen review, including acknowledgement of missing fields. Every field must be reviewed before confirmation can be saved. Saved corrections are distinct from original extracted values and source evidence.
- Document questions and answers are saved privately in the existing conversations/messages records. Responses without valid source-page quotes fall back to “This information is not present in the extracted document.”
- Deletion removes the private file, document record, analysis, conversations and messages. Dependent database deletion runs atomically through an owner-triggered cleanup operation.
- Owner-authenticated server processing; AI and privileged writes are server-side and occur only after ownership checks. Document text is treated as untrusted input, never as instructions.
- Explicit retry controls, preservation of extracted text when interpretation fails, duplicate-processing protection, and a 10-minute release guard for interrupted operations. No automatic inference replay is added. Credit/access failures pause the current multi-file batch.

## Services and configuration
- Existing Lovable Cloud authentication, database and private storage were reused without rebuilding authentication or changing navigation/homepage.
- `unpdf` performs digital PDF text extraction using its edge-compatible parser.
- Lovable AI Gateway with the workspace-default `openai/gpt-6-astra` Responses service performs vision transcription, text-only interpretation and document questions. Workspace catalog availability and zero-retention capability were checked.
- No additional AI API key is required from the owner. Gateway authentication is supplied securely by Lovable; no secret is exposed to the browser. AI credit and access controls still apply.

## Test results
| Check | Result |
| --- | --- |
| Digital PDF | Passed: two pages, Karnataka state, annual income and second-page qualification retained |
| Scanned PDF | Passed: a raster-only PDF was genuinely transcribed with vision OCR |
| PNG image | Passed: state, district, occupation and date read correctly |
| Multiple uploads | Passed: multiple files uploaded and processed sequentially in one session |
| Missing information | Passed: absent birth date was not filled; Q&A explicitly reported it absent |
| Unreadable document | Passed: blank image produced a saved unreadable/blank warning and failed-analysis state |
| Invalid document | Passed: a text file renamed as PDF was rejected by server signature validation |
| Review | Passed: all nine fields reviewed; confirmation and extracted sources persisted after reopening |
| Grounded Q&A | Passed: district answer cited the source; unsupported birth-date question returned the absent-information answer |
| Private storage | Passed: files downloaded by authenticated processing from the existing private bucket; the bucket's private flag was confirmed |
| Delete | Passed through UI; database verification found zero remaining test documents, analyses, conversations or messages. The one pre-existing storage object was left untouched |
| Signed-out access | Passed: private document library was not displayed |
| Mobile | Passed: 390px viewport had no horizontal overflow |
| Regression tests | All 18 tests passed across five test files |
| Compilation | Latest automatic preview check: build OK |

## Limitations and unverified cases
- Vision OCR is probabilistic, not a certified OCR engine. A clean synthetic scanned PDF and PNG passed; handwriting, Indian-language scans, complex tables, faint/partly obscured pages, JPEG/WEBP samples and large multipage scans were not individually tested.
- Multipage digital extraction was tested; multipage scanned-page numbering was not separately verified. OCR output is checked for expected original page numbers but the model may still mistranscribe content.
- A page with substantial existing PDF text bypasses vision OCR; additional text embedded only in images on that same page may not be captured.
- Confidence indicators are qualitative AI assessments, not calibrated probabilities. Exact quoted evidence is checked against extracted text, but AI interpretation can still be wrong; citizen review is required.
- Upload progress is indeterminate, not a fabricated percentage. Files are processed sequentially and the selected queue is kept in memory; closing the page loses unsaved selections, not uploaded files.
- A renamed invalid PDF and blank image were tested; encrypted PDFs, damaged-but-correct-header PDFs, deliberate network interruption, credit exhaustion, workspace denial and stale-request release were not independently forced in live tests.
- Existing owner RLS policies and server ownership checks were inspected; a second-user authenticated attack test was not performed. A signed-out library check does not establish full adversarial isolation testing.
- Tests ran in the local preview. Published-host runtime execution has not been independently verified.
- No final government scheme eligibility matching or cross-document merged eligibility profile is implemented. Citizens review each document's information separately; no later matching stage is enabled.
- Original files, extraction and confirmed review persist privately until deleted by the citizen. Deletion cannot undo an already completed external AI operation.

No further credentials are required for the tested workflow. Continued AI access requires available workspace credits and permissions.