# Council critique — CLIENT / REPUTATION / LEGAL lens · spec v4.2
## Verdict: PASS-WITH-FIXES

v4.2 is a real response to the 7/3 rejection — every line of Shavit's feedback maps to a delta, the $ purge kills the Reg D flag, the banker is de-identified, and most acceptance checks are machine-verifiable. But the spec still contains the two ingredients of a second rejection: it bets its Ch.1 centerpiece on the most AI-looking technique in the toolbox, and it never actually gates the Sunday post on Shavit approving the cut. Both are cheap spec edits today and catastrophic after render. 7 MUST-FIX, 6 NICE-TO-HAVE.

---

## MUST-FIX

### 1. There is no gate where Shavit sees and approves the cut before it posts Sunday. (MUST-FIX — the single biggest risk in the document)
The client rejected the last promoted cut three days ago. The only pre-publish client touch in §06 is "one text to Shavit — confirm 50+ doors as-of-date and the buyer count." That is a fact-check, not an approval. §02B's "Jake + Shavit thumbs-up" governs the *hook pick* at "the weekly review," with no date attached. Status line says "awaiting Jake's re-sign" — Jake is not the client who voted against v3. If v4 posts Sunday without Shavit's written approval of the actual video, and anything in it reads AI to him again, the relationship damage is worse than a slipped post date.
**Fix:** Add a hard Stage-8 gate to §06: (a) Shavit receives the full 9:16 cut by Saturday 12:00; (b) written approval ("👍" counts) required before pin; (c) no approval by Saturday night = the post slips — the film is evergreen, July 4 is not load-bearing (see #7). Fold the doors/buyer confirm into the same message so he answers once.

### 2. The Ch.1 "construction build-up" (Kling frames-mode) violates the spec's own credibility rule and is the most likely trigger of a second "looks AI." (MUST-FIX)
§04's governing rule is verbatim: **"AI may move the camera, never the house."** Frames-mode interpolation *is* moving the house — every intermediate frame is a generated construction state that never existed on the real property. The very next §04 row bans "fake construction states" because they "render a state that never existed" — the spec's distinction (Nano Banana still = banned, Kling interpolation = centerpiece) is a distinction Shavit's eye will not make. This is exactly the aesthetic he rejected 72 hours ago, promoted to the emotional core of Ch.1. Worse for the lender audience: a banker watching a house visibly "rebuild itself" can reasonably conclude the *footage* is fabricated — in a film whose one job (§00) is "Can I trust this company?" And the acceptance backstop is dead on arrival: §06's "reviewed diff vs its source still" is meaningless for frames-mode, whose middle frames are *supposed* to differ from both anchors.
**Fix:** (a) Demote frames-mode from "the Ch.1 centerpiece" to a candidate treatment; (b) the default Ch.1 spine becomes the asset that already exists and is real — the 61 Salem split-screen film (§05) plus ghost-dissolve studs→after; (c) frames-mode ships ONLY if Shavit approves that specific clip in isolation before the composite (send it to him as "real photo → real photo, AI fills the timelapse — yes/no?"); (d) add an honest acceptance line for it: human review against both anchor photos + a kill switch, not a frame-diff that can't apply. Same preview-approval treatment for the 1–2 AI walkthroughs — a slow push along the photo's own axis is the safest i2v there is, but it still hallucinates parallax detail in the interior, and the reward interior is the frame the tenant audience trusts most.

### 3. Meta will label — or auto-label — the synthetic video, and the spec never decides the disclosure stance. (MUST-FIX)
The walkthroughs and any frames-mode clip are photorealistic AI-generated video. Meta's policy expects disclosure of realistic AI-generated content, and Instagram auto-applies an "AI info" tag when its classifiers detect it. Picture the failure: Shavit's pinned trust film — re-cut specifically because "it looks a little AI" — gets a platform-applied AI badge in front of his lenders and tenants. That outcome is worse than either alternative.
**Fix:** Decide the stance at the same gate as #1, with Shavit: either (a) self-disclose calmly (caption line like "some transitions animated from our own photos" — turns it into transparency, on-brand for trust), or (b) cut the synthetic-motion beats hard enough (camera-move-only, short, composited under type) that auto-detection risk is negligible and the film survives a label if one lands anyway. Do not post without having chosen.

### 4. The asset inventory still lists 34 Mead and Cleveland Heights as usable heroes — one row contradicts the exclusion. (MUST-FIX)
§05's "Website property heroes" row enumerates 10 heroes *including "34 Mead" and "Cleveland Heights"*, then hand-waves "the two Shavit flagged are already out." A builder pulling from that row can legitimately grab the 34 Mead *website* hero, believing only the specific IG frame Shavit flagged is dead — but Shavit's words were "This photo below is AI, I have another of 34 Mead," i.e. the circulating 34 Mead image itself is suspect until his replacement lands. The build directive is that Cleveland Heights and 34 Mead are excluded *entirely* until his photos arrive.
**Fix:** Rewrite the row: strike both properties by name, count → 8, add to the confirmed-dead table: "34 Mead — ALL current plates (website + IG) quarantined until Shavit's replacement photo lands; Cleveland Heights — same." Also define the "re-verified as a real photograph" screen, which currently has no method or owner: provenance = traceable to Shavit's own camera/IG original, and any plate showing the same over-smooth lawn/staging tells as the dead collage plates gets a one-word Shavit confirm before use. He caught two AI-looking plates that Jake's pipeline missed; assume the screen that let them through has other misses.

### 5. The "+$140K" overrule hatch must close, and storyboard F3 still renders the dollar line. (MUST-FIX)
Shavit's instruction was "Remove **all** portfolio value moving forward." §00-A/§01 correctly strike "+$140K" by default — then reopen the wound with "Jake can overrule at the gate if he reads Shavit's rule as portfolio-total only." Three days after a rejection is not the moment to litigate the client's sentence back at him. Meanwhile storyboard frame F3 (§02) still shows **"+$140K in value."** in gold — a builder working from the storyboard ships a "$" and only the OCR check saves it.
**Fix:** Delete the overrule clause — the stake line is "A HOME AGAIN." period. Update F3's comp to match the §01 beat map. (The OCR zero-"$" acceptance check is good; keep it as backstop, not as the plan.)

### 6. "FIFTY DOORS" is an exact falsifiable count in a lender-facing hook; the confirm is gated but not dated, and Ch.3 can invalidate it. (MUST-FIX)
The claim gate exists (§06: confirm "50+ doors as-of-date" pre-Stage-8) — good. Three gaps: (a) the hook says "FIFTY," the spec's own language says "50+" — if the real number is 47, "FIFTY" in the opening frame of a film aimed at lenders is a false statement of fact, not puffery; (b) the confirm has no deadline, and the post is Sunday; (c) Ch.3's own story ("ONE BUYER... WANTED THE WHOLE SET") begs the question the hook must survive — if any of that set actually *sold*, the door count moved. A pinned film also ages: doors change, "FIFTY" doesn't.
**Fix:** One message to Shavit by Saturday (same message as gate #1): "As of this week, is 'fifty doors' accurate to say on camera — yes/no, and did the whole-set buyer close or just offer?" If the count is ≥50 but not exactly 50, keep "FIFTY DOORS" only with his explicit ok, else fall back to a wording he confirms. Log answer + date in the claims list. Add a 90-day pin-review note: if doors materially change, refresh the hook frame.

### 7. "AMERICA TURNS 250" posts a day late — the film goes up Sunday July 5. (MUST-FIX as a decision, trivial to execute)
July 4, 2026 is Saturday; the post is Sunday. N1's present-tense Semiquincentennial hook, pinned the day after the party, reads as having missed the moment — and it's pinned, so it reads that way for months. The patriotic *texture* (music, porch, warmth) is what Shavit asked for and ages fine; the dated *claim* doesn't. Secondary optics: keep the flag and "MADE IN AMERICA" as warmth, not as the argument — a landlord brand leading with flag-wrapped copy invites bad-faith readings from exactly the tenant/community audience §00 courts, and note it is Shavit's verbatim line, so keep it, but let the proof beat carry it quietly rather than the hook.
**Fix:** Lead with W7 (locked) and hold N2 as the evergreen second head-swap. N1 only ships if the post actually lands on the 4th. If Shavit specifically wants the birthday nod on the 5th, past tense variants exist ("AMERICA JUST TURNED 250...") — his call at the #1 gate.

---

## NICE-TO-HAVE

### 8. Upgrade the banker heads-up from "suggested" to a publish precondition.
Ch.2 de-identification is genuinely good (no address, no town, no "two doors down"). Residual: "asked us to buy **her** house" + "bank manager" + Shavit's small, known markets — county grantor/grantee deed records are public, and a motivated local can match his LLC's purchases to a bank employee's sale. Probability low; blast radius = his warmest banking relationship, in front of his lender audience. §06 calls the heads-up text "suggested cheap insurance." Make it required before pin: one line from Shavit to her. (Keep "her" — genuine, and the heads-up covers it.)

### 9. Ban generated/composited flags explicitly.
N1's frame note says "flag on the porch if we have one." Make the second half of that rule explicit in §04's NO table: a flag may appear only if it exists in a real photo — an AI-added flag is simultaneously an AI tell (#2's whole problem) and a patriotism-as-prop optics failure.

### 10. Interior plates: add a "vacant/staged at capture" flag and a bystander check.
Salem Street is re-rented; the film shows its interior with "A HOME AGAIN." If any interior plate was captured after move-in, that's a tenant's home on a commercial film. Add a manifest.csv column (vacant/staged at capture: y/n, no-provenance-no-composite already exists to hang it on) and a human pass over street/crew footage for identifiable neighbors, passersby, or subcontractors who never agreed to be in an ad.

### 11. Name the hook/reward house now.
With 34 Mead and Cleveland Heights quarantined and 61 Salem spent on Ch.1, the "strongest real exterior" + matching warm interior + angle-matched loop (§06 same-house check) has maybe 2–3 candidates left, some of which exist only as IG screenshots. The most-watched 3 seconds of the film shouldn't ride on the weakest plates. Pick the property in the spec, verify its plates first.

### 12. AI music: confirm commercial-use rights per the generator's ToS.
Generated Americana bed is the right call (no sync-license exposure), but log the generator + plan tier in the manifest — some tiers restrict commercial use, and this is a commercial brand film.

### 13. Cosmetic: F6 timecode says 00:54–01:00 against a ~57s runtime.
A builder trusting the storyboard pads 3 seconds the beat map doesn't have. Align to 54–57s.

---

## What already passes this lens (for the record)
- $ purge + "Made in America, local to the Midwest" replacement: kills the Reg D solicitation exposure flagged in the v3 critique — the film's single biggest legal risk is gone at the client's own request.
- Banker de-identification (R1) held and improved; H2/H9 stayed dead.
- Zillow/Redfin strike (R2) held; provenance manifest is now a gate.
- No-full-address rule (R3) held and machine-checked via OCR; screenshot crop pre-step protects Jake's own privacy.
- Full state names, dupe-plate check, verbatim closer "BUILDING COMMUNITIES, LOCALLY." — every 7/3 instruction has a mapped, checkable delta.
- No AI people/testimonials, no outpainted architecture: correct and unambiguous.

*Council risk lens · v4.2 · 2026-07-03*
