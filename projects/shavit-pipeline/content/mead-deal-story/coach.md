# Coach — Mead Street deal case study (Instagram carousel, rev 1 · 2026-08-31)

## What "the previous post" actually is, and why it decides this one

Jake asked for the language of the previous post. There are two, and they do different
jobs, so this draft takes something different from each.

**The previous post on the account** is Shavit's own case-studies teaser, the reel he
approved at 8/30 9:52 AM with "You're good to go." His caption ends:

> "We are excited to introduce our next case study, featuring our Mead Street project
> in Hillsdale, Michigan."

So this is not a new format. It is the **promised delivery** of a post he already
announced, which sets the register: no contractions, no em dashes, no exclamation, no
emoji, first person plural, one idea per paragraph, and a stated reason to care before
any detail. It also supplies two things this caption reuses verbatim: his sentence about
what a case study contains, and his ten-tag hashtag block.

**The previous case-study post** is the Clarendon Road carousel, and it supplies the
skeleton: one-liner, then street and city and state on its own line, then how it was
acquired and why, then scope, then what it is now, then the hold or repeat beat, then
"Live with us. Work with us.", then tags. Slot for slot, this caption is the same shape.
Templated formats win (brand rule 10), and a reader who saw Clarendon should recognize
this instantly as the same series.

## Strategy against the playbook

**Brand specialist, not designer.** His 8/28 9:00 PM correction is the standard now:
"it is not about we fix what other people don't see, it is about we do what others
cannot," and his reason was operational, not aesthetic: "we just have better funding,
operations, on site management, and Renters pipeline to be able to execute projects
that other people will pass on." The caption therefore never describes the photographs.
The photos carry the transformation; the copy carries the advantage. The advantage beat
is his own sentence from the BUY step, moved up into paragraph three:

> "Because we specialize in value-add investments, we were able to move quickly and
> purchase the home directly."

That is the same claim as "we do what others cannot," stated with a fact instead of a
slogan. Which matters, because he **rejected the slogan** as a caption line on 8/28
9:18 PM ("Nope! Negative for both") after Jake proposed WE INVEST WHERE OTHERS WALK
AWAY and WE DO WHAT OTHERS CANNOT. Do not put either on a slide or in this caption.

**The first 125 characters.** His one-liner is 111 characters, so the whole positioning
statement sits above the "...more" fold and nothing is truncated mid-thought. That is
also exactly what Clarendon did.

**The hook is the acquisition, not the renovation.** Every operator in Hillsdale posts a
finished kitchen. Almost none can say a homeowner called them because of a mailer. His
L35 line, "Some of our best opportunities begin with simply letting people know we are
willing to help," is the most differentiated sentence in the entire case study, and it
does double duty: it reads as character to a tenant or seller and as deal flow to a
lender or partner. It leads the body.

**The numbers stay on the website.** Acquisition, renovation spend, ARV, equity, rent,
cap rate and ROI are all barred by the no-dollar rule and by uncited-numeral. The
caption does not gesture at them vaguely either. It names them as a reason to click
using his own inventory sentence ("the economics behind the investment"), which is
better than a number would be: the number satisfies curiosity, the promise of the
number moves traffic to the case study he just spent a reel announcing.

**Facts, not emotion.** Every adjective is his. The house is the villain ("distressed",
"deteriorated", "beyond repair"); Hillsdale never is, and in fact appears three times as
the beneficiary. Brand rule 2 holds.

**Cadence.** This is the week's rock. Shavit flagged on 8/28 that daily stories had gone
"too trivial. The same as always," and agreed with Jake that the account does not have
the volume for daily. One substantial post, no filler stories around it.

## Decisions for Jake, in priority order

### 1. The seller's hardship paragraph — clear this with Shavit before ship

`mead.hardship` is his verbatim sentence and it is already published on the website:
"She was experiencing significant financial hardship, the home had deteriorated over
many years, and its condition prevented her from obtaining homeowners insurance."

It stays in the draft because it is his authored copy, it is anonymous, and it is the
load-bearing setup for "solve a difficult situation." But a case study page read by a
few hundred people is not a local Instagram feed in the town where she lives, and
Hillsdale is small. Brand rule 3 says de-identify. Ask him directly rather than
softening his words unilaterally.

rewrite: de-identified swap, still his words
Replace `mead.hardship` with his own alternate phrasing of the same beat from the BUY
step (NOTES.md L60), which carries the situation without the personal detail:

    ...the homeowner contacted us seeking a solution for a property that had become
    difficult to maintain.

rewrite: keep the hardship, drop the most identifying clause
Trim to the first clause only, which is a pure trim and needs no new wording:

    She was experiencing significant financial hardship, and the home had deteriorated
    over many years.

### 2. "provides quality housing for a local family"

His words, describing the actual tenancy, not an ideal tenant, which is what keeps it on
the right side of fair housing. It is on the website for the same reason. If anyone
raises it, the fallback is "provides quality housing in Hillsdale," but that is a change
to his sentence and needs his OK.

### 3. #HillsdaleMI versus brand rule 4

The hashtag block is his, verbatim, from the approved 8/30 caption, and it contains
`#HillsdaleMI`. Brand rule 4 says spell out Michigan. The tag passes lint (no word
boundary before the MI) and the Howder post shipped the same tag, so the draft keeps his
block intact rather than editing a caption he approved.

rewrite: if the rule is to be enforced everywhere
Swap one tag, leave the other nine:

    #HillsdaleMichigan

### 4. The link line

    Read it at ShavitRootman.com/case-studies.

Nine words, and the only composed sentence in the caption. Everything before it is his.
Flagged so it is a conscious choice and not a drift.

**This is also a blocker.** The URL he says out loud in the approved teaser,
`ShavitRootman.com/casestudies`, returns 404 today. One line in
`site/public/_redirects` fixes it, and it should ship before either post goes out:

    /casestudies /#case-studies 301

## Carousel plan (visual build is a separate step)

Per the standing carousel rules: cover exterior, then the before collage on slide 2,
then split before-and-after frames per room, then the finished beats, closing on the
exterior. The Mead set already has three wired before-and-after pairs (front exterior,
rear deck, bedroom) plus ten afters in tour order. Slide lines, when they get written,
come from the same registry and get their own coach pass. `50.jpeg`, the floor plan,
stays out: it claims square footage his copy never states.

## Ship gate

Shavit pre-approves everything (his 8/27 5:01 PM rule). Order of operations: registry
`fact add` in a TTY, lint, verify, review, send him the rendered caption plus the slide
set, then `ship` on his yes.

---

# Rev 2 addendum (2026-08-31) — the slides, and what checking the frames turned up

Jake asked to see the draft post with the photos. Section 5 of the spec now renders all ten
slides against the real frames. Three things came out of actually opening every file rather than
trusting the filenames.

## 1. There is no BEFORE for the kitchen or the bathroom

Only five before frames exist, all December 5 CleanShots: the attic room, a close-up of its
failed ceiling, the paneled stairwell, the front exterior, and the rear deck. That is the entire
set.

So the two strongest afters in the house are stuck as after-only slides, which the standing
carousel rule flags as reading like a miss. His copy names both explicitly ("a completely
renovated kitchen, an updated bathroom"), so cutting them is not an option either.

**Ask Shavit for two frames: a December kitchen and a December bathroom.** If they exist, slides
6 and 7 become split pairs and the deck gets materially stronger. This is the same lesson the
Clarendon carousel produced, which was to ask for original befores up front.

## 2. after-01.jpg is the same frame as exterior-after.jpg

Same angle, same day, effectively the same file. The cover and the close both want the exterior,
and the rule says close on the exterior even when it repeats, but it has to be a visibly
different crop. Do not let both of these into the deck as if they were two photographs.

## 3. The deck-after boards read weathered

The website slider caption calls it "a fresh deck". At that crop the photograph does not support
it, and on a split before-and-after slide the eye lands on the decking first.

rewrite: crop the deck slide up
Frame the after on the new french doors and railings rather than the deck surface, and let the
line carry the durability claim:

    Rather than applying cosmetic upgrades, the goal was to create a durable, low-maintenance
    home.

If ten slides is tight, the deck pair is the one to cut. The exterior and the upstairs room carry
the transformation on their own, and neither has this problem.

## Slide lines

All ten are his sentences or fragments of them, drawn from the same registry ids the caption
uses. They are proposed, not approved. Neither rejected slogan is eligible. His best sentence,
`mead.goal`, sits on slide 9 over the entry door, which is the one frame in the set showing the
thing a tenant actually walks through.

---

# Rev 3 (2026-08-31) — Jake's four spec annotations, and the register found in the texts

## The finding that drove the rewrite

Jake's note on slides 7 to 10 was "scan texts and see how the language was in the last case study
post." Shavit wrote that slide set himself, 8/3, for Kendall:

    Slide 1   EVERY HOME HAS A SECOND CHANCE.
              1919 Kendall Street. South Bend, Indiana.

    Slide 4   QUALITY IS BUILT LONG BEFORE THE FINISHES.
              The best renovations are not measured by what you can see.
              They are measured by what will never become a problem later.

    Slide 10  ONE HOME. ONE FAMILY. ONE NEIGHBORHOOD AT A TIME.
              Proudly revitalizing South Bend's 46613 and 46614.
              LIVE WITH US. WORK WITH US.

**The form:** an uppercase line stating a principle, then one or two plain sentences that explain
it. Specifics appear as bare fragments underneath ("Electrical. Plumbing. HVAC.") but they are
never the point. Not one of his ten slides describes its own photograph.

The Kendall lines themselves are not reusable. He rejected reused slide lines outright on 8/28
("Nope! Negative for both"). Only slide 10 repeats, because the closing triple, the "Proudly
revitalizing" line and "Live with us. Work with us." are standing brand elements.

## What each note changed

**"Don't say distressed say something else."** Gone from the caption and every slide.
`mead.strategy` is retired. The caption now opens on his L35 line, which is 92 characters and
therefore still clears the 125-character fold:

    Some of our best opportunities begin with simply letting people know we are willing to help.

That is a better hook anyway. The old opener named the category; this one names the
differentiator. His one-liner stays on the website untouched, so nothing contradicts.

**"2 should be like Using x y z and we were able to create blah blah."** Slide 2, the before
collage, is now built from his own 8/28 sentence rather than from a description:

    IT WAS NEVER HARD TO SEE.
    Anyone could see what this house had become.
    Funding, operations, on-site management and a renters pipeline are what let us take it on
    when others passed.

**"3 is too obvious leverage more."** It was a paint-and-landscaping list, which is the exact
photo-transcription failure. Now:

    CONDITION HAD PUT IT PAST WHAT MOST BUYERS WILL TOUCH.
    The home had deteriorated over many years. Its condition had made it uninsurable.

The uninsurable fact is the specific, non-obvious thing that explains why other buyers walked,
and it moves the sentence off the seller and onto the house, which also softens decision 1.

**"What does structural and deferred maintenance tell you about the homes."** Slide 4 answers
instead of listing, with the specifics demoted to fragments the way Kendall slide 3 does:

    DEFERRED MAINTENANCE IS A BILL SOMEONE POSTPONED.
    Structural repairs. New drywall. New flooring.
    We paid it in full so no one has to pay it again.

**"Fix that please."** Done, see below.

## One new fact

`mead.lesson.finishes`, his Lessons Learned bullet 3, verbatim: "Standardizing materials and
finishes improves efficiency while reducing future maintenance costs." It carries slide 7 and now
sits in the caption too. It is the most operator-grade sentence in the whole case study and it
explains why the bathroom looks like the other units, which reads as a system rather than a
coincidence.

## The redirect, fixed

`site/public/_redirects` now reads:

    /casestudies /#case-studies 301
    /case-studies /#case-studies 301

The second line was `/case-studies /#standard 301`, and `#standard` does not exist anywhere in
`site/src`. The only real anchor is `id="case-studies"` at `tenant-pages.jsx:537`, so that
redirect was landing people nowhere. Both are fixed in the repo. **Not deployed:**
`site/dist/_redirects` is stale (8/30), so the site needs a rebuild and Jake's go before
`netlify deploy --prod`.

---

# Rev 4 (2026-08-31) — the header rule, derived from what Jake kept

Jake kept all four headers on slides 7 to 10 and cut all six before them. That split is the most
useful piece of feedback in the whole thread, because it defines the rule.

## What he cut, and why each one failed

| cut | fault |
|---|---|
| THE OWNER CALLED US FIRST. | past tense, narrates this one deal |
| IT WAS NEVER HARD TO SEE. | past tense, defensive in shape |
| CONDITION HAD PUT IT PAST WHAT MOST BUYERS WILL TOUCH. | past perfect, **compares us to other buyers** |
| DEFERRED MAINTENANCE IS A BILL SOMEONE POSTPONED. | metaphor being clever |
| COSMETIC WORK WOULD HAVE BEEN CHEAPER. | conditional, defensive |
| A KITCHEN IS WHERE A RENTAL STOPS FEELING LIKE ONE. | aphorism, and "rental" diminishes the home |

## What he kept

    STANDARD FINISHES ARE A MAINTENANCE STRATEGY.
    THE HOUSE IS NOT THE PRODUCT.
    TODAY A LOCAL FAMILY LIVES HERE.
    ONE HOME. ONE FAMILY. ONE NEIGHBORHOOD AT A TIME.

All four are present-tense statements of standing philosophy. So are **ten out of ten** of
Shavit's own Kendall headers. Not one of his narrates that deal. Not one compares to another
buyer.

## The rule

    present tense, always
    a standing principle, never the story of this deal
    no comparison to other buyers        (Porsche rule, brand rule 11)
    no metaphor, no aphorism, no cleverness
    the deal narrative belongs in the subline, where it is welcome

Worth flagging: three of the six cut lines were carrying a competitor comparison, which is a
brand-rule violation independent of taste. They came from Shavit's own 8/28 message to Jake
("other people will pass on"). **A private explanation is not a public slide line.** That is the
trap to remember, because his text felt like source material and it reads as source material, but
publishing it breaks the Porsche rule.

## The six rebuilt

    01  BEING REACHABLE IS PART OF THE WORK.
        Some of our best opportunities begin with simply letting people know we are willing to help.

    02  CAPACITY IS WHAT MAKES A PROJECT POSSIBLE.
        Funding. Operations. On-site management. A renters pipeline.
        A house in this condition needs all four before it needs a contractor.

    03  CONDITION IS A STARTING POINT, NOT A VERDICT.
        The home had deteriorated over many years. Its condition had made it uninsurable.

    04  DEFERRED MAINTENANCE COMPOUNDS.
        Structural repairs. New drywall. New flooring.
        Years of postponed work are settled once, so they are never inherited again.

    05  WE BUILD FOR THE TENTH YEAR, NOT THE FIRST.
        Rather than applying cosmetic upgrades, the goal was to create a durable, low-maintenance
        home that would perform well for years to come.

    06  THE KITCHEN SETS THE STANDARD FOR THE HOUSE.
        A completely renovated kitchen. New lighting and fixtures. Updated mechanical systems.

Slide 2 keeps Jake's "using x, y, z" structure and Shavit's four capabilities, but drops the
"when others passed" clause. Slides 7 to 10 are untouched.

---

# Rev 5 (2026-08-31) — eight slides

Three notes at 10:10, all applied.

**"Take out first header I liked the BRRR strategy maybe even put that back as the header."**
Slide 1 now carries his L32 one-liner as the header, trimmed only to drop "distressed":

    A HOME TRANSFORMED INTO A PROFESSIONALLY MANAGED FAMILY RENTAL THROUGH THE BRRRR INVESTMENT STRATEGY.
    Mead Street. Hillsdale, Michigan.

This is consistent rather than an exception to the header rule: the cover is the one slide that
carries the one-liner instead of a principle, and Clarendon shipped exactly that way (Jake picked
Shavit's docx one-liner over the alternate cover).

**"don't like 2."** Reheaded to `WE BUY HOMES IN THIS CONDITION.` — present tense, states what we
do rather than what others do not, and it still carries the four capabilities as fragments
underneath. Alternate on the slide if this one misses: `THIS IS WHAT WE TAKE ON.`

**"don't like 3 maybe even remove it entirely."** Removed.

**"I like 5 but pick a different image."** Header kept verbatim. Image swapped from `deck-after`
to `after-06`, which is the same french doors seen from inside, so the weathered decking flagged
in rev 2 is out of frame and the slide no longer contradicts itself.

**"take out 8."** Removed, and its image is not recycled elsewhere.

**"replace image 9."** Swapped to `after-05`, the bright kitchen and living view, which is the
warmest frame in the set and the one that actually supports "a local family lives here". The entry
shot it was using moves to the closer.

**"end with 10."** Confirmed. The entry shot lands there, which is an exterior at a visibly
different crop from the cover, so the deck still closes on the exterior the way the standing rule
wants.

## The one cost, flagged in the spec

Cutting the exterior split leaves **one** true before-and-after pair, the upstairs room. Before
and after proof is the reason this format works for his audience. The collage on slide 2 still
holds the front before and slide 1 is the finished exterior, so the transformation is legible
across two slides. But if that reads thin, the one-line fix is to restore the exterior split with
a fresh header rather than run a deck with a single pair.

## Still unconfirmed

Headers on slides 3 and 5 (`DEFERRED MAINTENANCE COMPOUNDS.`, `THE KITCHEN SETS THE STANDARD FOR
THE HOUSE.`). Jake singled out only slide 5 of that group as liked, so these two have not had a
yes. They are marked on the spec.

---

# Rev 6 (2026-08-31) — slide 1 matches the series

Jake: "you need like Mead Street, look at the first slides for the other studies."

Checked both. On Kendall and Clarendon the **property name is the headline**, and the one-liner is
a short formulaic subline that barely moves between studies:

    Kendall Street                     A complete transformation using the BRRRR
    South Bend, Indiana                investment strategy.                        (61 chars)

    Clarendon Road                     A complete multifamily transformation using
    Cleveland Heights, Ohio            the BRRRR investment strategy.              (74 chars)

Rev 5 got two things wrong. The one-liner ran **100 characters** against their 61 and 74, so it
swamped the card, and it pushed the street name onto a second line where nobody reads it. Shavit's
long Mead sentence works on a web hero with room to breathe. It does not work as carousel type.

    MEAD STREET
    Hillsdale, Michigan
    A complete transformation using the BRRRR investment strategy.
    SHAVIT ROOTMAN

**On the copy rule:** "A complete transformation using the BRRRR investment strategy" is not a
rewrite of his words. It is the **series formula**, already shipped verbatim on both Kendall and
Clarendon, which makes it a standing brand element in the same class as "Live with us. Work with
us." and "Proudly revitalizing <City>, <State>." His longer Mead sentence stays on the website
hero untouched, so the post and the site do not contradict each other.

This also settles the ordering question from rev 5. The shipped Clarendon carousel led with the
one-liner and put the street second, but that only reads because the one-liner is short. With the
property name promoted, the cover matches the site heroes and the carousel at the same time.

---

# Rev 7 (2026-08-31) — rendered

Eight slides at 1080 x 1350 via `docs/reel-specs/_scripts/render_mead.py`, adapted from the
Clarendon renderer, which itself came from the shipped Kendall deck. Bone band, SF headline, DM
Sans subline, brass progress rule, index chip, gold mark: nothing in the treatment changed.

Output in `docs/reel-specs/mead-ig-2026-08-31/final/`, send-ready copy at
`~/Desktop/Shavit - Mead Carousel/` with CAPTION.txt and a MASTER pdf.

## Three things only the render could show

**The cover was too loose.** The house sat in the top third over a foreground of driveway and
sidewalk, and the series one-liner wrapped so "strategy." orphaned onto its own line. Now zoomed
1.16 and biased up and right, with the one-liner set as two balanced centred lines.

**Slide 3 did not read as one room.** Centred crops gave a cluttered before and a clean empty
after with no shared landmark, so the eye could not match them and the whole point of a split
frame was lost. Both halves are now biased onto the feature they share: the sloped ceiling meeting
the knee wall, window in frame. It reads as a pair now.

**Slide 7 was a second kitchen.** The frame picked on paper turned out to be dominated by a
stainless fridge at the right edge. It duplicated slide 5 and read cold under "today a local
family lives here". Swapped for the bright upstairs room.

This is the argument for rendering before approving. All three were invisible in the written spec
and obvious in the image.

## One open pick

Slide 7 has three candidates, all rendered and on the Desktop: the bright upstairs room in the
deck now, the living space with depth through to the next room (`07a`, which is the image from the
slide Jake cut, reused as an image rather than as a slide), and a flat-walled room that is the most
visually distinct but the plainest (`07b`).

## Not yet done

- Registry: fifteen `fact add` blocks, TTY, then lint, verify, review.
- Shavit's approval on the whole deck plus caption, his 8/27 standing rule.
- The kitchen and bathroom still have no December before, so slides 5 and 6 stay after-only.
- The `/casestudies` redirect is fixed in the repo but `site/dist` is stale, so it is undeployed.

---

# Rev 8 (2026-08-31) — the post itself

Jake: "make the actual post but put it in the spec." Section 4 is now the post as it lands in the
feed, not its parts.

Real feed chrome around the eight rendered slides: profile row, 4:5 media, swipe arrows, dot row,
action bar, likes line, and the caption truncated exactly where Instagram truncates it with a
working "more". Arrows, the dots and the left and right keys all move the carousel.

Handle is **@shavitness**, which is the account the live site links to in `CONTACT.instagram` and
in the schema `sameAs`, so the mock is not inventing one.

Verified in the browser rather than assumed: eight slides in the track, the counter and dots track
the index, prev is disabled on slide 1, next advances, and the caption expands from collapsed to
775px with all nine remaining paragraphs and all ten hashtags.

The caption breakdown that used to be section 4 is still there as section 5, span by span with the
registry ids, since that is what `verify` walks through.
