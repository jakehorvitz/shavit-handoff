# Facts to add — Clarendon Road (Instagram carousel + Facebook post)

**Copy rule (Jake, voice note 8/21 01:11):** every claim span in both posts is a
Shavit sentence or phrase, verbatim from docx 2, trimmed for length or with a
dollar figure, percentage or the house number removed. So each registry `value`
below is the docx wording itself; `verify` will show his sentence against his
sentence.

The registry (`facts/*.yaml`) does not exist yet and is TTY-only. Run each block
below as `./shavit.sh fact add` in a terminal and answer the four prompts with
the exact strings given (id, label, value, source). Then:

    ./shavit.sh lint   clarendon-deal-story
    ./shavit.sh verify clarendon-deal-story      # TTY, confirm each span
    ./shavit.sh review clarendon-deal-story
    ./shavit.sh lint   clarendon-triplex-fb
    ./shavit.sh verify clarendon-triplex-fb
    ./shavit.sh review clarendon-triplex-fb
    ./shavit.sh ship   clarendon-deal-story --date 2026-08-23   # only on explicit go
    ./shavit.sh ship   clarendon-triplex-fb  --date 2026-08-24

Source of truth for every value: Shavit's second case-study docx, 8/20 21:08,
text at `~/projects/shavit-rootman-website/docs/tasks/sources/clarendon-docx-2-rd-case-study-0820-9pm.txt`
(line numbers below refer to that file). It SUPERSEDES memo 1. The memo-1 ids
used by rev 1 (`clarendon.origin`, `clarendon.vacancy`, `clarendon.result`) are
retired and must not be added: there is no phone-call story in docx 2.

No dollar figure, percentage, or house number is carried into any value below
even though the docx is built on them. Those stay on the website.

| # | id | label | value (exact docx text as it appears in the posts) | source (docx line) |
|---|---|---|---|---|
| 1 | `prop.clarendon.street` | Clarendon street name | `Clarendon Road` | L2 "3220 CLARENDON ROAD" (house number removed); L23, L43 "Clarendon Road" |
| 2 | `prop.clarendon.city` | Clarendon city | `Cleveland Heights` | L3 "Cleveland Heights, Ohio" |
| 3 | `prop.clarendon.state` | Clarendon state | `Ohio` | L3 "Cleveland Heights, Ohio" |
| 4 | `clarendon.strategy` | Clarendon one-liner | `A complete multifamily transformation using the BRRRR investment strategy.` | L4, verbatim |
| 5 | `clarendon.acquired` | Clarendon acquisition | `A vacant triplex in poor but inhabitable condition.` | L23 "We acquired 3220 Clarendon Road in late 2025 as a vacant triplex in poor but inhabitable condition." (head trimmed); L74 "Acquired: Late 2025" |
| 6 | `clarendon.location` | Clarendon location | `The opportunity was driven not only by the building itself, but by its location within Cleveland Heights and proximity to the medical, educational, and employment centers surrounding University Circle.` | L23 second sentence, verbatim |
| 7 | `clarendon.scope` | Clarendon renovation scope | `The work included updated kitchens and bathrooms, flooring, drywall and paint, lighting and fixtures, plumbing improvements, portions of the electrical system, mechanical improvements, select window replacement, common-area improvements, basement moisture treatment and finishing work, driveway repairs, landscaping, and porch improvements.` | L33, verbatim |
| 8 | `clarendon.scope.exterior` | Clarendon exterior scope | `The exterior was refreshed while preserving the existing character of the property. Landscaping, selective repairs, driveway patching, porch improvements, and general exterior cleanup improved the presentation of the building without unnecessary replacement of serviceable components.` | L48, verbatim |
| 9 | `clarendon.scope.common` | Clarendon common areas | `The common hallways and stairways received the same attention as the individual units.` | L56 first sentence, verbatim |
| 10 | `clarendon.leased` | Clarendon lease status | `Following renovation, the three units were leased.` | L36 "Following renovation, the three units were leased for a combined $4,975 per month, or $59,700 in annual gross rental income." (dollar figures removed); L76 "Leased / Stabilized: June 2026"; L78 "Fully leased, refinanced, and professionally managed" |
| 11 | `clarendon.tenants` | Clarendon tenant profile | `The property attracted tenants including medical residents relocating from outside the area.` | L37 first sentence, verbatim |
| 12 | `clarendon.hold` | Clarendon hold and refinance | `Rather than selling the property and realizing the value created as a one-time gain, we retained Clarendon Road as part of the long-term portfolio.` | L43 (house number removed); L44 "The returned capital can be redeployed into future acquisitions and renovations while Clarendon continues producing rental income and building equity over time."; L64 "Refinancing rather than selling" |
| 13 | `clarendon.impact` | Clarendon community impact | `Returned a vacant and underperforming multifamily property to productive use in Cleveland Heights.` | L67; also L68, L69, L70, L71, L72 (the six COMMUNITY IMPACT bullets, each used verbatim on the Facebook post) |

Notes for the TTY session
- `fact add` rejects an id that already exists; if any of these were seeded
  earlier under another value, skip it and reconcile by hand.
- Ids 8, 9, 13 are used by the Facebook post; 4 by the Instagram post; the
  rest by both.
- `clarendon.impact` covers six bullets. If you would rather have one id per
  bullet, split it as `clarendon.impact.1` … `.6` and re-tag the FB post.md.
- The docx timeline lists "Refinanced: May 2026" while the narrative says the
  refinance followed stabilization (June). Neither post gives the refi a month.
- L69 reads "relocating to Cleveland from outside the region" (his word,
  "Cleveland"); everywhere else the city is Cleveland Heights.
