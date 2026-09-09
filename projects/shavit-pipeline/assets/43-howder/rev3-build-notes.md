# 43 Howder — rev 3 build notes (from Jake's 21 annotations, 2026-07-11)

Durable design capture so the HTML rebuild is mechanical. Source annotations live in
`docs/spec-inbox.jsonl` (section prefix `43-howder/`). This resolves every one.

## The redirect in one line
Kill the emotional narrative. New spine = **house as found (brief) → AI construction build-up /
360 → finished reveal → steady AI walkthrough tour → River-Street-style brand card.**
Facts-only captions. Creative AI transitions, never repeated. No testimonials. Song = Mellencamp.

## Music
- **John Cougar / Mellencamp — "Hurts So Good"** (Jake's link _UvmURp0_PI; instrumental).
- Section: riff + drum intro **~0:00–0:28** under the build-up (lands on frame one); optional
  chorus **~0:48–1:15** to hit the finished reveal. Confirm marks against the audio file.
- NOTE: the delivered River Street reel used **"Small Town"** — this is a deliberate switch
  by Jake. Jake sources a copyright-free version; audio may be stripped.

## New arc (facts-only)
| Act | Beat | Assets | Effect | Caption (facts only) |
|---|---|---|---|---|
| 1 | House as found | u1-17 (before exterior) | slow push, ~2s | HOWDER STREET |
| 2 | The build | u2-10 gutted → u1 finished interior; u2-08/u2-12 framing | **Kling first/last-frame interpolation** gutted→finished + **motion_control orbit** for 360 | GUT REHAB (fact-check wording w/ Shavit) |
| 3 | The reveal | u1-16 finished front elevation | orbit continuation / **Higgsfield Morph** out of the build | HOWDER STREET / [CITY], MICHIGAN |
| 4 | Walkthrough tour | u1-02 → u1-06 stairs → u1-01 hall → u1-08/u1-03 kitchen → u1-13 bath → u1-12 laundry → u1-11 rear | i2v push-through; **doorway first/last-frame hand-offs** between rooms; steady pace | room labels + materials only (see below) |
| 5 | Brand card | over final house push | crossfade-and-hold, mirror River St | see brand card |

Captions in Act 4 = describe the room + materials, no adjectives/emotion. Register model =
the line Jake loved ("BUILT IN MICHIGAN, OHIO & INDIANA"). Examples to grill:
KITCHEN · BUTCHER BLOCK, STAINLESS · TILED WALK-IN SHOWER · IN-UNIT LAUNDRY · NEW FRAMING, NEW ROOF.
(Any numeral or claim still needs `fact add`.)

## Transitions — creative, each used once (no dissolve/wipe/fade)
1. **Morph-cut** studs → finished wall (Higgsfield Morph) — the signature build beat.
2. **Orbit / camera-motion hand-off** — end one shot mid-360, begin next continuing the arc.
3. **Match-cut through a light source** — push into a bare bulb, whip out of the finished fixture.
4. **Object-continuity morph** — staircase/countertop stays fixed while surroundings transform.
5. **Material sweep** — flooring/paint lays itself across frame as the wipe-substitute.
6. **Doorway first/last-frame hand-off** — the tour's room-to-room connector.

## Brand card — mirror the delivered River Street reel EXACTLY (source: shavit-match-cut-tour/build/build_final.py)
- No logo image — it is **typographic**. Composited over the final renovated-house push (not black), black wash alpha ~120/255, fade-in ~0.7s, hold.
- Eyebrow (gold, Manrope 800, tracking): **BUILT IN MICHIGAN, OHIO & INDIANA**
- Wordmark (Bricolage ~92px, 700): **SHAVIT** (white #FFFFFF) **ROOTMAN** (gold #FFC000), soft shadow.
- Tagline (Manrope 700, ivory): **REAL ESTATE, OPERATED.**
- Credit at 72% H (Manrope, ivory): **MADE POSSIBLE BY THE CPM TEAM**
- CTA cards before it: **LIVE WITH US** (white) → **WORK WITH US** (gold), Bricolage ~110px.
- Address plate (earlier): **HOWDER STREET** (Bricolage ~100px white) + gold rule (70×4) +
  **[CITY], MICHIGAN** (Manrope 30px ivory). [CITY] PENDING Shavit.
- Tokens: GOLD `#FFC000`, IVORY `#F5EFE1`, white; Bricolage (display), Manrope (body). 1080×1920, 30fps.
- Gates: OCR — no `$`, full state names, no house numbers. Ship DISCLOSURE.txt (AI-assisted label + music license).

## Removed vs rev 2
- All emotional captions ("SOME HOUSES GET WRITTEN OFF", "NOT THIS ONE", "AND BROUGHT IT BACK").
- All testimonials (Jeffrey/Nicky/Gary) — Jake: "No testimonials, absolutely not."
- All dissolve/whip transitions.
- The before→after reveal PAIRS are de-emphasized: Jake said "we may not even need the before/afters
  if we are doing the tour," and "the before should be shorter, may not even need any before."
  Keep only the single as-found opener (u1-17) + the build; the tour carries the finished home.

## Reference videos (cite to Jake / Shavit)
Walkthrough: youtube.com/watch?v=ReASV_e1mwc (Higgsfield+Kling 3.0) · youtube.com/watch?v=I2np1Ds4Yh8
(Higgsfield+Nano Banana) · meltflexai.com/blog/higgsfield-real-estate-walkthrough-videos (presets).
Build-up / morph: youtube.com/watch?v=jMlquZfHS9g (interior construction timelapse) ·
youtube.com/watch?v=mRq25UmKbYo · youtube.com/watch?v=0abBGoeFCc4 · youtube.com/watch?v=UjfGEethDTE
(before/after morphs) · higgsfield.ai/blog/The-Ultimate-Video-Transitions-Tool (Morph engine).
IG signal: #airealestate ~18.4k posts (read-only hashtag pull, not Shavit's account).
Caveat: jMlquZfHS9g page could not be re-fetched — title search-confirmed, technique inferred.

## Still open (do NOT invent)
- **City** of 43 Howder (Michigan) → `./shavit.sh fact add` `[F:prop.city]`.
- Exact build-up caption wording (Shavit fact-check; he flagged invented facts before).
- Whether to keep the single as-found opener or drop "before" entirely.
