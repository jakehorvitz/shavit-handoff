# 1919 Kendall Street — Deal Case Study (draft 1)

Built 2026-08-11 against Shavit's "Website Guidance" memo. Section order follows his
list exactly, including his instruction that Investment Snapshot and BRRRR Performance
sit near the top and that the Before and After slider is the visual centrepiece.

## How to open it

```
cd ~/projects/shavit-rootman-website
python3 serve.py 8770
open http://localhost:8770/docs/case-studies/kendall-1919/
```

Port 8765 is already held by another serve.py instance, hence 8770. Opening over
`http://` (not `file://`) makes the page annotatable: every section heading gets a
"+ note" chip and comments persist to `docs/spec-inbox.jsonl`.

This lives in `docs/`, deliberately **not** under `site/public/`, so it cannot ship in
a Netlify deploy by accident. It also carries `noindex, nofollow`.

## Four things Shavit has to answer

These are reproduced in the gold draft banner at the top of the page. Delete that
`<aside class="draftbar">` before publish.

1. **Capital returned through refinance.** The memo says **$151,250**. A 75% LTV against
   a $215,000 ARV computes to **$161,250**. Every other figure on the sheet reconciles
   exactly (68,400 + 60,000 = 128,400; 215,000 - 128,400 = 86,600; 86,600 / 128,400 =
   67.4%), which makes this look like a digit transposition. The "100%+ capital
   recovered" claim holds either way, so nothing downstream breaks. The page currently
   prints his figure, unaltered.
2. **Timeline dates.** He supplied stage names only. All five render as "Date to confirm"
   in brass. No dates were invented.
3. **Scope wording.** His copy says "kitchens, bathrooms" (plural) for what the site
   lists as a single-family home. Written singular on the page. Confirm.
4. **"CPM standards"** was expanded to "Charger Property Management standards" so a
   first-time visitor is not reading an internal abbreviation.

## Photo decisions

Source is the 106-frame Drive dump at
`~/projects/shavit-pipeline/docs/reel-specs/kendall-2026-07-24/_drive-dump/`. Every frame was
reviewed on a contact sheet, then candidate pairs were checked side by side at full size.

**Four comparators shipped**, each cropped to an identical 1400x933 frame so the wipe lines up:

| Room | Before | After | Why it works |
|---|---|---|---|
| Exterior | 004 | 019 | Same camera position, same retaining wall, steps and chimney |
| Bathroom | 027 | 060 | Tub left, vanity right, in both frames |
| Kitchen | 022 | 023 | Shot from the living room through the same opening |
| Living room | 055 | 098 | Same fireplace, same flanking windows |

The living room comparator is labelled **"During"**, not "Before". The only frame of that
fireplace from that angle was taken mid-renovation, with masking and contractor materials on
the floor. Calling it a before would have been a small lie on a page whose whole job is
credibility.

**Rejected pairs, with the reason:**

- **Entry (102 to 030).** The front door is on the left in one frame and the right in the
  other. They are shot from opposite ends of the room, so a wipe reads as a mistake.
- **Hallway (048 to 090).** The "after" is still under construction: floor protection down,
  blue tape, wiring hanging, no fixtures.
- **Bedroom (084 to 105 / 087).** No finished frame matches the yellow-walled bedroom's angle.

**Excluded on the occupants rule:** `051`, `067`, `069`, `088`, `089`, `096`, `097` and the
labelled `before-debris`, `before-kitchen`, `before-tub` all show the prior occupants'
belongings (children's toys, clothing, groceries). Same call that killed the dog-breeding slide
on East Victoria. The page is about the house, never about who lived in it.

**Condition at Acquisition** keeps two frames no comparator covers: the failed bathroom subfloor
and a bedroom as purchased. **Finished interiors** in the closing gallery come from the nine
already-vetted photos live on shavitrootman.com.

## What is deliberately not done

- **Not ported into the React app.** Shavit is signing off on a *format* that every
  future project inherits, so the cheap move is to approve the format first. Porting
  means a `/investors/case-studies/:id` route in `site/src/routes.jsx`, a data file
  shaped like `properties.js`, and a `<CaseStudy>` component. Today case studies are
  only a homepage band (`tenant-pages.jsx:517`) behind the `/#case-studies` anchor.
- **Previous / Next targets are placeholders** (Buckingham, 1902 East Ewing). Ohio's
  Buckingham was earmarked as Deal Case Study #1 in `properties.js`, but the running
  order across projects is Shavit's call.
- **No CTA.** His format list does not include one, and the site's only conversion path
  is the SMS number. Worth asking whether an investor case study should carry one.

## Standing site rules respected

Two-buckets inventory language untouched, no holding-company names, no "owned by",
no on-site form, address shown (the website already publishes 1919 Kendall St with a
Zillow link, unlike the social carousels, which drop house numbers). Fair-housing safe:
the copy describes the property and the work, never a target tenant.
