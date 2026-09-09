# REFS-siteaudit — code audit of shavitrootman.com for the "product edit"

Lane: **siteaudit** · written 2026-08-15 (Sat, ~22:20 PT) · worktree `/Users/jakehorvitz/projects/shavit-product-edit` @ `767f3d8` (branch `feat/product-edit`)
Method: read-only pass over `site/` (every file in `site/src/`, `site/public/`, build scripts, acceptance scripts) + `sips`/`ffprobe`/`stat` on assets + two live checks (curl of the deployed CSS/HTML; a headless 390px Playwright load of https://shavitrootman.com/). Nothing under `site/` was edited; nothing committed; the pipeline audit-trail directory was not touched.
All line numbers are `file:line` in this worktree at `767f3d8`.

Assumptions I made (nobody to ask):
- "Home page section map" = the React `HomePage` in `tenant-pages.jsx`, not the static case-study page (covered separately in §1c).
- "Before/after pairs" = same room/elevation, before and after; I judged alignment visually from a contact sheet.
- Library costs are approximate (npm registry version + memory of gzip sizes); the technique lane owns exact numbers.

Companion files written by this lane: `siteaudit-live-phone-hero-390px.png` (screenshot proving §0 bug), `siteaudit-image-inventory.csv` (all 199 image files: path,w,h,bytes).

---

## 0. TL;DR (what the edit attaches to)

- The site is a **dark, black-canvas + gold (#FFC000) + white** brand (not navy/orange — `--color-navy` exists but is used once, `site.css:26,2811`). Display type is *declared* as Bricolage Grotesque / Manrope (`site.css:19-20`) but **no @font-face is shipped anywhere** and CSP blocks Google Fonts, so every visitor sees the system stack (SF/Segoe). Any award-tier edit will want a self-hosted woff2 (allowed: `font-src` falls back to `default-src 'self'`).
- Motion today = (a) 1.8s brand splash `LogoIntro` on every load, (b) a 12-slide 4.2s crossfade **photo montage hero** (3 slides mounted at a time), (c) IntersectionObserver `data-reveal` fades/rises + gold hairline `LineReveal` on section heads, (d) film grain, scroll progress bar, cursor ring on desktop. **On phones (≤767px) every animation/transition/filter/blend outside `.intro` is stripped** (`site.css:3059-3069`), so phones see hard cuts and instant pops.
- **Live defect found (phone):** because of that strip rule, the hero CTA "See Available Units" renders at `opacity:0` on phones — `.hero--enter .hero__actions > * { opacity:0; animation: rise-in … both }` (`site.css:218`) loses its animation and never becomes visible. Confirmed on the live site at 390px (computed opacity `"0"`, animationName `none`); screenshot: `docs/product-edit/siteaudit-live-phone-hero-390px.png`. Same class of bug will bite any new effect whose *resting* state is hidden — see §2.
- Best raw material for a cinematic edit: **1919 Kendall** — 4 aligned before/after pairs at 1400×933 (`site/public/case-studies/1919-kendall/img/ba*-{before,after}.jpg`), 9 finished "after" frames, plus its published numbers ($68,400 → $215,000). Second: the montage-approved exterior/interior sets for Howder / Saint Joe / Budlong (all 1600px masters with 1024px siblings). `hero.mp4` is **dead and unusable** (640×360, 79s, has an audio track, unreferenced except a dead constant).
- Ranked attach points (§6): **(1)** a full-bleed scroll-scrubbed *before→after* "one house, rebuilt" chapter between the hero and the Michigan inventory (Kendall pairs); **(2)** a case-study "product page" upgrade of `/case-studies/1919-kendall/` (already static, already has sliders — lowest risk, but it is `noindex` and off the main flow); **(3)** the hero montage itself upgraded to a Ken-Burns/parallax stack with a scroll-linked hand-off into the first inventory row.

---

## 1. Section map — every route

Routes: `site/src/routes.jsx:230-241` — `/` (`HomePage`), `/meet` (`MeetPage`), `/accessibility` (`AccessibilityPage`), `*` (`NotFound`, `routes.jsx:214-228`). All wrapped in `Layout` (`routes.jsx:172-212`). Plus one **static, non-React** page: `/case-studies/1919-kendall/` (`site/public/case-studies/1919-kendall/index.html`, own CSS `site/public/case-studies/case-study.css`, `noindex`).

### 1a. Layout chrome (every route) — `routes.jsx:197-210`

| Order | Element / selector | File:line | Purpose | Motion today | Phone (≤767) |
|---|---|---|---|---|---|
| 0 | `#boot-cover` (static div in `index.html`) | `site/index.html:14-16` | Instant black first paint so no listing photo flashes before intro mounts; 8s inline-timeout safety net | none | same |
| 1 | `.skip-link` | `routes.jsx:200` | a11y | — | — |
| 2 | `<FilmGrain>` → `.film-grain` | `components.jsx:458-460`; `site.css:3024-3033` | fixed full-viewport noise PNG, `opacity:.045`, `mix-blend-mode:overlay` | static texture | `display:none` (`site.css:3038-3040`) |
| 3 | `<ScrollProgress>` → `.scroll-progress span` | `components.jsx:429-452`; `site.css:3006-3020` | 2px gold bar, rAF-throttled `scaleX` | JS transform on scroll | still runs (JS transform, not CSS transition) |
| 4 | `<LogoIntro>` → `.intro`, `.intro__bg/halo/mark/house/rule/line/letter/caption` | `intro.jsx:20-96`; `site.css:2146-2290` | 1.8s brand splash + 0.6s lift (`intro.jsx:17-18`), every load, skips on any key/pointer (`intro.jsx:44-48`), off when `prefers-reduced-motion` or a `#hash` is present (`intro.jsx:32-37`); locks body scroll while up (`intro.jsx:56-61`); client-only (SSR renders null) | CSS keyframes (letters stagger 60ms, house path draw) | **the ONLY thing exempt** from the phone strip (`:not(.intro):not(.intro *)`, `site.css:3060`) |
| 5 | `<Nav>` → `.nav`, `.nav--scrolled`, `.nav__menu-btn`, `.nav__wordmark`, `.nav__cta` + `<MenuOverlay>` `.overlay` | `nav.jsx:26-83`, `85-213` | Menu / wordmark / "Contact Us" → `/#contact`; overlay menu = Available Units (MI/OH/IN), Investors (Case Studies, Invest), Learn About Us, Contact | `nav--scrolled` after 60px; overlay open transitions | transitions stripped |
| 6 | `<main id="main-content">` → `<Outlet/>` | `routes.jsx:205-207` | page | — | — |
| 7 | `<Footer>` `.footer` | `footer.jsx:9-61` | links, phone, email | none | — |
| 8 | `<CursorRing>` `.cursor-ring` | `components.jsx:378-426`; `site.css:2974-3004` | lagging gold ring, rAF | JS transform | hidden `@media (hover:none)` (`site.css:2999`) + not mounted on touch (`components.jsx:383-385`) |
| — | `<Seo>` `<Head>` | `routes.jsx:85-164` | title/description/canonical/OG + Organization/LocalBusiness/ItemList JSON-LD | — | — |

Layout hash-scroll: `routes.jsx:177-184` (`scrollIntoView` on `location.hash` after rAF). Any pinned/scroll-hijacked section must not fight this (deep links `/#michigan`, `/#contact`, `/#case-studies`, `/#home-<id>` are texted around by Shavit).

### 1b. Home page (`HomePage`, `tenant-pages.jsx:967-1001`) — DOM order

Wrapper: `<div class="page-fade tenant-home">` — `.page-fade` keyframe fade/rise on mount (`site.css:471-475`).

| # | Section (id / class) | Component · file:line | Purpose | Assets | Motion today (desktop) | Phone |
|---|---|---|---|---|---|---|
| 1 | `section.hero.hero--enter.hero--montage` | `MontageHero` `tenant-pages.jsx:907-965`; CSS `site.css:598-634, 4255-4315` | Hero = photo montage (replaced the video 7/14). `100svh`, `min-height:720px`. H1 "Live with us. / Learn about us." (`LineReveal`, `triggerOnView={false}`), sub, one gold CTA `See Available Units` → `/#michigan`, bottom-right city chip `.hero__addr` → `/#home-<id>` | `MONTAGE_SETS` `tenant-pages.jsx:855-874`: budlong 02–10, howder 01,03–08, saint-joe 01–07, round-robined to `HERO_MAX_SLIDES=12` (`:853`), 4.2s each (`:852`); `respImg()` srcset 1024/1600 (`:16-18`), sizes `(max-width:767px) 341px, 100vw` (`:939`) | `.hero__slide` opacity crossfade 1100ms (`site.css:4260-4267`); only prev/current/next mounted (`tenant-pages.jsx:922-944`) after the 7/21 crash; `.hero--enter` timeline: h1 lines rule+text delays 600–950ms (`site.css:233-236`), sub fade @1500ms (`:217`), CTA rise @1800ms (`:218-219`); scrim `site.css:3357-3361`; text-shadows `:3365-3366`; interval paused under reduced-motion (`tenant-pages.jsx:913`) | crossfade → hard cut; **CTA invisible (opacity 0 bug, §2)**; grain gone |
| 2–4 | `section.band.inventory-state#michigan` / `#ohio` / `#indiana` | `StateSection` `tenant-pages.jsx:451-506` mapped from `STATES` (`properties.js:20-24`) | Per-state inventory: head = `Reveal fade` eyebrow (kicker "Hillsdale, Michigan"), `LineReveal h2.h-lg`, `Reveal fade delay 500` `GoldRule`; body = `Carousel` of `ListingCard`s (photo-first, then available → coming-soon → lease-signed, `:456-461`); Ohio renders `EmptyState` (`:370-383`, copy `properties.js:22`) | card `photo` + `photos[]` from `properties.js`; `-1024` siblings via `respImg` (`:286`) | `[data-reveal]` opacity/translate 1200ms (`site.css:145-165`); `.lr-line` gold hairline draw (`site.css:176-202`); Carousel = native `overflow-x` + `scroll-snap` + JS infinite loop (`:387-449`; CSS `site.css:3858-3900`); Lightbox (`:211-267`) & PrequalModal (`:110-207`) are portals | reveals pop; carousel is the same swipe everywhere (Shavit 8/9) |
| 5 | `section.band#case-studies` | `CaseStudiesSection` `tenant-pages.jsx:510-550` | "Deal Case Studies. / Learn more about our numbers." Three `qcard.case-card` in a `Carousel`: Michigan (soon), Ohio (soon), Indiana → `/case-studies/1919-kendall/` | text only | LineReveal + Reveal | pop |
| 6 | `section.band#work-with-us` | `WaysToWork` `:562-592` | "One stop shop." Tenants / Investors / Home Sellers doors (`.doors-grid .door-card`) | text | LineReveal + Reveal | pop |
| 7 | `section.band.meet-founder#meet` | `MeetSection` `:635-662` | Circular 200px avatar (`/assets/photos/06_shavit_avatar.jpg`, 47KB), "Shavit Rootman.", LinkedIn/IG | 1 image | `Reveal zoom-lg` on avatar (`:639`); avatar has a CSS `filter` (`site.css:4338`) | filter stripped |
| 8 | `section.band#invest` | `InvestSection` `:600-630` | Verbatim "does not raise outside capital" copy — **legal landmine, don't touch** (`:594-599`) | text | LineReveal | pop |
| 9 | `section.band#contact` | `ContactSection` `:689-718` | Phone + email cards (`.reach-grid .qcard`) | text | LineReveal + Reveal | pop |
| 10 | `section.band#reach` | `QaSection` `:739-837` | Tabbed Tenants/Investors Q&A (`?qa=investors` deep link, `:750-765`), SMS "Text Us" | text | LineReveal + Reveal, FAQ `max-height` transition (`site.css:898`) | pop |

Note the home page has **no video, no 3D, no scroll-linked motion** beyond the progress bar; `ScrollLinkedColor`/`SurfaceSweep` primitives exist in `motion.jsx:97-128` but are unused. `HERO_VIDEO` (`data.js:28`) and `VideoHero` (`components.jsx:255-353`) are dead code; `accept-714.sh:72` asserts `hero.mp4` is **absent** from `dist/index.html`.

### 1c. Other routes

| Route | Component · file:line | Content | Motion |
|---|---|---|---|
| `/meet` | `MeetPage` `tenant-pages.jsx:1003-1025` | `.split` — `Reveal zoom-lg` portrait (`SHAVIT_PHOTOS.portraitLI` = `/assets/photos/06_shavit_portrait.jpeg`, 44KB) + "Real estate, operated." | one zoom reveal |
| `/accessibility` | `AccessibilityPage` `:1033-1056` | copy + phone/email | none |
| `*` | `NotFound` `routes.jsx:214-228` | 404 band | none |
| `/case-studies/1919-kendall/` (static) | `site/public/case-studies/1919-kendall/index.html:1-321` | Hero `after-01.jpg` (`:18-20`), title block, Investment Snapshot stats (`:34-51`), BRRRR Performance (`:54-67`), Project Story, BRRRR steps (`:84-118`), **4 before/after sliders** (`:128-186`, `--pos` + `clip-path:inset(...)` on `.ba__before`, `case-study.css:144-160`; pointer + `<input type=range>` JS `:279-302`), Condition-at-acquisition (`:188-200`), 6-image gallery (`:202-209`), Lessons, Impact, Timeline ("Date to confirm" ×4, `:252-263`), prev/next (`:268-273` — **"Next" points at `../clarendon-3220/` which does not exist; "Prev"/"Back to all" are `#`**), footer | `.hero img` `heroIn` scale animation (`case-study.css:96-98`); `.rv` IO reveal (`:260-265`, JS `:305-319`); `backdrop-filter:blur(4px)` on grip/chips (`:152,157`) — small layers; **not covered by the phone strip rule** (different stylesheet). Loads Google Fonts (`:9-11`) which the CSP blocks (falls back to system) |

Legacy CSS still shipped in `site.css` for unused components (`.tri`, `.cstudy`, `.deep`, `.progvis`, `.flag`, `.brrrr`, `.bp`, `.standard-pair`, `.watermark` — ~120 lines). `accept-revision.sh:187` asserts the CSS bundle stays ≥ 86,000 bytes, so don't "clean up" aggressively during the edit.

---

## 2. Mobile safe-mode + kill switches — and how a new effect must coexist

**The phone rule (verbatim), `site.css:3052-3069`:**
```css
/* iOS Safari ships the proven-safe configuration: the full page with CSS
   animations/transitions/filters stripped (the ?kill=anims state, which never
   crashed across every on-device test), EXCEPT the intro overlay — its
   transforms are audited-safe and it is the site's signature moment. Desktop
   is untouched. Bisect history: docs/CRASH_DEBUGGING_GUIDE.md + this repo's
   7/21 session — the fatal 2GB WebContent allocation needs at least one
   composited effect outside the intro to trigger; no single culprit isolated. */
@media (max-width: 767px) {
  body *:not(.intro):not(.intro *) {
    animation: none !important;
    transition: none !important;
    filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    mix-blend-mode: normal !important;
    will-change: auto !important;
  }
}
```
Confirmed present in the deployed bundle (`/assets/app-B5uYu2sD.css`, fetched 2026-08-15). Note it does **not** strip `transform`, `opacity`, `clip-path`, `position:fixed/sticky`, or JS-driven style writes — it kills CSS *time-based* motion and *compositing filters* only. (`docs/CRASH_DEBUGGING_GUIDE.md` referenced in that comment does not exist in this repo or the sibling worktree — the 7/21 session memory is the only record.)

Companions:
- Film grain hidden on phones: `site.css:3038-3040`.
- Reduced-motion: durations → 0.01ms and reveal transforms cleared, `site.css:449-465`; hero slide transition off `:4313-4315`; intro/montage interval/cursor ring/counter all check `prefers-reduced-motion` in JS (`intro.jsx:32`, `tenant-pages.jsx:913`, `components.jsx:164,384`).
- No `will-change` on reveals by design (comment `site.css:148-152` — a permanent GPU layer per element climbed to the 2GB jetsam cap).
- Hero uses `100svh` not `vh` to avoid re-layout on Safari toolbar flap (`site.css:600-603`).
- Montage mounts only prev/current/next slide (`tenant-pages.jsx:922-944`) — the 12-slides-at-once version is what crashed on 7/21.
- Grain is a PNG tile, not SVG `feTurbulence` (`components.jsx:454-457`) — turbulence software-rasterises full-viewport on WebKit.

**`?kill=` switches (URL bisect):**
- `Layout` (`routes.jsx:186-195`): parses `?kill=a,b,c` or `kill=all`; toggles `<html class="kill-anims|kill-filters|kill-animonly|kill-transitions|kill-heroanim|kill-reveal">` and skips mounting `grain` / `intro` (`:201,203`). CSS for those classes: `site.css:3043-3092` (`kill-anims` = the same 7 properties as the phone rule; `kill-filters` = filter/backdrop/blend; `kill-heroanim` scoped to `.hero *`; `kill-reveal` scoped to `.h-mega *`, `[data-reveal]`, `.lr__line`, `.lr__inner` — note the last two selectors don't match anything; the real classes are `.lr-line`/`.lr-line__text`).
- `HomePage` (`tenant-pages.jsx:970-984`): `kill=hero` swaps the montage for a plain h1; `kill=sections` drops the three state sections + case studies (everything after stays).

**Rules for a new effect to coexist (derived, with evidence):**
1. **Its resting/final state must be visible with zero animation.** The live hero CTA bug proves the failure mode: `site.css:218` sets `opacity:0` and relies on `animation … both` to reach 1; the phone strip removes the animation, opacity 0 remains. Pattern to follow instead: `[data-reveal]` (`site.css:145-165`) — hidden by default but a JS-toggled `.is-in` class *sets* the final values, so it degrades to a pop rather than to invisible. Same for `.lr-line.is-in` (`:200-201`) and `.hero__slide.is-active` (`:4267`). Any GSAP/`ScrollTrigger` tween that starts from `autoAlpha:0` must also either (a) run only ≥768px, or (b) set final values via `gsap.set`/class toggle when disabled.
2. **Choose one of two lanes:** (A) desktop-only — wrap the effect's CSS in `@media (min-width: 768px)` and gate the JS with `matchMedia('(min-width: 768px)').matches` (the montage/`respImg` already branch on 767/768); on phones render the plain photos/text; or (B) opt out of the strip like the intro does — that means adding your root class to the `:not()` chain at `site.css:3060` (a one-line CSS change) and then *proving* it on-device, because the comment says the fatal allocation was never isolated. Lane A is the only one that needs no iOS testing.
3. **What is still allowed on phones without touching that rule:** JS-driven `transform`/`opacity`/`clip-path` writes (like `ScrollProgress`, `CursorRing`, the case-study `--pos` slider), `IntersectionObserver` class toggles, `scroll-snap`, native `<video muted playsinline>` (no CSS filter over it), `position:sticky`. What is *not*: any CSS `transition`/`animation`, `filter`/`backdrop-filter`/`blur`, `mix-blend-mode`, `will-change`.
4. **Memory rules that already exist and must hold:** ≤3 full-viewport decoded images live at once (montage precedent); phones fetch `-1024` siblings via `srcset`; no full-viewport blend layers on phones (grain precedent, `site.css:3034-3037`); no per-element `will-change`.
5. **Don't fight the URL:** `?kill=` parsing is regex on `location.search` (`routes.jsx:188`, `tenant-pages.jsx:971`) and `?qa=` is `URLSearchParams` (`tenant-pages.jsx:751`); hash deep links scroll via `routes.jsx:177-184`. A pinned/scroll-scrubbed section must release the scroll for `#michigan` etc. (ScrollTrigger pin + hash jump = known jank; use `scrollIntoView` after refresh or avoid pinning around anchors).
6. **Reduced motion:** mirror `intro.jsx:32-37` — check `prefers-reduced-motion` and render the end state.

---

## 3. Asset inventory

Method: `sips -g pixelWidth -g pixelHeight`, `stat -f %z`, `ffprobe`; full CSV of all 199 image files is `docs/product-edit/siteaudit-image-inventory.csv`.

### 3a. `site/public/assets/properties/<slug>/` (masters `NN.jpg` + `NN-1024.jpg` siblings, from `sips`, per `tenant-pages.jsx:12-15`)

| Folder | Files | Masters | Master px (typ.) | Master total | Max master | Masters >250KB | Used by |
|---|---|---|---|---|---|---|---|
| `budlong-street` | 20 (10+10) | 10 | 1600×1066 (01 = 1066×1600 portrait) | 3.00 MB | 562 KB (`02.jpg` 575,909 B) | 5 | card `budlong-a` (`properties.js:56-57`), montage 02–10 |
| `howder-street` | 18 (8+8 +`hero-sq`) | 9 | 1600×1066; `hero-sq.jpg` 1400×1400 | 3.87 MB | 783 KB (`02.jpg` 801,875 B) | 5 | cards `howder-a/b` (01, gallery 01,03–08), montage |
| `saint-joe` | 16 (8+8) | 8 | 1600×977 / 1204×1600 | 2.03 MB | 398 KB | 4 | cards `stjoe-a/b` (03 lead, gallery 01–07), montage 01–07 |
| `kendall-street` | 18 (9+9) | 9 | **1086×724 only** (no 1600 master; `-1024` is 1024×682) | 1.48 MB | 392 KB (`01.jpg`) | 1 | card `kendall-1919` (01, gallery 01–09) — same frames as case-study `after-0N.jpg` |
| `cedar-street` | 18 (8+8 +`hero-sq`) | 9 | 1200×1600 portrait; `06.jpg` 1402×1122 | 3.99 MB | 637 KB (`06.jpg`) | 9 (all) | card `cedar-1114` (06 only, no gallery — Jake faded the set) |
| `12-river-street` | 24 | 12 | 1311×1600 | 3.75 MB | 709 KB | 7 | **unreferenced** (pruned listing, banned string in `accept-714.sh:63`) |
| `15-waldron` | 20 | 10 | 1600 | 3.46 MB | 590 KB | 10 | unreferenced (pruned) |
| `17-lo-presto` | 20 | 10 | 1600 | 2.37 MB | 532 KB | 2 | unreferenced (pruned) |
| `46-w-south` | 18 | 9 | 1600 | 3.03 MB | 576 KB | 9 | unreferenced (pruned) |

`site/public/assets/listings/` (12 card thumbs + `-1024`): 1000×1000 squares mostly; `cpm-kitchen.jpg` 1088×1445 (276 KB) is the "illustration" placeholder on 7 cards; `oak-a-hall.jpg` 896×1200. **Bite:** for 8 of the 12 listing thumbs the `-1024.jpg` is *larger in bytes than the master* (sips **upscaled** 1000→1024 with less compression — e.g. `12-river-street-1024.jpg` 456 KB vs master 246 KB, `budlong-street-1024.jpg` 341 KB vs 238 KB) — phones are downloading the bigger file. Only `budlong-street.jpg`, `cpm-kitchen.jpg`, `oak-a-hall.jpg` are actually referenced (`properties.js`).

Other: `people/banner.jpg` 368 KB (Placeholder fallback, `components.jsx:25`), `photos/06_shavit_avatar.jpg` 47 KB, `photos/06_shavit_portrait.jpeg` 44 KB, `shavit-portrait.png` **995 KB** (referenced only via `SHAVIT_PHOTOS.portrait`, `data.js:31`, unused on any page), `og-image.png` 33 KB, `noise.png` 16 KB.

**Files >250 KB: 72 of 199** (all in `properties/` masters + a few `-1024` and `listings/` upscales; see CSV). Nothing in `properties/` is >1 MB; largest single image is `howder-street/02.jpg` at 802 KB.

Decoded-memory reality (what matters on iOS): a 1600×1066 master ≈ 6.8 MB RGBA decoded, 1024×682 ≈ 2.8 MB. Twelve masters mounted ≈ 80 MB — the 7/21 crash number quoted in `tenant-pages.jsx:924-926`.

### 3b. Video

`site/public/assets/hero.mp4` — 3,048,156 B, **640×360**, H.264 23.976 fps, 1,896 frames, **79.09 s**, ~308 kb/s, **plus an AAC audio track**. Referenced only by the dead constant `HERO_VIDEO` (`data.js:28`); `VideoHero` (`components.jsx:255-353`) is never mounted; `accept-714.sh:72` asserts `hero.mp4` must NOT appear in the home HTML. Verdict: not usable as cinematic media (SD, long, unmuted source); would need a fresh 1080p/4K muted, ≤10 s loop encoded to H.264 + (ideally) AV1/HEVC if video is wanted. Still served live (HTTP 200).

### 3c. 1919 Kendall case-study assets — `site/public/case-studies/1919-kendall/img/` (4.0 MB total)

| File | px | bytes | Role |
|---|---|---|---|
| `after-01.jpg` … `after-09.jpg` | 1024×682 | 103–319 KB | hero (`after-01`) + gallery (`after-02..07`); byte-identical set to `assets/properties/kendall-street/0N-1024.jpg` |
| `ba-before.jpg` / `ba-after.jpg` | 1400×933 | 572 KB / 540 KB | **Exterior pair** — best alignment (same wall/steps, slightly different lens); house grey → white/black |
| `ba2-before.jpg` / `ba2-after.jpg` | 1400×933 | 280 KB / 185 KB | **Kitchen pair** — same room, before shot is wider/from further back (drop ceiling, carpet, dark cabinets → white shaker, butcher block, LVP) |
| `ba3-before.jpg` / `ba3-after.jpg` | 1400×933 | 230 KB / 196 KB | **Bathroom pair** — same room but different angle (before: curtain from doorway; after: tiled tub head-on) — weakest for a wipe |
| `ba4-before.jpg` / `ba4-after.jpg` | 1400×933 | 215 KB / 260 KB | **Living room "during"/after** — well aligned (fireplace + two windows), honestly labelled "During" (`index.html:174-185`) |
| `cond-floor.jpg` 825×1100, `cond-bedroom.jpg` 1100×879 | | 186 / 196 KB | condition-at-acquisition |

So: **4 real pairs exist, 3 true before/after + 1 during/after; two (exterior, living room) are aligned well enough for a scroll-scrubbed wipe or crossfade at full-bleed; kitchen works as a "transformation" beat; bathroom should stay a side-by-side.** No pairs exist for any other property in the repo. Off-repo: `site/photo-pull-manifest.md:58,71` records "Before *.png" files for **15 E Saint Joe** in Shavit's Drive (skipped at export) — a second house's before set is one Drive pull away. `site/staging-assets/standard/standard-0{1,2,3}-{before,after}.jpg` (1080×810, ≤95 KB) are 3 old "The Standard" pairs that Jake removed 2026-07-02; `accept-revision.sh:113-119` still asserts `standard-N-(before|after)` must NOT ship, so don't reuse those filenames.

Kendall's card set has **no furnished/staged shots and no 1600px masters** (`properties.js:451-455`); six raw Drive frames were flagged never-ship (people/mantel photo/screenshots).

---

## 4. Data model

`site/src/properties.js` — `STATES` (`:20-24`: `{code,id,label,kicker,emptyCopy}` for MI/OH/IN) and `PROPERTIES` (`:36-466`), 15 objects. Shape (every field appears in every object):
`id, state, addrState?, status ('available'|'coming-soon'|'lease-signed'|'hidden'), name, unit|null, locale, stateName, zip, type ('Apartment'|'Single Family'|null), beds, baths (1.5 supported), sqft|null, availableDate|null, eta?, rent? ('$1,600/mo'), line, photo, photos (array|null via gallery()/pick(), :27-31), illustration (bool → legal star), zillow (real URL or zillowFor() search, :33-34), manager`.

Inventory at `767f3d8`:

| id | state / shown under | status | photos | rent | sqft |
|---|---|---|---|---|---|
| budlong-a | MI | **available** (Sept 2026) | 10 (gallery) | $1,600 | 1300 |
| stjoe-11-2 | MI | lease-signed | placeholder kitchen | — | 700 |
| oak-a | MI | lease-signed | 1 (hall) | — | 981 |
| oak-b | MI | lease-signed | placeholder | — | 450 |
| barry-a / barry-b | MI | coming-soon (Mid Aug / Oct 2026) | placeholder | $1,250 / $1,200 | 800 / 450 |
| ludlam-a / ludlam-b | MI | coming-soon (Mid Sep / Oct 2026) | placeholder | $1,000 / $1,300 | 800 / 800 |
| cedar-1114 | IN (addr MI) | lease-signed | 1 (06) | — | 1844 |
| howder-a / howder-b | MI | lease-signed | 7 (shared gallery) | — | 1100 / 500 |
| stjoe-a / stjoe-b | MI | lease-signed | 7 (shared) | — | 910 |
| norwood-60 | MI | lease-signed | placeholder | — | 1046 |
| ewing-1902 | IN | coming-soon (Oct 2026) | placeholder | $2,000 | 1704 |
| kendall-1919 | IN | lease-signed | 9 | — | null (type/beds/baths null too) |

Ohio: zero listings by Shavit's word (`:398-400`). Only **one** unit is actually available; the "showcase" quality photography is all on lease-signed homes (Howder, St Joe, Kendall) — which is exactly why a product edit should sell the *standard of finish*, not a specific unit.

`site/src/data.js`: `SITE_URL`, `BRAND='Shavit Rootman'`, `SUBLINE='Managed by Charger Property Management'`, `CONTACT` (phone/sms/email/IG/LI, `:8-22`), `res()` resource hook, `HERO_VIDEO` (dead), `SHAVIT_PHOTOS`, `pages` SEO/share copy (`:43-64`). `properties.staged.js` is a 4-line stub, must never be imported (`accept-revision.sh:150-152`).

Rendering: `StateSection` → `Carousel` → `ListingCard` (`tenant-pages.jsx:272-368`): `article.ccard.listing-card#home-<id>` → `.ccard__media` (1:1, `site.css:3447-3457`) with `<button class="ccard__media-btn">` + `<img srcset>` + `.ccard__photos-badge`, optional `.ccard__stamp` for lease-signed (`:314-316`); `.ccard__body` = status → name → type → beds/baths words → sqft → rent → line → address → star → actions (Contact Us / Apply, both gated by `PrequalModal`) → city. Card width `--card-w: min(360px, 82vw)` (`site.css:3860`). Carousel clones the set ×3 with `buffer` (inert) copies when the track overflows (`:433-442`).

---

## 5. Build / tooling

- `site/package.json:7-14`: `dev` = `vite`; `prebuild` = `node scripts/gen-sitemap.mjs` (writes `public/sitemap.xml` from `properties.js`); `build` = `vite-react-ssg build`; `postbuild` = `node scripts/patch-ssg-csp.mjs && rm -rf dist/.vite` (hashes every inline `<script>` in every built HTML — including the case-study page — into `dist/_headers` CSP); `preview`/`serve` = `vite preview` (`--port 4173`).
- Deps (`:15-24`): react 18.3.1, react-dom 18.3.1, **react-router-dom ^6.30** (installed 6.30.4 in the main worktree), vite ^5.4 (5.4.21), vite-react-ssg ^0.8.7 (0.8.9), @vitejs/plugin-react. No animation lib, no Tailwind, no test runner. Node here is v24.14.1 / npm 11.11.0.
- `site/vite.config.js:1-18`: `ssgOptions.dirStyle:'nested'`, `onPageRendered` fixes `<title data-rh>` and forces `<meta charset>` first.
- SSG entry: `site/src/main.jsx` → `ViteReactSSG({ routes, basename })`; `routes.jsx` exports the tree; per-route `<Head>` from `vite-react-ssg` (`routes.jsx:141-162`).
- `site/index.html`: boot cover + 8s inline timeout (`:14-16`) — the inline script's sha256 is what `patch-ssg-csp` pins.
- Netlify: `netlify.toml` publishes `site/dist`; `site/public/_headers` CSP = `default-src 'self'; script-src 'self' [+hashes]; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; …` → **no CDN scripts, no inline event handlers, no external fonts/styles; `media-src`/`font-src` inherit `'self'`** (so self-hosted video/fonts are fine). `_redirects`: `/companies → /`, `/case-studies → /#standard` (an id that no longer exists), `/contact → /#reach`.
- How to run: `cd site && npm install && npm run dev` (5173) · `npm run build` → `site/dist` · `npm run preview`. **This worktree has no `site/node_modules` and no `dist/`** (`.gitignore` excludes both); the sibling worktree `/Users/jakehorvitz/projects/shavit-rootman-website/site/node_modules` exists (127 pkgs) — either `npm ci` here (~1 min) or symlink; the acceptance scripts `cd site` relative to themselves so they need node_modules *in this tree*.
- Acceptance: `accept-714.sh` (current gate, spec-714 v6) — §1 build green; §2 must-have strings in `dist/index.html` (email, "Live with us.", every current address, "Deal Case Studies", "Tenants Q&amp;A", "boot-cover", `hero--montage`, `hero__addr`, `/assets/properties/budlong-street/02.jpg`, `:25-53`); §3 must-NOT (pruned addresses, "hero.mp4", removed copy, `:59-73`); §4 source greps (`Square footage coming`, `const useCarousel = true`, no `nav__wordmark::before`, no `sr:intro-seen`, no `intro__montage`, no `VideoHero` in tenant-pages, `pointerdown` in intro, `score >= 560`, only zips 49242/46613/49120, `:78-104`). Older gates `accept.sh` / `accept-revision.sh` (7/2 & 7/8 eras) still exist and encode extra bans: no `<form>` in prerendered HTML, no `standard-N-(before|after)` assets, no holding-company strings, CSS ≥ 86 KB, `properties.staged.js` never imported.

---

## 6. Three ATTACH POINTS for a cinematic edit (ranked)

Design frame: the visitor is a prospective tenant on a phone from an IG/FB link (PRODUCT.md) deciding "is this landlord professional and quality-focused?" The proof the site actually owns is a *repeatable finish* (white lap siding + black trim, white shaker + butcher block + subway + LVP — visibly the same across Howder, St Joe, Budlong, Kendall, Cedar) and one documented rebuild with numbers. That is the "product".

### #1 — "One house, rebuilt": full-bleed scroll-scrubbed before→after chapter, right under the hero
- **Where in the DOM:** a new `<section class="band" id="rebuild">` (name TBD; do not reuse `#standard`) rendered in `HomePage` between `<MontageHero/>` and `{STATES.map(...)}` (`tenant-pages.jsx:982-986`), *inside* the `!kill('sections')` wrapper so the crash bisect still isolates it. Header via existing `LineReveal h2.h-lg` + `Reveal` + `GoldRule` so it matches every other section head (`section-head--left`, `site.css:688-690`).
- **Assets:** `ba-before/after.jpg` (exterior, 1400×933) as the pinned hero pair; `ba4` (living room) and `ba2` (kitchen) as chapters 2–3; `after-01..09` for a closing 3-up; the four Snapshot numbers from `case-studies/1919-kendall/index.html:41-48` as counters (only figures already published there — no new facts). Needs 1024/-1600 responsive variants generated (only 1400 masters exist) and a WebP/AVIF pass (currently 540–572 KB JPEGs).
- **Desktop experience:** sticky 100svh stage (`position:sticky` — allowed on phones too); as the user scrolls ~200vh, the *after* frame is revealed over the *before* by a `clip-path: inset(0 X% 0 0)` (the technique the case-study slider already uses, `case-study.css:147`) or a scrub crossfade; a thin gold hairline is the wipe edge (brand rule); numbers count up as the wipe passes 60%; caption "South Bend, Indiana · rebuilt top to bottom"; CTA "Read the case study" → `/case-studies/1919-kendall/`. Zero-dep version: one `scroll` listener + rAF writing `--pos` (pattern already in `ScrollLinkedColor`, `motion.jsx:104-128`, and `ScrollProgress`). Or GSAP ScrollTrigger `scrub:true` if the technique lane recommends it.
- **Phone fallback:** the same 2 images, no pin: a static stacked before/after with a draggable handle (the case-study slider's pointer code, `index.html:279-302`, ~25 lines) — this is JS-written `clip-path`, untouched by the phone strip. Or simplest: two photos with "Before"/"After" chips. Never mount more than the 2 pair images + 3 thumbs at once; on phones use the 1024 variants (~2.8 MB decoded each).
- **Footprint:** ~120–180 lines JSX + ~120 lines CSS + 2–4 KB JS (0 deps) — or +~35 KB gz if GSAP core+ScrollTrigger. Assets +~1.2 MB new derivatives.
- **Risk:** medium. Pinning + hash deep links (`/#michigan` from the hero CTA scrolls *past* this section — must not trap); iOS memory is fine if lane A (desktop-only motion) is used; content-wise it repeats numbers Shavit already approved on the case study, but the section copy is new and needs Jake's human voice + Shavit's OK; `accept-714.sh` won't break (no banned strings; `hero--montage` stays).
- **Why it serves the tenant:** it answers "what does 'renovated' actually mean here" in one gesture, before they reach the card grid; the leased-showcase photography finally earns its place.

### #2 — Turn `/case-studies/1919-kendall/` into the product page (lowest risk, highest polish ceiling)
- **Where:** the static page (`site/public/case-studies/1919-kendall/index.html`) — outside the React tree, outside `site.css`, outside the phone strip rule, already `noindex`, already has 4 sliders + IO reveals + hero zoom. Everything can be done in `case-study.css` + its inline script (the CSP hash is regenerated by `postbuild`).
- **Assets:** all 19 images already there; add 1024 variants for the four pairs.
- **Desktop:** cinematic hero (`after-01` slow Ken-Burns is already there, `case-study.css:96-98`) → sticky-stacked "chapters" (Exterior / Kitchen / Living / Bath), each pinned while its wipe scrubs, numbers counting in the margin, BRRRR steps as a horizontal scroll strip, gallery as a hover-parallax grid; optional Lenis smooth scroll (~4 KB gz) since this page has no anchors to fight.
- **Phone:** the existing draggable sliders (already touch-native) with tap-to-toggle; no pins; the page has never crashed but also has *no* strip rule — keep filters off images (the two `backdrop-filter:blur(4px)` on grip/chips are small composited layers, acceptable).
- **Footprint:** ~200 lines CSS + ~80 lines vanilla JS; zero deps possible.
- **Risk:** low technically. Product risk: it's one click off the home page, `noindex`, its prev/next links are broken (`index.html:269-273`), and its fonts are CSP-blocked (Google Fonts) — fix by self-hosting one woff2. Also the section is investor-flavoured (ROI/LTV) — the tenant story is the photos; the numbers stay as-is (approved 8/11).

### #3 — Hero montage → living hero with a scroll hand-off
- **Where:** `MontageHero` (`tenant-pages.jsx:907-965`) + `.hero__slide` CSS (`site.css:4260-4267`).
- **Assets:** the same 12 approved slides (`MONTAGE_SETS`, `:855-874`) — Jake's explicit approve/fade list; do not add frames.
- **Desktop:** slow Ken-Burns (`transform: scale(1.0→1.06)` over 4.2 s on the active slide only — a transform on one composited layer), a scroll-linked parallax/scale-down of the hero media as you leave it (rAF `transform`, ~20 lines), h1 lines de-emphasise, and the bottom-right city chip morphs into the first inventory row's kicker. Optional: replace the interval with a scroll-driven scrubber so the montage advances on scroll (desktop only).
- **Phone:** exactly today's behaviour (hard cut, 3 mounted slides) — the phone strip already neuters CSS motion here, and JS parallax should be gated ≥768px. **Fix the invisible CTA at the same time** (`site.css:218` → give `.hero__actions > *` its final state via a class or scope the `opacity:0` to `@media (min-width:768px)`).
- **Footprint:** ~40 lines JSX + ~30 lines CSS, 0 deps.
- **Risk:** low-medium: the hero is the crash-history hot zone (`:922-929`), so keep to transform/opacity on ≤3 layers; `accept-714.sh:50-52` requires `hero--montage`, `hero__addr`, and `budlong-street/02.jpg` in the prerendered HTML — keep those. Delivers "cinematic" feel but no *argument*; pair with #1 for the story.

Not recommended: 3D (three.js ≈150 KB+ gz, nothing to model — no floor plans/scans in repo; violates the "cost honestly" bar), full-viewport WebGL/canvas (jetsam), a new video hero (no usable footage; `hero.mp4` is SD with audio).

---

## 7. Things that will block or bite the build

1. **`site/node_modules` and `site/dist` are absent in this worktree** — run `npm ci` in `site/` first (lockfile present, 101 KB); acceptance scripts require it. Sibling worktree has them (react-router-dom 6.30.4, vite 5.4.21, vite-react-ssg 0.8.9).
2. **Live phone bug** (§0/§2): hero CTA `opacity:0` on ≤767px — fix alongside any hero work; it's a one-liner but affects the primary conversion path.
3. **Phone strip rule scope**: it kills *every* CSS transition/animation/filter outside `.intro` (`site.css:3059-3069`) — new effects must be desktop-only or JS-driven transform/opacity/clip-path (§2). Adding a second exemption means on-device iOS testing (root cause "never isolated", `:3052-3058`).
4. **Image weight**: 72 files >250 KB; property masters up to 802 KB; no WebP/AVIF; the `listings/*-1024.jpg` upscale problem (§3a). Kendall has **no 1600 masters** (1086×724 card set; 1400×933 pairs) — full-bleed on a 4K/retina desktop will be soft; a Drive re-pull of the originals (99-photo upload, `properties.js:451`) is worth it. New derivatives must keep the `-1024` sibling convention if they flow through `respImg()` (`tenant-pages.jsx:16-18`, which only fires for `.jpg`).
5. **CSP**: `script-src 'self'` + hashed inline — no CDN GSAP/Lenis/three; bundle via npm. Any new inline `<script>` in a static page is auto-hashed by `scripts/patch-ssg-csp.mjs`; inline `style=""` is allowed (`'unsafe-inline'` on style-src). External fonts are blocked (case-study page currently falls back); self-host woff2 under `public/`.
6. **SSG hydration quirks documented in code**: server/client mismatch guards — `MenuOverlay` gates active-class on `mounted` (`nav.jsx:88-93`), `QaSection` reads `?qa=` in an effect not in initial state (`tenant-pages.jsx:747-754`), `LogoIntro` returns null during SSR (`intro.jsx:11-12,63`), montage renders slide 0 server-side (`:843-844`). Any new component that reads `window`/`matchMedia`/scroll on first render must do so in `useEffect` or hydration errors #418/#425 return.
7. **react-router 6.30 hash behaviour**: `Layout` scrolls to `#id` via `scrollIntoView` in an effect (`routes.jsx:177-184`); `Btn formType` navigates to `/#reach` (`components.jsx:117-121`). A pinned section between hero and `#michigan` must not intercept that jump.
8. **Acceptance gates**: `accept-714.sh` must stay green (`hero--montage`, `hero__addr`, `budlong-street/02.jpg`, no `hero.mp4`, source greps §4). Older `accept-revision.sh` bans `standard-N-(before|after)` filenames and `<form>` tags, and asserts CSS ≥ 86 KB — don't reuse those names, don't add forms (also a hard constraint), don't purge legacy CSS.
9. **Content/legal**: `InvestSection` copy is verbatim and legally sensitive (`tenant-pages.jsx:594-599,612-620`); `INVESTOR_FAQS` carry Reg-D-sensitive figures (`:33-35`) — an "edit" must not restyle those into a promotional surface. Only figures already published on the Kendall page may appear in a numbers beat. Case-study page has "Date to confirm" ×4 (`index.html:252-263`) — a timeline beat is not ready.
10. **Case-study page dead links** (`index.html:269-273`: `../clarendon-3220/`, `#`, `#`) and `_redirects` `/case-studies → /#standard` (no such id) — tidy if the edit routes people there.
11. **Dead code that will confuse a builder**: `VideoHero`, `CtaBand`, `BlueprintHouse`, `IsraeliFlagBand`, `BrrrrIcon`, `ProgressVision`, `Watermark`, `TriPaths`, `StatsGrid`, `Counter`, `HexPauseButton` (`components.jsx`) are all unreferenced; `HERO_VIDEO`, `SHAVIT_PHOTOS.portrait` (995 KB PNG) unused; `PATH_BY_KEY.standard` (`components.jsx:15-18`) points at a removed section. `Counter` (`components.jsx:158-182`) is a ready-made reduced-motion-aware count-up if #1 needs numbers.
12. **8 GB dev Mac**: `vite-react-ssg build` is light (3 routes); the cost centre is image processing — batch with `sips`/`ffmpeg`/`cwebp`, not a headless browser.

---

## Reference rows (this lane's references are the site's own live pages; format per CONTEXT.md)

| URL | Maker | Year | Found via | Technique(s) | Why it matters | Verified-open | iOS-phone risk |
|---|---|---|---|---|---|---|---|
| https://shavitrootman.com/ | Jake Horvitz for Shavit Rootman / Charger PM (this repo) | 2026 | repo `site/src/tenant-pages.jsx:907-965` | Brand splash overlay; 12-slide crossfade photo montage hero (3 mounted); IO reveals + gold hairline line-reveals; scroll-snap carousels; film grain (desktop); scroll progress; cursor ring | The baseline the edit must sit inside; every current motion primitive is here | yes — curl 200 + Playwright load 2026-08-15 | **medium**: crash history 7/21; safe only because phones strip all CSS motion — and that strip currently hides the hero CTA on phones (bug) |
| https://shavitrootman.com/case-studies/1919-kendall/ | same (static page, draft 1 → published 8/11) | 2026 | repo `site/public/case-studies/1919-kendall/index.html` | 4 pointer-drag before/after sliders (`clip-path` + `--pos`), IO `.rv` reveals, hero Ken-Burns, stats grid | The only real before→after material + approved numbers; already the closest thing to a "product page" | yes — curl HTTP/2 200 2026-08-15 | **low-medium**: no phone strip applies; ~10 images ≤1400px mounted (~40 MB decoded worst case), 2 small `backdrop-filter` layers; never reported crashing |
| https://shavitrootman.com/assets/hero.mp4 | legacy hero footage (unknown origin) | ≤2026 | repo `site/src/data.js:28` | muted-loop hero video pattern (`VideoHero`, unused) | Shows why video isn't the lever: 640×360, 79 s, audio track | yes — HTTP 200 | n/a (unused); a real hero video would be **medium** (decode + fullscreen layer) |

## Top 3 for this site

1. **The Kendall before/after pairs as a scroll-scrubbed chapter under the hero (Attach #1).** It is the only asset on the site that *proves* quality rather than asserts it, it reuses a technique already shipped and touch-tested on the case-study page (`clip-path` wipe), and it degrades to a static pair on phones without touching the crash-guard rule.
2. **The case-study page itself as the "product page" (Attach #2).** Lowest risk, outside the React/SSG/phone-strip blast radius, already has the sliders and numbers; a Lenis-smooth, pinned-chapter version of it is where an "Awwwards-tier" treatment can go furthest without endangering the home page — but it needs to be linked harder from home and de-`noindex`ed to matter.
3. **A calmer, scroll-aware montage hero (Attach #3) — with the phone CTA fix.** The 12 approved frames already carry the "same finish, many houses" story; a Ken-Burns + scroll hand-off makes it feel authored instead of a slideshow, at ~70 lines and zero deps, provided motion stays on ≤3 transform/opacity layers and everything is gated ≥768px.
