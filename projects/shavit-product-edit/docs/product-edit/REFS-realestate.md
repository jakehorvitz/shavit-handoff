# REFS — realestate lane
_shavitrootman.com "product edit" research · lane: **realestate** · researched 2026-08-15 (evening PT)_

## How this was done (read before trusting a row)
- Every URL below was opened this session with `curl` (desktop Chrome UA), `WebFetch`, or the Chrome extension. "Verified-open" says which. Where a page was bot-blocked for one method I say so and name the method that worked.
- **Awwwards.com was hard-down the whole session** (Varnish 503 on category pages, nginx 502 on every `/sites/<slug>` page, confirmed from three fetch paths incl. a real Chrome tab). So every Awwwards award claim below is triangulated from a *second* source that did open: the studio's own case-study page, the CSS Design Awards page, the FWA case page (returned 200 + correct title; FWA is client-rendered so no body text), or Awwwards' own X posts (dates decoded from tweet snowflake IDs). The Awwwards URL is still given so Jake can re-check when it's back.
- Tech notes ("Nuxt / Lenis / WebGL / Mux …") come from reading the served HTML, not from the studio's marketing. Where I list "webflow", "wp-content", "_next", "_nuxt" it's because those strings are literally in the source.
- I did **not** dismiss consent modals by "Accept" anywhere. On quadplex80.com I clicked "Reject All" (privacy-preserving) to walk the intro; on washingtonpost.com I left the terms modal up and read the article via page text.
- Two blogs cite the 111 W 57 penthouse site as `above-the-clouds.nyc`. **That hostname does not resolve** (ENOTFOUND). The live site is `quadplex80.com`. Rows say so.
- iOS-phone risk is my read against the 2026-07-21 crash constraint in CONTEXT.md (single giant graphics allocation ⇒ jetsam). "HIGH" = full-viewport WebGL / volumetric shaders / dozens of full-res decodes. "LOW" = transforms/opacity on small layers, static images, muted `playsinline` video.

Legend for the index: **V** = verified-open this session (method); **iOS** = phone risk.

---

## Index (19 refs, grouped)

| # | Reference | Maker | Yr | Award / where found | Core technique | V | iOS |
|---|---|---|---|---|---|---|---|
| 1 | Quadplex 80 "Above the Clouds" — https://quadplex80.com/ | Outpost (for Sotheby's Dev. Marketing) | 2025 | Awwwards SOTD + Developer Award 2025-05-15, CSSDA SOTD, FWA SOTD — via https://outpost.design/work/above-the-clouds/ | Scroll-driven WebGL cloud fly-through → tower reveal; sound gate; interactive floor plans / cross-sections | yes (curl 200; Chrome walkthrough) | HIGH |
| 2 | 111 West 57th — https://111w57.com/ | Outpost | 2024–25 | Awwwards HM, FWA SOTD (https://thefwa.com/cases/111-west-57th-street 200), Webby nominee — via https://outpost.design/work/111-west-57th-street/ | Nuxt + Lenis + WebGL image planes; Mux mp4 loops; offset editorial grid | yes (curl 200) | MED |
| 3 | ERA — https://era.estate/ | Vide Infra | 2025 | Awwwards SOTD + Dev 2025-01-15 (X post 1879484171401249069), CSSDA WOTD, FWA — via https://videinfra.com/work/era | 5-layer WebGL glowing building silhouettes; WebGL 3D map; parametric apartment selector | yes (curl 200) | HIGH |
| 4 | Silver Pinewood Residences — https://silver-pinewood.com/ | Vide Infra | 2025 | Awwwards SOTD + Dev 2025-10-09 (X post 1976196672544797049), FWA case (https://thefwa.com/cases/silver-pinewood-residences 200) — via https://videinfra.com/work/silver-pinewood-residences | One WebGL 3D sculpture (glTF), "gentle scroll rhythm", pastel layered comps, apartment selector | yes (curl 200, 610 KB HTML) | MED–HIGH |
| 5 | Hubtown — https://hubtown.co.in/ | Unseen Studio (UK) | 2026 | Awwwards SOTD + Dev 2026-06-10; CSSDA WOTD 2026-06-14 https://www.cssdesignawards.com/sites/hubtown/49408/ (opened) | Nuxt + Sanity; 3D WebGL monolith hero with cursor-reveal | yes (curl 200) | HIGH |
| 6 | 25 Residences — https://25residences.com/ | Unseen Studio | 2024 | Awwwards SOTD 2024-08-26 (https://www.awwwards.com/sites/25-residences; via search snippet — Awwwards down) | WordPress + WebGL; typographic, 3D accents | yes (curl 200) | MED–HIGH |
| 7 | Explore Primland — https://explore.ownprimland.com/ | Outpost (+ Ingamana, R. Cenijn, R. Borghesi, arpeegee, M. Sochor) | 2026 | Awwwards SOTD + Dev Feb 2026; FWA SOTD + SOTM — via https://outpost.design/work/primland-explore/ , https://www.landing.love/sites/ownprimland/ | Three.js 3D terrain of a 12,000-acre estate; scroll/drag flythrough; hotspots; homesite selector; seasons; ambient sound | yes (curl 200) | HIGH |
| 8 | OH Architecture — https://www.oharchitecture.com.au/ | "SITE by MONOLOG" (dev Huy Nguyen) | 2025 | Awwwards SOTD 2025-04-28 + Dev Award (https://www.awwwards.com/sites/oh-architecture; inspiration pages …/inspiration/draggable-gallery-oh-architecture) | GSAP + Lenis + ScrollTrigger; horizontal works page; draggable gallery; huge real photography | yes (curl 200; WebFetch) | LOW–MED |
| 9 | dhk Architects — https://www.dhk.co.za/ | not credited on site (Webflow build) | 2025 | Awwwards SOTD 2025-06-24 (https://www.awwwards.com/sites/dhk-architects); FWA of the Day (https://thefwa.com/cases/dhk-architects 200) | Webflow + GSAP + ScrollTrigger + Lenis + Swiper + Vimeo; hero carousel; light/dark toggle | yes (curl 200; WebFetch) | LOW–MED |
| 10 | The Modern House — https://www.themodernhouse.com/ | in-house (Gibberd & Hill) | 2005→ current | Press: Guardian "shone like a beacon…", GQ, Esquire (see https://businessofhome.com/articles/part-publisher-part-real-estate-agency-meet-the-modern-house) | Magazine-style listing pages; prose + big photos; floorplan/EPC/map/brochure links | yes (WebFetch; curl gets Cloudflare 403) | LOW |
| 11 | Inigo — https://www.inigo.com/sales-list/aikwood-tower | Inigo (Modern House sister brand) | 2021→ | (no award; direct discovery) | Listing = "The Grand Tour / The Great Outdoors / Out and About / Setting the Scene" + Almanac stories; Next.js | yes (curl 200; WebFetch) | LOW |
| 12 | Aucoot — https://www.aucoot.com/property/the-old-rectory-cambridge/ | "Built by Six" | current | (no award; direct discovery) | 67-photo landscape+portrait carousel; Info / Full Details / Floorplan / Map / Brochure | yes (curl 200; WebFetch) | LOW |
| 13 | Kip Hideaways — https://www.kiphideaways.com/ | not credited (WordPress) | current | (no award; direct discovery) | "Spaces with soul." — curated stays; collections; photo-led | yes (curl 200) | LOW |
| 14 | Airbnb Luxe — https://www.airbnb.com/stays/luxury | Airbnb design | current | (Webby history for airbnb.com; direct discovery) | Product-page listing model: photo grid, amenities, sleeping arrangements, hosted copy | yes (curl 200; /luxury 302→/stays/luxury) | LOW |
| 15 | Studio McGee project page — https://www.studio-mcgee.com/projects/stoneford-cottage | Studio McGee (Next.js) | current | (no award; direct discovery) | 70+ full-bleed images, single/paired layout, one video, one-line intro | yes (curl 200 on /portfolio; WebFetch) | LOW–MED (image count) |
| 16 | Chris Loves Julia "Where we started and now" — https://chrislovesjulia.com/our-house-where-we-started-and-now/ | Chris & Julia Marcum | 2013, upd. 2024-08-09 | (no award; brief named "renovation storytellers") | Stacked before→after prose, room by room, first person | yes (Chrome; curl+WebFetch 403) | LOW |
| 17 | WaPo "Notre Dame cathedral before and after" — https://www.washingtonpost.com/world/interactive/2024/notre-dame-cathedral-before-and-after/ | Washington Post — design/dev Irfan Uraizee; Steckelberg, Timsit, Bellack | 2024-12-06 | (newsroom scrollytelling; direct discovery) | Full-bleed "scroll to continue" sequence, caption cards, damaged→restored comparisons | yes (Chrome; consent modal left up) | MED |
| 18 | JuxtaposeJS — https://juxtapose.knightlab.com/ | Knight Lab, Northwestern | current | (open-source tool; direct) | Draggable before/after slider, iframe or JS embed, "works normally on iOS" | yes (curl 200; WebFetch) | LOW |
| 19 | Belong — https://belonghome.com/ | in-house (Next.js) | current | (no award; brief named "PM companies") | "Property Management Made Loveable"; video testimonials; ratings wall | yes (curl 200; WebFetch) | LOW |

Also opened but **not recommended** as references (why): The OWO Residences https://theowo.london/ (Craft CMS, Vimeo hero, form-heavy — conventional); Chelsea Barracks https://www.chelseabarracks.com/ (Vimeo hero, brochure site); The Perigon Miami Beach https://theperigonmiamibeach.com/ (Next.js + Swiper + Vimeo, "Inquire" form — polished but generic); One Domino Square https://www.onedominosquare.com/ (thin); Olson Kundig https://olsonkundig.com/ ("built by Civilization", WordPress, very heavy); BIG https://big.dk/ ; Snøhetta; Kelly Wearstler; Plum Guide; Welcome Beyond. Blocked and not verifiable: The Set NYC, Zillow Showcase (px-captcha), Sweeten, onefinestay, Norm Architects (bot check), Land-book & Siteinspire category pages (Cloudflare / Vercel checkpoint), Godly (no real-estate filter exists).

---

## Detail cards

### 1 · Quadplex 80 / "Above the Clouds" — quadplex80.com — Outpost — 2025
- **What it does with the property:** A single penthouse (80th–83rd fl of 111 W 57) gets its own site. Loader (0→100%) then a choice: "Enter experience" / "Enter without sound". Then a scroll-driven WebGL fly-through — the camera rises through volumetric clouds and only after ~40 scroll-ticks does the tower's tip break the cloud line (I watched it: pure sky+cloud for a long time, tower appears as a sliver, then grows). Then: interactive floor plans and cross-sections, "window" vistas, gallery, ambient audio (music + wind), Mux-hosted mp4 for interiors. Copy is one line: "Rise above the hustle and bustle of the city and escape to your private sanctuary in the clouds."
- **Technique:** Nuxt SSR; WebGL clouds (shader), scroll = timeline scrub; sound toggle bottom-left; progress dot; `stream.mux.com/.../high.mp4` loops. Awwwards also gave it "Mobile Excellence", so a phone path exists — but it's a *rendered* phone path.
- **Why it's great:** It's the current ceiling of pacing. One idea per screen, and it makes you *wait* for the product. Sound is opt-in, not forced.
- **Translate to a $900–1,500 Midwest rental?** The *pacing* and *sound-optional gate* translate. The clouds do not — a volumetric fly-through toward a Hillsdale duplex reads as parody and is dishonest about what the product is. Also the single worst iOS-memory pattern we could pick.
- **iOS:** HIGH — full-viewport WebGL + large cloud textures is exactly a "one giant graphics allocation".

### 2 · 111 West 57th — 111w57.com — Outpost — 2024–25
- **Property treatment:** Tower brochure: hero video loop, offset editorial grid of interiors, "Residences" with availability, amenities, Studio Sofield interiors credit, Teodor serif + Neue Haas Grotesk.
- **Technique:** Nuxt; **Lenis** smooth scroll (in source); WebGL for image transitions; four muted/looped/`playsinline` Mux mp4s. "Site by Outpost" in footer.
- **Why great:** Restraint. Big type + big photos + slow reveals; nothing gimmicky.
- **Translate:** Yes — the offset grid, the serif/grotesk pairing logic, muted `playsinline` loops of *real* footage (we already own `hero.mp4`) all translate. The "Availability" table concept maps to "Available Now / Coming 2026" (and only that).
- **iOS:** MED — Lenis is fine on phones (or disable <768); WebGL image planes should be dropped on phones; keep video posters small.

### 3 · ERA — era.estate — Vide Infra — 2025
- **Property treatment:** Residential complex; five layers of animated 3D building silhouettes glow to the tagline "The Dawn of a New Era"; WebGL 3D map with landmarks; visual apartment selector; light trails; parallax galleries.
- **Technique:** WebGL (custom), Astro/Next fragments in source, Vimeo, "Website by Vide Infra".
- **Why great:** The 3D *map of the neighbourhood* is the one idea here that's about place, not just building.
- **Translate:** A hand-drawn or SVG neighbourhood map (Hillsdale College, downtown, the park) with 3–5 hotspots is honest and useful for tenants; a WebGL city model is not.
- **iOS:** HIGH.

### 4 · Silver Pinewood Residences — silver-pinewood.com — Vide Infra — 2025
- **Property treatment:** "Quiet luxury": pastel palette, layered compositions "echoing the architectural geometry", one WebGL 3D sculpture from the lobby as a metaphor object, interactive map, microanimations, apartment selector; explicit "optimized mobile version".
- **Technique:** Next.js, WebGL (glTF/basis in source), Barba-style transitions.
- **Why great:** Proves you can be award-tier with ONE 3D object and calm scroll — not a whole scene.
- **Translate:** The "one hero object" idea → for us it's the *house itself* photographed on a clean field, or a single detail (the porch, the new kitchen). Pastel-calm rhythm fits "quality-focused manager" better than dark-mode drama.
- **iOS:** MED–HIGH as built (WebGL); the *layout* language is LOW.

### 5 · Hubtown — hubtown.co.in — Unseen Studio — 2026
- **Property treatment:** Corporate developer site: dark reflective landscape, glowing 3D monolith hero, cursor reveals detail in geometry/lighting, scroll storytelling of a 40-year portfolio.
- **Technique:** Nuxt + Sanity CMS; WebGL; CSSDA judges' score 8.00 (UI 8.00 / UX 8.04 / Innovation 7.97).
- **Why great:** Cinematic *institutional* credibility from motion alone.
- **Translate:** Wrong register (institutional, dark, abstract). Useful only as proof that "trust" can be built with motion, not with claims.
- **iOS:** HIGH.

### 6 · 25 Residences — 25residences.com — Unseen Studio — 2024
- **Property treatment:** Mumbai luxury; typographic, animation, WebGL accents; "40+ amenities".
- **Technique:** WordPress front with WebGL layer.
- **Why great:** Shows a WordPress site can still take SOTD — stack isn't the barrier.
- **Translate:** Not much beyond that lesson.
- **iOS:** MED–HIGH.

### 7 · Explore Primland — explore.ownprimland.com — Outpost et al. — 2026
- **Property treatment:** Sells *land and homesites*: a Three.js replica of a 12,000-acre estate built from Hart Howerton's models + geo-data; scroll/drag flythrough; hotspots (pool & fitness, stable saloon, residences); homesite selector; season switch; ambient birdsong/fog/clouds; sized for showroom screens and tablets. Lead-gen via Spark CRM (we would not).
- **Technique:** Nuxt; Three.js terrain, low-poly foliage; WYSIWYG lighting tools.
- **Why great:** Best "place before product" storytelling in the set.
- **Translate:** The *idea* — show the neighbourhood before the house — translates as a slow real-drone/real-photo sequence of the street/town, not 3D terrain.
- **iOS:** HIGH.

### 8 · OH Architecture — oharchitecture.com.au — MONOLOG — 2025  ★
- **Property treatment:** Brisbane residential architects. Hero = one landscape photo (Myrtle Pool House), no headline noise. Works page scrolls **horizontally**; galleries are **draggable**; menu is a full-screen overlay; project cards carry year + status ("Under Construction"). Footer: "SITE by MONOLOG".
- **Technique:** GSAP + ScrollTrigger + Lenis (all in source), craft-ish CMS, Vimeo. Draggable gallery built by Huy Nguyen (per Awwwards inspiration page).
- **Why great:** Award-tier feel from photography + easing + typography — **no WebGL**. Exactly our budget class.
- **Translate:** Directly. A horizontal, draggable room-by-room gallery of 1919 Kendall; a hero that is one honest photo. Desktop gets GSAP/Lenis; phone gets native `scroll-snap-type: x mandatory` (no JS, no compositing risk).
- **iOS:** LOW–MED (transforms/opacity only; ship phone fallback as CSS scroll-snap).

### 9 · dhk Architects — dhk.co.za — (Webflow; agency uncredited) — 2025
- **Property treatment:** Cape Town studio; hero photo carousel with one tagline; card grid with year; 60+ award badges incl. FWA/Awwwards; light/dark toggle.
- **Technique:** Webflow + GSAP + ScrollTrigger + Lenis + Swiper + Vimeo.
- **Why great:** Confident, fast, "normal" architecture site that still took SOTD + FWA in one week.
- **Translate:** The award/trust wall idea → for us: "responsive maintenance", "renovated 2024", real dates, real photos — never invented numbers.
- **iOS:** LOW–MED.

### 10 · The Modern House — themodernhouse.com — in-house — 2005→
- **Property treatment:** Listing as magazine feature: hero photo with title/price/tenure, ~4–5 hero images + "MORE PHOTOS", flowing prose about heritage/light/materials, floorplan/EPC/map/brochure links, related homes. Sections Prime/New/Featured/Past Sales.
- **Technique:** Plain, fast, image-first (Cloudflare-fronted). No animation library visible.
- **Why great:** Proof that *writing + photography* is the product; the site's reputation ("rewriting the rulebook on estate agency") comes from voice, not tech.
- **Translate:** Highest signal for us. A tenant-facing house page written like a person wrote it (CONTEXT rule 5) with 12–20 great photos will out-perform any effect. Honest at any rent level.
- **iOS:** LOW.

### 11 · Inigo — inigo.com — Modern House sister brand — 2021→  ★
- **Property treatment:** Each listing is a chaptered story: **"The Grand Tour"** (room by room), **"The Great Outdoors"**, **"Out and About"** (area, transport, schools), **"Setting the Scene"** (history), tabs for floorplan/map/EPC/brochure, phone + "Request viewing", Almanac stories carousel.
- **Technique:** Next.js; simple gallery; no heavy motion.
- **Why great:** The best *content architecture* for a single house on the web right now.
- **Translate:** Rename and reuse: The Tour · Outside · Around Hillsdale · The Story (rehab). SMS CTA replaces "Request viewing". Zero dishonesty risk.
- **iOS:** LOW.

### 12 · Aucoot — aucoot.com — Built by Six — current
- **Property treatment:** 67+ photo carousel mixing landscape (1620×1080) and portrait (880×1320) frames; Info / Full Details / Floorplan / Map / Brochure; phone + "Arrange Viewing".
- **Technique:** WordPress; lightweight carousel.
- **Why great:** Mixed-orientation photography handled gracefully; "homes with character" positioning.
- **Translate:** Directly (our photo sets are mixed-orientation too). Lesson: paginate — never decode 67 full-res images at once on a phone.
- **iOS:** LOW (if lazy-loaded).

### 13 · Kip Hideaways — kiphideaways.com — WordPress — current
- **Property treatment:** "Spaces with soul." Stays as curated objects; collections (dog-friendly, treehouses…); casual copy.
- **Why great:** Warmth without luxury signalling — closest hospitality *tone* to a Midwest rental brand.
- **Translate:** Tone yes; booking machinery no.
- **iOS:** LOW.

### 14 · Airbnb Luxe — airbnb.com/stays/luxury — Airbnb — current
- **Property treatment:** Listing-as-product-page: 5-photo hero grid → "What this place offers" → sleeping arrangements → hosted description ("Designed by Oller & Pejic Architecture…" appears in source) → map.
- **Why great:** The most-tested house page on earth; every tenant already knows how to read it.
- **Translate:** Its *information order* is the safe default under any cinematic skin.
- **iOS:** LOW.

### 15 · Studio McGee project pages — studio-mcgee.com/projects/stoneford-cottage — Studio McGee — current
- **Property treatment:** One-line intro ("A timeless home inspired by the English countryside…") then ~70 full-bleed images, single and paired; one embedded video; no room captions, no before/after on the page.
- **Why great:** Renovation storytelling by *sequence and pairing* alone.
- **Translate:** Pairing logic yes; 70 images no (memory). For 1919 Kendall: ~15 pairs, captioned by room, real before/after.
- **iOS:** LOW–MED (image count is the risk, not effects).

### 16 · Chris Loves Julia — "Our House: Where we Started and Now" — 2013 (updated 2024-08-09)
- **Property treatment:** First-person, room-by-room, "here's what it looked like when we moved in… here's how it looks now", with what was done and cost mentions; the current "Before & Now" series continues the format.
- **Why great:** The voice — an owner talking, not a brand. This is the register CONTEXT rule 5 wants ("from Jake, not Claude").
- **Translate:** Directly (as a writing model, not a design model).
- **iOS:** LOW.

### 17 · Washington Post — "Notre Dame cathedral before and after the restoration" — 2024-12-06  ★
- **Property treatment:** A building's rehab told as scrollytelling: full-bleed photo (fire) → "Scroll to continue" → title card → a sequence of restored elements (roof, spire, bells, "forest" of beams, organ, floor…) each as a caption card over a full-bleed image/graphic; damaged→restored comparisons; credits block ("Design and development by Irfan Uraizee").
- **Technique:** Sticky full-bleed media with scroll-advanced caption cards; light 3D/graphics.
- **Why great:** The best *pacing model* for "this house was rough → here is what was fixed", and it's a **restoration**, which is our exact story type.
- **Translate:** Directly for the 1919 Kendall case study: 6–8 chapters (roof, kitchen, floors, bath, exterior…), each = one before photo, one after photo, one human sentence. Desktop: pinned crossfade/wipe. Phone: plain stacked pairs.
- **iOS:** MED as WaPo built it (sticky full-bleed sequences); LOW if each media element is ≤ viewport and decoded lazily.

### 18 · JuxtaposeJS — juxtapose.knightlab.com — Knight Lab (Northwestern) — current
- **What:** Draggable before/after slider (labels, start position), iframe or JS embed, open-source on GitHub; page states it "works normally on iOS devices"; examples from ESPN, Boston Globe.
- **Why great:** Zero-dependency-class before/after that journalists have shipped for a decade.
- **Translate:** The phone-safe before/after mechanic (two `<img>` + clip). Roll our own in ~60 lines rather than importing; keep it.
- **iOS:** LOW.

### 19 · Belong — belonghome.com — in-house — current
- **What:** "Property Management Made Loveable" — app video, resident/homeowner video testimonials, ratings wall (Google 4.7, Trustpilot 4.9, BBB A+), "Rent Payment Guarantee", city list.
- **Why included:** The brief asked for PM companies that punch above their weight. Honest finding: **no property-management site in 2023–26 is award-tier**; Belong is the most designed, and it's a SaaS-style page, not cinematic. The closest "PM-adjacent" award-tier work is branded rental buildings and design-led estate agents (rows 10–12).
- **Translate:** Its trust ladder (real ratings, real testimonials) is the tenant-confidence content we'd want under the cinematic layer — but only with real numbers we actually have.
- **iOS:** LOW.

---

## What "aspirational vs. out of place / dishonest" looks like for a $900–1,500/mo Midwest rental
- **Aspirational and honest:** one-photo hero; slow, muted, real footage (`hero.mp4`); Inigo-style chapters; draggable room gallery; before/after of the actual rehab; a simple neighbourhood map with 3–5 real landmarks; sound only if it's real ambient (rain on the porch) and opt-in; floor plan reveal drawn from a real measured plan.
- **Out of place / dishonest:** volumetric clouds, 3D monoliths, terrain flythroughs, "sanctuary" copy, "Enter experience" loaders, dark-mode drama, ambient score, renders instead of photos, amenity walls, apartment selectors implying inventory we won't enumerate (CONTEXT rule 4).

## Top 3 for this site
1. **Inigo listing architecture (row 11) + The Modern House voice (row 10) + Aucoot mixed-orientation gallery (row 12)** — the *content model*: The Tour · Outside · Around Hillsdale · The Story, 12–20 real photos, one human paragraph per chapter, SMS CTA. This is the part that makes tenants trust us; it costs nothing on iOS and cannot be dishonest.
2. **OH Architecture by MONOLOG (row 8)** — the *motion vocabulary*: GSAP + Lenis on desktop, horizontal draggable room gallery, one honest hero photo, big type. It proves award-tier without WebGL, which is the only class of effect that fits an 8 GB dev box, Netlify static, and the phone-crash constraint (phone gets CSS scroll-snap, no JS motion — consistent with the shipped "strip everything on ≤767px" rule).
3. **WaPo Notre-Dame scroll sequence (row 17) + JuxtaposeJS mechanic (row 18)** — the *before/after* for the 1919 Kendall rehab: 6–8 pinned chapters on desktop (before→after crossfade/wipe, one sentence each), plain stacked pairs or a two-image clip slider on phone. Two images per chapter, sized to viewport, lazy-decoded → small composited layers, no full-viewport filters.

North star for **pacing and sound etiquette** only: Quadplex 80 (row 1) — make the visitor wait one beat for the house, keep sound opt-in — while explicitly *not* borrowing its rendering approach.

## Assumptions / gaps
- Awwwards outage means SOTD dates for rows 1, 6, 8, 9 rest on the studio page / search snippet / inspiration pages rather than the Awwwards page itself; rows 3, 4, 5, 7 have a second independent confirmation (X post, CSSDA, FWA, studio page).
- Agency for dhk (row 9) is not credited on the site; Webflow build confirmed from source.
- I did not open Awwwards' "Elyse Residence" HM, "VILLA – 3D IMMERSIVE PROPERTY" nominee, "ARETÈ IMMOBILIARE" or "Fort Vega" (surfaced only in search snippets, no second source, Awwwards down) — worth a look when it's back.
- Zillow Showcase / Matterport-style interactive floor plans belong to the technique lane; not covered here beyond noting Zillow's pages were captcha-blocked.
