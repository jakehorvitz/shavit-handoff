# Task: Clarendon Road carousel rev 3 — apply Jake's critique (agent: clarendon-ig-rev3)

Repo: ~/projects/shavit-pipeline. Read first: `docs/reel-specs/clarendon-ig-2026-08-20/final/ANNOTATIONS-2026-08-21.md`
(Jake's six voice notes on rev 2, transcribed), then `docs/tasks/2026-08-21-clarendon-ig-fb.md` (the
rev 2 brief; every rule in it still applies: Shavit docx 2 wording verbatim, zero dollar figures,
Clarendon Road / Cleveland Heights / Ohio, no house number, facts not emotion, no em dashes, no
contractions, real photos only, end card identical to Kendall, nothing posted, website repo read-only),
`docs/reel-specs/_scripts/render_clarendon.py` (rev 2 renderer: keep it, extend it), `final/FRAMES.md`,
`final/NOTES.txt`, and the photo manifest at
`~/projects/shavit-rootman-website/docs/case-studies/clarendon-3220/_drop/MANIFEST.md` (READ-ONLY).
The spec server for this repo is on port 8766 (`http://localhost:8766/docs/reel-specs/clarendon-ig-2026-08-20.html`).
bones-guard is sealed here; Bash works. The ECC Fact-Forcing gate may ask you to state facts before a
first Write/Edit of a NEW file: state them briefly and retry; do not fight it, and prefer editing
existing files over creating new ones.

## The rev 3 deck (10 slides, Kendall bone system, 1080x1350)
01 cover A unchanged (exterior, "A complete multifamily transformation using the BRRRR investment
   strategy.", "Clarendon Road. Cleveland Heights, Ohio."). 01b is no longer in the send set.
02 BEFORE collage = the current ALT_02 composition moved into the numbered deck (4x2, MLS watermark
   cropped, person at the left edge of unit1-bedroom excluded by crop, brass BEFORE chip). Copy stays
   his: "A vacant triplex in poor but inhabitable condition." + the location/acquired sublines.
03–07 SPLIT before|after slides, one per docx category, before on the LEFT half, after on the RIGHT
   half of the 1080x866 photo area, a 6px bone gutter between, BEFORE / AFTER chips top-left of each
   half. Befores at near-native scale (576x768 into 537x866: scale ~1.13, crop the bottom 9% first so
   "MLS Now" never shows), afters centre-cropped to 537x866. Pairings (open every file and confirm
   the room type matches before you commit to it; caption vs filename disagree in places):
   03 KITCHENS: before/unit1-kitchen-before.jpeg | after-unit1/img_3052.jpeg
   04 BATHROOMS: the bathroom frame among before/unit3-before-*.jpeg | after-unit1/img_3037.jpeg
      (or after-unit3/dsc06937.jpeg portrait, which fits a portrait half better: pick the one that
      shows tub/tile/fixture most clearly at 537 wide)
   05 LIVING AREAS: before/unit1-common-before.jpeg | after-unit1/img_3045.jpeg
   06 COMMON AREAS or BEDROOMS: there is NO hallway/stair before. Either keep 06 as the after-only
      stair frame (after-unit3/dsc06958.jpeg) under the docx COMMON AREAS copy, or make it a bedroom
      split (before/unit1-bedroom-before.jpeg or the unit2 bedroom before | after-unit1/dsc09352.jpeg
      or img_3040.jpeg) under a docx line that is true of bedrooms (the LIVING AREAS paragraph covers
      "new flooring, drywall repairs, paint, lighting, and finish work"). Prefer the split: Jake asked
      for before/after representation; an after-only slide in the middle of five splits is the odd one.
      If you use the bedroom split, move the stair frame to the FB set or drop it; say which in NOTES.
   07 BASEMENT & MECHANICAL: before/basement-before.jpeg | after-basement/basement-after-b.png.
   Copy on 03–07 unchanged from rev 2 (docx paragraphs verbatim, trimmed).
08 "Following renovation, the three units were leased." unchanged (after-unit3/ea720a197c48.png).
09 "Refinancing rather than selling." unchanged (after-unit1/img_3048.jpeg).
10 CLOSE ON THE EXTERIOR: the same IMG_7691 at a clearly different crop from 01 (tight on porch, entry
   and gable, zoom ~1.35, ybias toward the roofline, lift 1.04), copy unchanged ("Fully leased,
   refinanced, and professionally managed." / "Proudly revitalizing Cleveland Heights, Ohio." /
   LIVE WITH US. WORK WITH US. + mark). The frame dsc06949 that was 10 becomes unused. NOTES must say
   the exterior appears twice by Jake's call and that a second exterior from Shavit is a drop-in.
Then: `python3.13 docs/reel-specs/_scripts/render_clarendon.py` (extend, do not fork, the renderer;
add a `split(before, after, ...)` helper next to `collage()`), regenerate REVIEW-sheet.jpg and
Clarendon-Carousel-MASTER.pdf, open REVIEW-sheet.jpg with Read and fix any half where the fixture,
tub, range or gable is cut; re-render until clean. FB set (`fb/`) unchanged unless you moved the stair
frame there. Update FRAMES.md (slide → before file | after file → why, with the docx quote column),
NOTES.txt (status, judgment calls, the confirm-with-Shavit list: MLS befores now IN the deck by Jake's
decision, so confirming rights with Shavit is more important, not less), and re-copy the send-ready set
to `~/Desktop/Shavit - Clarendon Carousel/` (replace; no 01b; include the new 02).
Spec: bump `docs/reel-specs/clarendon-ig-2026-08-20.html` to rev 3: new dated `.revlog` entry on top
naming each of Jake's six notes and what changed, wrap every changed slide block in `class="chg"`,
drop the previous `.chg` marks, embed the new slides, and make the written slide-copy column match the
rendered images exactly (the rev 2 page still shows pre-verbatim text in places: fix it).
Commit by name (`git add` the exact paths; never -A / .). Report: slide → files table, anything you
could not pair, the confirm list, the spec URL (port 8766), the Desktop path. Do NOT post anywhere.
