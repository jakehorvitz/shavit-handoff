# REFS — awards lane (award-tier "cinematic product edit" sites, 2024–2026)

Researched 2026-08-15/16 by the `awards` lane. Method, honestly stated:

- **Discovery** — Awwwards *Sites of the Year* index, *E-commerce winners* index, *Architecture* tag
  (award-filtered), individual `/sites/<slug>` detail pages; Codrops (roundups ended Sept 2024,
  replaced by "Motion Highlights" — checked); CSS Design Awards WOTD gallery (mostly agency
  portfolios — nothing product-grade, none included); godly.website (now 301s to recent.design,
  which is client-rendered and returned nothing scrapeable); FWA (site is JS-only, `/awards/*`
  routes returned HTTP 500 — could not mine). Awwwards' own `/annual-awards-2025/*` pages 502'd
  the entire session, so category "of the Year" nominee lists come from the indexes above.
- **Verification** — every live URL was hit with `curl -L` (status + redirect target + library
  signatures) and the strongest 14 were opened in headless Chromium (Playwright, 1440×900),
  scrolled through 8 checkpoints while logging `position:sticky/fixed` elements, `<canvas>`
  contexts (2d / webgl2), `<video>` `currentTime`, and screenshotting each stop. "What happens
  as you scroll" below is from those logs + screenshots, not from memory. Where the awarded
  version is no longer what's live, it says so.
- **iOS-phone risk** is my read against CONTEXT.md constraint #1 (2 GB jetsam, one giant
  graphics allocation killed WebContent). Rule of thumb used: full-viewport WebGL canvas or
  full-viewport `filter`/`mix-blend` = **high**; full-bleed `<video>` = **med** (one decoded
  1080p frame + decoder is fine, *many* simultaneously is not); `<img>`/type/transform-only or
  small (<400 px) canvases = **low**.

Legend for the "verified-open?" column: **yes-browser** = opened & scrolled in Playwright;
**yes-curl** = HTTP 200 + HTML inspected; **moved/gone** = URL no longer serves the awarded work.

---

## A. Award-tier product edits (the core list)

### 1. Apple — AirPods Pro 3 (canonical benchmark)
- **URL:** https://www.apple.com/airpods-pro/  (also checked: /iphone-17-pro/, /macbook-pro/, /apple-watch-ultra-3/)
- **Maker:** Apple in-house · **Year:** 2025 page, live Aug 2026 · **Source:** brief-mandated canonical benchmark (not an award entry)
- **Verified-open:** yes-browser
- **What happens as you scroll (observed):** ~29,000 px page (≈32 viewports). Hero = full-bleed
  `<video>` (7.5 s loop, `preload="none"`, poster start/end frames). Each chapter is a
  `data-anim-scroll-group` (Welcome → Highlights → Product Viewer → Noise Control → Audio
  Performance → …). "Audio performance" is a `.sticky-container > .sticky-element` holding a
  `VideoScrub` component: the earbuds video sits pinned while scroll drives `currentTime`
  (logged paused at 4.9 s mid-scroll = scrubbed, not playing). "Take a closer look" is a
  `ProductViewer` in `data-mode='2d'` — short videos auto-*play* when they enter a scroll
  window (`data-inline-media-play-keyframe='{"start":"t - 65vh","end":"b - 25vh"}'`), plus a
  `.usdz` AR quick-look. Everything else is `StaggeredFadeIn`, `ParallaxImage`, `ScrollGallery`,
  `FadeGallery` (opacity/transform only).
- **Technique names (from Apple's own markup):** `VideoScrub`, `ProductViewer`, `ParallaxImage`,
  `StaggeredFadeIn`, `ScrollGallery`, `data-inline-media-play-keyframe`,
  `data-download-area-keyframe` (media is *fetched* only when its anchor is within ±100–150 vh),
  `data-inline-media-unload-at-end="true"` (iPhone page: media is **unloaded** after playing),
  `disabledWhen: "no-enhanced"` (whole effect disabled on low-capability clients),
  small/medium/large + `_2x` renditions per breakpoint.
- **Why it's great:** the reference everyone means by "product edit": one object, one story,
  scroll = time; nothing plays that isn't on screen; nothing stays loaded that isn't needed.
- **iOS-phone risk:** **low–med** — no canvas at all; the risk-management pattern (load window,
  unload-at-end, poster frames, disable-on-weak-devices) is exactly what we should copy.

### 2. Aether 1 — OFF+BRAND (SOTD 14 Aug 2025 · E-commerce Honors Jul 2025)
- **URL:** https://www.aether1.ai/ · **Award page:** https://www.awwwards.com/sites/aether-1
- **Maker:** OFF+BRAND (itsoffbrand.io) · **Year:** 2025 · **Verified-open:** yes-browser
- **What happens as you scroll:** scroll is hijacked (`html{overflow:hidden}`, virtual scroll,
  4,500 px of "story"). One `position:fixed` full-viewport **WebGL2 canvas** holds a real-time
  3D earbud; text chapters ("Sound Without Boundaries" → "Unrivalled audio quality" → "Crafted
  for pure clarity" → "Intuitive Controls") slide past on the left while the object rotates,
  re-poses and gets a light sweep per chapter (screenshot: single earbud, dark navy field, thin
  arc light). Webflow shell + custom app bundle on Vercel; an "Ask Aether" AI-chat pill.
- **Techniques:** fixed full-viewport WebGL object + scroll-driven camera/pose; virtual scroll;
  chapter text as the only DOM motion.
- **Why it's great:** cleanest 2025 example of "object stays, story scrolls."
- **iOS-phone risk:** **high** — full-viewport WebGL2 canvas + PBR textures is the exact
  allocation profile that killed us. Desktop-only, with a photo fallback, if ever.

### 3. Daylight Computer — basement studio (SOTD 18 Jun 2024 · E-commerce Honors)
- **URL:** https://daylightcomputer.com/ · **Award page:** https://www.awwwards.com/sites/daylight
- **Maker:** basement.studio · **Year:** 2024 (still live as awarded) · **Verified-open:** yes-browser
- **What happens as you scroll:** 18,850 px (≈21 viewports). Sticky hero (`sticky top-0
  hero-container`), then a series of `sticky top-0` full-height chapters; the "world's first
  full-speed paper-like display" chapter is a **pinned horizontal rail** — a landscape video
  card slides in from the right as you scroll *down* (screenshot 1). One 1404×864 **2D canvas**
  (drawn frames — an image sequence, not WebGL geometry) plus a tiny WebGL2 canvas; a
  `fixed inset-0 mix-blend-multiply` overlay (paper grain) sits over the whole page. Next.js.
- **Techniques:** pinned chapters, vertical-to-horizontal rail, canvas frame sequence,
  full-page blend-mode grain, video cards.
- **Why it's great:** warm, tactile "device as object" edit without a 3D engine.
- **iOS-phone risk:** **high as built** (full-viewport `mix-blend-multiply` overlay + full-size
  2D canvas), **med** if you drop the blend layer and cap the canvas at ~half-res.

### 4. Lando Norris — OFF+BRAND (Site of the Year 2025 · SOTD 17 Nov 2025)
- **URL:** https://landonorris.com/ · **Award page:** https://www.awwwards.com/sites/lando-norris
- **Maker:** OFF+BRAND · **Year:** 2025 · **Verified-open:** yes-browser
- **What happens as you scroll:** 13,578 px. Sticky hero (`sticky-item home-hero`) → a
  **horizontal pin** section (`is-horiz-scroll` / `horizontal-pin-sticky`) → more sticky
  chapters ("ON TRACK", "Porcelain / Japan", "World Drivers' Champion", partners). A
  `position:fixed` full-viewport **WebGL2 background** (`gl-background`) runs under everything;
  ~20 small **Rive** 2D canvases (badges, counters); a fixed `transition-w` layer for page
  transitions. Stack visible in the page: Webflow + **Lenis** + **Rive** + custom bundle
  (`lando.OFF+BRAND…js`); 133 `<img>` (webp).
- **Techniques:** Lenis smooth scroll, sticky chapters, horizontal pin, Rive micro-animations,
  fixed WebGL backdrop, page-transition curtain.
- **Why it's great:** SOTY-level polish built mostly from *DOM* motion; the WebGL is a backdrop,
  not the content.
- **iOS-phone risk:** **high** (fixed full-viewport WebGL backdrop); the sticky/horizontal-pin
  layer alone would be **low–med**.

### 5. Oura Ring 4 — Instrument (E-commerce Honors, Honorable Mention 21 Apr 2025)
- **URL:** https://ouraring.com/product/rings → https://ouraring.com/store/rings/oura-ring-4
  · **Award page:** https://www.awwwards.com/sites/oura-ring
- **Maker:** Instrument · **Year:** 2025 · **Verified-open:** yes-browser
- **What happens as you scroll:** 9,184 px. Two **full-viewport non-looping `<video>`s**
  (6.9 s / 6.5 s, imgix-served mp4) each inside a `sticky top-0` container — the video plays
  once as its chapter pins ("Smart Sensing for the full picture" → "Increases accuracy" →
  "Adapts to you" copy swaps over the pinned video), then a 840×630 loop, then a finishes
  grid, spec table. **Zero canvas.** Sticky/animation classes are gated
  `md:motion-safe:js:sticky` / `lg:motion-safe:js:sticky` — i.e. only on ≥ md, only when
  `prefers-reduced-motion` is off, only when JS is running. Blur-up imgix placeholders.
- **Techniques:** pinned video chapters with copy swaps; progressive-enhancement gating;
  blur-up posters. Next.js.
- **Why it's great:** a $350 hardware product sold with *video + type + sticky* only — the
  most directly copyable premium pattern here.
- **iOS-phone risk:** **low–med** — one 1080p video decoded at a time; explicit motion-safe
  gating is the model for our phone fallback.

### 6. ZETR — Nightjar (SOTD 12 Aug 2024 · E-commerce Honors)
- **URL:** https://www.zetr.com.au/ → now https://www.zetr.co/us · **Award page:** https://www.awwwards.com/sites/zetr
- **Maker:** Nightjar (Sydney) · **Year:** 2024, redesigned/relocated on Next.js since · **Verified-open:** yes-browser
- **What happens as you scroll:** 14,122 px. A `fixed top-0 h-screen overflow-hidden`
  full-viewport **video layer** sits behind; product tiles (13/FLUSH, 15A DOUBLE OUTLET…) and
  copy chapters ("Architectural electrical for considered spaces" → "Flush installation" →
  "Precision in every surface") scroll over it; interior photos of *rooms* (travertine wall,
  garden through glazing) alternate with white product-catalogue rows. Three `blob:` videos
  (streamed via fetch/MSE: 55 s, 120 s, 21 s). No canvas. Page-transition "curtain" layers.
- **Techniques:** fixed backdrop video with sections scrolling over it; catalogue-grid ↔
  full-bleed room-photo rhythm; curtain page transitions.
- **Why it's great:** the closest *category* match — hardware for homes sold through calm
  interior photography, no gimmicks.
- **iOS-phone risk:** **med** — 120 s full-bleed video kept alive under the whole page is a
  memory/decoder tax; fine if swapped for a poster on phones.

### 7. ERA Residence — The First The Last (Honorable Mention 21 Jul 2026, Architecture)
- **URL:** https://www.era-residence.com/ · **Award page:** https://www.awwwards.com/sites/era-residence
- **Maker:** The First The Last (2× Site of the Year studio) · **Year:** 2026 · **Verified-open:** yes-browser
- **What happens as you scroll:** 21,670→24,605 px (chapters expand as they load). Sticky
  hero → sticky "location" screen (`loc-scroll-area_screen`) → concept chapter with a framed
  portrait photo and huge serif display type ("NEW GOLDEN MILE" set edge-to-edge, "SPAIN /
  34" running vertically) → sticky architecture chapter (`arch-w`, desktop-only intro
  `b-desk`) where a video **scales from ~980 px tall to ~3,300 px tall while pinned** — a
  frame-to-full-bleed zoom driven by scroll — under viewport-wide "ARCHITECTURE" type.
  Decorative 720×720 looping webm "bougainvillea" cut-outs float at the margins. **Stack fully
  exposed in `<script src>`:** Webflow + **GSAP 3.15 + ScrollTrigger + SplitText + CustomEase**
  + **Lenis 1.3.21** + **Barba** + **Lottie**. Zero canvas.
- **Techniques:** ScrollTrigger pin + scale, SplitText headline reveals, Lenis, editorial
  chapter structure, desktop-only intro (`b-desk`), Barba page transitions.
- **Why it's great:** a *residence* sold like a product, with named, off-the-shelf tools we
  could actually use (GSAP+Lenis is CONTEXT.md's "one small lib" budget). Note it uses CGI
  renders — the technique translates, the imagery must not (real photos rule).
- **iOS-phone risk:** **low–med** — DOM/transform only; the pinned scale-up must be clamped
  (scaling a 3,300 px video layer on a phone is the kind of "one giant layer" we fear).

### 8. Bucks Sauce — Buzzworthy (SOTD 3 Jul 2026 · E-commerce Honors Jun 2026)
- **URL:** https://buckssauce.com/ · **Award page:** https://www.awwwards.com/sites/bucks-sauce
- **Maker:** Buzzworthy · **Year:** 2026 · **Verified-open:** yes-browser
- **What happens as you scroll:** 11,354 px. Hero → "Choose your weapon" product row → pinned
  **"Why Bucks Sauce"** chapter (heading letter-spaced "W H Y  B U C K S  S A U C E" as kinetic
  type) where numbered slides 01/02/03 (Small batches / Real ingredients / …) rotate on a
  curved tick-marked arc as you scroll (screenshot 3) → pack builder → reviews. Seven small
  **2D canvases (≈170–250 px)** — bottle spins/idents — never a full-viewport one. Fixed
  `[clip-path:…]` layer for page transitions. Next.js/Turbopack.
- **Techniques:** pinned slide-carousel-on-scroll, kinetic letter-spacing, small canvas
  sprite/frame loops, clip-path transitions.
- **Why it's great:** freshest SOTD in the e-com category and it proves "cinematic" ≠ WebGL:
  the canvases are thumbnail-sized.
- **iOS-phone risk:** **low** — small canvases + transforms.

### 9. Igloo Inc — abeto (Site of the Year 2024 · SOTD 23 Jul 2024)
- **URL:** https://www.igloo.inc/ · **Award page:** https://www.awwwards.com/sites/igloo-inc
- **Maker:** abeto (also SOTY 2025 with *Messenger*) · **Year:** 2024 · **Verified-open:** yes-browser
- **What happens as you scroll:** nothing scrolls — `overflow:hidden` on html *and* body; a
  full-viewport WebGL scene (a fractured ice block, "CLICK TO EXPLORE", sound toggle) advances
  through virtual-scroll/click states. Single Vite bundle. It is a 3D **journey**, not a page.
- **Techniques:** virtual scroll → 3D camera path, WebGL everything.
- **Why it's great:** SOTY-level 3D storytelling; included as the ceiling, not a template.
- **iOS-phone risk:** **high** (all of it).

### 10. Monolith — CUSP (SOTD 11 Dec 2024 · E-commerce Honors)
- **URL:** https://monolith.nyc/ · **Award page:** https://www.awwwards.com/sites/monolith
- **Maker:** CUSP · **Year:** 2024 · **Verified-open:** yes-browser
- **What happens as you scroll:** 6,393 px that **loops** (scroll wraps back to the top);
  colour-block placeholders swap in for lazy images; one large video (1397×793); a fixed
  `Wipe` layer for page transitions; hairline editorial grid ("More Monoliths", "05_Images"),
  clock + weather in the nav. Next.js. Zero canvas.
- **Techniques:** infinite loop scroll, placeholder-colour lazy images, wipe transitions.
- **Why it's great:** quiet, gallery-grade restraint for objects (furniture) — a tone
  reference more than a motion reference.
- **iOS-phone risk:** **low**.

### 11. Polène — Spring/Summer (E-commerce Honors Nov 2024, Honorable Mention 1 Nov 2024)
- **URL:** https://www.polene-paris.com/ · **Award page:** https://www.awwwards.com/sites/polene
- **Maker:** Spring/Summer (Copenhagen) · **Year:** 2024 · **Verified-open:** yes-browser
- **What happens as you scroll:** 5,739 px. Full-viewport HLS/blob hero video loop (12 s) →
  large photo pairs → campaign grid → Instagram row. Fixed `component-zoomable-image` viewer
  for product zoom. Shopify. Zero canvas, no pinning.
- **Techniques:** full-bleed hero video, big-photo grid, zoomable image viewer.
- **Why it's great:** luxury-house calm; proof that "premium" can be a hero video + type.
- **iOS-phone risk:** **low**.

### 12. Opal Tadpole — Claudio Guglieri / Ingamana (Site of the Year 2024, SOTD 11 Jan 2024)
- **URL (awarded):** https://www.opalcamera.com/opal-tadpole — **moved/gone** (now 302 → https://op.al/ ; `/tadpole` and `/products/tadpole` 404). Award page: https://www.awwwards.com/sites/opal-tadpole (verified, credits + tags: E-commerce · Single page · 3D · Animation · Photographic).
- **Maker:** design Claudio Guglieri, dev Ingamana · **Year:** 2024
- **Technique (from award page + jury notes; not re-observed live):** single-page product edit
  for a webcam — "hand flip" hero, "show don't tell" stat blocks, "Smooth Criminal" product
  showcase animations; Animations & Transitions scored 8.6/10. Wayback API rate-limited me
  (429) so I could not confirm an archived copy this session — treat as historical.
- **iOS-phone risk:** n/a (not live).

### 13. Telepathic Instruments (Orchid) — Love and Money (SOTD 28 Mar 2025 · E-commerce Honors)
- **URL:** https://telepathicinstruments.com/ · **Award page:** https://www.awwwards.com/sites/telepathic-instruments
- **Verified-open:** yes-browser — **but the awarded edit is gone.** Live site today is a
  standard Shopify store (hero loop, "Featured Products" 2-up, product grid; `/products/orchid`
  404s). Award page tags were 3D · WebGL · Photographic · Single page. Listed so nobody chases it.
- **iOS-phone risk:** n/a.

## B. Also verified, worth a look (curl-verified, not browser-scrolled)

| Site | Maker · award | Live URL | Signals found in HTML | Note |
|---|---|---|---|---|
| CANCAN Furnishings | 360&5 · E-com Honors Oct 2025 | https://cancanfurnishings.com/ | `gsap`, `ScrollTrigger`, webm, Shopify | furniture-for-homes product edit on GSAP — same toolset as ERA |
| LAB46 | Series Eight · E-com Honors Jan 2026 | https://lab46.de/en | `gsap`, `.glb` ×3, mp4/webm, IntersectionObserver | 3D product models (glTF) inside a Shopify store |
| Drop Edition | Square43 · E-com Honors Mar 2026 | https://dropedition.com/ | `lenis`, `three` | Lenis + Three product drops |
| Report — VWLAB | Victor Work · SOTD 4 Aug 2025 | https://vwlab.io/pages/report | `three`, "sequence" strings, webm | image-sequence / 3D report page |
| Outfit | ++hellohello · SOTD 11 May 2026 | https://outfit.hellohello.is/ | Next.js, Shopify, `matter` (physics) | playful merch store; physics, not scroll-cinema |
| P448 | By Association Only · SOTD 28 Oct 2024 | https://p448.com/ | Shopify, mp4/webm | sneaker store, video-led |
| UND NY | LOWORKS · SOTD 24 Jul 2024 | https://und-ny.com/ | 7 `<video>`, webp ×193 | video-heavy food product story |
| 250 Broadway | übernatural · Nominee 7 Aug 2026 (Real estate) | https://www.250broadway.com/ | Framer, `lenis`, 2 mp4 | office-leasing "product page" — real-estate tag winner-list neighbour |
| House of Honey | Edoardo Lunardi · SOTD 14 Jul 2026 (Architecture) | https://www.houseofhoney.com/ | `lenis`, Next.js | interiors studio; editorial + Lenis |
| Lacoste Polo Factory | Merci Michel · SOTD 21 Jul 2026 | https://members-play.lacoste.com/polo-factory-experience | fixed body, WebGL2 + 2D canvas, register modal | opened in browser: it's a WebGL *game/experience*, not a scroll edit — **high** iOS risk |
| Belle Oaks | Duall · E-com Honors Dec 2025 (residential 3D map) | https://belleoaks.org → https://belleoaksmarketplace.com/ | one 175 s full-screen webm | **moved/gone** — awarded 3D map not at this URL |
| Messenger | abeto · Site of the Year 2025 | https://messenger.abeto.co/ | webgl | WebGL planet game — context only |
| Don't Board Me | The First The Last · SOTY 2024 | https://dontboardme.com/ | `lenis`, `three`, lottie, Nuxt | TFTL's other SOTY; Lenis + Three |
| Raymond Weil × Basquiat | Monks · SOTD 27 Mar 2024 | https://www.raymond-weil.com/en/basquiat/ | → redirects to a blog press-release | **gone** |
| SPYLT Milk | Tubik · SOTD 14 Mar 2025 | https://www.spylt.com/ | → `/password` | **store closed** |
| Qudrix | O0 · SOTD 22 Jan 2025 | https://www.qudrix.com/ | connection failed (000) | **unreachable** |

Source indexes used (all opened): https://www.awwwards.com/websites/sites_of_the_year/ ·
https://www.awwwards.com/websites/winner_category_ecommerce/ ·
https://www.awwwards.com/websites/architecture/?award=sotd ·
https://tympanus.net/codrops/2024/09/06/inspirational-websites-roundup-65/ (last roundup) ·
https://www.cssdesignawards.com/website-gallery?feature=wotd

## C. Patterns that recur across the winners (what "product edit" means in 2024–26)

1. **Pin + swap.** A full-bleed medium (video, photo, 3D) is `position:sticky` for 2–4 viewports
   while short copy blocks swap over it (Apple, Oura, ZETR, ERA, Daylight, Lando). This is the
   single most common move and it's DOM-only.
2. **Scroll = time.** Video `currentTime` scrubbed by scroll (Apple `VideoScrub`) or a canvas
   frame sequence (Daylight, VWLAB); play-once-when-pinned (Oura, Apple `ProductViewer`) is the
   cheaper cousin.
3. **Zoom-in reveal.** A framed image/video scales to full-bleed while pinned (ERA), or a
   horizontal rail slides in on vertical scroll (Daylight, Lando).
4. **Type as image.** Viewport-wide display type over the medium (ERA "ARCHITECTURE", Lando,
   Bucks kinetic spacing) — SplitText-style reveals.
5. **A fixed backdrop** (video: ZETR; WebGL: Aether, Lando) with sections scrolling over it.
6. **Discipline about loading.** Apple fetches media only inside a scroll window and unloads
   after play; Oura gates all of it behind `motion-safe`/`js`; ERA marks the heavy intro
   desktop-only. Winners *degrade on purpose*.
7. **Tools seen in the wild:** GSAP + ScrollTrigger (+SplitText) and Lenis dominate the
   non-WebGL winners (ERA, CANCAN, Lando, Drop Edition, House of Honey, 250 Broadway); Three /
   custom WebGL only where 3D is the product (Aether, Igloo, LAB46). Rive shows up for
   micro-animation (Lando). Nobody in this set used CSS scroll-driven animations
   (`animation-timeline`) — I checked computed styles on every browser-probed page: 0 hits.

## Top 3 for this site (Midwest rental-house showcase)

1. **Oura Ring 4 (Instrument)** — *pinned full-bleed video chapters with copy swaps, zero
   canvas, motion-safe/JS gating.* Translate: one sticky chapter per house — a 6–8 s exterior→
   kitchen→living hand-held clip plays once as it pins, three short lines swap over it
   ("Renovated 2025" / "Managed by Charger" / "Text 805-364-4415"). Phone fallback is the
   poster frame + the same three lines. Cheapest premium pattern; fits the 767 px kill-switch.
2. **ERA Residence (The First The Last)** — *editorial chapters + ScrollTrigger pin/scale +
   Lenis + SplitText, DOM only.* Translate: the 1919 Kendall before/after as a pinned
   frame-to-full-bleed zoom (photo, not CGI), viewport-wide "KENDALL" display type, chapters
   "Before / During / After / Available". Uses exactly the "one small lib" budget (GSAP+Lenis).
   Desktop-only intro flag (`b-desk`) is a pattern we can copy verbatim for iOS.
3. **Apple AirPods Pro 3** — not for the look, for the *media discipline*: scroll-window
   loading, unload-at-end, poster start/end frames, per-breakpoint renditions, effect disabled
   on "no-enhanced" clients. Whatever we build, its loader should behave like this — that is the
   answer to CONTEXT.md constraint #1, and no award-site in this list is more careful.

Runner-up: **ZETR** for tone (calm interior photography of real rooms + catalogue rhythm) — the
closest *category* match; its fixed backdrop video should become a poster on phones.

## Assumptions / gaps (honest)
- I could not open FWA (JS-only, `/awards/*` 500) or godly (dead → recent.design, client-rendered);
  Awwwards annual-award category pages 502'd all session, so the "of the Year" nominee list is
  reconstructed from the SOTY index and the E-commerce winners index.
- Wayback API rate-limited (429) so no archive links for the moved/gone sites this session.
- No luxury-watch or car-configurator benchmark made the cut: the Raymond Weil microsite is
  gone and I did not open a configurator, so I would not have been able to name its technique
  precisely — left out rather than padded.
- Screenshots from the browser probes (137 files) are in this session's scratchpad, not the repo.
