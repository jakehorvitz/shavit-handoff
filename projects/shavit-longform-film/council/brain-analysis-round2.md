# Brain Analysis — Round 2 · `deliver/master_9x16.mp4`

**Run:** 2026-07-04 · video-brain-analyze + video-brain-check (vault: `~/projects/video-brain`, 17 shavit register notes, all `as_of: 2026-07-03`)
**File analyzed:** round-2 master, MD5 `43cccc814602c80d622418b57b7e221a` (analyzed from a byte-identical copy after the round-3 loop started; SHA-256 in `checks/review_packet.md`: `c3c386a6…`)
**Container:** 1080×1920 · 30fps · 53.0s · H.264/AAC — **total bitrate 1.43 Mbps (video ≈1.2 Mbps)**
**Audio:** −14.3 LUFS integrated (inside the [−15,−13] gate) · true peak −0.7 dBTP · **LRA 0.0 LU** · engineered silence 29.0–30.0s (1.0s — inside the 0.8–1.2 window) · B&W freeze verified at the drop
**Known open items (per round-2 machine run, not re-analyzed for depth):** Ch.2 baked caption band; watermark OCR bleed ~14s.

**Human-review status: `checks/visual_review.md` is an unsigned stub.** No human has signed off this render. Per spec §06 that is an automatic acceptance FAIL, and per [[human-review-mandatory]] everything below is evidence for a human decision, not a substitute for one.

---

## VERDICT LINE

**REJECT this render — do not send it to Shavit.** It passes the wording register (no $, full state names, "LOCALLY." closer) but ships a mislabeled state claim, baked Instagram chrome on two beats, a 1-second unreadable story twist, and a 12-second static empty room as the reward — the exact photo-bookkeeping and craft class that triggered the 7/3 "I vote against it." Every fix is local; the next render can pass.

---

## 1 · Timecoded findings

Severity scale: **CRITICAL** (would sink the cut / violates a standing rule or gate), **MAJOR** (a competent CD sends it back), **MINOR** (polish), **ADVISORY** (taste/strategy — cannot block, per [[machine-gates-vs-taste]]).

| # | Timecode | Severity | Finding | Violates | Concrete fix |
|---|---|---|---|---|---|
| 1 | 5.5–7.5s | **CRITICAL** | **"OHIO. / INDIANA." labels a single plate — `05_west_side_cleveland.jpg`, an Ohio property.** The Indiana claim sits on a non-Indiana house, and the actual Indiana plate (`03_2217_parkview_south_bend.jpg`, 7.5–9.0s) is never named. Shavit already rebuked exactly this once (variant B mislabeled a Michigan ranch as OH and IN). | shavit-standards #26 ("state labels must match REAL properties"); [[claims-must-match-title]]; Hormozi #8 promise hygiene | One state per plate: MICHIGAN → `01_river_street` (already correct), OHIO → `05_west_side_cleveland`, INDIANA → `03_2217_parkview`; overlay the proof line ON the Indiana beat as spec'd. |
| 2 | 31–38s & 38–53s | **CRITICAL** | **Baked Instagram chrome inside plates.** The Ch.3 ranch tile (one of `after_044/045/055`) carries carousel prev/next arrows on its edges; the reward plate (`after_019.jpg`) carries a carousel pagination-dot row bottom-center, visible for the film's entire last 15 seconds including behind the closer and signature. Manifest rows claim "cropped to photo rectangle only" — falsified. (Distinct from the two known open items.) | spec §06 plate hygiene ("FAIL on any IG chrome"); [[output-qa-rubric]]; [[ai-reputation-cost]] | Re-crop or replace both plates; re-run the plate-hygiene OCR/chrome pass over every `after_*.jpg` actually composited. |
| 3 | 30.2–31.2s | **CRITICAL** | **The film's twist is unreadable.** "THEN ASKED US / TO BUY HER HOUSE." — 8 words — holds ~1.0s. The engineered silence + B&W freeze build to a payoff nobody can read; the banker story dies. Meanwhile line 1 held ~8s and Ch.3's 5 words get ~7s. | spec §01 Ch.2 beat design; [[value-per-second]]; [[silence-retention-device]] (spike pays into nothing) | Hold the payoff ≥2.5s (warm snap + bed re-entry under it); reclaim time from "ONE BUYER." (~3.5s→2s) and "A BANK MANAGER WATCHED IT ALL." (~8s→5s). |
| 4 | 38–44.5s | **CRITICAL** | **The reward is a 12s static still of an empty room.** Single plate `after_019.jpg`, measured motion MAD 0.18 (fully static), 6.5s of it with no type at all, IG dots baked in. The spec's mandatory interior spectacle (~43–48s) is absent; the "Would I want to rent from them?" payoff is bare floorboards. Also breaks the no-still->8s rule. | spec §01 REWARD ("mandatory interior spectacle"); Hormozi #4 (no dead seconds, no still >8s); [[before-after-retention-stack]] | Replace with a real warm furnished interior + genuine slow move (or the twice-gated build-up effect), ≤8s; give the reclaimed seconds to Ch.2's payoff and the signature. |
| 5 | whole cut | **MAJOR** | **The motion language never shipped.** Measured frame-to-frame change: hook 1.49 MAD/2s, Ch.1 1.12, reward 0.18 — near-static everywhere; the only true freezes are the sanctioned ones (29s, 50s→end). `review_packet.md` labels 16 of 18 segments "camera-move," but the render reads as a dimmed slideshow. If these clips' affine residual is near zero they are Ken Burns by the register's own test — on the hook, chapter opens, AND reward. | spec v4.3 premise ("camera moves are the motion language, 4–8s, one move per shot"); [[kenburns-motion-cap]]; [[slop-composition-signature]]; [[slow-moves-hide-artifacts]] | Re-render hook/opens/reward with real i2v camera moves (Kling-class, frame-diffed vs source); re-run the calibrated affine KB test and publish per-clip residuals in the packet. |
| 6 | 0–53s | **MAJOR** | **Heavy dark scrim over every plate.** Every photograph is dimmed to ~50% so white type reads. Shavit's veto follow-up was "I'll just send you lighter photos" — the cut re-darkens everything he wanted lighter; the hook/poster read gloomy, not premium. | [[restrained-grade-antislop]]; shavit-standards #2 ("lighter photos are the primary plates"); [[poster-cover-doctrine]] | Cut scrim to ~20–25% behind type only (gradient band, not full-frame wash); let the afters be bright. |
| 7 | 0–3 / 13–21 / 51.5–53s | **MAJOR** | **61 Salem, three times, same angle.** Hook (`salem_clean_after.jpg`), Ch.1 after (`06_61_salem_street_hillsdale.jpg`), signature bg (`after_018.jpg`) are three different files of the same property at a near-identical angle — passes phash, reads as "this picture was used twice" to the man who caught that last time. Worse: the hook property appears finished at 13–21s, resolving the open loop ~30s early, while the actual reward plate (`after_019`) is not verifiably the hook property at all. | Hormozi #2 open-loop integrity ([[hook-retain-reward-framework]]); spec §06 same-house loop check (hook/reward same property, *different photographs*); Shavit dupe-catch (predictor #5) | Make the reward visibly 61 Salem (different photo/angle — interior or porch); swap the Ch.1 after to a different Salem angle than the hook; signature bg over the reward's final frame per spec, not a third Salem exterior. |
| 8 | 9.5–23s / 23.5–31.5s | **MAJOR** | **Both chapter tags are missing.** No "SALEM STREET" brass tag on Ch.1 (kills the proximity factor — the most specific geography the film has); no "ONE OF OUR REHABS" tag on Ch.2. Also: no rebuild sequence in Ch.1 — dark before cuts straight to finished after with no transformation, on a chapter about rebuilding. | spec §02 F3/F4; Hormozi #5 stakes/newsworthiness; [[before-after-retention-stack]]; [[specificity-builds-trust]] | Add both tags at the remaster scale (~3% frame height, [[address-tag-scale]]); insert 2–3s of the real 61 Salem split-screen rebuild footage between before and after. |
| 9 | 0–3s | **MAJOR** | **Hook typography is a wrapped paragraph.** "FIFTY DOORS. THREE / STATES. ONE / STANDARD." breaks mid-phrase, ~56px vs the spec's ~92px hook scale, no three-beat word-group rise, no brass underscore on "ONE STANDARD." It reads as default text-box wrapping, not design. | spec §02 F1 + §03 type scale; [[type-collision-lessons]]; [[animate-fast-hold-long]] | Set three clean line-groups ("FIFTY DOORS." / "THREE STATES." / "ONE STANDARD."), ~92px, rising on beats 1-2-3, brass underscore on the third. |
| 10 | 3–11.5s | **MAJOR** | **Proof beat: no before→afters, and it sprawls.** Three single plates (no ghost dissolves anywhere — acceptable fallback only where no verified before exists), and the MADE IN AMERICA line lingers ~4s over the Indiana plate (observed to ~11.5s), stretching proof to ~8.5s — the exact 3–10s sag council compressed to 6s. "FIFTY DOORS" is never visually paid. | spec §01 PROOF (6s, accelerating, line as reveal caption); council r2 retention note; [[hook-formula-rotation]] | Restore the 2.5/2.0/1.5s accelerating rhythm with per-state labels; hard-cut out of the Indiana after at ~9s into Ch.1's wrecked before. |
| 11 | whole cut | **MAJOR** | **Zero human/Midwest-texture beats.** No crew, no porch/flag/small-town detail, no tenant-coded human anywhere — the spec requires ≥3 (texture fallback applies given the footage audit), and two of the four audiences never see themselves. | spec §03 Human touch; shavit-standards #21; Hormozi #14 ([[match-avatar-in-ad-creative]] via hormozi-criteria) | Add ≥3 texture beats from real footage (crew hands from the reels, porch/lawn Americana); brief the 10-shot checklist for a tenant-coded beat next round. |
| 12 | delivery | **MAJOR** | **Master encoded at ~1.2 Mbps video** for 1080×1920@30 — an order of magnitude under platform-master practice; IG's re-encode will smear the already-soft screenshot-derived plates. Audio: LRA 0.0 LU (bed dynamics crushed flat — a loudness-war master gains nothing on Reels) and true peak −0.7 dBTP (above the −1.0 transcode-safe ceiling). | [[upload-bitrate-doctrine]]; [[reels-loudness-normalization]]; [[mix-level-targets]] | Re-export at CRF ~18 / 10–12 Mbps, keep −14 LUFS but limit TP to −1.0, and source a bed master with real dynamics. |
| 13 | provenance | **MAJOR** | **No manifest rows for the music bed (`build/audio/bed.wav`) or the Ch.2 real-footage segments (21–29s, 30–31s).** Rights basis for the audio (claimed Pixabay "Heartland") and the footage is unverifiable from the manifest; a missing row for a used asset is itself a FAIL under the register's rights logic. | [[no-zillow-photos]] rights logic (see check table); spec §06 provenance | Add rows (file, source, license) for bed + footage; cite the Pixabay license URL. |
| 14 | 7.5–9s | MINOR | Proof line renders "MADE IN AMERICA. / LOCAL TO THE MIDWEST." — period separator; register sanctions interpunct or comma ("typography, not wording"). | [[no-dollar-figures]] check text | Use "MADE IN AMERICA · LOCAL TO THE MIDWEST". |
| 15 | 3–5.5s | MINOR | The MICHIGAN kitchen is a finished after graded cool/desaturated — the grade grammar (cool = before, warm = after) says "before" over an after. | spec §03 Grade | Grade the Michigan plate warm, or use a genuine before here. |
| 16 | 5.5–7.5s | MINOR | Two narrative lines on one frame ("OHIO." + "INDIANA.") vs the one-line-per-frame rule. Fixing #1 fixes this. | spec §03 Word budget | Per-state single labels. |
| 17 | captions | MINOR | `deliver/captions.md` calls it a "60-second" film (master is 53s); no pinned-comment draft in the pack. | Hormozi #8/#13; caption hygiene | Say "under a minute"; add a pinned-comment line. |
| 18 | 50–53s | MINOR | Signature is compressed to ~1.2s of real screen time (closer text lingers to ~51.5s; packet claims 50.0). Draw + hold rushed vs the spec's ~1.5s + 1.5s. | spec §01 SIGNATURE | Start the closer at 43.5s, signature draw at 50.0s clean. |
| 19 | 31–38s | ADVISORY | Ch.3 "ONE BUYER. / THE WHOLE SET." still reads as celebrating a portfolio exit against the film's "they stay" thesis — unresolved from the criteria doc; taste, cannot block. | Hormozi #15 one-big-idea | Confirm the true story with Shavit; consider "THE ANSWER WAS NO." style stewardship reframe next round. |
| 20 | whole cut | ADVISORY | No tenure marker ("SINCE 20XX") and no third-party voice anywhere — the two cheapest missing authority signals. | Hormozi #11, #12 | 2 words under the signature wordmark (confirm year Saturday); collect one real tenant/review line for a future rev. |
| 21 | ~14s / 21–29s | (KNOWN) | Watermark OCR bleed ~14s; Ch.2 baked caption band — already tracked from the round-2 machine run; not re-analyzed. | spec §06 | Per existing round-3 loop items. |

**Counts: 4 CRITICAL · 9 MAJOR · 5 MINOR · 3 ADVISORY (+2 known items).**

---

## 2 · video-brain-check — mechanical register QA

Manifest assembled from: OCR over 53×1fps + 3 dense 4fps passes (on-screen strings), `checks/review_packet.md` plate/text timeline + measured frame diffs (motion inventory), `build/layers/*.png` hex sampling (palette), `assets/manifest.csv` 95 rows (provenance), loudnorm/silencedetect/freezedetect (audio), zero people observed (people_footage).

REGISTER CHECK — deliver/master_9x16.mp4 (round-2, MD5 43cccc…) — 2026-07-04

| Rule | rule_type | as_of | Verdict | Evidence |
|---|---|---|---|---|
| [[no-dollar-figures]] | standing | 2026-07-03 | **PASS** | Zero `$` in all sampled frames + captions.md; proof line present 7.5–9s; closer "BUILDING COMMUNITIES, LOCALLY." verbatim. Note: period separator instead of interpunct/comma (finding #14, typography). |
| [[full-state-names]] | standing | 2026-07-03 | **PASS** | MICHIGAN / OHIO / INDIANA spelled out; standalone MI/OH/IN tokens absent from frames and captions. (State-to-property mismatch is a claims violation, finding #1 — outside this rule's OCR predicate.) |
| [[no-house-numbers]] | standing | 2026-07-03 | **PASS** | No digit-leading address strings; no street text on screen at all (tag absence itself = finding #8). |
| [[no-generated-architecture]] | standing | 2026-07-03 | **PASS** | Every plate in the packet timeline traces to a real photograph in manifest.csv (own IG posts + site repo heroes); banned-by-name 34 Mead / Cleveland Heights plates exist in assets but are NOT in the composited timeline; no outpaint jobs. |
| [[brand-tokens]] | standing | 2026-07-03 | **PASS** | Pre-composite layer hex sample (`build/layers/*.png`): #FFFFFF, #FFC000, #B08D57 only; gold ≤1 stake line per chapter (A HOME AGAIN. / TO BUY HER HOUSE. / THE WHOLE SET. / LOCALLY.); brass on signature rules only; uppercase Inter-class type. |
| [[no-pulsing-logo]] | standing | 2026-07-03 | **PASS** | Watermark "SHAVIT·ROOTMAN" constant 35% white top-right, absent on signature; mark draws once then full freeze (freezedetect 50s→end, no oscillation). |
| [[static-signature]] | standing | 2026-07-03 | **PASS** | Final 2.2s: signature over the dimmed warm exterior, no black-field frame, mark static after draw-on. (Timing rushed — finding #18, craft not register.) |
| [[no-zillow-photos]] | standing | 2026-07-03 | **FAIL** | No listing-portal provenance anywhere — but the rule's rights logic requires a manifest row for EVERY used asset: the music bed (`build/audio/bed.wav`) and the Ch.2 real-footage segments (21–29s, 30–31s) have no rows. Finding #13; fix = add rows. |
| [[de-identify-people]] | standing | 2026-07-03 | **PASS** | Zero identifiable people in any sampled frame; banker beat is type-only with no identifying pairings. Caveat: the generic "ONE OF OUR REHABS" tag specified to anonymize the beat is missing (finding #8). |
| [[disparage-house-not-street]] | standing | 2026-07-03 | **PASS** | "A TREE WENT THROUGH THE ROOF." — factual, house-scoped; no street/community negatives anywhere. |
| [[posting-ceiling]] | standing | 2026-07-03 | UNTESTABLE | Deliverable is a cut; no publishing calendar supplied. |
| [[templated-formats]] | standing | 2026-07-03 | **PASS** | Named builder + scene map exist in the producing repo: `build_video.py`, `build/cutlist.json`, `build/text_manifest.json`, 15-slot type-layer template. |
| [[kenburns-motion-cap]] | standing | 2026-07-03 | **PASS\* (disputed)** | Per packet labels: KB only on the signature (~3s ≈ 7% of still-derived runtime, not on hook/opens/reward) → passes. \*Independent frame-diff shows near-zero global motion on the "camera-move" clips (MAD 0.2–1.5); if their affine residual is near zero they reclassify as Ken Burns and the cap fails on hook, opens AND reward. Re-run the calibrated affine test before trusting this PASS (finding #5). |
| [[reputation-not-virality]] | standing | 2026-07-03 | **PASS** | No engagement bait, income hooks, urgency CTAs, or manufactured drama; film is ask-free; captions carry only a soft bio-link line. |
| [[register-rule-typing]] | inferred | 2026-07-03 | **PASS** | All 17 register notes carry rule_type / check / pass·fail examples / applies_to / status; no dangling superseded pointers. |
| [[rebuilt-caption-softening]] | one-time | 2026-07-03 | **PASS** | "REBUILT. / RE-RENTED." — WRITTEN OFF absent everywhere. |
| [[address-tag-scale]] | one-time | 2026-07-03 | UNTESTABLE | No tag frames exist to measure — street/project tags are missing entirely (finding #8). |

**Advisory audience pass** ([[audience-lenders]], [[audience-partners]], [[audience-sellers]], [[audience-tenants]], [[reputation-not-virality]]): no success-flexing, no dollar signaling — good for the lender read ([[flexing-is-red-flag]] clean). But the mislabeled Indiana plate is precisely what a diligence-trained lender or Midwest local notices, and it damages the exact audience the film exists for ([[specificity-builds-trust]], [[hook-vs-diligence-audience]]). Tenants (an empty bare room as "home") and community members (zero human/local texture) don't see themselves in the cut.

**RESULT: HARD FAIL (1 standing rule: [[no-zillow-photos]] rights logic) · 0 confirm-with-Shavit warnings · 2 untestable · 1 disputed PASS.**
A full PASS still would not be taste approval — the v3 master passed everything and was rejected ([[machine-gates-vs-taste]]).

**Staleness:** all cited register notes are `as_of 2026-07-03` (1 day old); the fast-volatility notes (full-state-names, no-dollar-figures, no-generated-architecture, kenburns-motion-cap, posting-ceiling) are well inside the 90-day window; no Higgsfield model-routing claims were relied on. **No staleness warnings.**

---

## 3 · Verdict — would Shavit approve this as-is?

**Predicted: NO — "I vote against it," again.** Scored against the ranked rejection predictors (shavit-standards §B):

| Predictor | Status on this cut |
|---|---|
| 1. Anything that reads AI | **Moderate risk.** No generated architecture (real win), but the soft upscaled-screenshot plates + near-static "camera moves" + full-frame dark scrim read cheap/off rather than AI — adjacent failure mode of the same veto ("it should look extremely professional"). |
| 2. Music misses Midwest-luxury | **Unverifiable = live risk.** Bed provenance is not in the manifest; LRA 0.0 means whatever the track is, it's been crushed flat. His #2 rejection line last time was "Song - off!" — this cannot go to him unverified. |
| 3. Dollar figures | **Clean.** Zero `$` on screen and in captions; proof line in place. |
| 4. MI/OH/IN or "profitably" | **Clean.** Spelled out everywhere; "LOCALLY." verbatim. |
| 5. Photo bookkeeping | **FIRES, three ways.** Indiana label on a Cleveland property; 61 Salem at near-identical angle in three beats (his exact "used twice" catch); IG carousel arrows/dots baked into two beats. He found this class of error himself last time — with fewer instances. |
| 6. Off-brand system | **Clean.** Tokens exact, no pulse, no black card. |
| 7. Community-disparaging copy | **Clean.** |
| 8. Privacy/legal | Screen-clean (no addresses, banker de-identified); bed/footage rights rows missing is the residual exposure. |

Predictor #5 fires outright and #1/#2 are live — and this film is being judged by a man who rejected a cut that passed every machine gate. **Do not send Saturday's package on this render.**

### Top 5 changes that most move virality and reputation

1. **Fix the state/property bookkeeping (findings 1, 7).** One state per plate with INDIANA on the South Bend house; make hook→reward a real same-property loop with different photographs, and de-triple 61 Salem. This is the single highest-probability veto trigger and a pure reputation play — his audiences are diligence people.
2. **Rebuild the back half (findings 3, 4).** Give the banker payoff ≥2.5s and replace the 12s static empty room with a real warm interior that moves (≤8s). The twist and the reward are the film's two emotional payments; right now one is unreadable and the other is bare floorboards — that's where both retention and trust die.
3. **Strip every trace of Instagram chrome and re-run plate hygiene over all composited `after_*` crops (finding 2).** Carousel arrows/dots on a pinned brand film read "screenshotted my own feed" — instant amateur signal to lenders, the anti-thesis of "extremely professional."
4. **Deliver the motion language and lighten the grade (findings 5, 6, 9).** Real camera moves on hook/opens/reward (frame-diffed vs source), scrim cut to a type-band, hook set at spec scale with clean three-beat line groups. This is the "looks a little AI / student-made" veto axis and the biggest virality lever after the hook itself.
5. **Master it like a deliverable (findings 12, 13, 8).** 10–12 Mbps re-export, TP −1.0, a bed with actual dynamics and a manifest row proving its license, SALEM STREET / ONE OF OUR REHABS tags at the 2.3× scale. Then get a human signature on `checks/visual_review.md` — the gate exists because machine-passing cuts have died before.

### What's working (keep these)

- **The hook claim lands on frame 1, fully legible on mute, and the poster frame is the hook frame** — exactly right for the 3-second decision window ([[first-frame-text-mute]], [[hook-first-three-seconds]], [[poster-cover-doctrine]]).
- **The Ch.2 silence mechanism is genuinely engineered:** bed bottoms out 29.0–30.0s (measured, 1.0s inside the 0.8–1.2 gate) with a true B&W freeze as the muted-viewer event ([[silence-retention-device]]) — it just needs a payoff line that lives long enough to be read.
- **The word register purge held completely:** zero dollars, full state spellings, "BUILDING COMMUNITIES, LOCALLY." verbatim, REBUILT softening, no addresses, no early wordmark ([[no-dollar-figures]], [[full-state-names]], [[rebuilt-caption-softening]], [[no-house-numbers]]).
- **The brand system is pixel-exact:** #FFFFFF/#FFC000/#B08D57 only on the type layers, gold rationed to one stake line per chapter, watermark static, signature draws once over the image with no black card ([[brand-tokens]], [[static-signature]], [[no-pulsing-logo]]).

*Golden-set calibration note: none of V5's fixed mechanical defects were re-flagged; V6's v3-era register defects ($ figures, abbreviations, "profitably", outpainted plates) are confirmed fixed in this render and were not re-flagged.*
