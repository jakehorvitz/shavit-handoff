# Archive verification

- Original source repositories and live services left unchanged.
- Copied source files inventoried with paths, sizes and SHA-256. Media deduplicated by SHA-256 into 23 tar archives with independent archive checksums.
- Text privacy audit completed; identified private message extract and account-bound collectors removed; personal identifiers at audited locations generalized.
- All 29 PDFs (254 pages) opened. Text extracted from text-bearing files and all 82 unique image-only pages OCRed. No additional sensitive findings.
- Restore/relink helpers: 10 isolated tests passed, covering hash corruption, unsafe tar/catalog paths, symlink escapes, prefix filtering, idempotence and preserving existing edits.
- Actual website archive restore passed: 878 media files restored, 136 existing source files verified.
- Clean website install and production build passed in `/private/tmp/shavit-website-check` using the recovered source and assets. Existing dependency audit advisories: 4 moderate, 4 high. Existing React `buffer` warning retained. No deployment was performed.
- Palmier source audit: no missing-source IDs used by the active timeline in any recovered package; 30 missing historical library references recorded separately. This does not certify playback or rendering.

- Full actual archive restoration completed: **10,595 catalogued files** verified byte-for-byte after restore; 2 valid cross-project links restored. Four original broken comparison links remain documented rather than synthesized.
- Actual Palmier relink test: **283 path values in 90 JSON files** rewritten in a separate copy; **0 mapped media missing**, with the 30 known unmapped historical references reported. No archived package was changed.

Remote upload verification is added after all release assets arrive.

The adjacent August 29 competitor report was subsequently added and hashed, bringing the recovered source catalog to 10,595 files.
