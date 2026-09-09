# QC — Reel 2 base render (`mockup/reel2-base-nonum.mp4`)
_lane: qc-reel2 · 2026-08-16 · file probed: 1080×1920, h264, 30 fps, 1050 frames, 35.000 s (matches brief)_

**Verdict: SHIP AFTER FIXES** — the structure (before → gold swipe → after, four chapters, static close) is right and the photos carry it, but as rendered the signature swipe is 2–4× faster than the ~0.5 s target and in two of three chapters it is a *hard cut* for the left half of the frame; there is one real type collision, ~19 s of the 35 s is a fully static frame, and the close is page-cut at the bottom. All fixes are keyframe (`capture-reel2.mjs`) or CSS/JS (`the-turn.html`) — no recut of the concept.

## Method (what I actually did)
- Extracted all 1050 frames from the mp4 (`ffmpeg`, q2 jpg), not from the capture jpgs.
- Measured the gold handle per frame: count of #FFC000-class pixels per column in rows 110–1900; a column with >60 gold px is the hairline (`qc-reel2/measure-handle.py`, run in a scratch venv with Pillow+numpy). Swipe duration = frames from first handle movement to the handle parking at x=0.
- Contact sheets at 2 fps, 4 fps within ±1.5 s of each swipe, plus one 30 fps strip per swipe, plus full-res zooms — all in `docs/product-edit/qc-reel2/` (sheetA/B/C, swipe_c1/c2/c3, zooms.jpg, pair_60_195.jpg). I looked at every sheet; findings below cite frame numbers (f) and seconds.
- Cross-checked against `the-turn.html` (wipe = `ease(clamp((t-.30)/.12))`, caption `.44→.58`, numbers `.42→.64`) and the keyframe array `K` in `capture-reel2.mjs` (cubic in-out `smooth()` on every segment).

## Measured timeline (frame-accurate)
| Beat | Frames | Time | Duration | Note |
|---|---|---|---|---|
| Open: exterior *before* + KENDALL STREET, static | f0–f146 | 0.00–4.87 s | **4.87 s** | Nothing moves except the 2 px progress bar and the "SCROLL" hint fading (2.6→2.9 s). |
| **Swipe c1 (exterior)** | f147→f155 | 4.90–5.17 s | **0.27 s (8 frames)** | Handle x per frame: 1067, 1002, 877, 686, 437, 225, 79, 6, 0 → peak 249 px/frame. |
| Caption + "Rebuilt / Rented" fade in | f156–f168 | 5.2–5.6 s | 0.4 s | Everything on c1 is settled by 5.6 s. |
| c1 *after* hold, static | f168–f345 | 5.6–11.5 s | **5.9 s** | Longest dead stretch. |
| Push c1→c2 (vertical scroll, kitchen *before* slides up) | f345–f448 | 11.5–14.94 s | 3.4 s | c1 title passes under the fixed nav at ~14.5 s (f436). |
| c2 *before* fully framed, hold | f448–f463 | 14.94–15.43 s | **0.5 s** | Target ~1.5 s. |
| **Swipe c2 (kitchen)** | f463→f467 | 15.43–15.57 s | **0.13 s (4 frames)** | Handle x: 1017, 845, 573, then **jumps 573→0** — left half is a hard cut. |
| c2 caption settles / *after* hold | 16.0–20.5 s | | **4.5 s static** | |
| Push c2→c3 | f615–f704 | 20.5–23.48 s | 3.0 s | |
| c3 *before* ("During") hold | f704–f717 | 23.48–23.90 s | **0.4 s** | |
| **Swipe c3 (living)** | f717→f721 | 23.90–24.03 s | **0.13 s (4 frames)** | Handle x: 1034, 845, 521, then **jumps 521→0**. |
| c3 caption settles / *after* hold | 24.4–28.0 s | | **3.6 s static** | |
| Push c3→close (black slides up over the fireplace) | f840–f921 | 28.0–30.7 s | 2.7 s | |
| Close, static | f921–f1049 | 30.7–35.0 s | **4.3 s** | Static and holds — yes. But see #4. |

Totals: swipes = 0.53 s of 35 s; vertical pushes = 9.1 s; fully static frames ≈ 19 s.

**Why the swipes are this fast:** the wipe lives in 12 % of chapter progress (`t .30→.42`), and `K` traverses each whole chapter in one cubic-in-out segment (c1 5.4 s, c2 7.5 s, c3 6.5 s), so the wipe window lands at the peak of the ease. For c2/c3 the chapter's progress range is only 160 vh of a 260 vh keyframe travel, so the 12 % window is 19 vh of scroll crossed in ~4 frames. It is not a `the-turn.html` bug; it is a keyframe-shape problem.

## Findings, ranked (top 5 first)

### 1. Swipe is too fast and, in c2/c3, not a swipe (0.13–0.27 s vs ~0.5 s target; last step is a 520–570 px jump) — **must fix**
Jake asked for "a lot faster" than v1.2, and the SPEC pins ~0.5 s. 0.27 s (c1) is a flash; 0.13 s (c2, c3) reads as a cut with a gold flicker. Same-framed pairs (exterior, fireplace) lose the "same house, transformed" read; the kitchen pair (not same-framed) reads as a jump-cut between two different photos.
**Fix (capture-reel2.mjs, keyframes — preferred, deterministic):** give the swipe its own linear 0.5 s segment and hold either side. Replace the `K` line with:
```js
const w=(id,a)=>L[id]+a*(L[id+'h']-L.vh);      // chapter progress a (0..1) -> scrollY
const K=[[0,0],[2.2,0],
 [4.0,w('c1',.30)],[4.5,w('c1',.42),'lin'],[5.6,e(L.c1,L.c1h)],[9.0,e(L.c1,L.c1h)],
 [10.6,L.c2],[12.0,w('c2',.30)],[12.5,w('c2',.42),'lin'],[13.4,e(L.c2,L.c2h)],[17.4,e(L.c2,L.c2h)],
 [19.0,L.c3],[20.4,w('c3',.30)],[20.9,w('c3',.42),'lin'],[21.8,e(L.c3,L.c3h)],[25.8,e(L.c3,L.c3h)],
 [27.4,Math.min(L.max,L.close)],[35.0,Math.min(L.max,L.close)]];
```
and let a segment opt out of `smooth()`: in `yAt`, `const f = K[i+1][2]==='lin' ? u : smooth(u); return y0+(y1-y0)*f;`. Result: every swipe = 15 frames, ~40 px/frame (the CSS quad-ease inside `the-turn.html` still gives it a snap), before-holds 1.4 s, after-holds 3.4–4.0 s, pushes 1.6 s. Total unchanged at 35 s.
**Alt (the-turn.html only):** widen the JS window to `(t-.30)/.24` and `cap (t-.56)/.14`, `nums (t-.54)/.22` — helps c1 (~0.55 s) but c2/c3 still land on the ease peak (~0.3 s). Keyframe fix is the real one.

### 2. Type collision: "AFTER" tag overprints the numbers panel ("AFTERus") — **must fix**
f156–f345 (5.2–11.5 s), top-right: `.tag--after` (portrait: `top:132px`, box ≈ 46 px tall) and `.numbers` (portrait: `top:150px`) overlap; the panel's "STATUS" key sits inside the tag box (see `qc-reel2/zooms.jpg`, top-left panel). Also "Rebuilt / Rented" are title-case (register: white **uppercase**), the 11 px keys "STATUS/TODAY" are unreadable at reel scale, and "The numbers are in the case study." wraps as "…in the case / study." over foliage.
**Fix (the-turn.html):** in the portrait block `.numbers{top:212px}` (or `top:calc(132px + 80px)`), add `.num__v{text-transform:uppercase}`; in the `?nonum` branch drop the keys and the sentence:
`nums.innerHTML='<div class="num"><div class="num__v">Rebuilt</div></div><div class="num"><div class="num__v">Rented</div></div>';`
Optional second beat: make REBUILT · RENTED arrive ~2 s after the swipe instead of with the caption (JS `var k = clamp((t - .70) / .20)`), so the 3.4 s after-hold has a second event; with the keyframes above that lands ~7.2 s (SPEC's 8–12 s "Rebuilt · Rented" beat).

### 3. Parked handle shows as a half-circle notch on the right edge during every *before* hold — **should fix**
At `--p:0` the hairline sits at `left:100%` minus 1 px and the 64 px circle straddles the frame edge (see zooms.jpg top-right; f0–f146, f448–f463, f704–f717). It reads as a rendering artifact, not a handle.
**Fix (the-turn.html):** JS `stage.style.setProperty('--edge', (wipe>0.002&&wipe<0.998)?1:0);` and CSS `.stage__edge{opacity:var(--edge,0)}` — hairline exists only while it moves (Neoscape: a rule sweeps, then is gone). If you want it parked visibly, park it *inside* the frame: `.stage__edge{left:clamp(3px,calc(100% - var(--p,0)*100%),calc(100% - 3px))}` and drop the circle at rest.

### 4. Close is page-cut and carries web chrome; no end card in this render — **should fix**
f921–f1049: the two lower grid images are cropped by the frame bottom (zooms.jpg, bottom-left), the "→ INVESTMENT SNAPSHOT → BRRRR PERFORMANCE …" section list is 12–16 px (illegible, and it is site nav), and there is no URL / mark / "Read the case study" — SPEC 27–35 s = close **+ end card**. Static-and-holds: yes (4.3 s), which is the right behaviour once the frame is composed.
**Fix (the-turn.html, portrait block):** `.close{height:100vh;overflow:hidden;padding:180px 56px 120px;align-content:start} .next{display:none} .close__grid img:not(:first-child){display:none} .close__grid img:first-child{aspect-ratio:3/2}` → one full-width finished shot under ONE HOUSE, REBUILT. and the text-us button; either add a `.endcard` section (mark + shavitrootman.com + "Managed by Charger Property Management", black, no animation) that the last keyframe lands on, or keep the close 27.4–31 s and lay the shared end card over 31–35 s in the edit. Do not leave the URL-less close as the last 4 s.

### 5. Holds and pushes are mis-weighted (dead time) — **should fix, mostly solved by #1's keyframes**
0–4.87 s is a still (SPEC open 0–3 then swipe ≈ 4.5 s — the swipe is fine at 4.9 s but nothing at all happens for the first 4.9 s: hide the "SCROLL" hint and progress bar and this becomes an intentional hold, not a stall). c1 after-hold 5.9 s static; c2/c3 *before* holds 0.5/0.4 s (too short to register the "before"); pushes 3.4/3.0/2.7 s of half-and-half frames. The keyframes in #1 rebalance to 2.2 s open, 1.4 s before-holds, 0.5 s swipes, 3.4–4.0 s after-holds, 1.6 s pushes.

### 6. Caption legibility (The Local Project target) — minor/medium
`.sub` is 28 px, `#bbb`, 4 lines at bottom-left (zooms.jpg, right column). On a phone that is ~10 pt grey text — legible with effort, below Reels norms (TLP: white, centred, ~5 % of width, one thought per card). Fix in the portrait block: `.sub{font-size:34px;color:#f2f2f2;max-width:24ch;line-height:1.35}` and cut each caption to ≤ 2 lines per beat (copy is Jake's — flag, don't rewrite: e.g. c1 keeps "Bought as-is, rebuilt top to bottom, rented."). `.eyebrow` at 16 px ("DEAL CASE STUDY · INDIANA", "CHAPTER 2/3") is 1.5 % of width — bump to 22 px or drop the chapter eyebrows in the reel.

### 7. Web chrome inside a reel — minor
"MENU", "CONTACT US", the growing gold progress hairline, "SCROLL" hint. Keep the wordmark/sub-line (it is the brand slug); hide the rest under the portrait/reel query: `.nav__menu,.nav__cta,.progress,.hint{display:none}` (or gate on `?reel=1`).

### 8. Content note (no code fix): kitchen pair is not same-framed
`ba2-before` (drop ceiling/counter/doorway) vs `ba2-after` (window wall/fridge) — the wipe reads as a cut between two rooms; exterior and fireplace pairs are same-framed and sell the trick. If a same-angle kitchen pair exists in the case-study assets, swap it; otherwise accept and rely on the slower swipe + tags.

## Does "REBUILT / RENTED" read?
Partly. The two words are 56 px / 800 weight white and legible at a glance from 5.2 s to 11.5 s, but title-case (register says uppercase), the 11 px keys are noise, the sentence under them wraps badly, and the AFTER tag prints over the block (#2). After #2 it reads.

## Register / compliance check (SPEC §5)
Black canvas, white display type, gold rules only ✓ · real photos only, no people ✓ · no digit-leading address ("Kendall Street") ✓ · Indiana spelled out ✓ · no dollar figures on picture (nonum) ✓ · no Ken Burns, no looping logo ✓ · "Text 805-364-4415" is the site CTA ✓ · Title-case "Rebuilt/Rented" ✗ (fix #2) · web UI strings visible ("Menu", "Contact Us", "Scroll", section list) — WARN (fix #7, #4).

## Top-5 fix list (do these, re-render, re-QC the three swipe strips)
1. Keyframes: linear 0.5 s swipe segments + rebalanced holds (`capture-reel2.mjs`, block above).
2. `.numbers{top:212px}` + uppercase + strip keys/sentence in `?nonum` (`the-turn.html`).
3. Hide the parked hairline/handle (`--edge` opacity) (`the-turn.html`).
4. Close: single image, hide `.next`, `height:100vh; overflow:hidden`; add/overlay the end card (`the-turn.html` or edit).
5. Hide `.hint/.progress/.nav__menu/.nav__cta` in the reel query; `.sub` 34 px white, ≤ 2 lines (`the-turn.html`).

Verdict again: **SHIP AFTER FIXES** (re-render required; no recut).

## Assumptions
- I judged against the brief's stated targets (~0.5 s swipe, hold before/after, TLP caption system, Neoscape hairline) and the SPEC §4 Reel 2 table; I did not re-time against music (no bed in this base render).
- Frame numbers are 0-based over the mp4's 1050 frames (f = round(t·30)).
- Nothing edited outside `docs/product-edit/QC-reel2.md`, `docs/product-edit/qc-reel2/` (evidence sheets + measurement script) and `DONE-qc-reel2`. `site/`, the pipeline audit dir, `exports/` and `mockup/` untouched.
