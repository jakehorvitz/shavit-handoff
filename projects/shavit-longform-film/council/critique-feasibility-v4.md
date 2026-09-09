# Council critique — FEASIBILITY lens · spec v4.2 re-cut
**Verdict: PASS-WITH-FIXES** — nothing in v4.2 is fundamentally infeasible in the Fri-night→Sat window (frames-mode capability is verified, credits are ~10× more ample than budgeted, toolchain mostly present), but the current check.sh would PASS the exact film Shavit rejected, build_video.py still *builds* that rejected film, and three spec-mandatory beats are not asset-backed. Ship risk is concentrated in the gate and the asset audit, not in Higgsfield.

Evidence base: spec.html §06 (v4.2, 7/3), check.sh @ Jul 2 14:35 (pre-dates the v4.2 spec edit @ Jul 3 18:05), build_video.py @ Jul 2 14:42, assets/ inventory + manifest.csv (100 rows), Higgsfield model catalog + cost preflight (live), visual inspection of Salem plates / 17 before-crops / reel frames.

---

## MUST-FIX

**1. check.sh has ZERO OCR checks — the entire §06 OCR block is missing.**
There is no frame OCR anywhere in check.sh. Absent checks, each named per spec §06:
- `ocr_no_dollar`: sample frames @2fps, tesseract each, FAIL on any `$` character (Shavit's hardest rule).
- `ocr_no_state_abbrev`: FAIL on standalone `MI`/`OH`/`IN` tokens.
- `ocr_claims_verbatim`: every narrative line ∈ approved claims list — `FIFTY DOORS. THREE STATES. ONE STANDARD.` / `MICHIGAN` / `OHIO` / `INDIANA` / `MADE IN AMERICA, LOCAL TO THE MIDWEST` / `BUILDING COMMUNITIES, LOCALLY.` / approved story lines. (Note: the current builder renders `BUILDING COMMUNITIES THAT LAST.` — this check is the only thing that catches it.)
- `ocr_word_budget`: unique narrative words ≤35 (excl. watermark/signature) AND no frame >1 narrative line.
- `ocr_first_type`: first narrative type ≤1.0s.
- `ocr_no_address`: no digit-leading street address (currently only a grep for a manual attestation string).
- `ocr_wordmark_gate`: no wordmark before 50s; watermark present on sampled non-signature frames.
Blocker within the blocker: **tesseract and pytesseract are not installed** (verified). `brew install tesseract && pip install pytesseract` is step zero tonight. Extend the same OCR pass to `deliver/captions.md` as a plain grep — the current captions file contains `$12M+`, `MI · OH · IN`, and the killed H1 hook line.

**2. Ken-Burns ≤20% affine-residual budget test — missing entirely; §8's motion check is the stale v3 inverse.**
check.sh §8 only asserts frames *move* ("Ken-Burns/pan missing" failure text — the v3 worldview where KB was the filler). It cannot distinguish zoompan Ken Burns from a true parallax camera move, so a 100%-Ken-Burns render passes today. Add `kb_budget`: per still-derived clip, fit an affine warp source→frame (cv2.estimateAffinePartial2D on tracked features); near-zero residual = KB. PASS iff KB total ≤20% of still-derived runtime AND no KB on hook / chapter opens / reward (needs the cutlist to tag beat classes). **cv2 is not installed** (`pip install opencv-python`). Spec requires threshold calibration on one known-good Kling clip + one deliberate KB clip *before* the loop starts — schedule that as the first Higgsfield smoke gen (10 credits, see finding 9).

**3. Duplicate-plate phash check — missing.** No perceptual-hash logic anywhere. Add `dupe_plate`: phash every composited plate; FAIL if the same photo appears in two beats. **imagehash not installed** (`pip install imagehash`). Define the rule edge now: hook and reward are *required* to be the same property (same-house loop) — so the rule is "no identical *photo*", not "no repeated property". Today's builder reuses `salem_video_after.jpg` across Ch.1, reward ×2, and signature — it would fail this check four ways, which is correct: that's Shavit's actual 7/3 complaint.

**4. The gate is self-attesting — build_video.py writes its own "human" attestations.**
`write_sidecars()` unconditionally writes `checks/visual_review.md` containing all 8 PASS strings (`HOOK-REWARD MATCH: PASS`, `AI-MOTION: NONE`, `NO-ADDRESS OCR: PASS`, `IG-UI CHROME: NONE`, …) that check.sh §9 greps for. Section 9 can never fail. And it's not hypothetical: the crops demonstrably contain IG chrome (finding 6) while the file attests `IG-UI CHROME: NONE`. Fix: delete visual_review.md generation from the builder; check.sh must FAIL if the file is builder-written (require a signed line like `REVIEWER: jake <date>` plus mtime > master mtime). Also add the §06 provenance artifact the grep papers over: `motion_diff` — every AI-motion clip must have a diff image vs its source still in `checks/motion_diffs/` referenced from the review file.

**5. build_video.py builds the REJECTED v3 film — tonight's job is a renderer rewrite, not a re-run.**
Verbatim from the current script: hook `EVERYBODY DROVE PAST THIS HOUSE.` (H1, killed 7/3) · `$12M+ PORTFOLIO VALUE` · `+$140K IN VALUE.` (struck by default) · `MI · OH · IN` · `BUILDING COMMUNITIES THAT LAST.` (must be `BUILDING COMMUNITIES, LOCALLY.`) · builds a `hook_H7.mp4` variant (H7 demoted) · 100% zoompan Ken Burns on every shot · synthetic 55Hz+click bed instead of the heartland track. check.sh §1 also still *requires* `deliver/hook_H7.mp4` — the stale gate forces building a rejected variant. The v4.2 build needs: clip-based timeline (Higgsfield camera-move clips + real footage segments + ≤20% KB), the 5-heartland track cut 200s→~60s with the Ch.2 drop-out (deterministic ffmpeg; track verified present, 200.5s), librosa beat map re-derive (librosa verified installed), new claims text, W7 hook + chosen head-swaps, rewritten captions. Budget most of Saturday for this, not for Higgsfield.

**6. Ch.1 frames-mode anchors are NOT asset-backed — do not spend this generation until fixed.**
Verified by eye: `salem_video_before.jpg` is an intact exterior (siding on, no tree, no studs) shot from one corner of the house; `salem_video_after.jpg` is shot from the *opposite* corner; both carry baked-in `BEFORE`/`AFTER` caption text. These are not angle-compatible anchors — Kling frames-mode between them must hallucinate a 180° transition: the exact "looks a little AI" failure Shavit rejected. And the spec's claimed "Salem studs shots": not found — the 17 before-crops are dated kitchens/baths, ceiling/plaster damage, backyards; no full-gut studs frame, no tree-through-roof frame. Fixes in order: (a) scrub all 15s of `61 Salem St — Split Screen.mp4` for an angle-matched before/after frame pair (the two halves at t=1.0s are mismatched; other timestamps may align); (b) `Shavit River Street — Before-After.mp4` likely contains matched pairs — River Street can take the frames-mode slot; (c) hold the gen for Shavit's incoming photos. If no angle-matched pair exists by Sat noon, cut the effect to a hard-cut ghost dissolve — deterministic and safe.

**7. Proof-beat state coverage is not asset-backed: Indiana has exactly one plate, zero befores verified for OH/IN.**
The beat needs three before→after dissolves, one per state. Afters: MI plentiful (River St, E Saint Joe, Budlong, Second Chance Ranch — Salem reserved for hook/reward, 34 Mead suspect pending Shavit's real photo); OH = West Side + Larchmere only (Cleveland Heights banned); IN = 2217 Parkview only. Befores: the 17 before-crops are unlabeled — no property/state mapping exists, and nothing is confirmed for Parkview (IN) or the Cleveland properties (OH). First task tonight: property-level audit of all 82 crops + manifest columns `property,state` (also feeds finding 3's dupe rule and the same-house check). Fallback if an IN or OH before doesn't exist: degrade that dissolve to a single after plate with the full state name — the beat still reads; a mismatched-property "dissolve" would be a fake before/after on a trust film, which is worse than no dissolve.

**8. Source-plate hygiene: IG chrome and desktop text are baked into "cropped" plates; reel captions carry "CLEVELAND, OH".**
Verified by eye: multiple cropped plates retain IG carousel arrows/dots, and at least one after-crop has the "Personal Jarvis" window title baked in (privacy leak — the class of failure the pre-step exists to stop). check.sh §7 only rejects exact 2880×1800 dimensions, so all of these pass. Separately, re-cuttable reel segments have baked-in lower-third captions (`CLEVELAND HEIGHTS / CLEVELAND, OH`, `WEST SIDE / CLEVELAND, OH`) — any reused motion segment will fail the new MI/OH/IN OCR check (or worse, ship the abbreviation Shavit explicitly banned). Fix: manual pass over all 82 crops (30–40 min); run the finding-1 OCR over *plates* pre-composite (`plate_text_scan`: FAIL on any detected UI/desktop text); crop reel segments above the caption band or avoid captioned spans.

**9. ≥3 human/Midwest-texture beats: unverified, and sampled reel frames show zero people.**
§03 makes this mandatory. Eight sampled frames across Reel 1 and Long Form 2 show only property shots — these reels are house slideshows. Full scrub of all 8 videos is ~2.5 min of footage total: do it tonight and timestamp every human/crew/porch/flag moment. If fewer than 3 human beats exist, the spec as written cannot pass without Shavit's incoming photos — decide the fallback now (spec's own wording allows porch/lawn/flag/small-town *texture* to count; lean on that rather than blocking on Shavit).

## NICE-TO-HAVE

**10. Higgsfield frames-mode: VERIFIED at the API level — and the credit budget is ~10× overstated (good news).**
`kling3_0` declares `medias.roles: ["start_image","end_image"]` via the MCP — frames mode exists exactly as the spec assumes (3–15s, std/pro/4k, `sound:"off"` for cheaper silent clips). Live cost preflight: **10 credits** (std/5s), **20 credits** (pro/8s). Four hero gens ≈ 40–80 credits, not ~250; 726 credits ≈ 36+ pro-8s attempts — the reject-and-re-roll policy is fully affordable. Still do one 10-credit std smoke gen first (doubles as the KB-threshold calibration clip, finding 2) before writing hero prompts.

**11. Loudness tolerance mismatch.** Spec: −14 LUFS ±1. check.sh: ±1.5 (`[-15.5,-12.5]`). Tighten to `[-15,-13]`.

**12. 16:9 export check is weaker than spec.** §03 requires reframe + re-set type; the builder emits a blurred-pillarbox of the 9:16 master, and check 8B only detects *black* side bands — blurred pillarbox passes. Either accept blurred-pillarbox explicitly in the spec or check for it (side-band Laplacian variance ≪ center).

**13. July-4 timing contradiction.** N1 (`AMERICA TURNS 250. THIS HOUSE TURNS ONE.`) is built for pin day = July 4 — which is *Saturday*, but the plan previews Sat night and posts Sunday July 5. Either post the N1 head-swap Sat evening after preview or drop N1 and lead with N2/W7; don't post a birthday card the day after the birthday.

**14. Saturday run-order (timeline is feasible only in this order).**
Tonight (Fri): install tesseract/opencv/imagehash → rewrite check.sh (findings 1–4, 11) → asset audit: label 82 crops by property/state, scrub 8 videos for human beats + angle-matched pairs (findings 6, 7, 9) → cut the heartland track + beat map. Sat AM: 10-credit smoke gen + KB calibration → hero gens (hook exterior, Ch.1 frames-mode, reward move, optional walkthrough) with diff review between other work — gens are minutes each, cheap to re-roll. Sat PM: renderer rewrite → check.sh loop → preview to Shavit Sat night. The long pole is the renderer rewrite + check rewrite (finding 5), not generation. Cut the optional interior walkthrough first if behind — it's the only §04 item marked optional.

---
*Feasibility council · v4.2 · 2026-07-03 · verified against live Higgsfield catalog + on-disk assets, not the spec's own claims.*
