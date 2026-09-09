# Build contract — The House That Came Back (60s brand film)

Read spec.html (the signed spec) first. This file is the practical build contract:
exact paths the acceptance gate (`./check.sh`) verifies, plus environment facts.

## Deliverables (exact paths — check.sh is the gate)
- `deliver/master_9x16.mp4` — H1 hook master, 1080×1920@30, h264 yuv420p +faststart, 55–62s, −14 LUFS ±1.5
- `deliver/hook_H3.mp4`, `deliver/hook_H7.mp4` — full films, identical from 3s on (head-swaps)
- `deliver/export_16x9.mp4` (1920×1080), `deliver/export_4x5.mp4` (1080×1350) — re-set type inside each frame's safe area; NOT blind center-crops
- `deliver/poster.jpg` — pin/poster frame (the reward frame with wordmark)
- `deliver/captions.md` — per-platform captions in the voice of assets/captions/*.txt
- `build/cutlist.json` — `{"events":[t0,t1,...], "exempt":[t_silence]}` every cut + dissolve-midpoint timestamp; the Ch.2 silence beat goes in `exempt`
- `build/layers/*.png` — pre-composite type/graphics frames (RGBA, brand hexes only)
- `assets/manifest.csv` — columns `file,source,rights` covering every file in assets/cropped/ and assets/upscaled/
- `checks/visual_review.md` — must contain literal lines `HOOK-REWARD MATCH: PASS`, `AI-MOTION: NONE` (or `REVIEWED`), `NO-ADDRESS OCR: PASS` — write them only after actually doing each review (extract + eyeball frames)

## Asset pre-step (do FIRST)
Raw pool (already in repo): `assets/before/` + `assets/after/` are 2880×1800 FULL-DESKTOP
screenshots of Instagram posts — browser chrome and private desktop visible. You MUST:
1. Auto-crop each to the photo rectangle only (the IG image region) → `assets/cropped/`.
   Detect the large photo region programmatically (largest non-UI rectangle); verify by eye on a sample.
2. Dedupe near-identical carousel frames.
3. `assets/heroes/` (10 website JPGs) are clean — use directly, list in manifest as `source=shavitrootman.com repo, rights=client-owned`.
4. `assets/films/` has prior videos incl. `61 Salem St — Split Screen.mp4` (Ch.1's property) — you may extract segments/frames.
5. NO other image sources. No Zillow/Redfin. No stock. No generated property imagery.

## Story content (verbatim type lines — spec §01; claims are locked)
Hook H1: EVERYBODY DROVE PAST THIS HOUSE. · H3: BOARDED UP. GUTTED. WRITTEN OFF. · H7: THE WORST HOUSE ON THE STREET. WATCH.
Proof counters: 50 DOORS / MI · OH · IN / $12M+ PORTFOLIO VALUE
Ch.1 (SALEM STREET tag): A TREE WENT THROUGH THE ROOF. → REBUILT. RE-RENTED. → +$140K IN VALUE.
Ch.2 (ONE OF OUR REHABS tag): A BANK MANAGER WATCHED IT ALL. → [music full drop-out, held ~1s] → THEN ASKED US TO BUY HER HOUSE.
Ch.3: ONE BUYER SAW THE PORTFOLIO. → WANTED THE WHOLE SET.
Reward: SAME HOUSE. NEW STANDARD. → BUILDING COMMUNITIES THAT LAST.
Signature: house-mark draw-on (once, then STATIC — no pulse), SHAVIT / ROOTMAN, twin brass rules, REAL ESTATE, OPERATED.
HARD RULES: no digits-leading street addresses on screen anywhere; watermark "SHAVIT·ROOTMAN" 35% white top-right on all non-signature frames; only #000000/#FFFFFF/#B08D57/#FFC000 in graphics layers; type inside safe zones (220px top / 320px bottom / 60px sides); max 7 words on screen at once.

## Stack guidance
- Preferred: Remotion for the type/graphics layer (npm; render layer PNG sequences or transparent video), Python+librosa for the beat map, ffmpeg for grading/composite/encode.
- If Remotion/npm is unavailable in this environment, a Python (PIL/numpy) type renderer is acceptable IF easing is implemented properly (cubic ease-out, subpixel positioning via 4x supersampling) — the gate checks output, not stack.
- Music: build a ~60s bed from the four music segments inside assets/films/ reels ONLY if rights-clean AI/RF (Reel 2's bed is AI-generated RF — extract from `Shavit Reel 2 — 6 Houses (RF music).mp4`), or synthesize a simple bed. Engineer the Ch.2 drop-out.
- Grade: befores cool/desaturated, afters warm; full warm only from Reward on.
- Higgsfield upscale/parallax is OUT OF SCOPE for this loop (runs as a later polish pass) — use deterministic Ken-Burns/pans.
- Environment facts: ffmpeg/ffprobe on PATH; python3.13 has PIL, numpy, librosa 0.11; node/npm availability unverified — probe before choosing Remotion.

## Anti-requirements (do NOT)
- Do not touch anything outside this project directory.
- Do not post, upload, or publish anything anywhere.
- Do not use un-cropped screenshots in any composite (privacy).
- Do not invent property imagery (no generative fill/outpaint of houses).
- Do not put full street addresses on screen.
- Do not make the logo pulse, loop, or shimmer.

## ITERATION 2 — DESIGN FIXES (from the orchestrator's frame review; the gate now enforces these)
The iteration-1 render passed the formal checks but failed the design review. Fix ALL of these:

1. **The hook is not a "before."** The 0–3s frame currently shows a finished house under
   blue sky beneath "EVERYBODY DROVE PAST THIS HOUSE." — nonsense. The hook MUST be a
   genuine before: use frames from `assets/films/61 Salem St — Split Screen.mp4` (its left/
   before side) or the most brutal `assets/cropped/before_*.jpg` (the tired gray tudor
   exterior, the gutted kitchen). 61 Salem is PREFERRED: the split-screen gives you the
   before AND the angle-matched after of the SAME house — and 61 Salem IS the Ch.1
   tree-collapse property, so hook, Ch.1, and reward all become one coherent house.
2. **Ch.1 "A TREE WENT THROUGH THE ROOF." currently plays over a pristine exterior.**
   It must play over damage/roofline/gutted imagery, then dissolve to the warm after.
3. **Grade arc is missing.** Befores must be graded cool/desaturated (blue-shifted,
   -20 sat), afters warm. The gate now measures hook coolness (B−R > 2) and reward
   warmth (R−B > 2) — a flat dark dim overlay everywhere will fail.
4. **Every chapter is a static slide.** The gate now samples t=8/16/28/40/48s and fails
   if 1-second pixel motion is ~zero. Implement real Ken-Burns push/pan on every still
   (1–4% scale drift minimum) and keep the micro-zoom beat bumps.
5. **IG UI chrome leaked into crops** (carousel ‹ › arrows, page dots visible in some
   assets/cropped files). Re-crop or exclude those; no UI pixels in any final frame.
   New attestation lines required in checks/visual_review.md:
   `IG-UI CHROME: NONE` and `BEFORE FOOTAGE: USED` (write only after verifying by eye).
6. Keep everything that already passes (runtime, loudness, beat sync, layers, exports,
   head-swap variants) — this is a targeted quality pass, not a rebuild.

## ITERATION 3 — STAGE-6 REVIEW FIXES (adversarial reviewer verdict: DO NOT SHIP until these are gone)
Fix in priority order. The gate now machine-checks #3/#4/#5 and requires new attestations for #1/#2/#6.

1. **F1 BLOCKER — tag/headline collision.** Whenever a headline wraps to 2 lines, line 1 lands on the
   chapter tag's y-position (visible at 0-3s, 12s, 16s, 24-28s, 32s, 36s, 40s, 44-52s; single-line beats
   are clean). Fix the layout constant: tag y = headline_block_top − tag_height − gap (or shift the tag up
   one line-height when lines=2). Verify EVERY two-line beat frame by eye, then attest `TYPE COLLISION: NONE`.
2. **F2 — hard scrim seam** at y≈1150–1170 on most beats: the bottom darkening band ends in a hard step.
   Replace with a smooth gradient (0% at y≈900 → target opacity at y≈1400). Attest `SCRIM: GRADIENT`.
3. **F5 (machine-checked) — signature must overlay the dimming warm reward frame.** No black-card cut.
   The gate samples the frame 2.2s from the end and fails on a black field.
4. **F4 (machine-checked) — poster.jpg = the warm reward frame with the wordmark composited**, not the
   black signature card. Gate fails a mostly-black poster.
5. **F3 (machine-checked) — export_16x9 must be designed, not pillarboxed.** Sanctioned treatment: the
   plate letterboxed with type re-set into the side dead zones. Gate fails empty black side zones.
   Also re-set the 4:5 type block properly for 1080×1350 (currently a blind crop, line 2 ~90px from edge).
6. **F6 — rebuild Ch.3 (36–43s) as the spec'd collage:** portfolio hero tiles popping on consecutive
   beats, tempo escalation; remove the dated scallop-valance kitchen from under "WANTED THE WHOLE SET."
   Attest `CH3 COLLAGE: PRESENT`.
7. **F7 — under "A TREE WENT THROUGH THE ROOF." use damage/roofline/gutted imagery** (roof-against-sky
   crops exist in assets/cropped/before_*), not the intact dusk exterior.
8. **F8 — cheap insurance:** blur (8–10px) the porch-post region ~x300,y1620–1760 in the hook/Ch.1 plate
   (possible vertical house-number marks).
9. **F9 — captions.md to house standard:** 7 platforms (TikTok/IG/YT Shorts/FB/LinkedIn/X/Threads),
   hashtags, shavitrootman.com/links + UTM params, audio note — mirror assets/captions/Reel 1 format.
10. **Audio nitpick:** start the 1s silence under the empty held beat (~29s) so line 2 lands INSIDE the
   silence, not simultaneous with its onset.
11. Do not regress anything already green (runtime/loudness/beats/motion/grade arc/variants identical from 3s).

## ITERATION 4 — MUSIC REDIRECT (Jake at stage 8: bed must be "luxurious and sexy"; he picked Pia)
1. **New bed = assets/music/Pia.mp3** (full 6-min track; Jake's explicit pick, rights caveat flagged+accepted).
   Select the best ~57s window: use librosa energy/structure analysis to find a sustained high-groove
   section (e.g. first chorus) that STARTS on a downbeat; 0.5s fade-in, 1.5s fade-out.
2. **Re-sync every cut** to Pia's beat grid in that window — the acceptance gate recomputes beats from
   the delivered master's audio, so the old cutlist will fail until re-timed. Update build/cutlist.json.
3. **Keep the Ch.2 drop-out**: full duck to silence for ~1.0s with line 2 ("THEN ASKED US TO BUY HER
   HOUSE.") landing INSIDE the silence (silence starts on the empty held beat, ~0.5s before line 2).
4. Re-master audio to −14 LUFS integrated. Keep aac.
5. Do NOT regress visuals: same plates, type, grade, collage, signature — only re-time to the new beat map.
6. captions.md audio note becomes: baked track "Pia"; on IG/TikTok optionally post with the in-app Pia
   sound instead for reach; baked version is for site/YouTube/LinkedIn/FB.

## HUMAN REVIEW ROUND 1 — 2026-07-03 (REJECTED; fix list is binding)
The render passed the machine gate but failed human review. These findings are now ALSO machine checks (check.sh section 11). Concrete fixes, in priority order:

1. **Beat timeline is v4.2's — rebuild to spec v4.3 §01:** hook 0–3 · proof 3–9 (accelerating dissolves 2.5/2.0/1.5s) · Ch.1 9–21 · Ch.2 21–31 · Ch.3 31–38 · reward 38–50 · signature 50–53. Target ~53s.
2. **Hook plate:** use the ALREADY-GENERATED Kling camera-move clip at `checks/calibration/kling_camera_move.mp4` (Salem finished exterior, real dolly parallax, 5s @960x960 — upscale/crop to 1080x1920 frame). NEVER a before plate on the hook. Type rises over it on three beats.
3. **Proof state mapping:** dissolve/plate order must be MICHIGAN (River Street or E Saint Joe — both MI), OHIO (West Side or Larchmere), INDIANA (2217 Parkview hero 03 — currently misused in the Ch.3 collage; move it here). Only MI gets a true before→after dissolve (verified pair); OH and IN are single after plates with the state name (assets/AUDIT.md verdicts).
4. **Ch.2 must be real rehab/interior FOOTAGE, not a staged still:** pull a 10s segment from assets/films or assets/reels (see assets/AUDIT.md human-beat/texture timestamps; crop above caption band y1380–1600 if captioned). Desat-freeze on the silence drop stays.
5. **Reward (38–50s):** warm finished interior/exterior of the SAME property as the hook (Salem — e.g. s14_salem_after-class real crops, NOT plates916), interior spectacle slot at ~43–48s. after_019/after_020 are contaminated (IG carousel dots) — re-crop them (crop bottom ≥22%) or replace; the dot scan will catch any survivors.
6. **≥2 real-footage clips overall** (Ch.2 + at least one texture beat: fireplace flame LF1 t≈17.5–19.5, porch+wreath River St t≈3.3–4.7, Budlong street Reel1 t≈6–8, ranch lawn LF2 t≈78–130).

## ROUND 2 REVIEW — two surgical fixes (then the gate is all-green except the human signature)
1. **Ch.2 footage caption band:** the Larchmere segment carries its baked lower-third ("LARCHMERE DUPLEX / CLEVELAND, OH") — OCR reads it merged with narrative type ('WATCHEDIT ALDUPLEX', 'CLEVELAND'). Crop/zoom the segment so the y1380–1600 band (per assets/AUDIT.md) is fully out of frame, or use an uncaptioned span. This also clears most of the word-budget overflow (56→expected ≤44).
2. **Watermark OCR bleed at t≈14s:** 'DOTMAN'/'COTMAN' = the SHAVIT·ROOTMAN watermark being read as narrative on bright-sky frames. Verify the watermark bbox lands inside the top-right exemption region at the contracted size (small, 35% white) on EVERY beat — if it drifted larger or lower on some layers, restore the contract.

## V5 RENDERER CONTRACT (binding for round 4)
Source: council/CHANGE-SPEC-V5.html §02 (C1–C12). check.sh section 12 (checks/change_spec_v5_checks.py) machine-gates C1–C5, C8–C9, C11–C12. Motion is the primitive now, not an afterthought: real Kling clips + real footage first, stills are the exception.

1. **C1 — hook = the real Kling dolly.** Conform `checks/calibration/kling_camera_move.mp4` (24→30fps, scale/crop to 1080×1920) as the 0–3s plate, cut in mid-move. "FIFTY DOORS. THREE STATES. ONE STANDARD." rises on three beats; the third lands on the cut. Gate: `motion_floor` — median optical flow ≥0.15px/frame in the master for every hook/chapter_open/reward/camera-move clip. The current render measures ~0.01: your camera-move motion is NOT surviving the composite — fix the pipeline, not the label.
2. **C2 — state captions bound to matching-state clips.** MICHIGAN only over the River St clip window, OHIO alone over West Side, INDIANA alone over Parkview. Derive type windows FROM the cutlist clip in/out — never free-timed. Gate: `type_plate_sync` (OCR window ↔ clip state). Round-3 render shows INDIANA over the Ohio house at t=5.5–7.0s — this exact failure.
3. **C3 — reward interior = G2.** Conform `assets/generated/G2_reward_interior_dolly.mp4` (24→30fps, scale/crop 1080×1920) into 43–48s with the warm grade applied. Kills the static empty room.
4. **C4 — dwell floors.** "THEN ASKED US TO BUY HER HOUSE." holds ≥2.5s after the silence (freeze-desat → warm snap stays). EVERY narrative line ≥1.8s on screen. Gate: `line_min_dwell`. Currently failing on the banker payoff (~1.0s) and MADE IN AMERICA / LOCAL TO THE MIDWEST.
5. **LOCKED line set (verbatim, nothing else renders):** FIFTY DOORS. THREE STATES. ONE STANDARD. · MICHIGAN · OHIO · INDIANA · MADE IN AMERICA, LOCAL TO THE MIDWEST · SALEM STREET · A TREE WENT THROUGH THE ROOF. · REBUILT. RE-RENTED. · A HOME AGAIN. · ONE OF OUR REHABS · A BANK MANAGER WATCHED IT ALL. · THEN ASKED US TO BUY HER HOUSE. · ONE BUYER. · THE WHOLE SET. · **OWN. OPERATE. REPEAT.** (NEW — Ch.3 gold payoff, gold #FFC000) · BUILDING COMMUNITIES, LOCALLY. · **MIDWEST GROWN. MIDWEST KEPT.** (NEW — brass #B08D57 sub-line under the closer, smaller size) · SHAVIT / ROOTMAN · REAL ESTATE, OPERATED.
6. **C5 — chrome purge, per audit.** Re-crop every plate flagged `ig-chrome` in `assets/manifest-audit.csv` (chevrons/arrows/dots/red badge slivers — crop them OUT, esp. the Ch.3 tiles and the 38–53s background). Gate: `chrome_shape_scan` runs at threshold 170 on every source plate AND 12 master frames — currently flagging chevron suspects on most plates.
7. **C6 — Ch.3 reframe:** demand as proof, refusal as character. ONE BUYER. → THE WHOLE SET. → gold payoff OWN. OPERATE. REPEAT.
8. **C7 — "HELD SINCE DAY ONE."** brass sub-line on the reward beat ONLY if Shavit confirms hold-history Saturday; otherwise omit silently. Do not block the render on it.
9. **C8 — Salem angle diversity.** Salem may not repeat a near-identical angle across beats: hook keeps the G1 Kling move; Ch.1 after = finish frames from `assets/films/61 Salem St — Split Screen.mp4`; reward exterior = a different crop. phash gate already enforces no dupes.
10. **C9 — delivery floors.** Encode the master at ≥10 Mbps video (gate floor is 8; aim 10). Master the bed with real dynamics — LRA >0.5 LU (current bed is brickwalled at 0.0). Add manifest rows (`assets/manifest.csv`) for `Pia.mp3` and every `assets/films|reels` segment used (Larchmere Duplex — Showcase.mp4 is missing one now). Gates: `delivery_floor`, `provenance_music_footage`.
11. **C10 — captions.md carries the CTA architecture:** profile-line CTA + pinned-comment + per-platform variants. The film itself still ends with zero ask.
12. **C11 — chapter tags restored.** "SALEM STREET" and "ONE OF OUR REHABS" brass tags render at the register-versioned size (the approved remaster scale, NOT the pre-remaster size).
13. **C12 — one real-footage texture beat** in Ch.2 or reward: fireplace flame (LF1 t≈17.5–19.5) or porch/wreath River St (t≈3.3–4.7) — evergreen, no holiday cues. Counts toward the ≥2 real-footage minimum.
14. Do not regress anything green: runtime/loudness/beat grid/word budget/watermark contract/exports all still gated. Run `./check.sh` — section 12 must go green with the rest.

## ROUND 5 — final two render fixes (check-side noise filters are already fixed gate-side)
1. **Ch.2 footage span has the Larchmere TITLE CARD mid-frame** ("LARCHMERE DUPLEX / CLEVELAND OH" in gold, visible ~21-23s). Cropping cannot save a mid-frame title (audit §hygiene). Use an UNCAPTIONED span: Larchmere Showcase interiors t≈3–13s, or River Street Before-After film mid-span with the top-left chip band (y<200) cropped. Verify with OCR before compositing: zero text detections on the chosen span's frames.
2. **Banker payoff dwell:** "THEN ASKED US TO BUY HER HOUSE." currently ~1.5s — extend to ≥2.5s on screen (floor is 1.8s; 2.5s is the spec ask).
