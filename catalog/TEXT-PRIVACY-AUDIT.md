> Historical inspection report. Findings below were resolved as described in [PRIVACY-DISPOSITION.md](PRIVACY-DISPOSITION.md). The PDF limitation is superseded by [PDF-PRIVACY-AUDIT.md](PDF-PRIVACY-AUDIT.md).

# Bounded safety audit of the assembled Shavit handoff

Audit date: 2026-09-08. Snapshot scanned: `/Users/jakehorvitz/projects/shavit-handoff`. Read-only; no files changed.

## Findings requiring curation before sharing

1. **Raw iMessage extract remains copied:** `projects/shavit-rootman-website/docs/tasks/sources/howder-imessage-story-sources-2026-08-24.txt` (67 lines / 3,423 bytes). Its header contains Shavit's personal phone, identifies the Messages database, and retains row IDs/timestamps. The body is project copy/feedback. Replace it with the useful authored copy and brief non-identifying provenance, or remove it. Ensure the file's original content does not remain in a media blob/archive or stale manifest record.
2. **Personal phone hardcoded into collection scripts:** `projects/shavit-pipeline/docs/reel-specs/_scripts/build_triage.py:17` and `collect_shavit_media.py:28`. Both read the current Mac's `~/Library/Messages/chat.db`; they are Jake's local collection tools, not standalone production deliverables. Parameterize the contact identifier using an explicit argument/environment setting and document that the tool is optional/local, or exclude these collectors from the friend-facing bundle.
3. **Personal phone in narrative handoff:** `projects/shavit-pipeline/docs/reel-specs/RESUME-rev6-motion-build.md:202`. Redact the number while keeping the useful July 29 asset-labeling correction. This file also names Jake's personal Google account at line 157; replace that with “the original operator's Google account” if identity is not needed.

No actual API keys, GitHub tokens, AWS access keys, OpenAI/Anthropic tokens, JWT credentials, password-bearing URLs or private-key blocks were found in the UTF-8 text files scanned. This is a bounded pattern scan, not a guarantee about every binary/image or arbitrary credential format.

## Reviewed candidates that are not credentials

- Both copied website `site/supabase/config.toml` files: line 101 is `env(OPENAI_API_KEY)` and line 326 is `env(SUPABASE_AUTH_EXTERNAL_APPLE_SECRET)`. They are placeholders.
- `drive_auth.py`, `drive_pull.py`, `dl_folder.py`, `east-victoria-story-2026-07-23/_scripts/dl_ev_v2.py`, and `_drive-dump/dl_ev.py` refer to local credential/token file paths but do not contain their values. Keep only with a portability note; never copy the referenced JSON credentials. `drive_auth.py:4` names Jake's personal Google account and can be generalized.
- `spec-inbox.jsonl` files under the website, pipeline and August recap are annotation comments with `at`, `section`, and `comment` fields, not exported iMessage databases. A keyword review found no secrets or off-topic private conversation. They preserve creative feedback; a human-readable feedback log would be easier for the successor.
- `legacy/marketing-engine/03-lead-log/lead-log-template.csv` has generic example rows without individual names/contacts. Its parent README calls these examples. Keep clearly marked as sample data.
- `legacy/marketing-engine/07-content-engine/approval/queue.sample.json` is sample captions with an empty video URL, not an active posting queue.
- Source references to chat.db or verbatim client copy in other project notes mostly explain provenance/asset decisions. They are not secret material by themselves; do not confuse a useful copy source with unrestricted permission to publish private conversations.

## Limits

There are 29 copied PDFs. This audit did not extract their text because neither pdftotext nor a PDF extraction Python package was available in the invoked runtime. Images/video/audio/media-release archives were outside this bounded text audit. Expanded zip text was covered where assembled under the repo; original archive binary safety depends on the root packaging process. The separate design report identifies source asset quarantine and historical/current distinctions.
