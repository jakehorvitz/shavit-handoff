# 5.5 Spec-conformance report — shavit-product-edit vs signed SPEC-reels.html v1.3 (updated 2026-08-16 01:30 for v3)

**v3 delta (Jake's v2 review, verbatim in journal):** hook copy "Introducing our new website. / shavitrootman.com"; titles are category names only (Available Units. / Deal Case Studies. / Kendall Street. / Contact Us.); carousel beat moved by transform (no scroll-handler shake); BOTH reels end on the slate's shared end card (END CARD (shared), 4.5s) — the "stand-in mark" MISSING item below is now RESOLVED. Built = exports/*-v3.mp4, CURRENT=v3, gate exit 0 (26 site-UI WARNs).


Built = exports/REEL-1-the-website-v2.mp4, exports/REEL-2-kendall-street-v2.mp4 (CURRENT=v2), Palmier timelines REEL 1 (3194F6F8) / REEL 2 (7A98B3A0), gate accept-edit.sh exit 0 (FAIL 0, WARN 25).

## §4 Reel 1 shot list
| Beat (spec v1.3) | Built | Verdict | Evidence |
|---|---|---|---|
| 0–4 hook, sequential Mac (0–2) → phone rise (2–4), never stacked | Mac push-in 0–2, hard cut, phone rises 2–4; no frame has both | MATCHES | reel1.html beats; QC-reel1 §A/C; frames 0000–0119 |
| 4–9 Available now: phone scroll to Michigan row, carousel moves | 4–11 (extended 2s): scroll to Michigan then two real carousel swipes | DRIFTED (timing, +2s; content richer) | reel1.html `t<11`; capture-swipe.mjs |
| 9–14 Deal Case Studies on the Mac; cuts before card figures legible | 11–14 Mac frame on the band; starts mid-scroll; card copy at ~9–12px; OCR still reads "$68,400" at 12.5–13.5s | DRIFTED (figures readable to OCR; site UI → WARN, Shavit ruling) | gate WARN @12.5–13.5s |
| 14–24 The Turn = live case-study page on the phone, each slider swipes fast, "Rebuilt." | 14–24 live page, four swipes ~0.45s each (exterior, bathroom, kitchen, living), "Rebuilt." at 16.6s | MATCHES | capture-casestudy.mjs; QC-reel1 §D5 |
| 24–30 Text us | 24–29.4, holds on the CALL OR TEXT card, "Questions? Text us." | MATCHES | reel1.html `t<29.4` |
| 30–35 end card, logo draws once then holds, no black-card cut | 28.8–35 crossfade in, mark draws by clip-path 0.6s, static after; the "SR" square is a stand-in, NOT the slate's shared end card | DRIFTED (mark asset) | reel1.html end block; REVIEW-stage6 #8 |
| Music bed | Mixkit "House 02" (Lily J), 123 BPM deep house, Mixkit Stock Music Free License, 35s, loudnorm | MATCHES (Jake steer 8/16 "electronic dance music") | audio/BED-EDM-NOTES.md |
| Copy in Jake's voice (placeholders) | overlay type + captions are placeholders; "Every home, every rent, no forms" corrected to "Available now. Coming soon. One number to text." after review #7 | MATCHES (placeholder status flagged) | reel1.html; captions/REEL-1.md |

## §4 Reel 2 shot list
| Beat | Built | Verdict |
|---|---|---|
| 0–3 open, KENDALL STREET, address small (= "South Bend, Indiana", no digit) | 0–2.2 hold; copy "South Bend, Indiana…" | MATCHES |
| 3–8 fast gold-handled swipe, hold before/after | swipe 4.0–4.5s (15 frames), holds 1.4s / 3.4s | MATCHES |
| 8–12 numbers ONLY if ruled; default "Rebuilt · Rented" | REBUILT · RENTED lands ~2s after the swipe; no $ anywhere | MATCHES |
| 12–20 kitchen | 10.6–17.4 kitchen swipe at 12.0–12.5 | MATCHES (timing shifted −1.4s) |
| 20–27 living, During → After | 19.0–25.8, swipe 20.4–20.9, tags DURING/AFTER | MATCHES |
| 27–35 close + end card | 27.4–30.6 close (single finished shot, ONE HOUSE, REBUILT., Text CTA), 31.4–35 end card (mark + SHAVIT ROOTMAN + URL) | MATCHES (mark is a stand-in, see above) |

## §5 anti-requirements
- No voice-over, nothing generated, no new photography, no site changes — MATCHES (journal has zero generation calls; site untouched; the gold-handle CSS injection into the live-page capture was REMOVED after review #6, so the live page appears with its real white handle).
- Register: no digit-leading address in OUR type (MATCHES — "Kendall Street"), states spelled out in our type (MATCHES), no pulsing logo (MATCHES — draws once), Ken-Burns ≤20% (MATCHES — Mac push-in 0–2s is 10% scale over 2s ≈ 6% of runtime; Jake may rule), real photos only (MATCHES), "written off" absent (MATCHES).
- $ on picture: none in our type; site UI inside device screens shows rents/$68,400/$151,250 — DRIFTED-BY-DESIGN → 25 WARNs for Shavit's ruling (spec §5 bullet 4 + §12).
- Drafts not posts — MATCHES (nothing posted).

## §9 acceptance
All 7 criteria executable and passing (see gate log); criterion 5 as amended in v1.2 (Palmier holds base + bed). Region-based OCR replaced the time-window classification after review P1-2; dependency + staleness guards added after P1-3.

## §3 mockup contract
Previs (SPEC 1–3) → Reel 2 built from the same the-turn.html; storyboard frames → Reel 1 beats. MATCHES.

## MISSING
- ~~Shared slate end card not yet placed~~ RESOLVED in v3 (baked from the master project export, both reels).
- Cursor click on "Read the case study" (spec §4 9–14) — not captured; beat trimmed instead (QC C4). Cosmetic.

## Verdict
No unresolved drift that changes what Jake signed: two DRIFTED items are timing rebalances that improve pacing (documented), one is the stand-in end-card mark (flagged for the shared asset), one is site-UI figures visible in captures (a ruling item by spec). Proceed to stage 6/7 with the MISSING list carried into the presentation.
