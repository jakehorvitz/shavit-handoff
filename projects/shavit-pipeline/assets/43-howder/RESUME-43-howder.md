# RESUME — 43 Howder reel (handoff, written 2026-07-11 ~16:20)

## One-line state
Editorial photo-cut **preview_editorial.mp4 (13.5s)** is built and awaiting Jake's verdict in the
vertical viewer; the AI-walkthrough approach (4 cuts) and a first photo-reel draft were REJECTED and
are parked in `clips/`. Spec is at **rev 7** (storyboard.html). ~205 Higgsfield credits remain of 530.

## Read these FIRST (standing rules from today, all in memory too)
1. **Specs must be annotatable** — every spec/review page includes `spec-annotate.js` + `data-spec`;
   Jake's notes land in `docs/spec-inbox.jsonl` as `{at, section:"<spec>/<key>", comment}`.
   Read them with: `curl -s localhost:8765/annotations` (filter prefixes `43-howder/`,
   `43-howder-video/`, `43-howder-build/`). Fold notes into the next rev; highlight changes
   (`.revlog` + `class="chg"` gold glow), clear glows next rev.
2. **Incremental build review** — never one-shot a render. Build one thing, show Jake, wait.
3. **Realism prompt standard** (if ANY generation happens): identity chain, concrete nouns, one named
   action per person, name the capture device, specify light, fold negatives into positives.
4. **No contractions in replies to Jake or drafted copy.**
5. **NDA**: Shavit Rootman material is confidential — local only, never publish/Artifact.
6. **Never auto-post.** Ship = queue to `outbox/`; Jake/Shavit approve everything.

## Where everything lives
- Project: `~/projects/shavit-pipeline/assets/43-howder/`
- Spec (rev 7, storyboard w/ images+timeline): `storyboard.html`
- Review viewer (vertical/IG format, pause-to-note at timestamps, frame scrubber): `reel.html`
- Build monitor (older, shot cards): `build.html`
- Server: `python3 serve.py` from `~/projects/shavit-pipeline` → `http://localhost:8765/assets/43-howder/...`
  (probably still running; check `lsof -ti:8765`)
- Source photos: `unit1/raw/` (16 AFTER + 7 BEFORE u1-17..23 are PNG!), `unit2/raw/` (25 mid-rehab,
  Unit 2 has NO finished shots). Catalogs: `unit*/catalog.json`. Contact sheets: `sheets/`.
- Shipping crops (Jake-signed frames): `thumbs2/` + full-res in `build2/`
- All video: `clips/` — key files: `preview_editorial.mp4` (CURRENT), `e1..e7.mp4` (its pieces),
  `V_entry2.mp4` (the approved AI door clip), `end_outpaint.png` (9:16 outpainted exterior, BENCHED),
  parked failures: `preview_tour*.mp4`, `T_ext*.mp4`, `preview_photoreel.mp4`.
- Design capture of the killed AI concept: `rev3-build-notes.md`.

## The current cut (embodies every Jake note to date)
S1 door-ALREADY-open (V_entry2 trimmed from 2.3s — the only AI beat) → S2 stairs+room (u1-15 crop .75)
→ whip-pan → S3 kitchen wide (u1-05 crop .38) → S4 kitchen front (u1-08) → wipe → S5 vanity (u1-04)
→ S6 shower (u1-13) → white flash → S7 the UNTOUCHED photo u1-16 full-frame on black matte + gold rule.
**NO captions/type anywhere** (Jake: "take out any captions for now"). Transitions are edit-craft
(xfade hblur/smoothleft/fadewhite) — deliberately non-AI after 4 failed AI-seam attempts.

## Jake's taste rules (hard-won today — violating these wastes a round)
- Facts only, no adjectives/emotion; no testimonials; no $; street name only (HOWDER STREET), full
  state names (MICHIGAN); town still UNKNOWN (needs `./shavit.sh fact add`, Shavit confirms).
- Person-logic: never pass through an unseen door; no fast zooms; anatomically plausible movement.
- No direct cuts — smooth or white-flash. Never repeat a gimmick transition.
- AI seams/glides of interiors FAILED his bar repeatedly; blind 9:16 center-crops butchered photos
  twice ("NOT THE HOUSE"). Hand-pick crop centers; show him crops BEFORE assembly.
- Music: Hurts So Good (John Cougar), full-band section not the drums intro; Jake sources the
  copyright-free file himself. River Street reel used "Small Town" — the switch is deliberate.
- Brand card (DEFERRED with captions, spec in hand): mirror delivered River St outro exactly —
  gold #FFC000, ivory #F5EFE1, Bricolage+Manrope (fonts copied to `clips/`), eyebrow
  "BUILT IN MICHIGAN, OHIO & INDIANA", SHAVIT(white) ROOTMAN(gold), "REAL ESTATE, OPERATED.",
  "MADE POSSIBLE BY THE CPM TEAM", LIVE WITH US / WORK WITH US CTAs.

## Open items (in order)
1. **Jake's verdict on preview_editorial.mp4** — check `43-howder-video/` annotations first thing.
2. **Provenance**: Jake asked "are we sure these photos belong to this house" — all frames are from
   Shavit's Drive folder "43 Howder - Duplex" (verified consistent flooring/trim/exterior), but Jake
   should confirm with Shavit one-line before shipping.
3. Flagged honestly: the S7 matte close reads small on a phone — alternatives: tighter real crop or
   end on an interior.
4. Later: captions/brand-card decision, drop in music, upscale/export 1080×1920 → `outbox/`.
5. Parallel path Jake approved exploring: ask Shavit for a real 5-min vertical phone walkthrough
   (draft text is in rev 5 history / can redraft) — real footage becomes the flagship cut.

## Environment gotchas
- ECC GateGuard hooks demand "facts" before first Bash and before each new file Write/Edit — present
  the 4 facts inline and retry; do not fight it.
- Higgsfield uploads: `media_upload` → curl PUT → `media_confirm` → use media_id; job_status with
  sync:true polls ~25s server-side. kling3_0 supports start+end image; turbo start only.
- BEFORE photos u1-17..u1-23 are `.png` (CleanShots) — glob `raw/*.*` or they silently 404.
- Session server cwd resets after every Bash call (hook) — use absolute paths or re-cd each command.
