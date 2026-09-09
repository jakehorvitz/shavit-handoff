# Council critique v4.2 — retention/hook lens

**VERDICT: PASS-WITH-FIXES**

Scope: retention mechanics only, against spec.html v4.2 (2026-07-03). Prior round (v3) findings D1–D6 are all addressed in v4.2 except where noted. New findings below.

---

## Direct answers to the questions posed

- **Numbers-first hook vs curiosity hook (0–3s):** For cold-feed reach, yes — "FIFTY DOORS. THREE STATES. ONE STANDARD." is weaker than a curiosity gap; it's a claim, not a question, and claims don't cost the thumb anything to skip. But this is a **pinned profile reel**: the dominant viewer is a profile visitor already evaluating trust (Shavit's own audience list, §00), and for a lender/tenant deciding "can I trust this company," numbers-forward is the right open. The line is also client-locked. Don't fight the line — fix the *frame* under it (Finding 7). Cold-reach weakness is already hedged by the N1/N2 head-swaps.
- **Does the proof beat sag?** Yes — it's the single worst retention stretch in the cut (Finding 4).
- **~30-word cap:** The cap is right in spirit (per-frame load is the retention variable) but the spec's own beat map busts it by ~75% — the build loop will thrash or amputate the wrong lines (Finding 1).
- **Ch.2 music drop-out with the warmer track:** Still works in principle; underspecified and muted-viewer-blind in practice (Finding 5).
- **Construction effect at 12–24s:** Right placement. Front-loading the wow at ~15–20s buys the early retention that drives distribution. The problem is what it leaves behind: the back half (24–57s) has zero spectacle (Finding 6).
- **Is 57s too long?** Not for a pinned intent-driven asset — but 12 seconds of de-identified generic rehab footage carrying 13 words (Ch.2) is too long *inside* it. Trim there, land ~52–53s (Finding 6).

---

## MUST-FIX

**1. MUST-FIX — The word budget is arithmetically broken and will wreck the build loop.**
Count the beat map's actual lines (§01 + §02): hook 6 + proof 10 (MICHIGAN/OHIO/INDIANA + MADE IN AMERICA, LOCAL TO THE MIDWEST) + Ch.1 11 + Ch.2 13 + Ch.3 9 (beat-map version) + reward 7 = **~56 total, ~47 unique** — against a "≈30 word" cap (§03) and a **≤35 unique** OCR acceptance gate (§06). The §03 budget formula ("hook + setup/payoff per chapter + closer") doesn't even budget the proof-beat words or "SAME HOUSE. NEW STANDARD." Retention consequence: at build time the loop auto-fails and the builder deletes lines ad hoc — and the lines that die will be the cheap-to-cut ones (stake lines), not the right ones.
**Fix:** Before build, canonize ONE line set and re-derive the number from it. Recommended canonical set (~52 total): keep everything in §01 but take Ch.3 from the storyboard ("ONE BUYER." / "THE WHOLE SET." — 5 words, not 9). Then set the acceptance gate to that set's actual unique count (~44) and get Jake to re-sign the number, OR cut to genuinely hit ~35 unique: drop "SAME HOUSE. NEW STANDARD." (the same-house visual already says it — that's the whole point of the loop check) and merge Ch.1's payoff to "REBUILT. A HOME AGAIN." (−6 total). Per-frame rule (≤7 words, one line at a time) stays untouched — that's the part that actually protects retention.

**2. MUST-FIX — Storyboard frame F3 still shows "+$140K IN VALUE." in gold.**
§02 F3 (00:12–00:24) carries the struck dollar line as the chapter's gold stake line. This contradicts §00-A ("struck by default"), §01 ("A HOME AGAIN." is the stake), and hard-fails the ZERO-"$" OCR gate in §06. If a builder comps from the storyboard — which is what storyboards are for — the render fails acceptance or, worse, ships the exact thing Shavit ordered removed.
**Fix:** Edit F3's type block to `A tree went through the roof. / Rebuilt. Re-rented. / A HOME AGAIN.` with "A HOME AGAIN." as the gold line. One-line spec edit; do it before anyone opens Remotion.

**3. MUST-FIX — Ch.3 has two different scripts in the same spec; the verbatim-claims OCR check guarantees one of them fails.**
§01 beat map: "ONE BUYER SAW THE PORTFOLIO." → "WANTED THE WHOLE SET." (9 words). §02 F5: "One buyer. / The whole set." (5 words). §06's OCR gate requires on-screen lines to match the approved claims list *verbatim* — with two versions in the spec, either the claims list or the render is wrong by construction.
**Fix:** Canonize the storyboard version — "ONE BUYER." (beat 1) → "THE WHOLE SET." (beat 2). It's 4 words shorter (helps Finding 1), and staccato fits the 7s escalation chapter better than a full sentence. Update §01 and the §06 claims list to match.

**4. MUST-FIX — The proof beat (3–12s) sags exactly on the first-drop cliff.**
Nine seconds of three *identical-mechanic* ghost-dissolves where the only new information per beat is a state name the hook already promised — the viewer has the pattern fully priced after dissolve 1, at ~5s, which is precisely where IG retention curves bleed hardest (3–10s). Then it gets worse: "MADE IN AMERICA, LOCAL TO THE MIDWEST" plays as a static tagline card at ~10–12s — a 7-word standstill right before the first story starts. v3's pattern-fatigue finding (D3) got fixed at the chapter level and reintroduced at the proof level.
**Fix:** Compress proof to **6s** with accelerating dissolves — Michigan 2.5s, Ohio 2.0s, Indiana 1.5s — and overlay "MADE IN AMERICA, LOCAL TO THE MIDWEST" *on* dissolve 3 (it's the reveal caption, not its own beat). Hard-cut out of the Indiana "after" directly into Ch.1's tree/roof before-frame — the collision (finished house → wrecked house) is itself a retention event. Ch.1 now starts at ~9s.

**5. MUST-FIX — The Ch.2 silence spike is undefined, muted-viewer-blind, and the warm track softens it.**
Three stacked problems with the film's claimed "retention spike mechanism": (a) "held beat" has no duration — anything past ~1.2s of dead air on a phone reads as a broken video and earns a swipe; (b) a large share of IG viewers watch muted — for them the entire mechanism *does not exist*, and the spec assigns no visual event to the beat; (c) the mechanism was designed against a cold cinematic bed. 'Heartland'-style warm sparse Americana sits much closer to silence already — dropping from quiet-warm to nothing is a shrug, not a spike.
**Fix, all three:** (a) hard-spec the hold at **0.8–1.2s** and add it to the beat-alignment acceptance check; (b) put a visual event ON the beat — freeze-frame or snap the rehab footage to desaturated/near-B&W on the drop, snap warm on "THEN ASKED US TO BUY HER HOUSE." so the beat lands with sound off; (c) have the bed *lift* for ~1s (rising figure or added strings) immediately before the cut so the silence is a fall from a local peak, and re-enter with a low swell, not a resume. Add these to the music brief before the 2–3 candidates are generated — track choice must accommodate the lift.

**6. MUST-FIX — The back half (24–57s) has no spectacle; Ch.2 is the saggiest 12 seconds in the cut.**
After the construction build-up ends (~20s), the remaining 33+ seconds contain: 12s of deliberately de-identified, addressless, generic rehab footage carrying two type lines (Ch.2 — visually anonymous *by design*, which is correct for privacy and fatal for retention), 7s of tile pops, and an 11s reward that is one warm exterior plus two lines. The spec's only other visual weapon — the second frames-mode build-up on the reward interior — is marked "optionally." The mid-roll cliff for THIS cut is 24–43s, and the spec leaves it undefended.
**Fix:** (a) Make the reward-interior frames-mode build-up **mandatory**, placed at ~43–48s: studs-to-warm-interior paying off the loop visually before "BUILDING COMMUNITIES, LOCALLY." — it's the film's second-best asset and it's currently a maybe. (b) Trim Ch.2 from 12s to **10s** — 13 words never needed 12 seconds. (c) Resulting timeline: hook 0–3 · proof 3–9 · Ch.1 9–21 · Ch.2 21–31 · Ch.3 31–38 · reward 38–50 · signature 50–53. **~53s total**, inside the 55–62 gate only if the gate's floor drops to 52 — change the ffprobe gate to **52–62s** in the same edit.

---

## NICE-TO-HAVE

**7. NICE-TO-HAVE — Hook execution: motion in frame one, and land beat 3 on the cut.**
The locked line is fine for this asset (see direct answers), but the spec's "strongest finished exterior, slow camera move" risks 20 static-ish frames of a pretty house — a pretty house is a scroll. Require: camera already moving at frame 0 (cut into the move mid-motion, never at its start), and time "ONE STANDARD." to land simultaneous with the hard cut into the proof beat so the third text beat doubles as the first edit. If the July-5 post uses a head-swap, N1 is still valid (the 250th is the whole weekend), but W7 is the safer pin since the holiday context evaporates by Tuesday and the pin lives for months.

**8. NICE-TO-HAVE — Two acceptance checks collide on the hook/reward pair.**
§06 requires hook and reward frames to be "the same property, angle-matched" (same-house loop check) AND that "no photo appears in two different beats" (duplicate-plate check). If the builder satisfies the loop check with the same photograph, the dupe check fails; if the dupe check is naively strict, it forbids the loop. Spec the resolution explicitly: same property, *different photograph* (or different crop/time-of-day), and exempt the hook/reward pair from perceptual-hash collision at a stated threshold.

**9. NICE-TO-HAVE — Ch.3 tile count.**
"Rapid tiles from the 10 verified heroes" in 7s = ~0.7s/tile of near-identical finished-house exteriors — at that cadence they smear into wallpaper. Cap at the 6–8 most visually distinct heroes (vary exterior/interior, day/dusk) and let the last tile hold a full beat under "THE WHOLE SET."

**10. NICE-TO-HAVE — F6 timecode contradicts the beat map.**
Storyboard F6 reads 00:54–01:00 (6s signature — the exact thing v3's D6 killed); beat map says 54–57s (~3s). Fix the timecode to match the beat map so nobody rebuilds the long tail from the storyboard.

---

## What v4.2 got right (for the record, so it doesn't get "fixed" backwards)

- 12/12/7 chapter escalation retained; no return to equal blocks.
- Signature as draw-on over the dimming final frame, no black card — loop-replay seam is now good.
- Ken Burns cap with machine check, and banned from hook/chapter-opens/reward — the exact frames where dead motion kills.
- Construction build-up placed 12–24s is correct; do not move it later "to fix the mid-roll" — fix the mid-roll with Finding 6 instead.
