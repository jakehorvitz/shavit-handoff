# Shavit PDF and expanded-archive privacy audit

Completed 2026-09-08 against `/Users/jakehorvitz/projects/shavit-handoff`. Read-only; repository files were not modified. This addendum closes the earlier report's PDF-extraction gap.

## Result

No credential values, private-key blocks, token/JWT patterns, raw-message database identifiers, personal phone identifier, unrelated career/relationship strategy, or credential-like dumps were found by the bounded PDF text/OCR scans. No PDF had embedded file attachments or AcroForm fields. No suspicious page required additional visual investigation.

Scope:

- **29 PDFs / 254 pages** opened successfully with bundled `pypdf`; zero extraction errors.
- **14 text-bearing PDFs** were scanned through their extracted text.
- **15 image-only carousel PDFs** reduced by exact SHA-256 matching to **9 unique files / 82 pages**. Embedded page images were extracted and OCRed locally with Tesseract; all 82 succeeded, produced 22,070 characters, and had no matches across the audit categories. Duplicate copies inherit the same OCR result because their entire file hashes match.
- 117,491 characters were extracted in the initial all-PDF pass, including page separators from image-only files.
- The carousel PDFs are expected project deliverables: Clarendon, East Victoria, Kendall, Mead and Howder; some are expressly prior/retired revisions. Keep the current/archive labels from the main handoff.

Three keyword matches were reviewed and cleared:

| File | Page | Disposition |
|---|---:|---|
| `legacy/proposals/shavit-onboarding-checklist.pdf` | 1 | Requests delegated manager access rather than sharing passwords. No password value. |
| `projects/shavit-rootman-website/final-shavit-real-estate/project/uploads/shavit_rootman_website_brief.pdf` | 10 | “Credentials” refers to professional skills/certification. No account credential. |
| `projects/shavit-rootman-website/final-shavit-real-estate/project/uploads/shavit_rootman_website_brief-f2a0ffd1.pdf` | 10 | Duplicate professional-credentials wording. No account credential. |

## Expanded ZIP directories

Both expanded archive trees were checked for `.env*`, secrets/credential/token/cookie/session/private-key-like filenames, `chat.db`, and `.git` contents:

- `deliverables/Shavit - Clarendon Carousel.zip.contents`: 5 files, no risky filenames.
- `deliverables/Shavit/Netlify Ready (before invest-page rewrite, Jun 2).zip.contents`: 26 files, no risky filenames.

The expanded website's text files were covered by the preceding repository-wide text scan. Its retained code remains an archival website version, not the current production source. The Clarendon ZIP's PDF is an exact duplicate of the separately included carousel PDF and was covered by the hash-deduplicated OCR pass.

## Evidence and limits

Machine-readable extraction results: `/private/tmp/shavit-pdf-audit/index.json`; OCR results: `/private/tmp/shavit-pdf-audit/ocr-index.json`; exact-duplicate groups: `/private/tmp/shavit-pdf-audit/image-pdf-groups.json`. Extracted text and OCR intermediates remained under `/private/tmp/shavit-pdf-audit` and should not be copied into the handoff repo.

This was a bounded privacy-pattern scan plus review of matches, not a legal/content-approval audit or a layout review. OCR can miss small/decorative/low-contrast text. The audit did not visually review every photograph, scan video/audio media for incidental screen/private content, or inspect original unexpanded ZIP binaries. It does not claim that every property photo has publication rights or that historical draft copy is currently approved.
