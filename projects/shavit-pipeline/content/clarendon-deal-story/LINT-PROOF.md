# Lint proof — Clarendon Road posts (rev 2, 2026-08-21, Shavit wording only)

Both bodies are Shavit's docx 2 sentences verbatim (Jake, 8/21 01:11), trimmed
or with dollar figures / the house number removed. This file applies every
machine rule in `shavit.py cmd_lint` by hand to the marker-stripped text, and
`FINISH.sh` runs the real command on marker-stripped copies and writes the
output to `docs/reel-specs/clarendon-ig-2026-08-20/final/LINT-OUTPUT.txt`.

## Rules in `cmd_lint`, applied to both posts with `[F:...]{...}` stripped to text

| Rule (shavit.py) | Check | clarendon-deal-story (IG) | clarendon-triplex-fb (FB) |
|---|---|---|---|
| no-dollar | `"$" in body` | no `$` (L36 used with the figures removed) | no `$` |
| full-states | `\b(MI\|OH\|IN)\b` (case-sensitive) | "Ohio" spelled out; no uppercase IN/OH/MI token ("BRRRR" is not one) | same |
| no-house-numbers | `\b\d+\s+[A-Z]...\s+(Street\|Road\|...)` | "Clarendon Road" with the number removed; no digits at all | same |
| phone-registry | `\(\d{3}\)\s*\d{3}-\d{4}` | no phone-shaped string | same |
| unknown-fact | every `[F:id]` must be in facts/ | N/A on the stripped copy; on the real post it stops at `clarendon.strategy` until `fact add` (expected) | same, first id `clarendon.impact` |
| allowlist / uncited-numeral | every `\d+` outside a span dies | ZERO digits: the dated docx lines ("late 2025", "June 2026") are trimmed out of the caption and live only on slides 02 and 08 | ZERO digits |
| no-bait (warn only) | "follow for more", "you won't believe", "smash that", "link in bio NOW", "giveaway", "tag 3 friends" | none | none |
| url-quote | `url:` ids need a quote | no `url:` ids | no `url:` ids |

Expected output on the stripped copies: `lint ok`.
Expected output on the real posts today: `unknown-fact: clarendon.strategy …` / `unknown-fact: clarendon.impact …`.

## Brand / prose rules (checked by eye)

- No em dashes (the docx's own "long-term", "one-time", "common-area" hyphens are kept as his).
- No contractions, no apostrophes.
- Every adjective is Shavit's. Nothing composed.
- Street name only, full state name, city "Cleveland Heights" (L69's "relocating to Cleveland" is his sentence; flagged).
- Fair housing: the only people sentence is L37, who did lease.
- IG caption about 1,300 characters, hook + place line inside the first 125.
- FB post about 255 words (playbook 150 to 300). The playbook CTA is not docx wording and is not in the body.

## Stripped IG text (what FINISH.sh lints)

A complete multifamily transformation using the BRRRR investment strategy.

Clarendon Road. Cleveland Heights, Ohio.

A vacant triplex in poor but inhabitable condition. The opportunity was driven not only by the building itself, but by its location within Cleveland Heights and proximity to the medical, educational, and employment centers surrounding University Circle.

The work included updated kitchens and bathrooms, flooring, drywall and paint, lighting and fixtures, plumbing improvements, portions of the electrical system, mechanical improvements, select window replacement, common-area improvements, basement moisture treatment and finishing work, driveway repairs, landscaping, and porch improvements.

Following renovation, the three units were leased. The property attracted tenants including medical residents relocating from outside the area.

Rather than selling the property and realizing the value created as a one-time gain, we retained Clarendon Road as part of the long-term portfolio. The returned capital can be redeployed into future acquisitions and renovations while Clarendon continues producing rental income and building equity over time.

Live with us. Work with us.

.
.
#beforeandafter #clevelandheights #universitycircle #clevelandrealestate #ohiorealestate #brrrr #rehab #renovation #propertymanagement #realestateinvesting #midwestrealestate #multifamily #homerenovation #propertyrehab

## Stripped FB text

Returned a vacant and underperforming multifamily property to productive use in Cleveland Heights.

A vacant triplex in poor but inhabitable condition. The opportunity was driven not only by the building itself, but by its location within Cleveland Heights and proximity to the medical, educational, and employment centers surrounding University Circle.

The exterior was refreshed while preserving the existing character of the property. Landscaping, selective repairs, driveway patching, porch improvements, and general exterior cleanup improved the presentation of the building without unnecessary replacement of serviceable components.

The work included updated kitchens and bathrooms, flooring, drywall and paint, lighting and fixtures, plumbing improvements, portions of the electrical system, mechanical improvements, select window replacement, common-area improvements, basement moisture treatment and finishing work, driveway repairs, landscaping, and porch improvements. The common hallways and stairways received the same attention as the individual units.

Created three professionally renovated and managed homes in a prime location serving the greater University Circle employment and educational corridor. Provided quality housing for medical residents and other professionals relocating to Cleveland from outside the region. Improved the physical condition, presentation, and long-term viability of an existing Cleveland Heights property. Demonstrated that older housing stock can be thoughtfully repositioned while preserving the character of the existing building.

Rather than selling the property and realizing the value created as a one-time gain, we retained Clarendon Road as part of the long-term portfolio.

Created homes that we would be proud to live in ourselves.

Live with us. Work with us.
