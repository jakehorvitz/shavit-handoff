# Pre-build asset audit — 2026-07-03 (Fri night)

Scope: council critique-feasibility-v4 findings 6, 7, 8, 9. Every one of the 84 files in `assets/cropped/` was inspected by eye; all 10 films in `assets/films/` were frame-scrubbed (contact sheets at 1–3 fps + full-res verification frames). Per-file labels live in `assets/manifest-audit.csv` (check.sh §same-house already reads this file; `manifest.csv` was left untouched because `build_video.py:173` rewrites it on every run — columns appended there would be clobbered).

---

## 1. Property / state census (finding 7)

"Usable" = correctly identified, non-banned, and salvageable by re-crop (see §4 — only 1 of 84 crops is hygiene-clean as-is).

| Property | State | AFTER plates | BEFORE plates | Notes |
|---|---|---|---|---|
| River Street | MI | 8 (after_049, 055–061) | 3 (before_004 kitchen, 005 bath, 006 exterior) | before_006 carries an MLS "MichRIC" watermark — licensing + OCR risk; the films hold cleaner before/after frames of the same views |
| 61 Salem | MI | 8 (after_018–022, 053, 054, salem_video_after) | 6 (salem_video_before, after_023–025 [misfiled as after], before_009, 010 LOW) | salem_video_after is the hook/reward reserve |
| East Saint Joe | MI | 9 (after_026–034) | 3 (after_035–037 [misfiled as after]) | |
| Budlong | MI | 4 (after_038–041) | 2 (after_042 [only clean crop], 043 [Street View screenshot]) | |
| Second Chance Ranch | MI | 5 (after_044–048) | 0 | |
| West Side | OH | 2 (after_051, 052 — kitchen only) | **0** | no exterior crop; exterior exists only in film (LF2 t≈66s shows Larchmere, not West Side — West Side has no verified exterior anywhere) |
| Larchmere | OH | **0 crops** (hero 07 + film footage only) | **0** | Larchmere Duplex — Showcase.mp4 t0–2s has the exterior; interiors staged t2–13s |
| 2217 Parkview | IN | 7 (after_070–076) | **0 verified** (before_012/013 are a grey-cinderblock rear that matches Parkview's painted-block construction — CANDIDATE ONLY, needs Shavit confirm) | |
| 34 Mead | MI | 2 — **BANNED** (after_062, 063) | — | after_063 is a full desktop IG screenshot incl. "$57,500" caption |
| Cleveland Heights | OH | 1 — **BANNED** (after_077) | — | |
| UNKNOWN | — | 9 (after_064–069, 078–080) | 12 (before_002/003/007/008/011/012/013/014/015/016/017 + before_001) | before_001 + after_050 are a "61"-numbered pebbledash/Tudor house whose architecture **conflicts** with the 61 Salem hero + split-screen film — flag to Shavit, do not composite as Salem |

**Totals (usable, non-banned): MI ≈ 34 afters / 14 befores · OH = 2 afters / 0 befores · IN = 7 afters / 0 verified befores.**

## 2. Human beats + Midwest texture (finding 9)

**Humans found across all 10 films (~6 min scanned) and all 84 crops: ZERO.** No crew, no hands, no residents. (Only "humans": a sliver of an adjacent IG post showing someone's shoes bleeding into the top edge of after_080, and photographer username tag-pills on after_026 — both unusable.) **The spec's ≥3 human beats cannot be sourced from current assets.** Decide the fallback now — spec wording allows porch/lawn/flag/small-town *texture* to count.

Best texture beats (timestamps verified on extracted frames):

| Texture | Source | Timestamp | Notes |
|---|---|---|---|
| Burning fireplace (real flame, white brick) | Long Form 1 (Collage).mp4 | t≈17.5–19.5s | warmest interior beat in the archive |
| Front porch + autumn wreath, sidewalk, lawn | Shavit River Street — Before-After.mp4 | after t≈3.3–4.7s (before-state porch t≈0–2.3s) | the film's own angle-matched exterior |
| Small-town street: lawn, sidewalk, big trees | Reel 1 (Pia).mp4 — Budlong segment | t≈6–8s | caption band baked (see §4) |
| Sloped lawn + long ranch, golden light | Reel 1 t≈12–14s; Reel 2 t≈13–16s; LF2 t≈76–130s (long clean hold) | LF2 hold is caption-free after t≈78s | best lawn texture |
| Cleveland streetscape: porch columns, Victorian neighbors | Long Form 2 t≈66–68s (Larchmere ext) | no captions on this shot | OH texture |
| Porch pillars, brick, dusk | East Saint Joe — Captioned.mp4 t≈8–9s and t≈18–19s | "A DIFFERENT ENDING"/"THIS IS WHAT WE DO" captions on parts | |

No American flag appears anywhere in the archive.

## 3. Angle-matched anchor pairs for Kling frames-mode (finding 6)

**Verdict: VIABLE — but only on River Street, not Salem.**

★ **PRIMARY ANCHOR (VIABLE): River Street exterior**, from `Shavit River Street — Before-After.mp4` (1080×1920, wipe transition at t≈2.3–3.0s):
- BEFORE frame: **t≈2.0s** — grey siding, white door w/ wreath, gable vent top-right, porch left, sidewalk bottom.
- AFTER frame: **t≈3.7s** — white siding/black trim/black door + chimney, **same camera position, same framing** (gable, downspout, door, window and sidewalk all register across the wipe; the film itself wipes between these plates, which is why they align).
- Captions: small "BEFORE"/"AFTER" chips baked top-left, ≈ x 55–300, y 125–200 (of 1080×1920). The chip sits over sky/tree — crop the top ≈220 px (or re-frame 9:16→4:5) and both plates are caption-free.
- Grading: before is desaturated/darkened — Kling will read it as weather/season change, which is the intended story.
- The same two plates recur in `River Street — Captioned.mp4` (t≈0–6 / t≈7.5–9) but there the captions ("NOBODY SAW IT COMING", "RIVER STREET / HILLSDALE, MI") sit mid-frame over the house — use the Before-After film's frames, not these.

Secondary candidates (ghost-dissolve grade, NOT frames-mode grade):
- River St kitchen, same film: before t≈5.3–7.0s / after t≈7.3–11s — same corner, but stove/fridge/window positions shift; moderate match.
- River St bathroom, same film: before t≈12–14s / after t≈14.3–16.3s — before is a tighter crop; weak match.
- East Saint Joe living wall (leaded-glass door + window): `East Saint Joe — Captioned.mp4` before t≈13–14s / after t≈15–16s — same wall, different focal length; dissolve-only.

**NOT VIABLE: 61 Salem split-screen exterior** (`61 Salem St — Split Screen.mp4`, verified full-res at t≈1.7s): the film is a simultaneous top/bottom split; the BEFORE half is shot from the front-left corner looking up, the AFTER half from the front-right corner — **opposite corners, exactly as finding 6 said**. Kling would have to hallucinate a ~180° orbit. Also both halves carry baked BEFORE/AFTER chips (top half chip ≈ y 30–70; bottom half chip ≈ y 990–1065). Salem interiors in the same film (t≈3–9s) are different rooms/angles across the split — no pair.
- No Salem studs/tree-through-roof frame exists anywhere in the archive (confirmed across all 84 crops + all films).
- Consequence for §01 Ch.1: run the Tree chapter as the **re-cut of the real split-screen film** (spec default), and give the frames-mode construction effect to the **River Street exterior pair** or the Proof beat. If Shavit's incoming photos land an angle-matched Salem pair by Sat noon, revisit.

## 4. Hygiene kill-list (finding 8)

**83 of 84 crops are contaminated. Only `after_042.jpg` is clean.** Nothing else may be composited until re-cropped. Contamination classes:

- **IG carousel chrome** (circled ‹ › chevrons, dot page indicators, red notification slivers on the left edge): on ~90% of crops — every property group.
- **Desktop/browser chrome** (navy title bar, grey window strip): before_007/008/010/015/016, after_062/063, after_066/068/069, after_070–080.
  - **before_016 has the macOS window title "Personal Jarvis" baked in** — the privacy leak the pre-step exists to stop. KILL until re-cropped.
  - **after_063 is a full desktop IG post screenshot**: username "shavitness", caption "34 Mead Street… bought for $57,500" (a dollar figure — Shavit's hardest rule), like counts, comment box. KILL outright (also BANNED property).
- **Banned properties: after_062, after_063 (34 Mead), after_077 (Cleveland Heights). Never composite.** (plates916/ also still contains s10_mead_street.jpg and s02_cleveland_heights.jpg from the rejected build — do not reuse.)
- **Adjacent-post slivers** (strips of the next grid photo at top/bottom edges): most crops; after_080's sliver includes people's shoes.
- **Baked captions/watermarks**: salem_video_before/after ("BEFORE"/"AFTER" chips), before_006 (MLS "MichRIC" watermark — also a rights question), after_026 (3 photographer username pills), after_043 (Google Street View X-button + map pin).
- **Identity conflict**: before_001 + after_050 — Tudor/pebbledash house numbered "61" that is not the 61 Salem of the hero/film. Hold until Shavit confirms what it is.

Re-crop rule of thumb verified by eye: the photo rectangle inside each screenshot is intact; cropping 3–6% off each edge (and the top strip where window chrome exists) clears chevrons/dots/slivers on most plates. Chevrons sit at the vertical midline of the photo edges — crop width, not just height.

**Baked caption bands in re-cuttable video segments** (all 1080×1920; state abbreviations will fail the new `ocr_no_state_abbrev` gate):
- Reel 1 / Reel 2 property lower-thirds ("34 MEAD STREET / HILLSDALE, MI", "CLEVELAND HEIGHTS / CLEVELAND, OH", "2217 PARKVIEW / SOUTH BEND, IN", …): centered, property line ≈ y 1400–1500, state line ≈ y 1500–1560; safe band to kill: **y 1380–1600**. Crop above the band or avoid captioned spans.
- East Saint Joe / River Street captioned films: title + state lines sit mid-frame, ≈ y 960–1130 (over the subject) — these spans cannot be cropped clear; avoid, or use the Before-After film variants.
- BEFORE/AFTER chips (river_ba, esj_cap pairs): top-left ≈ x 55–300, y 125–200.
- Salem split-screen: chips at y ≈ 30–70 (top half) and y ≈ 990–1065 (bottom half).
- Long Form 1 (1920×1080): banned text baked mid-frame — "$12M+ PORTFOLIO VALUE" (t≈27–29), "MI/OH/IN" state-abbrev triptych (t≈24–26), "50 DOORS" (t≈10–12), "200 BY 2030" (t≈35–38). Treat LF1 as caption-contaminated wall-to-wall except the fireplace shot (t≈17.5–19.5, clean) and Salem rear pans (t≈20–22, chips only).

## 5. Proof-beat verdict per state (finding 7 / spec §01 3–9s)

Council rule: a dissolve runs ONLY where a verified same-property before exists.

- **MI: DISSOLVE — YES.** Best pair: **River Street exterior** (film frames, angle-matched, §3) — if River St takes the Ch.1 frames-mode slot, use **East Saint Joe** (before after_035–037 / after after_026–034, same-property verified via both ESJ films) or the River St kitchen pair. Salem is reserved for hook/reward and its pair is angle-broken anyway.
- **OH: DISSOLVE — NO. Degrade to single after plate + "OHIO".** Zero OH befores exist (West Side: 2 after-kitchens only; Larchmere: no crops at all — pull a clean after frame from Larchmere Showcase t≈0–2s exterior or LF2 t≈66–68s, both caption-checked). A mismatched-property dissolve is a fake before/after on a trust film — worse than no dissolve.
- **IN: DISSOLVE — NO (pending one confirm). Degrade to single after plate + "INDIANA"** using after_070–076 (re-cropped). Exception path: if Shavit confirms before_012/013 (grey cinderblock rear + shed/deck) is 2217 Parkview by Sat noon, the IN dissolve is back on — the construction matches, but confidence is LOW and this must not ship unverified.

## 6. Open questions for Shavit (blocking only if unanswered by Sat noon)

1. Is the grey cinderblock backyard (before_012/013) 2217 Parkview? → unlocks the IN dissolve.
2. What property is the "61" Tudor/pebbledash house (before_001 / after_050)? It is not the 61 Salem in the hero.
3. Any angle-matched Salem before/after photos (esp. studs / tree damage) in the incoming batch? → could upgrade Ch.1.
4. What are the two unidentified after-carousels (after_064–069, olive/grey walls; after_078–080, pale-blue + detached garage)? Both look Cleveland-area — either could give OH depth.

---
*Method: heroes 01–10 viewed as identity references; films scrubbed via 1–3 fps contact sheets + full-res frames (extraction under the session scratchpad); all 84 crops individually viewed (3 parallel labeling passes + spot re-verification of before_001, after_018, after_050, after_080, before_012). LF2 note: its container reports 142.6s but the video stream is VFR with long static holds (t≈2–60s is one near-static kitchen frame; scene changes only at 63.6/65.8/68/70.2/75.6/136.6s).*
