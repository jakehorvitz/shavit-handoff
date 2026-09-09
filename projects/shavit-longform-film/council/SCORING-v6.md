# SCORING — v6 master · `deliver/master_9x16.mp4`

**Run:** 2026-07-04 · video-brain-analyze (full ingestion protocol) + video-brain-check (register QA) · vault `~/projects/video-brain` (17 shavit register notes, all `as_of: 2026-07-03`)
**File scored:** SHA-256 `6f2d663b…af82edf7` (matches `checks/review_packet.md` and the signed FINAL REVIEW in `checks/visual_review.md`) · MD5 `dbdb9e24…`
**Container:** 1080×1920 · 30fps · 53.43s · H.264/AAC · **9.31 Mbps total**
**Audio (measured):** −13.9 LUFS integrated (inside [−15,−13], at the hot edge) · true peak −1.4 dBTP (transcode-safe) · LRA 1.9 LU (real but thin dynamics) · engineered silence 27.85–28.85s = 1.0s (inside the 0.8–1.2 gate), B&W freeze verified at the drop · zero black frames
**Ingestion:** 53×1fps frames + 24-frame 8fps first-3s pass + 4fps grayscale motion series (per-segment MAD) + per-segment mean-luma + full-res crops on every suspect region + source-plate diffs against `assets/sanitized/`
**Grounding:** spec.html v4.3 + locked line set (journal 7/4 08:25) · shavit-standards.md (27 + 8 predictors) · hormozi-criteria.md (15) · brain-analysis-round2.md (predecessor REJECT) · CHANGE-SPEC-V5.html (C1–C12) · `.bones/journal.log`

**Verification caveat, stated up front:** the caller-reported 46/47 machine pass could not be reproduced in this session (`check.sh` run from the repo root could not locate the master in this sandbox). One of its PASSes is demonstrably false either way — `chrome_shape_scan` missed an on-screen Instagram carousel chevron (finding N1). The signed review's "zero IG chrome" line is falsified for the 33–38s window.

---

## VERDICT LINE

**FIX-THEN-SHIP — do not send this render to Shavit.** The v6 rebuild genuinely fixed the state mislabel, the unreadable twist, the static slideshow, the scrim, the delivery floors, and the provenance holes — but the Ch.3 collage ships a baked Instagram carousel chevron inside a plate AND re-uses the OHIO proof kitchen (same photograph, different crop) in a second beat. That is rejection-predictor #5 — the class Shavit caught himself last time — live, twice, in one 7-second window. The fixes are three tile swaps, not a rebuild.

---

## 1 · REPUTATION SCORE — 75/100 (bar: ≥95 — NOT MET)

**Formula:** Shavit register 40% + gen-quality arm 30% + edit-craft arm 20% + legal/claims 10%. Any CRITICAL ⇒ cap at 80.
**CRITICAL findings present (2) ⇒ cap at 80 applies; the weighted score lands below the cap anyway.**

| Component | Weight | Score | Contribution |
|---|---|---|---|
| Shavit register (17 vault notes + 27 standards criteria) | 40% | 82 | 32.8 |
| Gen-quality arm (30-artifact taxonomy, all clips incl. disclosed synthetic-warp stills) | 30% | 68 | 20.4 |
| Edit-craft arm | 20% | 70 | 14.0 |
| Legal / claims | 10% | 80 | 8.0 |
| **REPUTATION** | | | **75.2 → 75** |

### 1a · Timecoded findings (most severe first)

| # | Timecode | Severity | Finding | Citation(s) |
|---|---|---|---|---|
| N1 | ~33.0–38.2s | **CRITICAL** | **Baked Instagram carousel chevron on screen.** The Ch.3 kitchen tile carries a translucent circle + left-chevron "‹" on its left edge (confirmed at full res, 33.5s). Source inspection: `assets/sanitized/after_044/051/055__chrome_clean.jpg` ALL still carry carousel chevrons (051 also a pagination-dot row; 055 a dark UI band) — the `__chrome_clean` names and the review's "zero IG chrome" claim are falsified. (Signature bg `after_018` also carries a source chevron, but the composite crop keeps it off screen — verified at 52.0s.) | spec §06 plate hygiene ("FAIL on any IG chrome"); [[output-qa-rubric]]; [[ai-reputation-cost]]; predictor #5 |
| N2 | 5.3–7.9s & ~33–38.2s | **CRITICAL** | **Same photograph in two beats.** The Ch.3 collage kitchen (`after_051`) is the SAME kitchen photo as the OHIO proof plate (`05_west_side_cleveland`) — identical scalloped valance, subway tile, faucet, stove, marble, fridge; different crops of one image. phash passed on filenames; a human (and Shavit — "This picture was used twice") sees one picture twice. His own suggested swap (17 Lo Presto) is still unused. | spec §06 duplicate-plate check (intent); shavit-standards A#4 (STANDING); predictor #5 |
| N3 | 0–3.3s | MAJOR | **Hook typography still reads as default text-wrap:** "FIFTY DOORS. THREE / STATES. ONE / STANDARD." breaks mid-phrase, ~60px vs the spec's ~92px hook scale, no three-beat rise, no brass underscore on "ONE STANDARD." Round-2 #9, unfixed on the film's three most valuable seconds. | spec §02 F1 + §03 type scale; [[type-collision-lessons]]; [[animate-fast-hold-long]] |
| N4 | 9.9–21.8s & 21.8–31.0s | MAJOR | **Both chapter tags still missing** — no "SALEM STREET" brass tag (the film's only specific geography) and no "ONE OF OUR REHABS" tag on the banker beat (the de-identification device the spec names). Change-spec C11 said restore them; the locked claims list shipped without them. Also still no rebuild/transformation moment — dark before hard-cuts to finished after in a chapter about rebuilding. | spec §02 F3/F4; [[specificity-builds-trust]]; [[address-tag-scale]] (UNTESTABLE — no tag exists); de-identify-people caveat |
| N5 | ~72% of still-derived runtime | MAJOR | **Motion language is mostly simulated parallax.** Real Kling i2v on exactly two clips (hook G1, reward-a G2 — both verified architecture-stable). Proof plates, Ch.1 afters, Ch.3 tiles and reward-b move via the renderer's synthetic perspective warp — no true parallax. Passes the calibrated affine KB test mechanically (warp ≠ affine), but by the register's *purpose* these are Ken-Burns-class stills wearing a warp, including on chapter opens and the reward's second half. Disclosed + signed as a v6.1 upgrade path (~40cr), so graded PASS*(disputed), not a standing FAIL — but it is the cut's biggest premium-feel tax. | [[kenburns-motion-cap]] (classification gap); [[slop-composition-signature]]; [[slow-moves-hide-artifacts]]; visual_review disclosure |
| N6 | 38.2–50.8s | MAJOR | **The reward is still an empty room.** Real G2 dolly (real parallax, door grid square) + a second moving shot, warm grade, ≤8s per shot — the mechanics are fixed — but the "Would I want to rent from them?" payoff remains bare floors and blank walls. Warmth is all grade, no life. (Known constraint: every Salem interior is a vacant listing-empty; the real fix is Shavit's incoming photos.) | spec §01 REWARD; [[before-after-retention-stack]]; hormozi #14 (avatar on screen) |
| N7 | whole cut | MAJOR | **Zero human/Midwest-texture beats** (spec requires ≥3; audit confirmed zero human footage exists — fallback texture beats fireplace/porch/lawn were specced in C12 and not shipped). Tenants and community members never see themselves. | spec §03 Human touch; shavit-standards A#21; [[match-avatar-in-ad-creative]] |
| N8 | 0–3.3 / 13.8–21.8 / 50.8–53.4s | MAJOR | **Three near-identical 61-Salem exterior angles** (hook `salem_clean_after`, Ch.1 after `06_61_salem`, signature bg `after_018`) — and the hook exterior appears fully finished at 13.8s, paying the open loop ~25s early. The reward interior is a different photograph of the same property (machine loop check passes) but nothing on screen tells the viewer the reward IS the hook house. Change-spec C8 not executed. | Hormozi #2 open-loop integrity; spec §06 same-house loop check; predictor #5 adjacency |
| N9 | package | MAJOR | **`deliver/captions.md` is stale and dangerous:** calls the film "60s" (it is 53.4s) and instructs "Audio: baked track 'Pia'… optionally post with the in-app Pia sound" — Pia is the track Shavit killed on 7/3, and the in-app-audio suggestion is the licensing trap the vault warns about. If the Saturday package ships this file, the posting instructions contradict the film. | [[audio-palette-consistency]]; [[trending-audio-licensing-trap]]; shavit-standards A#23 |
| N10 | 3.3–9.9s | MINOR | Proof row punctuation inconsistent ("MICHIGAN" unpunctuated vs "OHIO." / "INDIANA.") and tempo is 2.0s/2.6s/2.0s — not the spec's accelerating 2.5/2.0/1.5. Single plates instead of before→after dissolves is a *sanctioned, disclosed* fallback (befores unverified for OH/IN). | spec §01 PROOF; [[hook-formula-rotation]] |
| N11 | 9.9–13.8s | MINOR | Ch.1 before segment mean luma 37.6 — a very dark interior (ceiling fan) that doesn't visibly say "tree through roof"; the line does all the work. Inside gates, but the weakest image in the film. | [[output-qa-rubric]]; spec §03 Grade (cool=before is honored) |
| N12 | provenance | MINOR | `after_038` (Ch.3 tile) carries faint bottom-edge watermark remnants — the asset audit's "MLS watermark rights question" was never resolved. Not visible in the composite (verified 31.8s crop), so exposure is provenance-only. | [[no-zillow-photos]] rights logic — caveat, not a row failure |
| N13 | docs | MINOR | `checks/review_packet.md` plate timeline says reward 38.2–50.8 = `after_019` "camera-move" while the signed review says "real G2 interior dolly 38.3–43.3" — the packet no longer describes the actual cut; and `visual_review.md` lacks the literal attestation lines BUILD.md requires (`HOOK-REWARD MATCH: PASS`, etc.). Documentation drift around the gate that exists because self-attestation failed before. | spec §06 human-review integrity |
| N14 | 31–38.2s | ADVISORY | "ONE BUYER. / THE WHOLE SET." → "OWN. OPERATE. REPEAT." (Jake-locked 7/4) reads operator-dry and softens the exit-story collision — but the tension with "they stay" is reduced, not resolved. Cannot block; confirm the story with Shavit. | hormozi #15; [[machine-gates-vs-taste]] |
| N15 | 50.8–53.4s | ADVISORY | Still no tenure marker and no third-party voice anywhere ("MIDWEST GROWN. MIDWEST KEPT." gestures at permanence; C7's "HELD SINCE DAY ONE." was superseded). The two cheapest missing authority signals, unchanged from round 2. | hormozi #11, #12 |

### 1b · Component evidence

**Shavit register — 82/100.** All 17 vault notes pass (table §3); the wording purge is total (zero `$`, full state names, "BUILDING COMMUNITIES, LOCALLY." verbatim, "REBUILT. / RE-RENTED.", comma proof-line variant sanctioned, no addresses, no early wordmark, brand hexes clean, watermark static, signature no-black-card + static mark at MAD 0.10). Deductions: standards A#4 duplicate-plate STANDING check fails on the kitchen dupe (−8); A#5 composition QC fails on the baked chevron (−5); A#21 human beats = 0 (−3); A#14/#26 tag letter unmet (−2).

**Gen-quality — 68/100.** 30-artifact taxonomy over all clips: zero generated architecture (every plate traces to a real photo; banned 34 Mead / Cleveland Heights plates absent from the timeline); G1/G2 frame-diffed and architecture-stable (door grids square, siding lines straight, balusters true); no AI people; no mirror/reflection warps; grade continuity holds cool→warm. Deductions: baked platform chrome is the #1 "screenshotted my own feed" authenticity artifact (−12); synthetic-warp fake parallax across ~72% of still-derived runtime is the named slop signature in motion form, disclosed or not (−10); painterly upscale texture in hook trees/shingles + heavy grain overlay that IG's re-encode will exaggerate (−6); dark Ch.1 before reads as quality miss (−4).

**Edit-craft — 70/100.** Working: the silence device is fully engineered (1.0s measured bottom-out, B&W freeze, warm-snap payoff held 2.6s); cuts land on the librosa beat map; runtime 53.4s inside gate; no snap-backs or black frames; safe zones respected; 9.3 Mbps master; TP −1.4. Deductions: hook typography (−8); missing tags + missing rebuild sequence (−7); 8s single-plate Ch.1 after and 12.6s empty-room reward sag the back half (−6); proof tempo not accelerating, punctuation inconsistency (−4); LRA 1.9 still thin for a "luxury" bed (−3); no texture beats (−2).

**Legal/claims — 80/100.** Zero `$` anywhere (frames + captions grep), no abbreviations, every on-screen claim verbatim from the approved list, "whole set" keeps the count unconfirmed by design, banker fully de-identified (type-only, no locating pairings — though the spec's generic tag is absent), no addresses, no engagement bait, provenance rows now cover the Heartland bed (Pixabay 354086, license named) and the Larchmere footage. Deductions: unresolved MLS-watermark rights question on `after_038` (−8); stale captions.md steering the post toward the killed Pia track (−7); FIFTY-DOORS as-of + no-active-raise confirms still pending (Saturday package items, process not film) (−5).

---

## 2 · VIRALITY RUBRIC INPUTS — 63/100 (brain half; Higgsfield `virality_predictor` supplies the other 50%)

| Input | /100 | One-line evidence |
|---|---|---|
| Hook-3s strength | 78 | Real Kling dolly moving at frame 0, claim fully legible at 0.125s on mute, poster = hook frame — but the line is a wrapped paragraph at ~60px with no beat-rise, so it reads placed, not designed. |
| Loop-close / rewatch seam | 58 | Hook property returns at the reward (machine-verified same property, different photograph) and the signature exterior visually rhymes with frame 1 — but the hook house appears finished at 13.8s (loop paid ~25s early) and nothing tells the viewer the empty reward interior IS the hook house. |
| Value-per-second | 66 | 53.4s with no dead air ≥2s in the front half and a genuine pattern-interrupt at 27.9s; back half sags — 8s on one Salem exterior (two lines) and 12.6s of bare room carrying three lines. |
| Avatar resonance (4 audiences) | 55 | Lenders/partners: strong (numbers-forward hook, banker behavior-proof, zero flexing — [[flexing-is-red-flag]] clean). Learners: one beat ("OWN. OPERATE. REPEAT."). Tenants: an empty unfurnished room as "home." Community: closer line only — zero human/local texture on screen. Two of four audiences never see themselves. |
| Share/save triggers | 60 | The banker twist (silence → "THEN ASKED US / TO BUY HER HOUSE.") is a genuinely screenshottable story beat and the Midwest-identity proof line has forward-to-a-colleague energy ([[sends-per-reach-king]]); by design there is no bait, no CTA, no trend hook — trust-film ceiling applies. |
| **Weighted rubric (equal weights)** | **63.4 → 63** | |

Note for the combiner: if the predictor scores the *format* (pinned trust film) rather than the execution, show both numbers and say so — per the change-spec's own standing-risk language.

---

## 3 · video-brain-check — mechanical register QA (v6)

Manifest assembled from: OCR over 53×1fps + 8fps first-3s frames (onscreen_strings, hook/closer) · `build/cutlist.json` + review packet + measured 4fps MAD series (motion_inventory) · build layer constants + on-frame spot-check (palette) · `assets/manifest.csv` 115 rows (asset_provenance) · loudnorm/silencedetect/blackdetect (audio_info) · zero identifiable people in any sampled frame (people_footage).

REGISTER CHECK — deliver/master_9x16.mp4 (v6, SHA 6f2d663b…) — 2026-07-04

| Rule | rule_type | as_of | Verdict | Evidence |
|---|---|---|---|---|
| [[no-dollar-figures]] | standing | 2026-07-03 | **PASS** | Zero `$` in all sampled frames + captions; proof line "MADE IN AMERICA, / LOCAL TO THE MIDWEST." (comma variant sanctioned) at 38.2–43.5s; closer "BUILDING COMMUNITIES, / LOCALLY." verbatim. |
| [[full-state-names]] | standing | 2026-07-03 | **PASS** | MICHIGAN (3.3–5.3, River St Hillsdale MI) · OHIO. (5.3–7.9, West Side Cleveland) · INDIANA. (7.9–9.9, 2217 Parkview South Bend) — one state per matching plate; MI/OH/IN tokens absent everywhere. |
| [[no-house-numbers]] | standing | 2026-07-03 | **PASS** | No digit-leading address strings; no street text on screen at all (tag absence is craft finding N4, not a leak). |
| [[no-generated-architecture]] | standing | 2026-07-03 | **PASS** | Every plate traces to a real photograph in manifest.csv; G1/G2 are i2v camera moves on real anchors with diff artifacts in checks/motion_diffs/; synthetic warps distort real pixels, invent none; banned plates (34 Mead, Cleveland Heights) not in the timeline. |
| [[brand-tokens]] | standing | 2026-07-03 | **PASS** | White narrative type; gold rationed to one stake line per chapter (A HOME AGAIN. / TO BUY HER HOUSE. / REPEAT. / LOCALLY.); brass on the "MIDWEST GROWN. MIDWEST KEPT." sub-line + rules; uppercase Inter-class; photography frames exempt. |
| [[no-pulsing-logo]] | standing | 2026-07-03 | **PASS** | "SHAVIT·ROOTMAN" constant 35% white top-right on all non-signature frames; absent on signature; no oscillation. |
| [[static-signature]] | standing | 2026-07-03 | **PASS** | Final 2.6s over the dimmed warm Salem exterior (mean luma 46.6 — not a black card); mark draws once then MAD 0.05–0.14 (fully static); no pulse. |
| [[no-zillow-photos]] | standing | 2026-07-03 | **PASS (caveat)** | No listing-portal provenance; music bed + Ch.2 footage rows now present (round-2 HARD FAIL fixed). Caveat: unresolved audit question re faint MLS-style watermark on `after_038` — not visible in composite; resolve before any re-crop exposes it. |
| [[de-identify-people]] | standing | 2026-07-03 | **PASS (caveat)** | Zero identifiable people; banker beat type-only with no locating pairings. Caveat: the spec's generic "ONE OF OUR REHABS" tag is absent (N4). |
| [[disparage-house-not-street]] | standing | 2026-07-03 | **PASS** | "A TREE WENT / THROUGH THE ROOF." — house-scoped, factual; nothing negative touches street or community. |
| [[posting-ceiling]] | standing | 2026-07-03 | UNTESTABLE | Deliverable is a cut; no calendar supplied. |
| [[templated-formats]] | standing | 2026-07-03 | **PASS** | `build_video.py` + `build/cutlist.json` + `build/text_manifest.json` exist in the producing repo; 15s-chapter structure intact. |
| [[kenburns-motion-cap]] | standing | 2026-07-03 | **PASS\* (disputed)** | Labeled KB only on the signature (2.6s ≈ 5.7% of ~45.6s still-derived runtime, not on hook/opens/reward) → passes. \*The synthetic perspective warps on proof/Ch.1/Ch.3/reward-b produce no true parallax; they defeat the affine predicate without satisfying its purpose. Disclosed and signed (v6.1 Kling upgrade path). Do not let this classification stand un-argued in the Saturday memo. |
| [[reputation-not-virality]] | standing | 2026-07-03 | **PASS** | No bait tokens, income hooks, urgency CTAs, or manufactured drama; film is ask-free; captions carry only soft link CTAs. |
| [[register-rule-typing]] | inferred | 2026-07-03 | **PASS** | All 17 notes carry rule_type/check/examples/applies_to/status; no dangling superseded pointers. |
| [[rebuilt-caption-softening]] | one-time | 2026-07-03 | **PASS** | "REBUILT. / RE-RENTED." — "WRITTEN OFF" absent everywhere. |
| [[address-tag-scale]] | one-time | 2026-07-03 | UNTESTABLE | No tag frames exist to measure (N4). |

**RESULT: PASS on the register (0 standing fails · 0 confirm-with-Shavit warns · 2 untestable · 1 disputed PASS) — but the spec §06 acceptance gate FAILS on plate hygiene (N1), independent of the register.** A register PASS is not taste approval; the v3 master passed everything and was rejected ([[machine-gates-vs-taste]]).

**Staleness:** all cited notes `as_of 2026-07-03` (1 day old); fast-volatility notes well inside 90 days; no Higgsfield model-routing claims relied on. **No staleness warnings.**

**Golden-set calibration:** none of V5's fixed mechanical defects were re-flagged; V6's v3-era defects ($ figures, abbreviations, "profitably", outpaints, black-card) are confirmed absent and were not re-flagged. Note: the analyze-skill golden set still describes `deliver/master_9x16.mp4` as the 57s v3 "big lesson" — the file at that path is now the 53.4s v6 rebuild; the golden-set entry needs updating.

---

## 4 · Round-2 findings resolution table

| R2 # | Severity | Finding | Status in v6 | Timecode evidence |
|---|---|---|---|---|
| 1 | CRITICAL | "OHIO./INDIANA." on a single Ohio plate; Indiana never named | **RESOLVED** | 3.3–9.9s: one state per plate, states match manifest properties (MICHIGAN→River St Hillsdale · OHIO→West Side Cleveland · INDIANA→2217 Parkview South Bend); `type_plate_sync` check added |
| 2 | CRITICAL | Baked IG chrome (Ch.3 arrows; reward dots through the last 15s) | **PARTIAL** | Reward plate (`after_019`) and signature window verified clean on screen (38.2–53.4s); **but a carousel chevron is on screen in the Ch.3 kitchen tile ~33.0–38.2s**, and sources `after_044/051/055__chrome_clean.jpg` all still carry chrome → new CRITICAL N1 |
| 3 | CRITICAL | Twist payoff unreadable (~1.0s) | **RESOLVED** | "THEN ASKED US / TO BUY HER HOUSE." holds 28.4–31.0s (2.6s ≥ the 2.5s floor), warm snap after the measured 1.0s silence + B&W freeze; `line_min_dwell` check added |
| 4 | CRITICAL | Reward = 12s static still of an empty room (MAD 0.18) | **PARTIAL** | Motion fixed: real G2 interior dolly 38.2–43.5s + second moving shot 43.5–50.8s (cut at 43.5; no shot >8s; segment MAD 5.6/5.8 vs 0.18) — but the room is still a bare unfurnished empty (N6) |
| 5 | MAJOR | Motion language never shipped (dimmed slideshow) | **PARTIAL** | Every segment now shows real measured motion (MAD 5.6–26.2 vs 0.18–1.5); hook + reward-a are true Kling parallax — but ~72% of still-derived runtime is synthetic perspective warp, not i2v (disclosed; N5) |
| 6 | MAJOR | Heavy ~50% dark scrim over every plate | **RESOLVED (caveat)** | Mean luma: proof 88, reward 91/83, Ch.2 75 — plates read bright with gradient type bands; caveat: Ch.3 collage (65) and Ch.1 before (38) remain dim |
| 7 | MAJOR | 61 Salem ×3 same angle; loop resolved early; reward not verifiably the hook property | **PARTIAL** | Reward is now a Salem interior — same property, different photograph (loop check passes); but hook/Ch.1-after/signature remain three near-identical Salem exterior angles and the finished exterior still shows at 13.8–21.8s (N8); change-spec C8 unexecuted |
| 8 | MAJOR | Both chapter tags missing; no rebuild sequence | **OPEN** | 9.9–31.0s: no "SALEM STREET", no "ONE OF OUR REHABS", no transformation footage between before and after (N4); C11 contradicted by the locked claims list |
| 9 | MAJOR | Hook typography = wrapped paragraph, ~56px, no beat rise, no underscore | **OPEN** | 0–3.3s: "FIFTY DOORS. THREE / STATES. ONE / STANDARD." still breaks mid-phrase at ~60px, full line static from frame 1 (N3) |
| 10 | MAJOR | Proof beat sprawls (~8.5s), tagline lingers, no before→afters | **PARTIAL** | Compressed to 6.6s; MADE-IN-AMERICA line moved off proof entirely (now the reward reveal, 38.2–43.5s); single plates are the sanctioned disclosed fallback — but tempo is 2.0/2.6/2.0s, not accelerating (N10) |
| 11 | MAJOR | Zero human/Midwest-texture beats | **OPEN** | Whole cut: zero human or texture beats; C12's fireplace/porch fallback not shipped (N7) |
| 12 | MAJOR | 1.2 Mbps master; LRA 0.0; TP −0.7 | **RESOLVED** | 9.31 Mbps · TP −1.4 dBTP · LRA 1.9 LU (thin but real) · −13.9 LUFS inside gate |
| 13 | MAJOR | No manifest rows for music bed or Ch.2 footage | **RESOLVED** | `assets/manifest.csv`: Heartland (Pixabay 354086, Content License, Jake-locked 7/3) + Larchmere Duplex Showcase.mp4 rows present; `provenance_music_footage` check passes |

**Resolution counts: CRITICAL 2 RESOLVED / 2 PARTIAL / 0 OPEN · MAJOR 3 RESOLVED / 3 PARTIAL / 3 OPEN.**
(Round-2 minors: #14 separator now comma — sanctioned; #17 captions still stale, now worse — Pia reference, N9; #18 signature now 2.6s clean — resolved.)

---

## 5 · Verdict — would Shavit approve, against the 8 rejection predictors?

| Predictor | Status on v6 |
|---|---|
| 1. Anything that reads AI | **Low-moderate.** Real photos, two verified-stable Kling clips, no outpaints, no synthetic people. Residual: warp motion + heavy grain + painterly upscale texture could read "filtered," not AI. Much improved. |
| 2. Music misses Midwest-luxury | **Improved, still his least predictable veto.** Heartland is Jake-locked values-Americana with a real (if thin, LRA 1.9) master and a clean license row. The alternate-track escape hatch from the change-spec should ride in the package. |
| 3. Dollar figures | **Clean.** |
| 4. MI/OH/IN or "profitably" | **Clean.** |
| 5. Photo bookkeeping | **FIRES, twice.** The OHIO proof kitchen reappears in the Ch.3 collage (same photograph, different crop) and an IG carousel chevron is baked into that same tile. He caught exactly these two classes himself on the last cut — with fewer instances. |
| 6. Off-brand system | **Clean.** Tokens exact, watermark static, no black card, signature static. |
| 7. Community-disparaging copy | **Clean.** |
| 8. Privacy/legal | **Screen-clean.** Residuals are process items: MLS-watermark question on one tile, FIFTY-DOORS as-of confirm, no-active-raise confirm, Meta AI-label stance. |

**Predicted answer as-is: NO — predictor #5 fires on the man who invented it.** Everything else in the film has moved decisively toward a yes.

**Top remaining risk:** the Ch.3 collage plates. One tile swap (replace the duplicate kitchen with 17 Lo Presto — his own suggestion), re-crop or replace `after_044/051/055` with genuinely chrome-free crops, re-run the chrome scan over the *actual composited tile regions*, and re-render. That single fix clears both CRITICALs; N3 (hook type), N4 (tags), and N9 (captions.md) are the next three hours of work after it. Below-bar score is fixable without touching the film's spine.

### What's working (keep these)

- **The claim lands on frame 1, moving.** A real Kling dolly under a fully-legible mute-readable hook, with the poster = the hook frame ([[hook-first-three-seconds]], [[first-frame-text-mute]], [[poster-cover-doctrine]]).
- **The silence device is now a complete machine:** measured 1.0s bed bottom-out, B&W freeze for muted viewers, warm snap into a payoff that holds 2.6s ([[silence-retention-device]]) — round 2's best idea finally paid.
- **The word register is airtight:** zero dollars, full state names on the RIGHT houses, closer verbatim, softened captions, no addresses, ~44 unique narrative words reading clean type-off ([[no-dollar-figures]], [[full-state-names]], [[specificity-builds-trust]]).
- **The brand system is pixel-disciplined:** gold rationed to one stake line per chapter, brass structural, static watermark, no-black-card static signature over a warm frame ([[brand-tokens]], [[static-signature]], [[no-pulsing-logo]]).

---

## RE-SCORE v6.1

**Run:** 2026-07-04 ~15:40 · focused re-score of the five claimed v6.1 fixes only; all other v6 judgments carried forward unchanged.
**File scored:** `deliver/master_9x16.mp4` · SHA-256 `34cad195…665d5ddd` · 53.429s · 62.4 MB. **Moving-target caveat:** a codex build loop was live during this session — the master was deleted and re-rendered mid-score (frames first pulled from the 15:31 render, then re-extracted and re-verified frame-by-frame on the 15:35 render; collage/hook/tag frames are visually identical across both). `.loop/iter-1.log` was still being written at 15:37; latest recorded acceptance run is **46/47 (review_fresh failing — human review predates render), not the caller-reported 47/47**.

### Fix verification (own eyes, full-res)

| # | Claimed fix | Verdict | Evidence |
|---|---|---|---|
| 1 | Ch.3 collage chrome re-cropped (CRITICAL N1) | **VERIFIED FIXED** | Frames at 33.0s and 36.5s extracted and inspected at full width, then split into 4 full-res 540×960 quadrants each (8 crops total). Zero chevrons, zero pagination dots, zero UI bands in any tile, any edge. New `*__tile_clean.jpg` sources (after_042/044/055) present in `assets/sanitized/`. |
| 2 | after_051 dupe tile → after_042 (CRITICAL N2) | **VERIFIED FIXED** | The collage's only interior tile is now a mid-reno bedroom (corner bay windows, rolled carpet, staged toilet) — compared side-by-side against `assets/heroes/05_west_side_cleveland.jpg` (kitchen: scalloped valance, subway tile, marble, fridge): different rooms, different photographs. Also checked against the reward interior at 40.0s (door + blank wall, no bay window) — no new duplicate introduced. No tile in either collage frame repeats any proof plate. |
| 3 | Chapter tags restored (was N4-part) | **VERIFIED FIXED** | 10.5s: brass "SALEM STREET" tag with underline rule over the tree/roof before. 23.0s: brass "ONE OF OUR REHABS" tag over the banker beat. Both small-caps brass, consistent with the brand system. |
| 4 | Hook line breaks intentional 3-line (was N3-part) | **VERIFIED — PARTIAL CRAFT FIX** | 0.3s and 1.0s: "FIFTY DOORS. / THREE STATES. / ONE STANDARD." — each phrase on its own line, no mid-phrase wrap. The "default text-wrap" read is gone. Still short of spec §02 F1: type ≈75px (spec ~92px), full line static from frame 0 (no three-beat rise), no brass underscore on "ONE STANDARD." |
| 5 | captions.md Pia reference purged (was N9) | **NOT FIXED IN THE SHIPPING PACKAGE — REGRESSED** | The purge exists in git HEAD (`c07df3c`: "Heartland (Pixabay 354086)… do not swap to an in-app sound"). But `build_video.py:1172–1176` still hard-codes the OLD Pia template into `deliver/captions.md` on every render, and the live loop's 15:24 re-render clobbered the fix — the working-tree file again says `Audio: baked track "Pia"… optionally post with the in-app Pia sound`. Header also still says "60s brand film" (film is 53.4s) in both HEAD and working tree. **Root cause to fix: the generator template, not the file.** |

### Recomputed reputation — 86/100 (bar ≥95 — NOT MET)

Both CRITICALs cleared ⇒ no 80 cap. Only fix-touched deductions moved; every other v6 judgment kept.

| Component | Weight | v6 | v6.1 | Moves (from the v6 deduction ledger) |
|---|---|---|---|---|
| Shavit register | 40% | 82 | **97** | A#4 duplicate-plate +8 (fix 2) · A#5 chrome QC +5 (fix 1) · A#14/#26 tag letter +2 (fix 3). Held: A#21 human beats −3. |
| Gen-quality arm | 30% | 68 | **80** | Baked platform chrome +12 (fix 1). Held: synthetic-warp −10, painterly/grain −6, dark Ch.1 before −4. |
| Edit-craft arm | 20% | 70 | **78** | Hook typography +4 of 8 (fix 4 — breaks fixed; scale/rise/underscore still open) · tags +4 of the 7-pt tags+rebuild deduction (fix 3 — rebuild sequence still missing −3). Held: back-half sag −6, proof tempo −4, LRA −3, texture −2. |
| Legal / claims | 10% | 80 | **80** | No change: the captions Pia purge did NOT survive into the shipping file (fix 5 regressed), so the −7 stands; MLS watermark −8 and pending confirms −5 unchanged. |
| **REPUTATION** | | 75 | **86.4 → 86** | 97×.4 + 80×.3 + 78×.2 + 80×.1 |

### Virality rubric — 64/100 (hook-3s moved; all other inputs held)

Hook-3s 78 → **83**: the wrapped-paragraph read (the input's stated deduction) is gone; still no beat-rise, no underscore, type still under spec scale, so it reads clean rather than designed. Other inputs unchanged (58/66/55/60). Equal weights: (83+58+66+55+60)/5 = 64.4 → **64**.

### Findings ledger after v6.1

- **N1 chrome: RESOLVED** · **N2 duplicate: RESOLVED** — predictor #5 no longer fires.
- **N3 hook type: PARTIAL** (breaks fixed; scale/rise/underscore open) · **N4 tags: mostly RESOLVED** (both tags on screen; rebuild/transformation moment still absent).
- **N9 captions: OPEN and now a build-system bug** — hand-fix committed, generator template reverts it every render (`build_video.py:1176`). One-line template edit + re-render closes it for good. Also update "60s" → "53s" in the same template.
- N5 (warp motion), N6 (empty reward), N7 (no human beats), N8 (Salem ×3 / early loop), N10–N15: unchanged, as scored in v6.
- Process: latest acceptance log shows **46/47** (`review_fresh`), loop still iterating at score time — re-confirm 47/47 and re-hash before the Saturday package.

### Verdict — would Shavit approve v6.1?

**Closer to yes than any cut so far — predictor #5 (his own catch-class) is now clean, both tags give the film its geography and its de-identification device, and the register sits at 97.** But 86 is still under the ≥95 bar: the film's remaining taxes are structural (simulated-parallax motion on ~72% of still runtime, an empty-room reward, zero human beats), and the package around the film would hand him posting instructions pointing at the track he personally killed. **Fix the captions generator template and re-render before anything ships; present the motion/reward/human items as the known v6.2 upgrade path.**
