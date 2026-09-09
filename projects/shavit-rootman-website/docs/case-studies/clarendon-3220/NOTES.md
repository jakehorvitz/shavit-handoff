# 3220 Clarendon Road — Deal Case Study (revision 2, 2026-08-21)

Rebuilt 2026-08-21 from the two things Shavit sent on 2026-08-20: the docx
"3220 Clarendon Rd Case Study" (9:08 PM, transcribed at
`docs/tasks/sources/clarendon-docx-2-rd-case-study-0820-9pm.txt`) and ~45 captioned photos
(9:15–9:31 PM, sorted into `_drop/` with `_drop/MANIFEST.md`). Same twelve sections, same
order, same shared stylesheet as 1919 Kendall; `case-study.css` was not touched.

## Open it

```
cd ~/projects/shavit-rootman-website && python3 serve.py 8770
open http://localhost:8770/docs/case-studies/clarendon-3220/
```

Live copy: `site/public/case-studies/3220-clarendon/` → shavitrootman.com/case-studies/3220-clarendon/
(number-first slug, like `1919-kendall`). The docs copy keeps the spec-annotation hook; the
site copy strips it, mirroring how Kendall shipped.

## What changed from draft 1 (2026-08-11)

Draft 1 was built from the earlier memo (`clarendon-docx-1-website-case-study-for-jake.txt`).
Shavit never confirmed that memo; on 8/20 he sent docx 2 and said "match the details you need
from the metrics you used for 1919 Kendall". Docx 2 was used wholesale. **Where the two
conflict, docx 2 wins** — Jake should confirm each of these with Shavit:

| Item | Docx 1 (draft 1) | Docx 2 (this page) |
|---|---|---|
| Address | 3220 Clarendon Avenue, Cleveland | **3220 Clarendon Road, Cleveland Heights** |
| Renovation investment | $130,000 | **$140,000** |
| Total project cost | $284,000 | **$294,000** |
| Value / equity created | $266,000 "Equity Created" | **$256,000 "Value Created"** |
| Return metric | 93.7% ROI | **87.1% "Value Created Over Project Basis"** |
| Capital returned through refinance | ~$150,000 (after ~$12,000 closing costs) | **~$160,000** (closing costs not mentioned) |
| Acquisition story | relationship via a homeowner; "Adam"; one unit vacant at close | **acquired late 2025 as a vacant triplex in poor but inhabitable condition** |
| Rent detail | two 3BR/1BA + one 1BR/1BA | **seven bedrooms, three bathrooms; three units** |
| Rehab scope | incl. air conditioning in all three units | **longer scope list; AC not named (mini-split visible in photos)** |
| New in docx 2 | — | Annual Gross Rent $59,700 · Current Monthly Cash Flow ~$1,000 · Refinance Loan Amount $412,500 · Capital Recovered 100%+ · Current Status Stabilized · dated timeline |
| Section name | "Project Overview" / "The BRRRR Strategy" | **"Project Story" / "The BRRRR Process"** (Kendall's names) |
| Estimated cap rate | ~8.0% | dropped (not in docx 2) |

Numbers reconcile: 154,000 + 140,000 = 294,000; 550,000 − 294,000 = 256,000;
256,000 / 294,000 = 87.1%; 75% × 550,000 = 412,500.

## Draft-1 open questions — now closed

1. *No photographs* → closed: Shavit sent ~45 frames on 8/20; hero, five comparators and a
   nine-frame gallery are built from them (details below).
2. *"Charger Realty" wording* → moot: docx 2 has no relationship story; the phrase is gone.
3. *Publishing the address* → closed by Shavit sending the page copy and photos for the site;
   the address is now intentionally public (see "Standing site rules").
4. *Timeline dates* → closed: docx 2 dates every stage (one ordering question remains, below).
5. *Section name* → closed: docx 2 uses Kendall's "Project Story" / "The BRRRR Process".
6. *"Three families" vs "households"* → moot: docx 2's Community Impact copy replaced it.
7. *Next Project target* → still none; the nav renders only the real neighbour (Kendall).

## Timeline — one thing to confirm

Docx 2 lists the stages in Kendall's order (Leased / Stabilized before Refinanced) but dates
them **Refinanced: May 2026** and **Leased / Stabilized: June 2026**. The page orders the dots
by date (Acquired · Renovation Completed · Refinanced · Leased / Stabilized · Current Status)
and prints his dates as given. A refinance closing before lease-up is unusual for a BRRRR;
ask Shavit whether the months are right or swapped.

## Layout notes (no CSS changes)

- Docx 2 has nine snapshot metrics and five performance metrics; Kendall's grids are 4-wide.
  The ninth / fifth tile would leave grey empty cells, so the last tile in each grid carries an
  inline `grid-column:1/-1` and spans the row (Current Status; Capital Recovered 100%+).
  If a later project also needs nine, that is the moment to move this into the stylesheet.
- Prev / Next: only real neighbours are rendered (no `href="#"` no-ops — that was a live bug
  fixed 8/20). Clarendon has a Previous (Kendall) and no Next, so the lone card spans the row
  with the same inline rule. Kendall's live page got its Next (Clarendon) restored the same way.
- "Approximately" values render as the plain figure with a `stat__note` "Approximate"
  (Kendall's pattern for its estimated cap rate).
- Exterior and Common Areas are two of docx 2's six Before & After categories but have no
  pair (no exterior before; no common-area photos at all). Their paragraphs sit as two ledes
  between the comparators and the gallery, per the brief's "cover those categories in copy".

## Photo decisions

All 37 frames in `_drop/` were opened and reviewed. Two findings that changed the pairing:

1. The "Unit 1" IMG_30xx files and the "Unit 2" DSC093xx files are **the same shoot** (e.g.
   `img_3038` ≡ `dsc09355`, `img_3048` ≡ `dsc09394`, `img_3049` ≡ `dsc09391`). So there are two
   after-shoots in total: one lower unit (fireplace, triple windows, pass-through kitchen) and
   the attic unit (DSC069xx, sloped ceilings, mini-split, glass shower). Comparators are
   therefore labelled by **room**, with "Upstairs unit" only where the slope makes it certain,
   never "Unit 1 / Unit 2". Ask Shavit which floor the DSC093xx shoot is, and whether the
   other lower unit was photographed.
2. Captions and filenames disagree: `unit1-bedroom-before.jpeg` is the **fireplace living room**
   (same board-and-batten wall and mantel as `img_3047`), and `unit3-before-b.jpeg` is the
   **attic bathroom** — so a Bathroom pair exists after all.

**Five comparators shipped**, each cropped to the shared 1400x933 frame:

| Label | Before (`_drop/`) | After (`_drop/`) | Why it reads |
|---|---|---|---|
| Kitchen | before/unit1-kitchen-before.jpeg (top-biased band, see below) | after-unit1/img_3052.jpeg | Same wall from the doorway: window over the sink, refrigerator right, door at the left edge |
| Living Room | before/unit1-bedroom-before.jpeg (left 80 px dropped, see below) | after-unit1/img_3047.jpeg | Opening to the dining room centre, panelled fireplace wall right, in both |
| Bathroom · Upstairs unit | before/unit3-before-b.jpeg | after-unit3/dsc06937.jpeg (portrait; centre band) | Same sloped room shot from the door toward the window; fixtures swapped sides, said so in the caption |
| Living Area · Upstairs unit | before/unit3-before-a.jpeg | after-unit3/dsc06949.jpeg | Window wall under the slope in both; window AC → mini-split |
| Basement & Mechanical | before/basement-before.jpeg | after-basement/basement-after-b.png (→ JPEG) | Glass-block window and utility sink in both |

Two befores were cut before `wire-pair.sh` (it centre-crops, nothing else):
- **Living room before**: a person's legs are visible at the far-left edge of the listing
  frame. The left 80 px were dropped first so no person appears on the page.
- **Kitchen before**: the prior occupant had a human-silhouette shooting target taped to the
  refrigerator door, lower right. The frame was cut as a top-biased 3:2 band (rows 40–424:
  drop ceiling, cabinets, window, counter, top of the fridge) so the target is outside the
  frame. The caption says the before is "cropped at the countertop".

**Rejected, with the reason:**
- `before/unit2-common-or-bedroom-before-a.jpeg` (office): the same shooting-target poster
  fills the right wall; no after from that room anyway.
- `before/unit2-common-or-bedroom-before-b.jpeg` (child's bedroom, toys and stuffed animals):
  the Kendall occupants rule — the page is about the house, never who lived in it.
- `before/unit1-common-before.jpeg` (red-wall, carpeted living room): real and usable, but it is
  a *different* room from the fireplace living room (carpet vs. wood floor) — probably the
  other lower unit, which has no after shoot. Held back rather than wiped against a room it
  may not be. Candidate for a "Condition at Acquisition" figure once Shavit confirms the unit.
- `after-basement/basement-after-a.png` not used as a comparator (corner/hallway angle, no
  before from that angle); used in the gallery as the epoxy-floor frame.
- `after-unit1/img_3036.jpeg` (1206x795, low-res duplicate angle), `img_3037` (tile detail),
  `img_3040`, `img_3041`, `img_3049`, `img_3053`, `after-unit2/dsc09355/09391/09394/09409/09412`,
  `after-unit3/dsc06916/06943`: fine photos, not needed.

**Gallery (after-02 … after-10, 1024x682):** fireplace living room (img_3045), dining + pass-through
(img_3048), kitchen (dsc09403), bathroom (dsc09364), bedroom (dsc09352), upstairs open living
(ea720a197c48.png), upstairs vanity (dsc06946), upstairs stair landing (dsc06958), basement
epoxy floor (basement-after-a.png). **Hero (after-01, 1024x683):** after-exterior/exterior-after.jpeg,
a 3:2 band biased slightly up from centre so the gable and the steps both survive.

Every before is a 576x768 iMessage-compressed listing frame with an "MLS Now" watermark in
the bottom strip (the 3:2 centre crop removes the strip). They are upscaled ~2.4x to 1400x933
and look soft next to the DSC afters. That is the honest state of his photos; see open items.

## Standing site rules respected

No holding-company names, no "owned by", full state name ("Ohio"), dollar figures shown
(Kendall shows them), seller unnamed, fair-housing wording describes the property and the
market, not who lives in it. The address is now intentionally public: **shipping this page
retires the old pre-ship check `grep -ril clarendon site/dist → 0`** (introduced in f8df029
while the page was held).

## Open items for Shavit / Jake

1. **Before images are MLS listing photography — confirm we have the right to publish them.**
   All eight `_drop/before/*.jpeg` frames carry an "MLS Now" watermark in the bottom-left
   strip: they are the old sale-listing photos, not Shavit's own shots, and the site has a
   standing not-ours-to-copy rule about listing photos. He forwarded them deliberately
   ("From me"), so the pairs are built — but this is the first thing to confirm with him
   before the page goes live. Verified: every published before crop uses rows ≤ 576 of the
   768-row frame (standard band 192–576; kitchen 40–424; living room 218–549) and the
   watermark sits at rows ≈ 735–765, so no full or partial watermark survives in any
   shipped crop (checked visually on all five).
2. **Original before photos.** Ask Shavit for the original files (AirDrop or Drive, not
   iMessage) and re-run `./wire-pair.sh` with the same pairs; the befores will sharpen without
   any other change. Do not change `case-study.css` to work around the softness.
3. Confirm the docx1 → docx2 conflicts in the table above, especially Road/Heights, $140k,
   87.1%, ~$160k, and the vacant-triplex acquisition story replacing the relationship story.
4. Timeline: refinance (May 2026) before lease-up (June 2026)?
5. Which floor is the DSC093xx after shoot, and was the other lower unit photographed? Any
   exterior *before* or common-hallway photos (those two categories have no imagery).
6. The basement "after" is a screenshot (CleanShot, likely from his own listing); a camera
   frame of the finished basement would replace it cleanly.
