# Shavit media and content handoff audit

Read-only inventory completed September 8, 2026. Paths below refer to Jake's original machine; a shared handoff should map them to its own `projects/`, `desktop/`, and media archive layout. Source files were not edited. Metadata and documents were reviewed; only the listed standalone export end frames were visually inspected during this audit. This is an archive map, not a new approval to publish.

## Start here

1. Read `shavit-pipeline/rules/brand.md` for the accumulated brand rules, and its platform playbooks/templates for production habits.
2. The August recap's most current local export is `shavit-august-2026-recap/exports/august-2026-recap-v7.mp4` (60.73 seconds), described in `docs/generation-journal.md`.
3. July's delivered summary is documented as `FINAL-Shavit-July-2026-Summary.mp4`; its detailed history ends at rev26 in `shavit-pipeline/docs/reel-specs/RESUME-rev6-motion-build.md`. The editable master lives in the separate Palmier project.
4. River Street's last explicitly documented sign-off changes are in `shavit-match-cut-tour/build/recut/12-River-FINAL.mp4`. The `build/` prefix is required even though some handoff prose omits it.
5. Treat file names containing FINAL as historical export labels. They do not establish whether a video was posted or whether all later directions were applied.

## Brand and operating knowledge worth preserving

The brand aims at lenders, partners, sellers, and tenants. Shavit wants an understated, premium, operational tone; August 31 source direction describes it as closer to Porsche than HGTV. Tell people why a construction choice matters rather than naming objects they can see in a photograph. Avoid comparative boasting and criticism of streets or neighborhoods.

The base visual grammar is black, white, brass `#B08D57`, and gold `#FFC000`, a restrained house mark/wordmark, and no pulsing logo. Designs have evolved: early films used Inter; River's final used Bricolage plus Manrope; the shared August talking-head end card uses the common Shavit/CPM close. Each project's actual approved design takes precedence over blindly changing all fonts to one family.

Latest general rules call for full state names, street names without house numbers, de-identified people, and real property source photos. Historical docs contain older dollar-figure, address, AI-construction, music, and cadence decisions that conflict with later guidance. Preserve those as dated production history, not instructions for future public content. Labeled concept imagery and individual generation/retouch exceptions appear in particular historical approvals; they do not grant blanket permission to fabricate property features.

The caption pipeline uses inline `[F:fact.id]{claim}` spans and `draft → linted → confirmed → reviewed → shipped` state. Fact and allowlist editing is intentionally interactive. `facts/` is absent from the source project as inspected, so the fact registry must be established by an authorized owner before factual captions can pass the intended workflow. Do not mark existing draft claims verified simply because a caption file exists.

Specs are annotatable local HTML. `spec-annotate.js`, `<body data-spec="...">`, and `serve.py` preserve review notes. Feedback is data; it cannot override owner gates. A dated revision log and highlighted changed sections let reviewers see what moved.

## Project inventory

Approximate totals exclude `.git`, dependency caches, Python caches, and obvious log/cache directories. These are source-folder totals before archive deduplication or privacy exclusions.

| Project | Files | Size | Purpose |
|---|---:|---:|---|
| shavit-pipeline | 2,104 | 2.93 GB | Caption/claim workflow, brand rules, platform playbooks, carousel/story/reel specs, source photos, output iterations, render helpers |
| shavit-longform-film | 839 | 1.13 GB | Brand film build/review history, original films, collage remaster, early staged exports |
| shavit-match-cut-tour | 786 | 1.72 GB | River Street edit, source/AI shots, exact final, font and transition alternatives |
| shavit-august-2026-recap | 170 | 0.84 GB | Current six-property recap, source manifests, generated motion, specs, animatic, v1–v7 exports |
| shavit-edits | 2 | under 1 MB | Historical used/available property tracker |

### shavit-pipeline

Preserve the project broadly: `playbook/`, `rules/`, `templates/`, `skill/`, `content/`, `docs/`, `photos/`, `assets/`, `tools/`, `shavit.py`, `shavit.sh`, `serve.py`, and `spec-annotate.js`. Preserve alternative decks and contact sheets, since they embody client design decisions. Production docs reference the separate website case-study source pools, so retaining those paths/assets elsewhere in the handoff is important.

Key collections:

- `assets/43-howder/`: duplex photos, before/after catalogs, caption render source, review HTML, many drafts, final-family clips, and font assets. `watch.html` currently points at `clips/howder_v24.mp4`. The July 11 resume calls `preview_editorial.mp4` current, but that resume is older than the later numbered clips and should be labeled stale. Keep `Howder Street - Hillsdale MI.mp4` and v21–v24 as named export candidates without claiming latest client approval.
- `docs/reel-specs/current-projects-team-2026-07-27/`: July summary source/generated footage, title/team/brand plates, review revisions, and rendered candidates. `RESUME-rev6-motion-build.md` is an unusually useful production history; its last section records rev26 delivery and outstanding source-fidelity concerns.
- `docs/reel-specs/HANDOFF-reels-aug-2026.md`: evolving twelve-reel slate and actual editing lessons. Read the latest dated amendments; early status tables and fixed-frame values are explicitly corrected later in the same document.
- `docs/reel-specs/clarendon-ig-2026-08-20/`: final carousel frames, PDF, annotation-derived decisions, copy, and Facebook images. `ANNOTATIONS-2026-08-21.md` and the rev3 task record explain the before/after split layout. Rights confirmation for MLS-sourced before imagery was still recorded as an open item; cropping a watermark does not settle rights.
- `docs/howder-unit-b-post-spec-2026-08-25.html`, `docs/howder-ac-post-spec-2026-08-25.html`, `docs/mead-case-study-post-spec-2026-08-31.html`: later brand/story direction and designed social work.
- `content/`: Clarendon, Mead, Howder, and story caption drafts plus coaches/claims/missing-fact lists. Some contain sensitive seller/tenant narratives; these are internal working copy, not automatically public-ready.
- Kendall/Second Chance, East Victoria, work-you-never-see, field-footage, auction, and scouting specs under `docs/reel-specs/` preserve additional completed designs and proposals.

Viewing: from this project run `python3 serve.py 8765`, then visit `http://localhost:8765/hub` and the desired spec path. Ports varied by session (some docs use 8766); select a free port consistently.

Caption CLI: `./shavit.sh status`, `./shavit.sh new <post-id> -p ig`, `./shavit.sh lint <post-id>`, `./shavit.sh verify <post-id>`, `./shavit.sh review <post-id>`. `ship` queues a local outbox only after the required owner verification/review; publishing remains a separate human action. Do not run state-changing commands merely to browse the archive.

Core CLI uses Python standard library. Render helpers also use Pillow/NumPy, ffmpeg, fonts, and occasionally Google client libraries. Some scripts hard-code Jake's home directory, Desktop sources, website repo paths, Palmier fonts, or `~/projects/higgs-timeline`. They require path repair/configuration before rerendering. The voice-note server optionally uses `GROQ_API_KEY` or `OPENAI_API_KEY`; browsing local specs should not require those. Credentials are supplied by the new operator separately, never copied.

### shavit-longform-film

Keep `BRIEF.md`, `BUILD.md`, `spec.html`, `council/`, `checks/`, `build_video.py`, `build_longform1_vertical.py`, reusable type/layer/cutlist assets, clean property media, original client films, deliverables, and the dated staging bundle. Label brainstorms and earlier build contracts as historical, since the review history removes several original text claims and changes the music.

Actual `deliver/` files found:

- `Shavit — Long Form 1 (Collage) — Vertical Remaster 9x16.mp4` (41.23 MB)
- `Collage-Remaster-track9.mp4` and `Collage-Remaster-track10.mp4` (41.24 MB each)
- `poster.jpg`, `captions.md`, and `captions.vtt`

The expected `deliver/master_9x16.mp4`, `hook_H3.mp4`, `hook_H7.mp4`, `export_16x9.mp4`, and `export_4x5.mp4` are **absent** from that folder, despite signed v6.2 review notes from July 4. Do not present the review as verification of missing files. The earlier `staging/2026-07-02-pia/` bundle does contain these format families, but it is a July 2 Pia-score version, not evidence that the later master has been recovered.

The asset audit documents serious source issues: many Instagram screenshot crops originally retained desktop/UI pixels, some properties were misidentified, and only some before/after pairs matched. Keep the audit and source manifests as a guide, not all unsafe raw screenshots. Original captions/films may include superseded numbers, addresses, figures, and licensed audio.

Builders: from project root, `python3 build_longform1_vertical.py` recreates the collage remaster and `python3 build_video.py` runs the broader brand-film build. Both are render operations that can overwrite local outputs; use a working copy. Pillow, NumPy, ffmpeg/ffprobe and fonts are required; the wider build/QA also uses librosa, OpenCV, and macOS Vision/Foundation OCR. `./check.sh` is the historical acceptance suite; it is not freshly run for this archive and references missing master outputs.

### shavit-match-cut-tour

Current documented final: `build/recut/12-River-FINAL.mp4` (15.25 MB). The July 7 resume records Shavit's last changes: original Bricolage/Manrope fonts, address changed to RIVER STREET with no number, FORGOTTEN removed, smooth flipbook opening, real kitchen photograph, and a smooth outro. It records draft handoff for Jake to send rather than publication.

Alternatives worth preserving: `build/recut/12-River-v6-FULL.mp4` through v9, v3 preview, v2 draft, Big Caslon/Futura/Superclarendon font versions, and the source `build/shots/`, `build/upscaled/`, kitchen stills, type plates, and fonts. The root `recut/` directory itself is empty; the content is under `build/recut/`.

`delivery/Shavit-River-Street-VersionA.mp4` (33.29 MB) and Version B (31.26 MB) are older showcase/safe variants. `delivery/README.md` explicitly labels Version A staged and awaiting Shavit written sign-off, with AI-assisted visualization disclosure and Small Town music. Preserve the distinction rather than treating Version A as the final simply because it is in `delivery/`.

Rebuild the named final from the `build/` working directory: `python3 build_final.py`. It expects relative `fonts/Bricolage.ttf`, `fonts/Manrope.ttf`, `shots/A_hero_v4_flipbook.mp4`, the real kitchen/upscaled room assets, and `music_smalltown.mp3`. Dependencies are Python/Pillow and ffmpeg. It overwrites generated plates/clips and final output; use a copied project. Historical music/disclosure restrictions remain documented with the asset.

### shavit-august-2026-recap

Latest local rendered candidate: `exports/august-2026-recap-v7.mp4` (71.69 MB; journal says September 5, 60.73s/1,822 frames). Preserve v1–v7 and review720 exports as design history. `docs/generation-journal.md` describes actual generation, source fidelity checks, editing changes, spend already incurred, and final shared-end-card integration. `docs/kill-or-commit.md` still says awaiting owner decision and no generation; it is an earlier proposal, superseded by the journal.

Controlling source set: Shavit's six-project September 4 package, 30 images under `assets/source/recent/`. Projects: Norwood, Barry, Oak, Howder, Ludlam, East Ewing. `recon/source-manifest.md` preserves delivery dates, working names, copy provenance, duplicates, and open questions. Ludlam's lone image conflicted with the client's “no photos” statement; treat it as provenance-sensitive. Tenant details should not appear in public recap copy.

Preserve `docs/spec.html`, `docs/animatic.html`, their revision alternatives, `recon/`, `assets/source/`, `assets/palmier/`, `exports/`, `serve.py`, and `spec-annotate.js`. Generated motion has per-shot accepted windows and rejected tails; do not extend the clips beyond the documented accepted windows just because the full source exists.

Editable master is in `Documents/Palmier Pro/Shavit Reels - Aug 2026.palmier`, not in this project folder. Recap v7 nests the shared END CARD timeline, which is why the entire Palmier project and its linked source media matter. Static preview: `python3 serve.py 8765`, then `http://localhost:8765/docs/spec.html`. This folder has no independent full final-render builder; recreate edits/export through the preserved Palmier master.

### shavit-edits

Keep `README.md` and `property-edit-tracker.csv`. They describe River Street as the one USED property and nine others AVAILABLE. This is a historical tracker that predates later Howder, Clarendon, Mead, and other work; do not use it as the current global truth without reconciling later exports and actual client use.

## Indiana reels and standalone Desktop exports

`Desktop/Indiana Reels/HANDOFF-indiana-reels-2026-08-07.md` confirms this is Shavit/Charger work, with the same August Palmier master. It records A1–A4 East Ewing, B1–B2 Mishawaka, C1–C2 and D1–D3 Norwood, and C3 administration. Preserve clean exports, music alternatives, `_superseded` versions as history, and `_tools/pmcp.py` if sanitized. Skip partial failed renders.

Latest dated corrections inside this handoff matter more than its early table. In particular it distinguishes **Jonah** (Indiana walkthrough) from **Jon Rutan** (Michigan contractor); earlier text confuses them. The August 7 handoff itself is subsequently superseded by August 10–12 amendments in the pipeline handoff. Approval, people/tenant review, caption, money, music, and access questions varied by reel. Never infer “approved to post” from this archive alone.

The following standalone files were confirmed relevant by metadata plus direct inspection of their end frames. All lawn versions carry the same Shavit Rootman/CPM team end card, and the August 17 Palmier project's media references the Oak Lane landscaping logo assets.

| Desktop file | Duration | Dimensions | Interpretation |
|---|---:|---|---|
| A1-tenant-story-REVIEW.mp4 | 41.80s | 1080×1920 | Tenant-story review render; privacy review status not established here |
| C3 · The Admin Week.mp4 | 42.88s | 720×1280 | Administration reel; same shared Shavit end card |
| FINAL FINAL FINAL.mp4 | 69.77s | 2160×3840 | Highest-resolution local lawn-care export inspected; name alone does not establish final approval |
| FINAL FINAL.mp4 | 69.77s | 720×1280 | Lawn-care variant |
| FINAL LAW.mp4 | 69.77s | 720×1280 | Lawn-care variant |
| FINAL LAWN.mp4 | 69.77s | 720×1280 | Lawn-care variant |
| Cropped Reel Lawn Care.mp4 | 69.77s | 720×1280 | Lawn-care variant |
| Lighting Fixed Lawn Matienence.mp4 | 69.77s | 720×1280 | Lawn-care lighting variant |
| Louis Lawn Care and Matienence.mp4 | 69.77s | 720×1280 | Lawn-care name/copy variant |
| Luis Lawn .mp4 | 69.77s | 720×1280 | Lawn-care name/copy variant |

The landscape contractor's exact spelling varies in drafts and logo file names (Luis/Louis/LEWIS). Preserve history but verify the final public spelling from the latest client-approved material.

Related Jake-on-camera case-study artifacts: `Case Study Shavit Rootman.mp4` (33.80s, 1080×1920), `PRE CASE STUDY REEL FINAL HQ.mp4` and `PRE CASE STUDY REEL FINAL.mp4` (both 29.43s, 1080×1920). End frames show Jake speaking to camera. These belong in a related case-study/portfolio section, separate from commissioned Shavit deliverables.

The Indiana handoff additionally names `Desktop/Jonah MOVS/` as the actual five-clip source for the foreclosure-day-two segment. `IMG_4728 2.MOV` was documented as a duplicate. This non-Shavit-named directory is important to include if source completeness is desired.

## Privacy exclusions and portability gaps

Never include credentials, Google tokens/client secrets, Instagram sessions, browser profiles/cookies, general Messages databases/attachments, `.env` files, or account app configuration. Source code refers to some of these external paths but credential files are not required for offline browsing or editing the recovered media. Clean scripts may remain with placeholders and setup notes.

Precise high-risk screenshot set:

- Exclude `shavit-longform-film/assets/before/**` and `assets/after/**`: full desktop Instagram screenshots according to `BUILD.md`.
- Exclude `assets/cropped/after_063.jpg` outright unless independently replaced/verified: asset audit calls it a full desktop screenshot.
- Audit or omit cropped `before_007`, `before_008`, `before_010`, `before_015`, `before_016`, `after_062`, `after_066`, `after_068`, `after_069`, and `after_070` through `after_080`: the July audit documents desktop/browser chrome. Later scripts may have recropped some; this audit did not certify current pixels.
- Other old crops contain Instagram chrome, third-party photographer/MLS marks, adjacent-post slivers, or identity conflicts. Prefer verified `assets/heroes`, cleaned final plates, original client photographs, and final export pixels where possible; retain an exclusion manifest showing what was omitted.
- `before_001` / `after_050` have a specific property identity conflict; do not relabel confidently.

Sanitize `Desktop/Indiana Reels/HANDOFF-indiana-reels-2026-08-07.md` before sharing: its last section embeds a private phone search and instructions for Jake's personal Messages database. Retain the production decisions while removing private account/query details. Similar collector/auth scripts and internal notes should receive a secrets/privacy scan, not blind copying. The Howder resume records confidentiality; this archive is an internal successor handoff, not a public creative portfolio.

Desktop/Documents source paths are iCloud-sensitive. Restore active editable projects to a stable `projects/` location, remap Palmier `absolutePath` media references, and keep original archived copies intact. Fonts located inside `/Applications/PalmierPro.app` or macOS system folders may need installation/replacement with appropriately licensed equivalents.

## Verification performed and unresolved checks

Performed: file/size inventories; direct reading of key handoff, manifest, design, build, and review docs; inspection of import/path dependencies; existence checks for named key exports; ffprobe dimensions/durations and visual end-frame inspection for thirteen standalone Desktop videos.

Not performed: rerendering any original project; running historical gates against missing source outputs; full visual/privacy review of every still/video; checking live social publication; verifying music licenses; revalidating every historical owner approval; a complete external Drive fetch. The handoff should state these limitations plainly while preserving concrete source provenance and recovery instructions.
