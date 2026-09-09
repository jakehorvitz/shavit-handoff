# RESUME — 12 River reel recut (v6 spec: Didot + smooth outro)

GOAL: improve the original 98/100 by REBUILDING from its own clean text-free clips
(build/shots/W_*.mp4, B1_before_pushin, B2_after_pushin, A_hero_v4_flipbook) — NOT a Ken Burns
rebuild (Jake rejected that), NOT overlays on the burned-in export (caused black boxes/bleed).

## Current spec = v5 (script: build/build_v5_spec.py). Structure:
1 old house "FORGOTTEN" · 2 construction (no text) · 3 finished house + BOLD "12 RIVER STREET" (reveal)
· 4 KITCHEN (real k23 photo, recut/kitchen/k23.jpg) · 5 LIVING ROOM · 6 BATHROOM · 7 ALL-SEASON ROOM
(trimmed to 1 shot) · 8-9 back to house LIVE WITH US -> WORK WITH US (animated) -> HARD CUT ·
10 BOLD Shavit outro OVER the house (soft wash, not black screen).
Captions = room name + vivid factual desc (no "New"). Dissolves 0.45s between beats; hard cut into outro.
Music: music_smalltown.mp3. NO black boxes (text shadow for legibility).

## Rendered so far (spec only): ending-animation demo = recut/v5/ending-animation.mp4 (CTA + outro).
Static frames: recut/v5/story/*.jpg. Spec page: ~/Downloads/12-River-Spec-v5.html.

## NEXT (once Jake approves v5): build the FULL reel end-to-end.
Adapt build_v3_preview.py (the working xfade-chain builder) to the v5 order + add:
 - beat 3 house-reveal-with-address, ending CTA animation (fades, no box), bold outro over house.
Use the SEGMENTED/xfade approach. HANG LESSON: looped-image (-loop 1) inputs need a hard -t output
cap or overlay shortest=1, else ffmpeg deadlocks at 0% CPU.

## Open Qs for Jake: opener word ("Forgotten" placeholder); kitchen angle (k23 default; k21/k25 exist).
## Real kitchen photos (durable): recut/kitchen/k21.jpg k23.jpg k25.jpg. Drive token dead -> use Drive MCP.

## 2026-07-07: FULL v6 REEL BUILT -> recut/12-River-v6-FULL.mp4 (28s) + ~/Downloads/12-River-v6-FULL.mp4
Builder: build/build_v6_full.py (beats 1-7 clips + recut/v6/_v.mp4 ending, xfade 0.45, scored).
Fonts: Didot display + Avenir body (build_v6_spec.py regenerates plates + ending). Awaiting Jake review.

## 2026-07-07 v8 = current best -> recut/12-River-v8-FULL.mp4 (~/Downloads/12-River-v8-FULL.mp4)
Builders: build_v6_spec.py (Didot plates + ending _v.mp4) + build_v7_full.py (assembly, output renamed v8).
v7->v8 changes: construction beat back to A_hero_v4_flipbook (Jake likes the choppiness); room descriptions
bigger+pure-white (plate_room A(34), scrim 0.50/190) for readability. Address "12" scaled to cap-height (fixed).
Rooms = smooth 4k stills (upscaled/*_4k.jpg + k23). Opener B1 + ending _v.mp4 keep pushes. No em dashes.
Jake: "almost perfect." Next: await final tweaks or send to Shavit.

## 2026-07-07 v9 = current best -> recut/12-River-v9-FULL.mp4 (26s). Builder: build_v9_full.py.
Fixed the two "weird jumps": opening is ONE continuous flipbook (old->construction->finished); FORGOTTEN
(massive, centered, Didot 150, white+heavy shadow) fades over the old house, ADDRESS fades over the finished
house -> NO beat crossfades around construction/address. Merged old B1 opener + reveal beat into the flipbook.
Rooms = smooth stills; ending _v.mp4. Jake open to a different FORGOTTEN color (white reads fine for now).

## 2026-07-07 FINAL (Shavit sign-off changes) -> recut/12-River-FINAL.mp4 + ~/Downloads/12-River-FINAL.mp4
Builder: build_final.py. Reverted to ORIGINAL fonts (Bricolage display + Manrope small), address = "RIVER STREET"
(no 12), removed FORGOTTEN. Everything else as v9 (smooth flipbook opening, stills, real kitchen, ~3s address,
smooth outro). Deliverables folder: ~/Downloads/12-River-Reel/. Shavit: "we're rocking." DRAFT, Jake sends.
