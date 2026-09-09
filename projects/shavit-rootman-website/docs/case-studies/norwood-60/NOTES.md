# 60 S Norwood Ave — in-progress case study (draft 1, 2026-08-24)

## Source of truth
Shavit's 8/24/26 3:26 PM text, VERBATIM (the only copy he has supplied for this page):

> 60 S Norwood, Hillsdale:
> - Drywall in the works.
> - Exterior siding, windows, doors, roof, fascia, and soffits done.

Plus 11 photos in the same text (10 unique — two of the HEICs were byte-identical),
originals in iMessage attachments; web-sized copies in `img/`. No docx, no numbers,
no dates beyond the text's own date.

Second source (added same day, on Jake's "do you have afters of norwood from the
drive"): Shavit's Drive folder **"60 S Norwood - local luxury"** (folder id
`1JbVEhTuI7EiDr68Zl0yOAnIK9Jqp-9v-`, 21 files, 6/29–7/27). It holds **NO afters** —
it is exterior + interior BEFORES (house as acquired, gut to studs), two hand-drawn
floor-plan sketches, materials deliveries, and late-July framing progress. Four
befores + one framing shot are now on the page (Condition at Acquisition + the
first Inside the Work figure). Pulled via the claude.ai Drive connector (base64) —
the machine-wide Google sign-out of 8/24 blocks every other route.

## What this page deliberately is NOT
Kendall and Clarendon are completed-deal pages (Investment Snapshot, BRRRR
Performance, before/after sliders, timeline). Norwood has none of that material
yet, so this ships as an **In Progress** case study: snapshot (facts already live
on the site), his two progress bullets verbatim, a photo grid, and a `.pending`
"numbers publish at completion" block. The BRRRR sections drop in when Shavit
supplies numbers — do not compose them earlier.

## Fact provenance
- Beds 3 / baths 2 / sqft 1,046 / Single Family — `site/src/properties.js`
  `norwood-60` entry (Shavit 7/16 email §2).
- Lease signed — live `norwood-60` listing status.
- Progress bullets — 8/24 text, verbatim (order flipped so done work leads;
  flipping order is trimming, not rewriting).
- Photo captions — descriptive of what is visible only, no claims about scope,
  cost, or schedule.

## Composed lines Jake should eyeball before deploy (everything else is Shavit's or registry-backed)
1. Summary: "A single-family rebuild, documented while the work is under way."
2. Pending block: "The full deal numbers for this project publish when the
   renovation is complete…"
3. Homepage Michigan slot blurb: "A Hillsdale single family under renovation —
   exterior done, drywall in the works." (condensed from his bullets)

## Open questions for Shavit
1. Acquisition price, renovation budget, and dates — unlocks the Investment
   Snapshot + timeline.
2. Befores EXIST (Drive folder above) — at completion, shoot afters from the
   matching angles so the Kendall/Clarendon slider treatment works here too.
   The exterior-before vs the finished exterior is already a strong pair.
3. The listing card said "finished to a new standard" while his text says
   drywall is still going in — card line softened to "being brought to a new
   standard" this commit; confirm he is fine with that wording.

## Publishing note
The address is already public on the site (norwood-60 listing card), so this page
discloses nothing new. Draft is annotatable (`data-spec="norwood-60-case-study"`,
serve via `python3 serve.py` → http://localhost:8765/docs/case-studies/norwood-60/).
Public copy at `site/public/case-studies/60-s-norwood/` strips the annotate hooks,
same as Clarendon.
