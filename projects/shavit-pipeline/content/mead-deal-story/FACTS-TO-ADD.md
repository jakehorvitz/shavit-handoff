# Facts to add — Mead Street deal case study (Instagram carousel caption)

**Copy rule (Jake, voice note 8/21 01:11, [[shavit-copy-is-shavits-words]]):** every
claim span in this caption is a Shavit sentence, verbatim, trimmed for length or with
a dollar figure, percentage or the house number removed. Each registry `value` below
is his own wording, so `verify` shows his sentence against his sentence.

The registry (`facts/*.yaml`) does not exist yet and is TTY-only. Run each block below
as `./shavit.sh fact add` in a terminal, answering the four prompts with the exact
strings given. Then:

    ./shavit.sh lint   mead-deal-story
    ./shavit.sh verify mead-deal-story        # TTY, confirm each span
    ./shavit.sh review mead-deal-story
    ./shavit.sh ship   mead-deal-story --date 2026-09-01   # only after Shavit's OK

## Source of truth

1. **Shavit's iMessage, 8/27/26 3:48 PM (CPM Onboarding Marketing Team GC).** Full
   verbatim text is fenced in
   `~/projects/shavit-rootman-website/docs/case-studies/mead-34/NOTES.md`; the line
   numbers below refer to that file. It is the same text the website case study at
   `/case-studies/34-mead/` is built from, so verbatim keeps post and site from
   contradicting each other.
2. **Shavit's iMessage, 8/30/26 9:52 AM (same GC)** — the caption he wrote and approved
   for the case-studies teaser reel ("You're good to go."). Source of
   `brand.casestudy.contents` and of the hashtag block, which is his verbatim.

No dollar figure, percentage or house number is carried into any value below even
though his text is built on them. Those stay on the website.

## Shared with the Mead story posts — add ONCE

`prop.mead.street`, `prop.mead.city`, `prop.mead.state` are already queued in
`content/mead-story-exterior/FACTS-TO-ADD.md`. Neither list has been run yet, so add
them once from either list; `fact add` refuses an id that already exists.

| # | id | value | source |
|---|---|---|---|
| 1 | `prop.mead.street` | `Mead Street` | NOTES.md L30 "34 Mead Street" (house number removed per no-digit-addresses) |
| 2 | `prop.mead.city` | `Hillsdale` | L31 "Hillsdale, Michigan" |
| 3 | `prop.mead.state` | `Michigan` | L31 "Hillsdale, Michigan" |

## New for this post

**Rev 3 (8/31):** `mead.strategy` ("A distressed home transformed...") is
**retired** and must not be added. Jake's spec note was "don't say distressed"; the caption now
opens on `mead.origin` instead. His one-liner stays on the website untouched.

| # | id | label | value (exact text as it appears in the caption) | source |
|---|---|---|---|---|
| 5 | `mead.origin` | Mead acquisition principle | `Some of our best opportunities begin with simply letting people know we are willing to help.` | L35, verbatim |
| 6 | `mead.mailer` | Mead acquisition channel | `After receiving one of our "We Buy Houses" mailers distributed throughout Hillsdale, the homeowner contacted us.` | L37 first sentence, verbatim |
| 7 | `mead.hardship` | Mead seller situation | `She was experiencing significant financial hardship, the home had deteriorated over many years, and its condition prevented her from obtaining homeowners insurance.` | L37 second sentence, verbatim. **See coach.md decision 1 — this is the one span to clear with Shavit before ship.** |
| 8 | `mead.opportunity` | Mead why-we-bought | `Rather than seeing a property beyond repair, we saw an opportunity to solve a difficult situation while preserving another home for the Hillsdale community.` | L39, verbatim |
| 9 | `mead.valueadd` | Mead competitive advantage | `Because we specialize in value-add investments, we were able to move quickly and purchase the home directly.` | L60 third sentence (his BUY step), verbatim |
| 10 | `mead.scope` | Mead renovation scope | `The renovation included structural and deferred maintenance repairs, new drywall throughout, new flooring, a completely renovated kitchen, an updated bathroom, new lighting and fixtures, interior and exterior paint, updated mechanical systems, and landscaping and exterior improvements.` | L62 bullet list, joined into one sentence in his order — the identical join the website shipped (NOTES.md "Edits made, all trim-level") |
| 11 | `mead.standard` | Mead build standard | `Rather than applying cosmetic upgrades, the goal was to create a durable, low-maintenance home that would perform well for years to come.` | L62 final sentence, verbatim |
| 4 | `mead.lesson.finishes` | Mead lessons learned 3 | `Standardizing materials and finishes improves efficiency while reducing future maintenance costs.` | Lessons Learned bullet 3, verbatim. **New in rev 3**, replaces the retired `mead.strategy`. |
| 12 | `mead.today` | Mead current status | `Today, the property is professionally managed, fully occupied, and provides quality housing for a local family.` | L41 second sentence, verbatim |
| 13 | `mead.goal` | Mead housing goal | `Our goal is not simply to renovate homes. It is to provide housing that tenants are proud to call home.` | L64 (monthly rent figure removed; his em dash split into two sentences, the same split the website shipped) |
| 14 | `mead.repeat` | Mead repeat step | `Capital returned through refinancing was reinvested into additional acquisitions, allowing us to continue expanding our portfolio while preserving quality housing throughout Hillsdale.` | L68, verbatim |
| 15 | `brand.casestudy.contents` | What a case study contains | `Beyond the finished renovation, the case study walks through how we found the opportunity, why we pursued it, the economics behind the investment, the renovation process, the timeline, and the lessons we learned along the way.` | Shavit's approved 8/30 9:52 AM teaser caption, verbatim except "each case study" -> "the case study" for agreement (this post is one study, his was the announcement) |

## The URL claim

The caption carries `[F:url:https://shavitrootman.com/case-studies/34-mead/]{ShavitRootman.com/case-studies}`.
`lint` skips url ids but then demands a non-empty `quote` in `claims.json`; paste this
supporting line into that claim before re-linting:

    Shavit's 8/30 teaser VO and caption send viewers to the case studies; the Mead study is live at /case-studies/34-mead/ (verified 200 on 8/31).

**BLOCKER, fix before this or the teaser goes out:** the URL Shavit says out loud in the
approved teaser is `ShavitRootman.com/casestudies` (no hyphen) and it **404s** today.
One line in `site/public/_redirects` fixes it:

    /casestudies /#case-studies 301

(While in that file: `/case-studies /#standard 301` also looks wrong — it sends the
plural landing route to the Standard section, not to `#case-studies`.)

## Notes for verify

- Photos for the carousel are Shavit's 8/27 7:06 PM dump, staged at
  `~/projects/shavit-rootman-website/docs/case-studies/mead-34/_drop/` (UNTRACKED).
  Befores are the 12/5/2025 CleanShots, afters are his 14 pro listing frames. All real
  photographs, no AI edits. The old 7/3 AI exterior stays BANNED.
- `50.jpeg` is a floor-plan graphic claiming square footage and room counts. His
  case-study copy never states specs, so it stays out of the carousel (Budlong rule).
- Building type is never named in his text (single family vs other). Do not guess it.
- **Shavit pre-approves everything before posting** (his 8/27 5:01 PM rule).

## Rev 11 (8/31) — the slide copy now comes from his 11:08 AM text

Source 3 for this post: **Shavit's iMessage, 8/31/26 11:08 AM, 1:1 with Jake** (not the GC).
A complete eight-slide rewrite plus six notes, opening "Absolutely. Below is exactly what I would
send Jake" — so it is his direction relaying assistant-drafted copy, **not his own writing** the
way the 8/27 text is. Every slide line in `_scripts/render_mead.py` is now his, trimmed to the
band. Nothing is composed.

**The caption (`post.md`) is unchanged.** His rewrite is headed "WEBSITE / CAROUSEL COPY" and does
not touch the Instagram caption, which is still built from his 8/27 text. The fifteen facts above
still stand exactly as queued.

### Four things his rewrite asks for that cannot ship as written

| # | Slide | What he wrote | Why it is held |
|---|---|---|---|
| A | 02 | seller "was dealing with significant **health challenges**" | **Contradicts** `mead.hardship` and the live website, which say "significant financial hardship" — his own 8/27 L37 wording. Different claims about a real person. Not a fact add; a question for him. |
| B | 03 | Mead was the **first** renovation where finishes were standardized portfolio-wide | No source anywhere. Would be the deck's best slide if true. Needs `fact add mead.standard.origin`. |
| C | 05, 06 | stainless appliances, dishwashers, white cabinetry, walk-in showers, black fixtures | Specs. His own note 2 ("remove copy that simply describes what the viewer can already see") excludes them, and the Budlong rule already kept `50.jpeg` out for this. Dropped, not queued. |
| D | 07 | rented to families **relocating from outside** the Hillsdale area | New tenant claim, no source. The queued fact says only "a local family". Needs `fact add`. |

A and D are the two to put to him. B is worth asking for because it is a genuinely good slide.
C needs nothing: dropping it follows his own instruction.

### One thing to confirm, not a fact

His slide 1 one-liner is **"A complete BRRRR renovation."**, which is now on the cover. It replaces
"A complete transformation using the BRRRR investment strategy.", the series formula that Kendall
and Clarendon both ship verbatim. The Mead cover therefore no longer matches its siblings. His
call, but he may not have realised the series used a fixed line.
