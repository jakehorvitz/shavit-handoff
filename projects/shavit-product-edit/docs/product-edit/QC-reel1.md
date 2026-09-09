# QC — Reel 1 base render (`reel1/reel1-base.mp4`)

**Render checked:** `docs/product-edit/reel1/reel1-base.mp4` — h264 1080×1920, 30 fps, 1050 frames, 35.00 s, no audio stream (expected; music is another lane). Rendered 00:12 from `reel1/reel1.html`; the HTML was edited again at 00:14 (the "Deal case study · Kendall Street" eyebrow was removed from the 15–24 branch). **Findings below are against the render; where the 00:14 source already fixes something it says so.** Line numbers refer to the 00:14 file.

**Method:** `ffmpeg -vf fps=2` → 70 frames → seven 5-second contact sheets (10 frames each), all read; then full-res single frames at 0.5 / 1.5 / 3.0 / 6.0 / 15.5 / 25.5 s, 10 fps strips across 7.3–8.9 s (carousel swipe), 14.0–15.0 s (cursor / click), 25.4–27.0 s (founder portrait / CTA), 28.6–30.0 s (end-card cut), and the raw footage sequences `phone-to-reach/0054–0069` and `phone-michigan-swipe/0000–0047`. Contact sheets are in this session's scratchpad (`qc/sheets/sheet_0..6.png`), not the repo. Contract = SPEC-reels.html §4 (Reel 1 table + v1.3 amendments) and §5 (register / hard don'ts).

Severity: **P0** = will read as broken/cheap or breaks a hard don't · **P1** = clearly below the Porsche/AirPods bar · **P2** = polish · **RULING** = for Shavit, not a fix.

---

## A. Text overlapping / clipped by the device

**A1 · P0 · 2.0–4.0 s — headline runs across the phone.** "A NEW HOME / FOR THE HOMES / WE MANAGE." (104 px, 3 lines) sits over the bottom third of the phone; at 3.0 s the word "MANAGE." lands directly on the site's serif "Hillsdale, MI" chip (full-res frame confirms). Phone bottom ends at ~y 1600 while the h1 top is ~y 1357.
- **Fix (`reel1.html` L51):** shrink and lift the phone for this beat: `--ty:${(80-300*u).toFixed(0)}px … --s:.82` (bottom lands ≈ y 1290 at u=1, clear of the callout). Keep `--o`. Alternative if you'd rather keep the phone big: move the callout to top-left for phone beats (`.callout{top:220px;bottom:auto}` inline) with `h1{font-size:76px}`.

**A2 · P0 · 4.6–11.0 s — "EVERY HOME, / EVERY RENT, / NO FORMS." covers the listing card copy.** The headline overprints "Three bedrooms · one bathroom", the sq-ft line and the rent; the gold "$…/mo" peeks through the letterforms (6.0 s full-res). Reads as a layout accident for 6+ seconds — the longest beat in the reel.
- **Fix (L56):** `--ty:${(-230-40*u).toFixed(0)}px … --s:${(0.80+0.03*u).toFixed(3)}` (bottom ≈ y 1284; top ≈ y 176). If you keep the current scale, the callout must move up (see A1 alt).

**A3 · P0 · 4.0–11.0 s — eyebrow "AVAILABLE NOW" clipped by the phone.** Only "AVAILABL" shows; the phone's top-left corner (ty −40…−120, s 0.98→1.02, ry swings to +14°) covers the eyebrow at `top:120px`.
- **Fix:** covered by A2's smaller phone; belt-and-braces `.eyebrow{top:96px}` / `.hair{top:78px}` (L7, L35), or move the eyebrow inside the callout stack.

**A4 · P1 · 25.0–29.0 s — "QUESTIONS? / TEXT US." over the phone.** Two-line h1 top ≈ y 1453; phone (s 1, ty −100) bottom ≈ y 1553; the site's "LEARN MORE" / "DO YOU ACCEPT PETS?" rows sit under the headline (25.5 s full-res).
- **Fix (L71):** `--ty:${(-260).toFixed(0)}px … --s:.90` (bottom ≈ y 1324).

**A5 · P1 · 15.0–24.0 s — eyebrow hidden behind the big phone; "REBUILT." kisses the phone.** In the render the eyebrow "Deal case study · Kendall Street" is 90 % hidden (only "— DE" shows at left). The 00:14 source already deleted the eyebrow — good — but the hairline at `top:100px` still gets covered by the phone corner at s 1.14. "REBUILT." (88 px, `bottom:96px`) clears the phone bottom by ~17 px — it touches the drop shadow and reads cramped.
- **Fix (L65–L67):** drop the `.hair` from this branch too, or lift it: inline `style="top:56px"`; phone `--s:${(1.02+0.08*u)}` (max 1.10 instead of 1.14) *or* `--ty:-190px`; callout `bottom:120px`.

## B. Legibility (type < ~28 px, dim / soft screens)

**B1 · P1 · every beat — eyebrow is 22 px.** `.eyebrow{font-size:22px}` (L7) at 1080 wide = sub-legible on a phone; it's the only place the URL appears until 29 s.
- **Fix:** `font-size:30px; letter-spacing:.24em` (L7). Also `.eyebrow::before{width:56px}` (L8) so the dash doesn't look like a hyphen.

**B2 · P1 · 29–35 s — end card hierarchy inverted.** The payoff (`shavitrootman.com`) is 28 px letter-spaced grey (#bbb) and "Managed by Charger Property Management" is **20 px #7e7e7e** — the smallest, dimmest text in the reel is the last thing on screen for 5 s. The mark is 120 px, the name 96 px, and the card sits dead-centre with 800 px of empty black below.
- **Fix (L32–L33, L75):** `.end h1{font-size:112px}`; `.end p{font-size:40px;color:#fff;letter-spacing:.18em}` for the URL; tagline inline `font-size:28px;color:#9a9a9a`; `.end .mark{width:150px;height:150px;font-size:56px}`; `.end{gap:48px}`.

**B3 · P2 · 11–15 s — Mac screen text unreadable.** A 1600 px desktop capture in a 968 px screen at s 0.94–1.0: listing addresses/rents/"READ THE CASE STUDY" render at ~9–12 px on the 1080 canvas. Acceptable as texture, but the beat's caption is "Learn more about our numbers" and nothing on the Mac is legible.
- **Fix (L22, L61):** make the Mac the hero of its beats: `.mac{top:40%}` and `--s:${(1.10+0.08*u)}` on L61 (and `--s:${(1.02+0.12*u)}` on L46), `--ty:-40px`. It also closes the dead band (see D2).

**B4 · P2 · 3–4 s — phone hero slightly soft.** The 390@3x capture is fine; the softness is JPEG + `object-fit:cover` on a rotated layer. Rendering the phone with `will-change:transform` / `backface-visibility:hidden` and capturing at 2× then downscaling would sharpen; low priority.

## C. Cuts, timing, holds

**C1 · P1 · 2.0 / 11.0 / 15.0 / 24.0 s — every beat boundary is a "vanish + fade-in" = a dip.** The outgoing device disappears on the frame; the incoming one fades from 0 over 0.4 s (`--o:${ss((t-2)/0.4)}` etc.), so there's a 0.2–0.4 s near-black hole at each cut (visible on the 10 fps strip at 14.9→15.1). Neither a clean hard cut nor a crossfade.
- **Fix:** pick one. Hard cut: set incoming `--o:1` on L51, L56, L61, L66, L71. Crossfade (recommended for 14→15 and 24): let branches overlap 0.4 s — e.g. render the Mac branch while `t<15.4` with `--o:${ss((15.4-t)/0.4)}` and start the phone branch at `t>=15` — requires turning the `if/else` chain into independent `if`s per element (structural, ~10 lines).

**C2 · P0 · 29.0 s — cut to black before the end card.** Phone + callout vanish at 29.00, the end card fades in over 0.8 s from 0 → ~0.3 s of pure black. §4 says "no black-card cut; logo draws once, holds".
- **Fix (L68–L75):** overlap: phone branch until `t<29.6` with `--o:${ss((29.6-t)/0.6)}` and end card from `t>=28.8` with `--o:${ss((t-28.8)/0.8)}`; give the mark a draw (animate `--hw`-style border via `clip-path:inset(0 calc(100% - var(--d)) 0 0)` over 0.6 s) instead of a fade.

**C3 · P1 · 6.0–8.4 s — 2.4 s static hold on the same card.** The scroll footage lands on "34 Budlong" at ~6.0 s; `phone-michigan-swipe` starts at 7.5 s but its first ~28 frames are a pre-hold, so the first swipe fires only at ~8.4–8.8 s. Then Barry A→B at ~10 s. Beat is 7 s for two swipes.
- **Fix (L54):** skip the pre-hold: `F('footage/phone-michigan-swipe', 24+fr(7.5), 119)`; and/or shorten the beat to 4–10 s (shift subsequent beat starts by −1 s) — the reel is 35 s, the spec allows 30–45, so trimming is free.

**C4 · P1 · 13.5–15.0 s — Mac holds static; no cursor, no click.** §4: "cursor lands on *Read the case study*; cut on the click." The 10 fps strip shows an unchanged frame from 13.5 to 15.0 and no cursor.
- **Fix:** either re-capture `desktop-to-case-studies` with a cursor move + press state (capture-site.mjs), or trim the beat to 11–14 s (L58 `t<14`, and shift 15→14 in L63–L64) so the static hold is 0.5 s not 1.5 s.

**C5 · P1 · 24–29 s — the beat is "Text us" but the phone scrolls past the CTA in 0.4 s and parks on the FAQ for 2 s.** Founder portrait 25.8–26.0, "CALL OR TEXT +1 (805) 364-4415" card centred only ~26.1–26.5, then "Questions, answered" accordion static from ~27.0 to 29.0.
- **Fix (L71):** hold on the CTA card: `F('footage/phone-to-reach', Math.min(fr(24),64), 119)` — frame 0064 has "CONTACT US. / CALL OR TEXT +1 (805) 364-4415 / CALL NOW" centred; the phone then holds there from 26.1 s to the end of the beat, matching the callout copy.

**C6 · P2 · 23.9–24.0 s — footage clamp freeze.** `phone-casestudy-swipes` runs out (frame 299 at 23.97 s); invisible at speed, but the beat ends mid-scroll on "Condition at acquisition" (subfloor photo) — an anticlimax after the living-room swipe.
- **Fix:** end the beat on the living-room "after" (`Math.min(fr(14),284)`) or re-time so 24 s lands there.

## D. Device / composition ("looks cheap" risk)

**D1 · P1 · 0–2 s and 11–15 s — the MacBook reads as a floating dark slab.** Lid, bezel and screen are all near-black on a black stage; the "base" is a 40 px gradient bar with no deck/keyboard/hinge and no edge highlight; the lid's bottom corners are 12 px while the base is 22 px. On the AirPods/Porsche bar this is the weakest asset in the reel. (Jake: "I want the Mac to be featured" — it is currently the least featured-looking thing.)
- **Fix (L22–L28), cheapest first:** `.mac .lid{box-shadow:0 0 0 2px #2a2a2a, inset 0 0 0 1px rgba(255,255,255,.10), 0 60px 120px rgba(0,0,0,.85)}`; `.mac .base{height:64px;background:linear-gradient(#3a3a3a 0,#1a1a1a 6%,#0e0e0e)}` + a hinge `::before` 4 px highlight; `.mac .screen{box-shadow:0 0 120px rgba(255,192,0,.10)}` and lift the capture's brightness 6–8 % (or CSS `filter:brightness(1.08)` on `.mac .screen img` — desktop only, this is a render not the site). Scale per B3. Upgrade path per spec: Rotato render of the same capture.

**D2 · P1 · 11–15 s — dead band.** Mac occupies y ≈ 420–1060, callout starts ≈ 1360; 300 px of empty black between them, and the Mac is only ~60 % of frame width. Fixed by B3/D1 scale (`--s` 1.10–1.18, `--ty:-40px`).

**D3 · P2 · 4–11 s — phone lean.** `--ry` swings −16°→+14° with `--rz` −5°→+3°: at 6 s the phone appears to be tipping to the right. With A2's smaller phone, cap `--ry` at `(-12+18*u)` and `--rz` at `(-4+5*u)`.

**D4 · P2 · 0–35 s — the gold progress bar (L42, `.progress` 6 px at top).** It grows across the top for the whole reel; on Instagram it sits under IG's own UI and reads like a buffering bar. Recommend removing (`html` line 42) or dropping to 2 px at 40 % opacity.

**D5 · P2 · 15–24 s — this is the strongest section; keep it.** Straight-on phone, fast gold-handled swipes (~0.4 s), holds on each comparator: exterior 16.4–17.6, bathroom 18.4–19.6, kitchen 21.0–22.4, living room 22.6–23.6. Matches Jake's v1.3 note. Only A5 applies.

## E. Site UI visible in captures — for Shavit's ruling (listed, not fixed)

| t (s) | Where | Exactly what is on screen |
|---|---|---|
| 2.4–4.0 | phone hero, bottom-right | serif chip **"Hillsdale, MI"** (§5: avoid/crop or Shavit rules OK) |
| 4.0–11.0 | phone, Michigan row | gold label **"HILLSDALE, MICHIGAN"** above "MICHIGAN" |
| 6.0–8.4 | phone card | **"34 BUDLONG ST, UNIT A"** (digit-leading address) · "AVAILABLE SEPTEMBER 2026" · sq-ft line · rent **"$1,600/mo"** (partly under the headline) |
| 8.4–10.0 | phone card | **"33 BARRY ST, UNIT A"** · "COMING SOON · MID AUGUST 2026" · **"$1,250/mo"** |
| 10.0–11.0 | phone card | **"33 BARRY ST, UNIT B"** · "COMING SOON · OCTOBER 2026" · rent "$1,2…/mo" (partly under headline) |
| 11.0–13.5 | Mac, listing rows | Michigan/Ohio/Indiana cards with all addresses (Budlong, Barry, "11 LUDLAW ST"-type, "1902 EAST EWING AVE", "1916 CEDAR ST", **"1919 KENDALL ST"**) and gold rents — ~10 px, unreadable at speed but present |
| 13.5–15.0 | Mac, Deal Case Studies band | card copy **"1919 KENDALL STREET."** + "READ THE CASE STUDY" (§5: same ruling as card copy) |
| 15.0–15.4 | phone, case-study hero | **"1919 KENDALL STREET" / "SOUTH BEND, INDIANA"** at ~46 px — the only large digit-leading address in the reel |
| 15.3–16.3 | phone, Investment snapshot + BRRRR | **"$68,400 · $60,000 · $128,400 · $215,000 · $86,600"** and **"67.4% · 75% · $151,250 · 100%+"** at ~50 px — **dollar figures burned into picture; UNRULED per §5 (default = none)** |
| 25.3–25.7 | phone, Investors / Home sellers | "We currently do not accept private capital." · "SELL US YOUR HOME." (content mismatch with a tenant-facing "Text us" beat) |
| 25.8–26.0 | phone, Meet our founder | **Shavit's portrait** (identifiable person; §5 "de-identify any person" — his own site UI, ruling needed) · LinkedIn / Instagram buttons |
| 26.1–26.5 | phone, Contact | "+1 (805) 364-4415" · "chargerpropertymanagement@gmail.com" |

The scroll speed at 15–16 s and 25–26 s means the dollar figures and the portrait are each on screen ≈1 s / ≈0.3 s — but a frame-scrub or a screenshot catches them. If Shavit rules "no", the fix is in the capture, not the renderer: start `phone-casestudy-swipes` at the "Before & after" anchor (≈ frame 60 → `F(...,60+fr(14),299)` and pull the beat start to 14 s), and start `phone-to-reach` past the founder card (≈ frame 60) or hold on frame 64 as in C5.

## F. Register check (§5)
- Black canvas ✔ · white uppercase ✔ · gold rules only ✔ (gold used for eyebrow text too — fine) · real photos only ✔ · no Ken-Burns ✔ · Michigan/Ohio/Indiana spelled out ✔ · no pulsing logo ✔ (but no "draw" either — C2) · digit-leading addresses on *our* type: none ✔ ("Kendall Street", "Hillsdale, Michigan") · on site UI: several (E) · dollar figures on picture: yes, via site UI (E) · person: founder portrait 0.3 s (E) · "no forms" claim in copy while the phone shows "SEND AN EMAIL" button at 26.5 s — cosmetic, but Jake's line "no forms" over an email CTA invites a nitpick.

---

## Ranked top-5
1. **A2 + A3 (P0)** — 4.6–11 s: headline overprints the listing card and the eyebrow is clipped, for 6+ s. Phone `--s .80–.83`, `--ty −230…−270` (L56); eyebrow up (L7/L35).
2. **A1 (P0)** — 2–4 s: hook headline across the phone and onto the "Hillsdale, MI" chip. L51 `--ty:(80-300u)`, `--s:.82`.
3. **E — dollar figures + "1919 KENDALL STREET" + founder portrait on picture (RULING, but blocks ship until ruled).** 15.3–16.3 s and 25.8–26.0 s. If "no": re-time captures as in E/C5.
4. **C2 + C1 (P0/P1)** — cut-to-black into the end card and vanish/fade dips at every cut. Overlap branches; end card crossfades and the mark draws.
5. **D1 + B3/D2 (P1)** — the MacBook is a dark slab in a dead-band composition, twice. Bezel highlight, deeper base/hinge, +8 % screen brightness, `--s` 1.10–1.18, `--ty −40`.

Then: B2 end-card sizes, C5 hold on the CTA (`Math.min(fr(24),64)`), C3 skip the swipe pre-hold, C4 cursor or trim, B1 eyebrow 30 px, D4 drop the progress bar.

## Verdict: **SHIP AFTER FIXES** (not RECUT)
The spine is right — Mac→phone hook, live site on real devices, and the 15–24 s case-study swipes are genuinely good and match Jake's v1.3 note. What's wrong is layout math and cut hygiene: three beats overprint the device, every cut dips to black, the end card is a whisper and the Mac needs to look like a Mac. All of it is CSS numbers in `reel1.html` plus two capture re-times; none of it needs new footage except (optionally) the cursor click. Shavit's ruling on the site-UI money/address/portrait frames is the only external blocker.
