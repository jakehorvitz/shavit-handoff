# Shavit Website — 7/14 Revision (bones pipeline, Stage 1 requirements)

Source: 7/14 Google Meet transcript + Jake's supplementary notes. Where they
conflict, the transcript wins (Jake's instruction). Supersedes parts of 7/13.

## BUGS (Shavit demoed live)
1. **Homepage photo-flash on load.** A listing photo flashes before the "Shavit
   Rootman" logo intro appears. ROOT CAUSE: `LogoIntro` (intro.jsx) is client-only
   (returns null in SSR), so the prerendered hero paints first, then the curtain
   mounts after hydration. FIX: bake a first-paint cover into the static HTML that
   the intro script removes once it takes over. (Jake's longer-term plan: a house
   montage intro — separate content task.)
2. **Nav "two dots."** `.nav__wordmark::before/::after` draw two corner squares that
   look like edit handles. Shavit: "seems like you're trying to edit the page."
   REMOVE both pseudo-elements.
3. **Nav CTA goes nowhere.** "Reach" links to `/#reach` and doesn't navigate.
   Resolved by the Contact Us change below (becomes a mailto).

## NAV / MENU
- Top-right CTA = **"Contact Us"** only (not Inquire, not Reach). Label already
  changed 7/13; now also make it a **mailto:chargerpropertymanagement@gmail.com**
  (drafts an email). Decision was Shavit's: "let's do contact us."
- **Menu restructure:**
  - **Available Units** → subcategory by state: Michigan / Ohio / Indiana.
    ("Units" unifies apartments + houses.)
  - **Deal Case Studies** → per state, 3 each (content later from Shavit).
  - **Live with us. Learn about us.** — replaces "Meet Shavit / Work With Me."
    NOT "work with us" (no hiring on the site; hiring stays on social).
  - **Contact Us** (mailto).
- **Meet section → "Meet our Founder"**: small photo, one sentence, socials. Keep
  it minimal (Shavit: photo too big; "I want it small").

## HERO
- **Remove the "Available Now / Coming Up" eyebrow** (the slash text). Shavit: "I
  don't know why this text is here at all... remove this one entirely."
- **Round the card/hero corners** ("a little round, a little less rigid").
  NOTE: Jake's notes say "less round" — transcript says MORE round / less rigid;
  following the transcript per Jake.
- **Headline "Every home we have. One place." is wrong** (it is not every home).
  Shavit deferred a replacement, keep-and-kill 7 options later. Placeholder for now.

## LISTINGS — new card format (consistency > exact figures, per Shavit)
Order on each card, top to bottom:
1. **Status / availability at TOP** — `Available <Month Year>` / `Coming Soon` /
   `Lease Signed` (so it is seen immediately).
2. **Address + unit** — e.g. `34 Budlong St, Unit A`. Abbreviate St/Ave.
3. **Unit type** — `Apartment` or `Single Family` (34 Budlong is an Apartment, not
   single-family; fix these).
4. **Beds and baths, prominent** — spelled boutique with a mid-dot:
   `Three bedrooms · one bathroom`. This goes ABOVE the descriptive line.
5. **Square footage** — its own field, for every unit (Shavit provides; do NOT
   pull from Zillow).
6. **Descriptive subtext** — the "near downtown Hillsdale, everything new inside"
   line, demoted below the specs.
7. **City at bottom** — `Hillsdale, Michigan` (state = section header; city per card).
- **Remove** the "Text for rent & move-in" line entirely.
- **Buttons:** `View Photos` (gallery, only if photos exist) / `Contact Us`
  (mailto gmail) / `Apply` (to Zillow; Eli monitors Zillow). Replaces the old
  SMS "Text About This Home" CTA.
- **Lease Signed overlay:** diagonal "Lease Signed" stamp across the photo of taken
  units (still shown, clearly unavailable).
- **Illustration disclaimer:** for units using a previous-project photo (no shoot
  yet), a small star + "Picture is for illustration only, from our previous
  projects." (legal — avoids misrepresentation).
- **Per-state header:** `Hillsdale, Michigan` (drop "and nearby communities").
- **Remove the carousel** when a state has few/no units (just render the cards).
  Stylistic — Jake's discretion.

## PORTFOLIO PRUNE — only Shavit's texted units survive
Shavit: "you have exposed my entire portfolio... I don't like that at all. How
about I just tell you what's available." Everything NOT in his text is taken, so
remove it. From the transcript, the confirmed set:

### Michigan (Hillsdale)
- **34 Budlong St, Unit A** — Apartment — 3 bd / 1 ba — AVAILABLE — real photos.
- **The Trio -> three separate units:** 33 Barry St / 11 Ludlam St / 115 Oak St —
  Apartments — all 1 bd / 1 ba EXCEPT one that is 2 bd / 1 ba — AVAILABLE —
  illustration photo + star (no shoot yet). [WHICH ONE is 2/1? = Shavit's text]
- **43 Howder St, Unit A** — Apartment — 3 bd / 1 ba — LEASE SIGNED — real photos.
- **43 Howder St, Unit B** — Apartment — 1 bd / 1 ba — LEASE SIGNED — real photos.
- **15 E St Joe, Unit A** — Apartment — LEASE SIGNED.
- **15 E St Joe, Unit B** — Apartment — 2 bd / 1.5 ba (one of the two) — LEASE SIGNED.
- **60 S Norwood** — Single Family — 3 bd / 2 ba — LEASE SIGNED. (Transcript first
  said "coming soon," then corrected to taken/lease-signed, using LEASE SIGNED.)
- REMOVE everything else (34 Mead, 61 Salem, 46 W South, 12 River, 15 Waldron,
  17 Lo Presto, and the already-removed org-chart dump).

### Ohio
- Nothing available, nothing coming soon, out-of-stock message. Done 7/13.
- Buckingham -> Deal Case Study #1 (content later).

### Indiana (South Bend)
- **1114 Cedar St** — Single Family — COMING SOON — Shavit has photo + bed/bath +
  sqft. ("11 Cedar" in transcript = 1114 Cedar.) 7/13 said "Niles" — treat as
  South Bend, IN unless Shavit's text says otherwise.
- **1902 E Ewing** — COMING SOON.
- These two ONLY. Remove 2217 Parkview + others.

## Q&A (ReachSection / FAQ)
- Split into **Tenants Q&A** and **Investors Q&A** (two separate groups). Keep
  low profile. Actual questions come from Shavit's text — do NOT invent them.

## SCOPE (Jake 7/14: "fix everything listed and said", incl. prequal + email)
- **Prequalification IS in scope.** Before Contact Us / Apply fires, ask credit
  ("What is your credit score?") + stable income. If credit < 560 or no stable
  income → show a polite "you do not meet the criteria right now" message and do
  NOT open the email. Only a pass opens the draft.
- **Email flow = open the mail app** (mailto) to
  chargerpropertymanagement@gmail.com. No backend form / no per-person business
  inboxes this cycle (Eli has none yet). Real form-to-Eli deferred.
- **Apply → Zillow:** RESEARCH the real Zillow URLs per address during build
  (Jake: "find the zillow urls"). Fallback to a Zillow search/profile link where
  a unit is not publicly listed.
- **Deal Case Studies:** build the section shell + menu entry; CONTENT (stories +
  ROI/NOI) lands later from Shavit.

## TEXT SCAN RESULTS (iMessage w/ Shavit, Jul 12–14) — what the texts actually gave
The granular specs are VERBAL (from the call), NOT in the texts. Texts confirmed:
- **1902 E Ewing Ave, South Bend, IN 46613** — Coming Soon (zip confirmed).
- **115 Oak St, Hillsdale, MI 49242** — Coming Soon (zip confirmed). Real interior
  photos + captions sent ("open floor concept, recessed lighting, mini-splits";
  "white cabinetry, butcher block, stainless, tile backsplash"; "floating vanity,
  new black fixtures, tub-to-ceiling tile").
- MI active-project list (Shavit's words): 115 Oak, 33 Barry, 11 Ludlam, 43 Howder,
  60 S Norwood, 15 E Saint Joe. (Spelling is "Ludlam".)
- **1114 Cedar — Shavit's photo caption says "Niles, MI" (9 photos)**, but the 7/14
  transcript says "Indiana." CONFLICT — flag for Jake. Default to Niles, MI (his own
  file label) unless he says otherwise. Do NOT invent a zip.
- Ohio: "Nothing available / Nothing coming soon." Confirmed.

## STILL MISSING (placeholder in staging, Jake fills before the promote gate)
- Square footage per unit, availability dates, which Trio unit is 2bd/1ba, exact
  per-unit photo availability. Build the fields now; fill real values pre-promote.

## BLOCKED ON JAKE / SHAVIT (needed to populate real listings)
1. **Shavit's TEXT** — the definitive per-unit list: exact bed/bath, square
   footage, availability dates, which Trio unit is 2/1, which units have real
   photos vs illustration, final lease-signed statuses. Jake has it; paste needed.
2. **Zillow application URLs** for the Apply button (per unit or one).
3. **Availability dates** (e.g. "Available September 2026").
