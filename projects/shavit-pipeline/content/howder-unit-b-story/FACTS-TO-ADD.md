# Facts to add — Howder Unit B story (Instagram, target post date 2026-08-25)

**Copy rule (Jake, voice note 8/21):** every claim span is a Shavit sentence, verbatim,
trim only. All values below are his exact words from the iMessage thread. Full source
text with row ids:
`~/projects/shavit-rootman-website/docs/tasks/sources/howder-imessage-story-sources-2026-08-24.txt`

**Brief for this post (Shavit, 8/24 10:14 PM, r139112):**
"We can post Howder Unit B tomorrow, but it needs to be telling the story of the unit."

The registry (`facts/*.yaml`) is TTY-only. Run each block below as
`./shavit.sh fact add` in a terminal and answer the prompts with these exact strings.
Then:

    ./shavit.sh lint   howder-unit-b-story
    ./shavit.sh verify howder-unit-b-story      # TTY, confirm each span
    ./shavit.sh review howder-unit-b-story
    ./shavit.sh ship   howder-unit-b-story --date 2026-08-25   # only on explicit go

Lint-forced trims already applied to his wording (confirm at verify):
- "43" dropped everywhere (no-house-numbers rule; matches his own 7/14 naming
  instruction "Howder Street / Hillsdale, Michigan", r134032).
- "MI" spelled out as "Michigan" (full-states rule; also his own 7/14 wording).
- Em dashes removed per Jake 8/25: facts 6 and 9 below carry a period and a
  comma where his 7/15 text had em dashes. Wording otherwise untouched.

## Fact blocks

1. id: howder.unitb-done
   label: Unit B completion news
   value: Howder Unit B is done.
   source: Shavit iMessage 08/24/26 (r139112 "Howder Unit B" + r139096 "second unit is done", spliced; confirm wording)

2. id: prop.howder.street
   label: Howder street name
   value: Howder Street
   source: Shavit iMessage 07/14/26 2:05 PM (r134032)

3. id: prop.howder.city
   label: Howder city
   value: Hillsdale
   source: Shavit iMessage 07/14/26 2:05 PM (r134032)

4. id: prop.howder.state
   label: Howder state
   value: Michigan
   source: Shavit iMessage 07/14/26 2:05 PM (r134032)

5. id: howder.condition
   label: Condition at purchase
   value: When we purchased this duplex, both units were occupied and in very poor condition.
   source: Shavit iMessage 07/15/26 7:13 AM (r134081)

6. id: howder.empathy
   label: Empathy line
   value: Navigating that situation required more than construction. It required empathy.
   source: Shavit iMessage 07/15/26 7:13 AM (r134081)

7. id: howder.demo
   label: Demolition discovery
   value: Once demolition started, we quickly discovered years of deferred maintenance and temporary repairs hidden behind the walls. Instead of adding another bandage, we rebuilt it the right way.
   source: Shavit iMessage 07/15/26 7:13 AM (r134081)

8. id: howder.college
   label: Hillsdale College proximity
   value: Located just 0.4 miles from Hillsdale College, we believed this property should reflect the quality and pride of its neighborhood.
   source: Shavit iMessage 07/15/26 7:13 AM (r134081)

9. id: howder.scope
   label: Renovation scope
   value: Nearly every component of the building was replaced or renovated, from the roof and major systems to the kitchens, bathrooms, flooring, trim, paint, and landscaping.
   source: Shavit iMessage 07/15/26 7:13 AM (r134081)

10. id: howder.units
    label: Finished unit mix
    value: Today, the property offers a beautifully renovated 3-bedroom, 2-bath unit and a 1-bedroom, 1-bath unit, built to the standard every family deserves.
    source: Shavit iMessage 07/15/26 7:13 AM (r134081)

11. id: howder.closer
    label: Closer line
    value: One family. One building. One neighborhood at a time.
    source: Shavit iMessage 07/15/26 7:13 AM (r134081)

## Notes for verify

- Unit B is the 1-bedroom, 1-bath unit (~500 sqft): site properties.js `howder-b`
  entry, sourced to Shavit's 7/16 email section 2. Consistent with fact 10.
- The hashtag block at the end of post.md is Shavit's own 7/15 list (r134082) and he
  said it goes in the FIRST COMMENT, not the caption. Post caption through the CPM
  sign-off; paste the hashtag block as the first comment.
- Photos: the finished Unit B set is already live on the site gallery
  (site/public/assets/properties/howder-b/01-09 + the regraded MLS set in
  ~/projects/shavit-pipeline/photos/43-howder-unit2/). Pick 4-6 for the carousel per
  the playbook (hook image first, after shot second to last).
- RETIRED by rev 15: the r12 slide-language confirms (a)-(d) covered composed
  spec captions ("Open floor concept", kitchen plate copy, "Glass shower, tiled
  to the ceiling", cover unit-mix sub). All of that copy is OFF the deck.
- rev 15 slide copy (Shavit iMessage 8/25 12:44 PM, after the call where he
  rejected photo-transcription copy): every line1 and sub on all nine slides is
  his 12:44 text VERBATIM - the slides need no composed-language confirms; his
  message is the source. Three splices to confirm at verify: his em dashes on
  slides 01, 03, 07 became commas (standing no-em-dash rule, same treatment as
  his 7/15 text). Load-bearing claims inside his copy Shavit should own at
  verify: "Very few rental properties in Hillsdale provide air conditioning"
  (market claim), "high-efficiency mini-split systems", "Every CPM renovation
  follows the same design standard", "500-square-foot" (consistent with fact
  12), and "CPM" as the brand abbreviation on slide 06.

12. id: howder.unitb-sqft
    label: Unit B size
    value: roughly 500 square feet
    source: Shavit 7/16 email section 2 (via site properties.js howder-b sqft: 500)

13. RETIRED by rev 15. Do not add. The close slide no longer says "Fully leased
    and professionally managed." - it carries Shavit's 12:44 closer verbatim
    ("More than a renovation." + commitment lines + "Live with us. Work with
    us."). Was: id howder.leased-managed, composed r13 from the Clarendon close
    pattern.

14. RETIRED 8/25 (AC moved to its own post, content/howder-ac-story). Do not add.
    Was: id: howder.ac
    label: Air conditioning
    value: The unit also has air conditioning.
    source: Shavit iMessage 08/25/26 11:34 AM ("I would also like the air-conditioning to be
      features..."), trimmed; Hillsdale clause removed per Jake 8/25. Ducted supply
      vent visible in his laundry pro shot (site howder-b/05.jpg) backs it. On slide 5 and in
      the caption after the unit-mix sentence.

15. id: howder.everyroom  (+ howder.ac-desc for the slide-8 subs)
    See content/howder-ac-story/FACTS-TO-ADD.md blocks 1-2 - the same two facts
    back the deck's slide 8 and the caption's AC line. Add them ONCE in the TTY
    pass; they cover both posts. (The r16 "AC is out" note is superseded by r17.)
    rev 15 update: the deck slide-8 WORDING is now Shavit's 12:44 AC text
    verbatim (see the rev 15 note above), superseding the descriptive r6 copy;
    howder.everyroom still backs the caption line "Every room, air conditioned."

16. id: howder.deck-copy-0825
    label: rev 15 slide copy source
    value: Nine-slide deck text, slides 01/09 through 09/09, as sent.
    source: Shavit iMessage 08/25/26 12:44 PM (full breakdown, sent after the
      call where he asked for competitive-advantage storytelling instead of
      photo transcription). Em dashes on 01/03/07 rendered as commas; confirm.
