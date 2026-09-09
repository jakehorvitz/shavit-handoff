# Deliverable 6 — No-camera content playbook

**The whole premise:** make operator-credible content with **no camera** and with
**Shavit never on screen.** You don't film — you *assemble* from photos he already
has plus typography. This file is the repeatable system.

---

## The production model

- **Unit of production = one deal → its photos → its numbers.** That's it.
- **Shavit's only job:** forward you a folder of phone photos + the deal figures, once per property. He records nothing.
- **Your job:** animate one still (Higgsfield) → caption + text in CapCut → post.
- **Credibility without a face** comes from **specifics** — real address, real number, real before/after. Vague + faceless = ignored. Specific + faceless = credible.
- **Keep motion boring.** Slow push-ins, subtle parallax. Flashy AI motion reads as fake and kills the operator trust you're buying.

---

## The only thing to ask Shavit (copy-paste this)

> Hey Shavit — for the content I just need two things per property, whenever you
> have a sec, no recording required:
> 1. **Photos** — anything off your phone: before/during/after of the rehab,
>    finished rooms, the exterior. Even old contractor pics work.
> 2. **The numbers** you're comfortable showing — purchase, rehab spend, rent/ARV.
>
> Drop them in a shared Google Drive folder by property and I'll handle the rest.
> Bonus: if you're ever standing in a unit, point your phone and take 10 sec of
> video of a room — not "content," just raw clips. That's all I need.

- **If he'll do nothing else:** the photos alone unlock 4 of the 5 formats below.
- **If he'll do the 10-second clips:** that's your only real "b-roll," and it's gold.

---

## The toolchain (all free or cheap)

- **Higgsfield** — image-to-video; animates his stills into motion (per the spec)
- **CapCut** — captions, text beats, sequencing, music (free)
- **Canva** — carousels + typography posts (free)
- **Google Earth / Street View** — "footage" for Market Walks, no camera (free)
- **ElevenLabs** *(optional)* — AI voiceover if you ever want narration

---

## The 5 formats

Each format below has: **what it is · assets needed · the Higgsfield prompt ·
CapCut build · caption skeleton + UTM.** Captions point to the bio link
(`shavitrootman.com/links`) whose buttons are already UTM-tagged. When you *can*
place a real link (Stories link sticker, YouTube description), use the UTM string
shown so the Lead Log `campaign`/`utm_content` columns line up with GA4.

> UTM convention reference: [`../analytics/UTM-conventions.md`](../analytics/UTM-conventions.md)

---

### 1. Numbers Without Hype  ·  *easiest, highest-trust*
- **What:** one animated photo + the deal's real math on screen. No camera, no face.
- **Assets:** 1 strong still (finished room or exterior) + purchase / rehab / rent.
- **Higgsfield prompt:**
  > *Slow cinematic push-in on a residential interior, subtle parallax, gentle drift, natural window light, no people, photoreal, 4–6 seconds, steady and understated.*
- **CapCut build:** clip in → 3 text beats (hook → 3 numbers appear one by one → CTA) → quiet music low.
- **Caption skeleton:**
  > Out-of-state doesn't mean out of control. Real numbers from a {market} buy — no hype, no projections. Openings + how I operate in bio.
- **CTA / link:** "Openings in bio" → `/links`  ·  `utm_campaign=awareness&utm_content=numbers_{market}_{yyyy}_{mm}`

### 2. Before / During / After  ·  *strongest proof, can't be faked*
- **What:** the rehab arc of ONE house, 3 stills sequenced (reel) or 5-slide carousel.
- **Assets:** a before, a during/demo, an after — same room or same exterior angle.
- **Higgsfield prompt** (run on each still, same motion so they cut together):
  > *Slow push-in, locked framing, subtle depth parallax, consistent motion across all shots, natural light, no people, photoreal, 4 seconds each.*
- **CapCut build:** 3 clips back to back → label each BEFORE / DURING / AFTER → hard cuts on the beat.
- **Caption skeleton:**
  > Same room, 90 days apart. Bought direct, rehabbed in-house — {market}. This is the work, not a flip reel.
- **CTA / link:** "How I operate → bio"  ·  `utm_campaign=awareness&utm_content=bda_{market}_{yyyy}_{mm}`

### 3. Operator Notes  ·  *trust without a face*
- **What:** one lesson, 20 seconds. Text-on-screen "notes" style OR AI/your voiceover.
- **Assets:** none required (text-only) — or one calm photo background.
- **Higgsfield prompt** (only if using a photo bg):
  > *Almost imperceptible slow drift across a still property photo, moody natural light, no people, photoreal, 6 seconds.*
- **CapCut build:** black bg or photo → white text scrolls slowly → no music or soft pad. (Optional ElevenLabs VO.)
- **Caption skeleton:**
  > The mistake everyone makes buying out-of-state 👇 One thing I learned running {n} doors across MI · OH · IN.
- **CTA / link:** soft — "More on the Substack, link in bio"  ·  `utm_campaign=substack&utm_content=note_{topic}_{yyyy}_{mm}`

### 4. Market Walks  ·  *zero camera, genuinely strong*
- **What:** "walk" a street and give the thesis — built from Google Street View.
- **Assets:** none — screen-record Street View / Google Earth of the block.
- **Higgsfield prompt** (optional, to animate a single street still instead):
  > *Slow dolly forward down a residential street, subtle parallax, overcast daylight, no people, documentary feel, 5 seconds.*
- **CapCut build:** screen-recording → speed to ~1.5× → text captions calling out what you see → map graphic intro.
- **Caption skeleton:**
  > Why I buy on this block and not the next one over — {neighborhood}, {market}. The boring fundamentals nobody films.
- **CTA / link:** "Selling here? Talk direct — bio"  ·  `utm_campaign=owners&utm_content=walk_{market}_{yyyy}_{mm}`

### 5. Openings Spotlight  ·  *the only time the house is the star*
- **What:** one available unit, 10-second walkthrough feel, "available now."
- **Assets:** the listing/unit photos he already has.
- **Higgsfield prompt:**
  > *Smooth slow pan across a bright residential room, gentle push-in on a key feature, natural light, no people, real-estate walkthrough feel, 5–8 seconds.*
- **CapCut build:** 2–3 animated room stills → text: location, beds/baths, "available now" → upbeat-but-calm music.
- **Caption skeleton:**
  > Open now in {market}: {n}BR, {feature}. We manage in-house, so you deal with the operator — not a call center. Details in bio.
- **CTA / link:** "Tenant info in bio" → `/links`  ·  `utm_campaign=openings&utm_content=spotlight_{market}_{yyyy}_{mm}`
  - **Email the inquiry lands on:** `rentals+{market}@shavitrootman.com` → fires `email_click` (the key event).

---

## Posting cadence (the floor)

- **2 reels + 1 carousel per week** — the floor, not the ceiling.
- **Hit it ≥80% of weeks** (90-day target #1).
- **Rotate markets** — don't post Hillsdale three times running; spread MI · OH · IN.
- **1 YouTube long-form / month** — recut your best reels + a Deal Debrief.
- **Batch it:** when a property folder arrives, make 3–4 posts from it at once.

## How this ties back to the analytics

- Every caption drives to **`/links`** (already UTM-tagged buttons) or a UTM'd deep link.
- Tenant interest → `rentals+{market}@` → **`email_click`** (key event).
- Seller interest → Market Walk / owners CTA → `#contact?utm_campaign=owners` → **`owners_page_view`** → `owners@`.
- Log every inbound in the **Lead Log** with the matching `campaign` / `utm_content`.
- Read it all monthly in **Looker Studio** against the **90-day targets**.

→ Starter schedule: [`4-week-starter-calendar.csv`](4-week-starter-calendar.csv)
