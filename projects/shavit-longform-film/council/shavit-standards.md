# Shavit Standards — pre-flight criteria for judging a brand film BEFORE he sees it

Compiled 2026-07-03 (night before the Saturday package; Shavit posts Sunday 7/5).

**Sources mined:**
- Obsidian vault `~/Desktop/Personal Jarvis` — `Brain/People/Shavit Rootman.md` (updated 2026-06-25), `Brain/Project/Shavit — Marketing & Content Engine.md` (2026-06-16), `ABOUT_JAKE.md`, `Writing Samples/Texts/sent-texts-sample.txt`
- **Video-brain Shavit register**: `~/projects/video-brain/Shavit.md` — auto-generated arm index (`_build/gen_index.py`), **17 notes, arm `shavit`, committed 2026-07-03 21:23 and 22:23 PT (v1 → stage-7 staging validation, 233-note vault)**; atom notes in `arms/shavit/*.md` carry `as_of: 2026-07-03`
- `~/projects/video-brain/_atoms/shavit-register-source.md` (the dated, sourced requirements register — every item below traces to it unless noted)
- Memory files: `shavit-rootman-marketing-deal.md`, `shavit-longform-film.md`, `shavit-instagram-remodel.md`, `shavit-website-technical-state.md`, `longform1-vertical-remaster.md`
- Build artifacts: `~/projects/shavit-longform-film/check.sh` (36-check gate, v4.3), `spec.html §00-A/§03/§06`

Legend: **STANDING** = permanent rule on record · **ONE-TIME** = cut note · **INFERRED** = council/Jake-derived, locked at a gate.

---

## A. The criteria list

Each: **criterion | evidence/source | how to verify on the cut**

### Authenticity (his only actual veto was here — weight these highest)

1. **Zero AI-looking imagery; no generated or outpainted property architecture, ever.** | Shavit 7/3 iMessage rejecting v3: *"It looks a little AI. I'll just send you lighter photos"* / *"This photo below is AI, I have another of 34 Mead."* STANDING (`no-generated-architecture`). | Every property pixel traces to a real photograph (provenance rows in manifest.csv); no `plates916/` outpaints in the timeline; 34 Mead and Cleveland Heights plates are BANNED by name until his replacements arrive; eyeball every still at full screen and ask "could a realtor tell this was generated?"
2. **His real "lighter" photos are the primary plates.** | Same 7/3 message; memory/shavit-longform-film.md "his incoming real/lighter photos become primary plates." | Confirm the newest Shavit-supplied photos are actually in the cut, not the old contaminated crops (81/82 crops were contaminated per assets/AUDIT.md — verify re-crops used).
3. **No Zillow/Redfin listing photos.** | Council R2, locked at Jake's 7/2 spec re-sign; DMCA/derivative exposure. STANDING. | Provenance manifest: every asset has a rights basis; no listing-portal sources; no un-cropped desktop screenshots.
4. **No duplicate plates — no photo in two beats.** | Shavit 7/3 verbatim: *"This picture was used twice, change to another property - perhaps 17 Lo Presto."* STANDING check. | Run the perceptual-hash duplicate-plate test in check.sh; manual scrub for near-dupes it might miss.
5. **Photo composition QC.** | Shavit 7/3 verbatim: *"Cleveland Heights — window on top isn't centered. Remove and use another photo."* He looks at individual frames this closely. ONE-TIME with STANDING flavor. | Frame-by-frame pass on every plate: centering, horizon, exposure (no dark-dusk shots — Jake killed one on Long Form 1), no burned-in tags (e.g. the yellow "AFTER" on salem_video_after.jpg).

### Money & words on screen

6. **ZERO dollar figures — film AND website.** | Shavit 7/3 verbatim: *"Remove all portfolio value moving forward, including website. Instead: Made in America, local to the Midwest."* ($12M+ gone; "+$140K" struck, Jake confirmed "Strike it"). STANDING ("moving forward"). | Acceptance fails on ANY `$` character in OCR of sampled frames + deliver/*.md/*.txt; proof line "MADE IN AMERICA · LOCAL TO THE MIDWEST" present instead.
7. **Full state names — Michigan, Ohio, Indiana.** | Shavit 7/3 verbatim: *"Change MI, OH, IN to → Michigan, Ohio, Indiana."* STANDING; MI/OH/IN are OCR-forbidden strings. | OCR every text frame; grep deliverable text files for the abbreviations.
8. **Closer is his exact line: "BUILDING COMMUNITIES, LOCALLY."** | Shavit 7/3 verbatim mutation: *"Change all messaging from Building communities, profitably → Building communities, locally."* STANDING. | Exact-string check on the final text card; "profitably" is dead anywhere.
9. **Hook locked: "FIFTY DOORS. THREE STATES. ONE STANDARD."** | Jake 7/4 lock ("Defenetly like 7" = W7); H1 killed ("blame-the-crowd energy"), H7 demoted, H3 staccato fallback; N1 "AMERICA TURNS 250. THIS HOUSE TURNS ONE." approved July-4 head-swap. | Exact hook on the opening; door count "FIFTY" must be re-confirmed as-of with Shavit in the Saturday package (see protocol).
10. **~30-word budget, one line per frame, story reads type-off.** | Jake 7/3: *"less words and more animations or photos but tell a story… human touch."* STANDING (canonical 48/42, OCR gate ≤44 unique narrative words in v4.3). | OCR unique-word count via check.sh; watch muted once — the story must land with no narration.
11. **Softened language: "REBUILT", never "WRITTEN OFF / REBUILT"; no negative-half framings.** | Jake's remaster cut note (`rebuilt-caption-softening`). ONE-TIME with STANDING flavor. | Caption audit — no re-attached negative framings anywhere.
12. **Hooks may disparage the HOUSE, never the street or community.** | Council R4, locked 7/2; two hooks (H2, H9) killed on exactly this line; his referral pipeline lives in those communities. STANDING. | Read every line asking "does this insult a neighborhood a seller/lender lives in?"

### Privacy & legal (the gates he never has to ask for)

13. **No house numbers / digit-leading street addresses on screen, ever.** | Council R3, locked at 7/2 spec re-sign; protects tenants (occupied), vacant mid-rehab houses (theft vector). STANDING, machine-checked. | OCR gate: no digit-leading address strings; street names ("SALEM STREET") or nicknames ("THE TRIO") only.
14. **Banker story fully de-identified — absolute.** | PRIVACY HARD RULE (register-source header): never paired with any property address, town, or financing detail, on screen or in the vault; runs in type only under generic "ONE OF OUR REHABS" tag. Council R1, blocking fix. | If the banker beat is in the cut: type-only, generic tag, and confirm no adjacent beat gives away the town; suggested cheap insurance — Shavit sends her a one-line heads-up.
15. **Trio buyer count stays "whole set" until Shavit confirms 3-vs-4.** | Council R6, bones gate 7/2. | On-screen copy says "the whole set," no numeral; count question is in the Saturday package.
16. **Pre-publish Reg D gate: confirm no active capital raise.** | Council R5 STANDING process rule; video-brain Reg D atom (7/3): brand-phase content = factual completed-project storytelling only — no return claims, projections, or deal terms in a public reel (Pino v. Cardone is the anti-pattern). Killing $12M+ also killed the website's Reg D flag. | Scrub the cut for anything resembling an investment invitation or performance claim; text Shavit the no-active-raise confirm before he posts.

### Brand system & motion

17. **Palette locked to the live site: black #000000 canvas, white #FFFFFF type, brass #B08D57 (rules/underscores ONLY), gold #FFC000 (mark + max one stake line per chapter), uppercase Inter tight tracking.** | Shavit 5/22 meeting (36:34) "uniform colors matching the website"; locked 7/1 — "NOT the older proposal-era navy+orange." STANDING (`brand-tokens`). | Hex-sample pre-composite graphics layers (photo frames exempt); brass never used emphatically, gold never structural; all set type uppercase Inter.
18. **Watermark OK · NO pulsing logo.** | Shavit 5/22 (36:34). STANDING (`no-pulsing-logo`). | "SHAVIT·ROOTMAN" at 35% white top-right on every frame except signature; logo draws on ONCE then holds fully static — FFT periodicity test (no oscillating component, dominant bin >55% at ≥0.5Hz = fail).
19. **Static signature ending; no black-card cut.** | spec §01 + check.sh §8B F5; two approved endings 7/3: site blueprint house-draw outro, or draw-on-once-then-static — both no black card, no pulse. STANDING (`static-signature`). | Sample last 2.2s: no black-field frame; mark shows zero independent motion; single monotonic global push-in ≤4–5% total is sanctioned.
20. **Ken Burns capped at ≤20% of still-derived runtime; never on hook, chapter opens, or the reward.** | Jake 7/3: *"I don't like the bullshit Ken Burns stuff"* → same-day mutation: *"ken burns doesn't need to be banned but it can't be the main theme."* STANDING (`kenburns-motion-cap`). | Affine-warp residual test (calibrated via checks/calibrate_kb.py); confirm hook/opens/reward beats have real camera moves or cuts, not pan-on-still.
21. **≥3 human/Midwest-texture beats.** | Jake 7/3 "human touch… cater to the Midwest." STANDING. Caveat: assets/AUDIT.md found ZERO human beats in all footage — texture fallback applies. | Count them; anyone captured on camera gets anonymized before publish (`de-identify-people`).
22. **AI walkthroughs rationed to 1–2, credibility rule intact.** | Jake 7/3 "marketers are doing AI walkthroughs — incorporate." STANDING. | Max two; must not trip criterion #1 (can't read as fake property footage). Construction build-up effect is TWICE-gated: real angle-matched anchors (River Street pair, NOT Salem) + **Shavit approves the isolated clip before it ships inside the film**.

### Music

23. **Bed = Midwest-Americana × luxury-enterprise; not country-radio, not stock-corporate; July-4 framing welcome.** | Shavit 7/3 verbatim: *"Song - off! … more midwest living, nonetheless do not compromise luxury, and in relations to enterprise and 4th of July. Happy birthday America/Midwest living video."* Sets STANDING direction. Mutation chain: synth bed → Jake's "luxurious and sexy" Pia pick → Shavit killed it → candidates round 2 (candidate #5 Pixabay "Heartland" current). | Play the bed against his exact words; rights basis clean (Pixabay royalty-free — no baked licensed-commercial tracks after the Pia caveat); loudness gate [-15, -13] LUFS.

### Structure & mechanics

24. **Runtime 52–62s (~53s target); templated 15s chapter system.** | spec v4.3 gate; Shavit 5/22 "templated/scalable formats" — every finished property becomes a drop-in chapter. STANDING. | Duration check; confirm chapters are actually modular (a new property could slot in).
25. **Edit hygiene: all boundaries crossfaded (no snap-backs), dissolves resolve before scene end, no stray black frames, no near-black windows mid-film.** | Jake's Long Form 1 cut notes, mechanized into QA (`checks/qa_longform1_vertical.py` + check.sh). ONE-TIME → gates. | Frame-luma diff snap threshold; black-frame scan outside outro.
26. **Address/state tags legible at phone size (~2.3× the original scale); state labels match REAL properties.** | Jake 7/3 "addresses need to be bigger" (originals ~1.5% frame height failed); "state labels must match real properties" (old variant B mislabeled one MI ranch as OH and IN). STANDING flavor. | View on an actual phone; cross-check every state label against the property map in the builder.
27. **Audience test — his verbatim four groups, each answerable after ONE watch.** | Shavit via Jake 7/3: tenants ("professional, responsive, quality-focused") · investors/lenders/partners ("disciplined stewards of capital") · aspiring investors ("real projects, real lessons") · community ("revitalization creates value for everyone") + five visitor questions incl. **"Can I trust this company?"** STANDING. | Cold-watch once per persona and answer the question; reputation-not-virality is the metric (impressions + engagement, never lead-gen bait).

---

## B. Rejection predictors (ranked — what most likely makes him say "I vote against it" again)

1. **Anything that reads AI.** His one real-world veto (7/3) opened with *"It looks a little AI."* He spots individual fake stills and off-center windows. One suspicious frame can sink the cut. → Criteria 1–5.
2. **Music that misses "Midwest living × luxury-enterprise."** Second line of the veto: *"Song - off!"* He's already rejected two directions (synth bed, Pia) and was lukewarm on candidate 1. This is the least machine-checkable criterion — highest residual risk in the Saturday package. → Criterion 23.
3. **Any dollar figure or portfolio-value trace.** He escalated this beyond the film to the entire website, "moving forward." A single `$` = instant fail by his own standing rule. → Criterion 6.
4. **State abbreviations (MI/OH/IN) or the old "profitably" messaging surviving anywhere.** He corrected both verbatim; seeing them again reads as "didn't listen." → Criteria 7–8.
5. **Photo bookkeeping errors: a duplicate plate, a banned plate (34 Mead, old Cleveland Heights), or a mislabeled state.** He caught the dupe himself last time. → Criteria 4, 5, 26.
6. **Off-brand system: navy/orange leakage, pulsing logo, black-card ending.** His 5/22 asks; older and less emotional than 1–5 but standing since day one. → Criteria 17–19.
7. **Community-disparaging or blame-the-crowd copy.** Never his verbatim, but council-locked because his referral pipeline lives in those streets — and Jake killed H1 on the same instinct. → Criteria 11–12.
8. **Privacy/legal misses (house numbers, banker identity, capital-raise timing).** Least likely to draw a "vote against" from him directly, but the highest-severity failure class — these protect him from things he isn't watching for. → Criteria 13–16.

---

## C. Presentation protocol — how to send the Saturday package for max approval odds

**Channel & format**
- **iMessage, video file first, minimal text.** He communicates by text + reactions (Loved/Liked/thumbs-up = yes; rejection came as a short typed list opening "Hi, I vote against it"). He reads slowly (2–3x) — every extra paragraph costs approval odds.
- **One cut, not options.** He's "straightforward… quick to make decisions." Open-ended choices burn his ≤15 min/week budget (his verbatim constraint via Jake 7/2: he "doesn't want to be uploading lots of content he just simply doesn't have the time"). Binary asks only.
- **Mirror his 7/3 feedback list item-by-item.** Lead with a short "your notes → fixed" ledger (AI stills → purged, real photos in; song → new Midwest-Americana bed; MI/OH/IN → spelled out; $ → gone, site too; "locally" closer in; Cleveland Heights → replaced; dupe → replaced with 17 Lo Presto). He values proof of a strategic mind and being listened to — this is the trust move after a rejection.

**The asks (bundle into ONE numbered message, each answerable with a thumbs-up or one word)**
1. **Written go on the cut** — an explicit yes in words, not just a reaction (bones gate requires it; "No written go = date slips").
2. **"FIFTY DOORS" as-of confirm** (door count current?).
3. **Trio buyer/property count** (3 vs 4 — copy stays "whole set" until answered).
4. **Meta AI-label stance** (label the AI walkthrough beats or not).
5. **No active capital raise underway** (Reg D pre-publish gate — phrase casually: "nothing fundraising-related live right now, right?").
6. **If the construction build-up effect is in the cut: send it as a separate isolated clip for its own thumbs-up** — it is twice-gated and must not ride in unapproved.

**Timing & follow-through**
- **Send Saturday as early as possible, ideally morning.** He prefers morning meetings across time zones, travels frequently, and has a documented pattern of missing/rescheduling — build slack before the Sunday 7/5 post.
- **One nudge if silent by early evening** — he explicitly asked Jake for responsiveness on scheduling and confirms with a thumbs-up when pinged the day-of (pattern from the June 26 meeting).
- **If he replies with notes instead of a go:** treat it as a numbered cut list (his style), fix same-day, resend the delta only ("fixed 1–3, here's the new file"), don't renegotiate the schedule in the same message.
- **Never post or touch the account.** He posts; standing guardrail from the IG remodel — no account changes/posting without his explicit go.
