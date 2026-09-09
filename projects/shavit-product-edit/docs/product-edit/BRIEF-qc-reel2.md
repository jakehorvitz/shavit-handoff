# Lane: qc-reel2 → write docs/product-edit/QC-reel2.md, then touch DONE-qc-reel2
QC the current Reel 2 render: docs/product-edit/mockup/reel2-base-nonum.mp4 (1080x1920, 35s), rendered from
mockup/the-turn.html by mockup/capture-reel2.mjs (scroll keyframes; each chapter = hold on before → FAST gold-handled
swipe (~0.5s) → hold on after; chapters: exterior 0–11.5s, kitchen 11.5–20.5, living 20.5–28, close 28–35).
Read docs/product-edit/SPEC-reels.html sections 4, 5, 10 (The Local Project caption system, Neoscape card wipe are the
taste targets) and video-brain register rules quoted there.
Method: sample frames at 4 fps around each swipe and 2 fps elsewhere, contact-sheet them, LOOK. Measure the actual swipe
duration per chapter (frames where the handle moves) and report it. Flag: swipe still too slow/fast, holds too long,
type collisions (nav vs Before/After tags, numbers panel vs copy), caption legibility, dead time, whether "REBUILT /
RENTED" reads, whether the close is static and holds. For each finding give the exact fix (the-turn.html CSS/JS or
capture-reel2.mjs keyframes). Ranked top-5 + verdict SHIP / SHIP AFTER FIXES / RECUT. Do not edit files; do not touch
site/, .bones/, exports/.
