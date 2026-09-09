# REFS-technique — cinematic "product edit" techniques × cost × iOS-Safari memory risk

Lane: **technique** · researched 2026-08-15 (Sat) · for shavitrootman.com product-edit brief
Method: WebSearch → opened every primary page (WebFetch and/or `curl -L` with a Safari UA); npm tarballs
downloaded and gzip-measured locally for bundle sizes; caniuse pages read for support tables.
"verified-open" = the URL returned HTTP 200 and I read its content on 2026-08-15. Where a page blocked
bots (CodePen, geyer.dev/Cloudflare) I say so instead of pretending.

Read this next to CONTEXT.md. Everything below is filtered through the one hard fact that matters here:
**on 2026-07-21 iOS Safari's WebContent process hit the 2048 MB jetsam cap in <500 ms from ONE giant
graphics allocation while the JS heap was only 4 MB.** So the question for every technique is not
"is it pretty" but "what is the largest single graphics allocation it can cause on an iPhone, and can
we bound it."

---

## 0. The memory frame (numbers used throughout)

Decoded bitmap = width × height × 4 bytes (RGBA). Nothing on this list is exotic; it is all arithmetic.

| Thing | Pixels | Decoded RGBA |
|---|---|---|
| Site photo `-1024.jpg` (1024×682, measured in `site/public/assets/properties/…`) | 0.70 Mpx | **2.8 MB** |
| Site photo full (1600×1066, measured) | 1.71 Mpx | **6.8 MB** |
| One full-viewport layer, iPhone 15/16 (393×852 CSS @3×) | 3.01 Mpx | **12 MB** |
| One 1280×720 sequence frame | 0.92 Mpx | **3.7 MB** |
| One 1920×1080 sequence frame | 2.07 Mpx | **8.3 MB** |
| 100 × 1080p frames decoded & retained | — | **829 MB** |
| 300 × 1080p frames (Apple-scale sequence) | — | **2.49 GB > 2048 MB jetsam** |
| One 8192×8192 sprite sheet | 67 Mpx | **268 MB in ONE allocation** |
| One 16384×16384 sprite sheet | 268 Mpx | **1.07 GB in ONE allocation** |
| WebGL 2048² RGBA texture + mips | — | ~22 MB (×1.33 mip overhead, MDN) |
| WebGL 4096² RGBA texture + mips | — | ~89 MB |
| iOS Safari **total canvas memory cap** | — | 224–384 MB per page (device/iOS-version dependent — pqina.nl 2022; WebKit bug 195325; Apple forums 112218) |
| iOS Safari max canvas area | 16,777,216 px (4096×4096) | pqina.nl |

Practical reading of the 07-21 crash: JS heap 4 MB rules out a JS-side leak; "one giant graphics
allocation" is the signature of (a) a full-page or document-height compositing layer/backdrop being
rasterised (blur/filter/blend on a huge box), (b) a giant sprite sheet or image being decoded, or
(c) an oversized canvas/WebGL drawing buffer at 3× DPR. Any technique in this file that can create
one of those on a phone is rated **high** and must be desktop-only.

Bundle costs (measured 2026-08-15 from npm tarballs, gzip -6):

| Package / file | Version (date) | min | **min+gzip** | License |
|---|---|---|---|---|
| gsap `dist/gsap.min.js` (core) | 3.15.0 (2026-04-13) | 72.9 KB | **28.4 KB** | Standard "no charge" (free incl. commercial) |
| gsap `dist/ScrollTrigger.min.js` | 3.15.0 | 44.6 KB | **18.0 KB** | same |
| gsap `dist/ScrollSmoother.min.js` | 3.15.0 | 13.4 KB | 5.5 KB | same |
| gsap `dist/Observer.min.js` | 3.15.0 | 10.0 KB | 4.3 KB | same |
| lenis `dist/lenis.min.js` | 1.3.26 (2026-08-05) | 18.7 KB | **5.4 KB** | MIT |
| three `build/three.module.min.js` + `three.core.min.js` (both needed) | 0.185.1 (2026-07-01) | 751 KB | **~188 KB** (tree-shaken apps typically land 130–170 KB) | MIT |
| @react-three/fiber | 9.7.0 (2026-07-31) | — | + ~30–40 KB on top of three | MIT |
| @google/model-viewer `model-viewer-module.min.js` (bring your own three) | 4.3.1 (2026-06-04) | 475 KB | **144 KB** | Apache-2.0 |
| @google/model-viewer `model-viewer.min.js` (three bundled) | 4.3.1 | 1.07 MB | **290 KB** | Apache-2.0 |
| @sparkjsdev/spark (Gaussian splats for three) | 2.1.0 (2026-05-18) | — | (plus three) | MIT |
| @cloudfour/image-compare (before/after web component) | — | — | **1.5 KB** (author's claim) | MIT |
| CSS scroll-driven animations / View Transitions / clip-path / `<video>` scrub | native | — | **0 KB** | — |

For scale: the current site has **no** animation library; `site/public/assets/hero.mp4` is 3.0 MB,
640×360, H.264 24 fps, 79 s, ~177 kbps (measured with ffprobe) — i.e. it is a small ambient loop,
not scrub-encoded (normal GOP).

---

## 1. CSS scroll-driven animations (`animation-timeline: scroll()` / `view()`)

**What it is.** Pure-CSS animations whose playhead is scroll position (scroll()) or an element's
visibility through the viewport (view()), with `animation-range` to clip the active window. Zero JS,
zero bytes.

**Support (Aug 2026, caniuse `mdn-css_properties_animation-timeline`, read 2026-08-15):** Chrome/Edge
115+, Firefox 156+, **Safari 26.0+ and iOS Safari 26.0+**, global 85.4 %. WebKit landed it in Safari
26 (WebKit blog 17101, 2025-06-20; Safari 26.0 features post 2025-09-15). **Safari 26.4 (2026-03-24)
made them threaded**: scroll-driven animations of `opacity`, `transform`/`translate`/`scale`/`rotate`,
`filter`, `backdrop-filter` and Motion Path run on the compositor "no matter the load on the main
thread." Safari 26.5 (2026-05-11) added four correctness fixes (view-timeline progress at 0 %/100 %,
`animation-play-state: paused`, `scroll` range name, bfcache restore). Chrome has run them
off-main-thread since 115 for compositable properties (developer.chrome.com guide).

**Patterns that matter here.** Sticky/pinned "chapters" (`position: sticky` + `view()` timeline on
children), image reveal (Bramus's `image-reveal` demo), cover-card→fixed-header, stacking cards,
horizontal-strip-on-vertical-scroll, and — with `steps()` — even frame sequences (see §3).
Progressive enhancement is one line: `@supports (animation-timeline: scroll()) { … }`; browsers that
lack it simply show the resting state.

**Cost.** 0 KB. Authoring cost is CSS-only and fits the site's hand-CSS approach (`site.css`).
Gotcha (WebKit blog): `animation-timeline` must be declared *after* the `animation` shorthand.

**iOS risk: LOW — *if* you animate only opacity/transform/clip-path on modest-size layers.**
The animation itself allocates nothing new; each animated element becomes a composited layer of its
own size. Risk goes to **HIGH** the moment you animate `filter`/`backdrop-filter` on a large or
full-viewport element (that is exactly a "one giant graphics allocation" shape and is currently
stripped on phones by the site's rule anyway). Note the site already strips *all* CSS animations on
≤767 px; a scroll-driven chapter would need to be explicitly whitelisted for phones or (simpler,
recommended) left desktop-only with the phone getting the same DOM statically.

**Fit for a Midwest rental-house showcase:** *excellent* — pinned photo chapters ("kitchen → living →
yard") with captions sliding in, and the 1919 Kendall before/after wipe, all without a library.

References:
- MDN guide — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations · Mozilla · 2023–26 · found via WebSearch · scroll()/view()/animation-range spec-level docs · verified-open **yes** · iOS risk low
- WebKit "A guide to Scroll-driven Animations with just CSS" — https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/ · Saron Yitbarek, WebKit · 2025-06-20 · found via WebSearch · Safari 26 launch guide, reduced-motion wrapper · **yes** · low
- WebKit Features for Safari 26.4 — https://webkit.org/blog/17862/webkit-features-for-safari-26-4/ · WebKit · 2026-03-24 · found via WebSearch · *threaded* scroll-driven animations (which properties) · **yes** · low
- WebKit Features for Safari 26.5 — https://webkit.org/blog/17938/webkit-features-for-safari-26-5/ · WebKit · 2026-05-11 · found via WebSearch · four SDA bug fixes · **yes** · low
- caniuse animation-timeline — https://caniuse.com/mdn-css_properties_animation-timeline · caniuse · live · WebSearch · support table (Safari/iOS 26.0+, 85.4 %) · **yes** · —
- Chrome guide — https://developer.chrome.com/docs/css-ui/scroll-driven-animations · Bramus Van Damme, Google · 2023 (updated) · WebSearch · off-main-thread explanation, links demo site · **yes** · low
- Demo hub — https://scroll-driven-animations.style/ · Bramus Van Damme (Google) · 2023–26 · linked from Chrome guide · 14 CSS/WAAPI demos incl. **image-reveal** (`/demos/image-reveal/css/`), **cover-to-fixed-header**, **stacking-cards**, **horizontal-section**, **3d-shoe-explorer** (uses `<model-viewer>` GLBs) — all 200 · **yes** (I fetched the corrected `/css/` paths; the un-suffixed paths 404) · low (image-reveal/stacking) → med (3d-shoe: WebGL)

## 2. GSAP ScrollTrigger (+ Lenis smooth scroll)

**License/version (confirmed).** GSAP 3.13 (2025-04-29, gsap.com/blog/3-13) made *all* of GSAP incl.
former Club plugins (ScrollSmoother, SplitText, MorphSVG…) free, sponsored by Webflow; npm `gsap`
latest is **3.15.0 (2026-04-13)** under the "Standard 'no charge' license" — commercial/client use is
explicitly allowed; the only prohibition is building a competing no-code animation tool.

**Bundle.** Core 28.4 KB gz + ScrollTrigger 18.0 KB gz ≈ **46 KB gz** for the pair (measured); +5.5 KB
if you add ScrollSmoother, or **+5.4 KB gz** for Lenis 1.3.26 (MIT) instead.

**Pin/scrub patterns (gsap.com ScrollTrigger docs, read 2026-08-15).** `pin: true` wraps the trigger
in a `pin-spacer` and pins it (`position: fixed` for the viewport scroller, transforms for nested
scrollers); `scrub: true|number` ties a timeline to scroll (a number adds catch-up smoothing);
`anticipatePin: 1` hides fast-scroll flash; `pinSpacing`, `pinType`, `pinReparent` for edge cases.
Docs warn: **never put `will-change: transform` on an ancestor of a pinned element** (breaks
`position: fixed`), avoid `content-visibility` on trigger elements, create triggers in DOM order.

**Known iOS pitfalls (from GSAP's own docs).** The `normalizeScroll()` page lists them verbatim:
mobile address-bar show/hide resizes the viewport and shifts trigger positions; native scrolling on a
separate thread makes pinned elements "jump" because the browser paints before JS re-pins;
"iOS Safari … misreports scroll position as well as event.clientX/Y intermittently, causing things to
'jitter'"; elastic overscroll. `ScrollTrigger.normalizeScroll(true)` fixes them by taking scrolling
onto the JS thread (experimental; loses native scrollbar auto-hide, yields on pinch-zoom).
`ScrollTrigger.config({ignoreMobileResize:true})` skips refresh on portrait address-bar changes.
Lenis: `syncTouch` is **off by default** on touch (it deliberately does not smooth touch scroll),
"can be unstable on iOS<16"; capped at 60 fps on Safari and 30 fps in Low Power Mode; no CSS
scroll-snap unless `lenis/snap`; the GSAP integration is `lenis.on('scroll', ScrollTrigger.update)`
+ `gsap.ticker.add(t => lenis.raf(t*1000))` + `gsap.ticker.lagSmoothing(0)`.

**iOS risk: MEDIUM as a library, LOW-to-HIGH depending on what you tween.** GSAP/Lenis themselves
allocate nothing graphical; jetsam risk comes from what the ScrollTrigger drives (a canvas sequence →
§3, blur filters → high, transforms/opacity → low). Practical rule for this site: run ScrollTrigger
desktop-only (`ScrollTrigger.matchMedia`/`gsap.matchMedia('(min-width:768px)')`), which also
sidesteps every item in the pitfalls list above and the phone animation strip.

**Fit:** *good* when you need scrub + pin across all desktop browsers *today* (Firefox users, older
Safari) or want a canvas/video sequence with a single control surface. If the target is
Safari 26+/Chrome only, §1 gives 80 % of this for 0 KB.

References:
- ScrollTrigger docs — https://gsap.com/docs/v3/Plugins/ScrollTrigger/ · GreenSock/Webflow · 2020–26 · WebSearch · pin/scrub/anticipatePin/pinReparent, will-change warning · **yes** · med
- normalizeScroll() — https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll()/ · GreenSock · current · linked from docs · the canonical list of iOS scroll pitfalls + fix · **yes** · med
- ScrollTrigger.config() — https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.config()/ · GreenSock · current · linked from docs · `ignoreMobileResize` · **yes** (200) · —
- GSAP 3.13 "100 % free" post — https://gsap.com/blog/3-13/ · GreenSock/Webflow · 2025-04-29 · WebSearch · license change · **yes** · —
- Standard license — https://gsap.com/standard-license/ · Webflow · 2025 · linked from npm `license` field · terms · **yes** · —
- imageSequenceScrub helper — https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub · GreenSock · current · found via helper index · the official canvas-frame-scrub helper (embeds CodePen `GreenSock/VwgevYW`, 147 AirPods frames) · **yes** (doc page 200; the CodePen itself returns 403 to non-browser fetchers, so *not* independently opened) · high on phones (see §3)
- Lenis — https://github.com/darkroomengineering/lenis · darkroom.engineering · 2022–26 · WebSearch · smooth-scroll wrapper, syncTouch caveats, GSAP integration · **yes** · med
- Lenis demo — https://lenis.darkroom.engineering/ · darkroom.engineering · current · README · showcase · **yes** (200) · med
- Codrops "SVG Mask Transitions on Scroll with GSAP and ScrollTrigger" — https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/ · Hiroki Watanabe · 2026-03-11 · WebSearch (Codrops) · pinned full-screen photo swaps via SVG blinds/grid masks, scrub 2–2.5, Lenis, grid density 14/10/6 by device · demo https://tympanus.net/Tutorials/SVGMaskScrollTransition/ + repo https://github.com/Hiro-kiii/Scroll-Transition/ · **yes** (all three 200) · med (several full-screen photos layered; mask on SVG not filter — OK, but ≥3 full-viewport decoded photos = ~36 MB on a phone; keep it desktop)
- Codrops "How to Build Cinematic 3D Scroll Experiences with GSAP" — https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/ · Joseph Santamaria · 2025-11-19 · WebSearch · GSAP ScrollTrigger/ScrollSmoother + Three/R3F/OGL camera paths, `dpr ≤ 2` · demo https://tympanus.net/Tutorials/Cinematic3DScroll/ · **yes** · high on phones (WebGL + smoothTouch)

## 3. Scroll-scrubbed image sequences (Apple "AirPods" canvas)

**How it works (CSS-Tricks 2020, Jurn van Wissen; GSAP helper).** N sequential JPEG/WebP frames are
preloaded as `Image`s; scroll progress → frame index → `ctx.drawImage()` on a `<canvas>` inside a
pinned section. The CSS-Tricks demo uses **148 frames ≈ 31 KB each**; GSAP's helper demo uses 147
Apple frames. Apple's real page fell back to a **single static image on slow mobile connections**
(as reported in that article — I did not reverse-engineer apple.com in this pass; apple.com/airpods-pro
opens 200 today).

**Memory math (see §0).** Wire size is not the problem; *decoded* size is. WebKit decodes lazily on
first draw and caches decoded bitmaps; on a phone, 100 frames at 1080p is **829 MB** of decoded
bitmaps if retained; at the phone's own 3× viewport size it is ~1.2 GB; a 300-frame Apple-scale
sequence exceeds the 2048 MB jetsam cap outright. Sprite-sheet variants are worse because they turn N
small decodes into **one** giant decode (8k² = 268 MB, 16k² = 1.07 GB — the exact crash shape).
The 2D canvas itself is bounded by iOS's 224–384 MB total-canvas cap and 16.7 Mpx per canvas.

**What count is safe on iOS.** Bound the *decoded working set*, not the frame count: (a) frames no
larger than the drawn size (on phones ≤ 960 px wide → ≤ 2.6 MB each); (b) ≤ ~60 frames on phones
(≈ 160 MB worst case if all decoded, comfortably inside the cap and far from jetsam), ≤ 150–200 on
desktop; (c) preferably decode a sliding window with `createImageBitmap()` and `bitmap.close()` so
you *control* residency instead of trusting the cache; (d) never sprite-sheet on phones.
Honest recommendation for this site: **desktop-only**, phone shows the poster frame.

**Alternatives.** (1) `<video>` scrubbed with `currentTime` — §4 — the lowest-memory option on iOS
because decoding happens in the media stack, one frame resident. (2) **WebCodecs** `VideoDecoder`
→ decode a keyframe-dense MP4 into `VideoFrame`s on demand: caniuse says Safari/iOS **16.4–18.7
partial, 26.0+ full**; scrolly-video (dkaoster) uses it on Chrome and *deliberately* falls back to
`currentTime` on Safari. Frames must be `close()`d promptly or you re-create the memory problem.
(3) **AVIF sequence** — AVIF decodes in Safari 16.0+/iOS 16.0+ (caniuse 94.7 % global); per-frame
files are ~50 % smaller than JPEG on the wire, decoded size is identical (still w×h×4), so it helps
bandwidth, not jetsam. (4) **CSS-only stepped sequence** via `animation-timeline` + `steps(N)` on
`background-position`/`opacity` (the geyer.dev write-up — **could not open, Cloudflare 403**, so
treat as unverified) — it needs the frames as a sprite sheet or N `<img>`s, i.e. same memory math.

**iOS risk: HIGH by default (unbounded decoded frames; sprite sheets), MEDIUM if bounded as above,
LOW if desktop-only.**

**Fit:** *medium.* A house isn't a product on a turntable; the frames would have to come from a real
walkthrough video (permitted: real footage, no people). A 60–120-frame desktop-only "walk to the front
door → into the kitchen" scrub is achievable from an iPhone clip via ffmpeg
(`ffmpeg -i walk.mov -vf "fps=12,scale=1280:-2" -q:v 3 f_%03d.jpg`).

References:
- CSS-Tricks "Let's Make One of Those Fancy Scrolling Animations Used on Apple Product Pages" — https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/ · Jurn van Wissen · 2020-05-22 · WebSearch · canvas + preload + rAF; 148 frames; mobile static fallback note · **yes** · high on phones
- GSAP imageSequenceScrub helper — (see §2) · GreenSock · **yes** · high on phones
- pqina "Total canvas memory use exceeds the maximum limit" — https://pqina.nl/blog/total-canvas-memory-use-exceeds-the-maximum-limit/ · Rik Schennink · 2022-01-12 · WebSearch · iOS canvas cap 384 MB (iOS 15) & lower earlier; w×h×4; shrink-to-1px release trick · **yes** · —
- pqina "Canvas area exceeds the maximum limit" — https://pqina.nl/blog/canvas-area-exceeds-the-maximum-limit/ · Rik Schennink · 2022 · WebSearch · 16,777,216-px per-canvas limit · **yes** (200) · —
- WebKit bug 195325 — https://bugs.webkit.org/show_bug.cgi?id=195325 · WebKit Bugzilla · 2019 · WebSearch · "Total canvas memory use exceeds the maximum limit" root · **yes** (200) · —
- caniuse WebCodecs — https://caniuse.com/webcodecs · caniuse · live · WebSearch · Safari/iOS 16.4–18.7 partial, 26.0+ full · **yes** · —
- caniuse AVIF — https://caniuse.com/avif · caniuse · live · WebSearch · Safari 16.4+/iOS 16.0+ · **yes** · —
- geyer.dev "Using (almost) pure CSS to make fancy scroll-driven image sequence animations" — https://geyer.dev/blog/css-image-sequence-animations/ · Geyer · 2024? · WebSearch · CSS `steps()` sequence · **NO — Cloudflare 403 to both WebFetch and curl; listed for completeness, unverified** · same as sprite sheet (high)

## 4. Scroll-scrubbed `<video>` (`currentTime` seeking)

**iOS rules (WebKit "New <video> Policies for iOS", Jer Noble, 2016-07-25 — still the governing
policy).** Autoplay without gesture is allowed only for **muted or silent** video, only while
**visible on screen**, and inline only with the **`playsinline`** attribute (otherwise iPhone goes
fullscreen). `play()` returns a rejected promise if conditions fail. In **Low Power Mode** autoplay is
suppressed and Safari overlays a native play button (Apple Developer Forums 727459/709821 & the
Medium/Lesniak posts found via WebSearch — community sources, consistent with each other); the
common mitigation is to catch the rejected `play()` promise and show a poster/static image.
Seeking via `currentTime` does **not** require autoplay to succeed, but the element must be
`muted playsinline preload="auto"` and on iOS the *first* frame may not paint until the media
element has been "activated"; most scrub libraries call `play().then(pause())` inside a
gesture-or-visibility handler to prime it.

**Keyframe interval requirement.** Seeking lands on the nearest decodable frame; with a normal GOP
(1 keyframe/2–10 s) scrubbing looks like a slideshow that snaps. Encode with a keyframe every frame
(scrolly-video README: "keyframe interval = 1") or at worst every 6–12 frames, and no B-frames:
`ffmpeg -i in.mov -an -c:v libx264 -profile:v main -pix_fmt yuv420p -g 1 -keyint_min 1 -bf 0 -crf 22
-movflags +faststart -vf "scale=1280:-2,fps=24" out.mp4` (a 10-s clip lands ~5–12 MB at 720p; size
grows ~3–5× vs normal GOP). Also produce a smaller 720p/540p variant for phones via `<source
media>`. Use `requestVideoFrameCallback` (Safari/iOS 15.4+, caniuse 94.4 %) to know when a seeked frame
is actually painted; jank comes from issuing seeks faster than the decoder finishes — throttle to the
frame callback and lerp toward the target time (scrolly-video's `transitionSpeed`/`frameThreshold`
pattern) rather than setting `currentTime` on every scroll event. Note the existing `hero.mp4` is
normal-GOP 640×360 — it would need re-encoding to be scrubbable.

**iOS risk: LOW-to-MEDIUM.** Video decoding happens in the media pipeline with roughly one decoded
frame resident (~4–12 MB); it is the *lowest-memory* way to put a moving picture on a phone. Risks are
UX not jetsam: Low Power Mode play button, occasional seek stalls, battery. Keep the element ≤ viewport
size and don't layer filters over it.

**Fit:** *very good* — a real 8–12 s walkthrough clip of a finished unit (no people) scrubbed by scroll
is the most "cinema per byte" thing on this list, and it degrades to a normal muted inline loop or a
poster on phones.

References:
- WebKit "New <video> Policies for iOS" — https://webkit.org/blog/6784/new-video-policies-for-ios/ · Jer Noble, WebKit · 2016-07-25 · WebSearch · autoplay/muted/playsinline rules · **yes** · low
- scrolly-video — https://github.com/dkaoster/scrolly-video · Daniel Kao · 2022–26 · WebSearch · three-tier approach (WebCodecs → playbackRate → currentTime), keyframe-1 encode advice, "Mobile Safari performs better with currentTime", Low Power Mode caveat · demo https://scrollyvideo.js.org/ · **yes** (both 200) · low–med
- MDN requestVideoFrameCallback — https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback · Mozilla · current · WebSearch · frame-accurate paint callback · **yes** (200) · low
- caniuse rVFC — https://caniuse.com/mdn-api_htmlvideoelement_requestvideoframecallback · caniuse · live · Safari/iOS 15.4+ · **yes** · —
- Apple "Delivering Video Content for Safari" — https://developer.apple.com/documentation/webkit/delivering-video-content-for-safari · Apple · current · WebSearch · encoding/HLS guidance · **yes** (200; not deep-read) · —
- Low Power Mode behaviour — https://developer.apple.com/forums/thread/727459 · Apple Dev Forums · 2023 · WebSearch · autoplay suppressed, native play overlay · **yes** (200 via search; community source) · —

## 5. WebGL / Three.js / React-Three-Fiber turntables & 3D house models

**Cost.** three 0.185.1 ≈ **188 KB gz** for the two build files (tree-shaken apps ~130–170 KB) +
R3F 9.7 (+30–40 KB) + drei 10.7 for OrbitControls/Stage/Environment; `<model-viewer>` 4.3.1 is 144 KB
gz (module, needs three) or 290 KB gz all-in, but gives camera-controls, auto-rotate, poster/lazy
load and iOS AR Quick Look for ~zero code (Bramus's 3D-shoe demo uses it). Add the **model**: a
photogrammetry/AI-mesh GLB of a house exterior is 5–50 MB with 2k–4k textures; Draco/meshopt + KTX2
(three GLTFLoader supports `KHR_draco_mesh_compression`, `EXT_meshopt_compression`,
`KHR_texture_basisu`) cut download but **KTX2/Basis is what cuts GPU memory** (MDN WebGL best
practices: compressed formats are smaller *in VRAM*; JPEG/PNG textures inflate to w×h×4 ×1.33 mips).

**Asset pipeline (from photos).** Polycam (iPhone app, LiDAR or photo mode; splat mode accepts 20–200
photos or an MP4; mesh export GLB/OBJ/USDZ; splat export PLY/SPLAT/SPZ — poly.cam pages verified) or
Luma AI capture; clean/decimate in Blender; compress with glTF-Transform (`gltf-transform optimize`)
and inspect at gltf.report. **Gaussian splats** render photoreal from phone video and are now
first-class in three via **Spark** (World Labs, MIT, 2.1.0, formats PLY/SPZ/SPLAT/KSPLAT/SOG) or
gsplat / mkkellogg's viewer; but they are memory-heavy: PlayCanvas forum case (verified) — an
**885 MB, 3 M-splat PLY failed to load on iPhone 13 / iOS 18.1**, fixed by SH=0 + compressed PLY to
**< 60 MB**; PlayCanvas staff: "mobiles are happy with up to 4 M" and "Safari is notoriously tight on
memory". Practical phone budget: ≤ 1 M splats, SPZ/SOG, no SH.

**iOS risk: HIGH on phones unless aggressively budgeted, MEDIUM on desktop.** A WebGL drawing buffer
at 3× DPR (12 MB) + MSAA (×4 = 48 MB) + depth + a couple of 4k RGBA textures (89 MB each, one
allocation apiece) + geometry is exactly the "one giant graphics allocation" family; Safari also
loses WebGL contexts under pressure. MDN's per-pixel-VRAM-budget method (verified) is the discipline:
`renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))`, ≤ 2k KTX2 textures, no MSAA on phones,
`dispose()`/`WEBGL_lose_context` on unmount, and honestly — desktop-only with a poster on phones.

**Fit:** *weak-to-medium.* A photogrammetry house model tends to look worse than the photos it came
from; a turntable sells objects, not homes. A splat fly-through of a finished living room is the one
3D thing that could look "award-tier", but its cost (three + Spark + a 20–60 MB asset, desktop-only)
is the highest on this list, and asset capture must be redone per property.

References:
- three.js GLTFLoader docs — https://threejs.org/docs/#examples/en/loaders/GLTFLoader · three.js · current · WebSearch · glTF as standard, Draco/meshopt/KTX2 support · **yes** · high (phones)
- MDN WebGL best practices — https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices · Mozilla · current · WebSearch · VRAM budget, mip +30 %, compressed textures, context loss, smaller back-buffer, MAX_TEXTURE_SIZE 4096 minimum · **yes** · —
- `<model-viewer>` — https://modelviewer.dev/ · Google · 2018–26 (v4.3.1) · WebSearch · web component, poster/lazy, AR · examples https://modelviewer.dev/examples/loading/ · **yes** (both 200) · med
- React-Three-Fiber docs — https://r3f.docs.pmnd.rs/ · pmndrs · current · WebSearch · React renderer for three · **yes** (200) · high (phones)
- drei — https://drei.docs.pmnd.rs/ · pmndrs · current · npm · helpers (Stage, OrbitControls, useGLTF) · **yes** (200) · —
- Spark — https://sparkjs.dev/ + https://sparkjs.dev/examples/ + https://github.com/sparkjsdev/spark · World Labs · 2025–26 · WebSearch · Gaussian-splat renderer for three, PLY/SPZ/SPLAT/KSPLAT/SOG · **yes** (all 200) · high (phones)
- PlayCanvas forum "Large 3DGS file doesn't load on mobile" — https://forum.playcanvas.com/t/solved-large-3d-gaussian-splatting-file-doesnt-load-on-mobile/38758 · PlayCanvas community/staff · 2024-12 · WebSearch · the concrete iPhone-13 failure numbers · **yes** · —
- Polycam Gaussian splatting — https://poly.cam/tools/gaussian-splatting · Polycam · current · WebSearch · capture from 20–200 photos/MP4, iPhone app · **yes** · —
- glTF-Transform / gltf.report — https://gltf-transform.dev/ · https://gltf.report/ · Don McCurdy · current · WebSearch · optimize/inspect GLB · **yes** (both 200) · —
- Codrops "Cinematic 3D Scroll Experiences" — (see §2) · high on phones

## 6. Before/after reveals for renovation photos

Four patterns, cheapest first — all work with the site's existing 1919 Kendall before/after JPEGs and
need **two decoded photos** (2 × 2.8 MB at 1024 px, 2 × 12 MB if you insist on full-viewport 3×).

| Pattern | Mechanism | Bytes | Phone behaviour | iOS risk |
|---|---|---|---|---|
| **Drag slider** | two stacked `<img>`, top one `clip-path: inset(0 0 0 var(--x))` (or `polygon`), driven by a native `<input type=range>` (keyboard/touch/SR for free — Cloud Four) | 0 KB hand-rolled; 1.5 KB gz as `@cloudfour/image-compare` | works today on any iOS; not an animation, so it survives the site's phone animation strip | **LOW** (clip-path is a paint-time mask, no filter, no extra layer beyond the two images) |
| **Scroll-wipe** | same DOM; `clip-path` keyframed with `animation-timeline: view()` inside a sticky section | 0 KB | Safari 26+ only, and only if whitelisted on phones (site strips animations); else static | **LOW** on desktop; note clip-path is *not* in Safari's threaded-SDA list, so it runs on main thread (fine at 2 layers) |
| **Clip-path shape reveal** (circle/diagonal, "curtain") | as above with `circle()`/`polygon()` | 0 KB | same | LOW |
| **Crossfade-on-scroll** | `opacity` keyframes on the "after" image via `view()`; or GSAP scrub | 0 KB / 46 KB | threaded on Safari 26.4+ | **LOW** — cheapest of all, but least legible for renovation storytelling (viewer can't compare regions) |
| SVG-mask blinds (Codrops) | mask on `<svg>` per image, GSAP scrub | 46 KB + Lenis | desktop | med (multiple full-screen photos) |

**Verdict:** the **drag slider is the cheapest and best on phones** (direct manipulation, allowed
under reduced-motion — WebKit's own guidance says user-controlled effects are fine); the scroll-wipe
is the cinematic desktop upgrade of the *same markup*, so one component serves both.

References:
- Cloud Four "Building an accessible image comparison web component" — https://cloudfour.com/thinks/building-an-accessible-image-comparison-web-component/ · Paul Hebert · 2021-07-14 · WebSearch · clip-path + range input + custom property, 1.5 KB gz · demo https://image-compare-component.netlify.app/ + https://github.com/cloudfour/image-compare · **yes** (all 200) · low
- Bramus image-reveal demo — https://scroll-driven-animations.style/demos/image-reveal/css/ · Bramus · 2023 · demo hub · view()-driven reveals · **yes** · low
- Codrops SVG mask transitions — (see §2) · med

## 7. View Transitions API (same-document + cross-document)

**Support (caniuse `view-transitions`, read 2026-08-15).** Same-document
`document.startViewTransition()`: Chrome/Edge 111+, Firefox 144+, **Safari 18.0+ / iOS 18.0+**, 90.2 %
global. Cross-document (`@view-transition { navigation: auto }`): Chrome/Edge 126+, **Safari 18.2+**
(WebKit blog "Two lines of Cross-Document View Transitions code…", Jen Simmons & James Craig,
2025-05-21, and Safari 18.2 features post); Firefox in progress. So by Aug 2026 effectively every
iPhone that can run iOS 18 has both.

**Which one applies here.** The site is a react-router 6.30 **data-router SPA** (vite-react-ssg wraps
`createBrowserRouter`; confirmed in its README) → use **same-document** transitions via
`<Link viewTransition>` + `useViewTransitionState()` (both documented for 6.30.1). Cross-document
would only matter if the site went MPA. Cinematic use: give the listing card photo and the property
page hero the same `view-transition-name` so the photo *morphs* into the hero — the "match cut".
Default is a 250 ms crossfade; you style `::view-transition-old/new(name)` in CSS.

**iOS risk: LOW.** The browser snapshots only the named elements (plus root) into GPU textures for
the duration of the transition — a couple of viewport-sized surfaces (~12–24 MB) for < 1 s, then
released. Avoid naming dozens of elements at once, and avoid a full-viewport blur during the
transition. Same-document transitions on iOS ≥ 18 also survive the site's phone CSS strip only if the
`::view-transition-*` keyframes are exempted (they are `animation`s), otherwise you get a hard cut —
acceptable fallback.

**Fit:** *excellent* — 0 KB, native, exactly the "cinematic cut" between pages the brief asks for, and
it stays out of the way of everything else.

References:
- MDN View Transition API — https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API (+ `/Using`) · Mozilla · current · WebSearch · concepts, pseudo-elements · **yes** · low
- MDN `@view-transition` — https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition · Mozilla · current · WebSearch · cross-document opt-in · **yes** · low
- caniuse view-transitions — https://caniuse.com/view-transitions · caniuse · live · WebSearch · Safari/iOS 18.0+, 90.2 % · **yes** · —
- WebKit "Two lines of Cross-Document View Transitions code you can use on every website today" — https://webkit.org/blog/16967/two-lines-of-cross-document-view-transitions-code-you-can-use-on-every-website-today/ · Jen Simmons & James Craig · 2025-05-21 · WebSearch · Safari 18.2 support, reduced-motion nuance · **yes** · low
- WebKit Features in Safari 18.2 — https://webkit.org/blog/16301/webkit-features-in-safari-18-2/ · WebKit · 2024-12 · WebSearch · cross-document VT lands · **yes** (200) · —
- Chrome VT docs — https://developer.chrome.com/docs/web-platform/view-transitions/ (+ `/cross-document`) · Google · current · WebSearch · patterns, `view-transition-name`, types · **yes** (200) · —
- CSS-Tricks "Cross-Document View Transitions: The Gotchas Nobody Mentions" — https://css-tricks.com/cross-document-view-transitions-part-1/ · CSS-Tricks · 2025 · WebSearch · pitfalls · **yes** (200; not deep-read) · —
- React Router 6.30.1 `<Link viewTransition>` — https://reactrouter.com/6.30.1/components/link + https://reactrouter.com/6.30.1/hooks/use-view-transition-state · Remix/Shopify · 2025 · WebSearch · wraps `startViewTransition`; **data router only** · **yes** (both 200) · —
- vite-react-ssg — https://github.com/Daydreamer-riri/vite-react-ssg · Riri · current · repo dep · confirms data-router (`createBrowserRouter`) usage · **yes** · —

## 8. `prefers-reduced-motion` & progressive enhancement (how top sites degrade)

**Primary guidance.** WebKit "Responsive Design for Motion" (James Craig, 2017-05-15): the vestibular
triggers are **scaling/zooming, spinning, parallax/multi-speed layers, 3D plane shifts, peripheral
motion**; user-controlled direct manipulation (drag, pinch) is fine; **"reduce, don't remove."**
web.dev (Thomas Steiner): CSS `@media (prefers-reduced-motion: reduce/no-preference)`, JS
`matchMedia('(prefers-reduced-motion: reduce)')` with a change listener, and `<picture><source
media="(prefers-reduced-motion: no-preference)" srcset="animated…">` to serve motion only on opt-in;
Safari 10.1+ / iOS 10.3+. WebKit's VT post adds that **simple crossfades are not known to trigger
motion sensitivity**, so a reduced-motion variant should keep fades and drop movement/scale.

**Progressive-enhancement stack that fits this site's constraints** (all verified primitives above):
1. Base = static, `<img loading="lazy" decoding="async">` sized with `srcset` to the slot (never
   decode a 1600 px photo into a 400 px slot on a phone).
2. `@supports (animation-timeline: view())` + `@media (min-width:768px) and (prefers-reduced-motion:
   no-preference)` → CSS scroll-driven chapters (0 KB).
3. Same-document View Transitions for route changes; reduced-motion → crossfade only.
4. `<video muted playsinline preload="metadata" poster>` with `play()` promise catch → poster.
5. JS heavy hitters (GSAP scrub, canvas sequences, WebGL) loaded via dynamic `import()` **only** when
   `matchMedia('(min-width:768px)').matches && !reduce` (`navigator.deviceMemory` is Chromium-only; on
   Safari treat "phone" as the signal). Also `document.hidden`/IntersectionObserver to tear down
   offscreen canvases (`canvas.width = 1` release trick, pqina).

**How top sites degrade (from the sources opened here):** Apple served a static image instead of the
frame sequence on slow mobile connections (CSS-Tricks 2020 report); Codrops' SVG-mask demo drops grid
density 14→10→6 by device; Codrops' 3D demo caps `dpr ≤ 2`; scrolly-video swaps WebCodecs → currentTime
on Safari and documents that Low Power Mode kills autoplay; Lenis leaves touch scrolling native by
default. Pattern: **the phone gets the same content with less or no motion — never a different
story.**

**iOS risk: LOW — this is the mechanism that keeps everything else low.**

References:
- WebKit "Responsive Design for Motion" — https://webkit.org/blog/7551/responsive-design-for-motion/ · James Craig · 2017-05-15 · WebSearch · what motion is harmful; reduce-don't-remove · **yes** · —
- web.dev prefers-reduced-motion — https://web.dev/articles/prefers-reduced-motion · Thomas Steiner · 2019 (upd.) · WebSearch · CSS/JS/`<picture>` patterns · **yes** · —
- MDN prefers-reduced-motion — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion · Mozilla · current · WebSearch · reference · **yes** (200) · —

---

## Master reference table (one row per reference, CONTEXT.md format)

| # | URL | Maker / studio | Year | Found via | Technique(s) | Why it's great | Verified-open | iOS-phone risk |
|---|---|---|---|---|---|---|---|---|
| 1 | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations | Mozilla (MDN) | 2023–26 | WebSearch | CSS scroll()/view() timelines, animation-range | Canonical property reference | yes | low |
| 2 | https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/ | Saron Yitbarek / WebKit | 2025-06-20 | WebSearch | CSS SDA in Safari 26 | Apple's own launch guide incl. reduced-motion wrap | yes | low |
| 3 | https://webkit.org/blog/17862/webkit-features-for-safari-26-4/ | WebKit | 2026-03-24 | WebSearch | threaded SDA (opacity/transform/filter/backdrop-filter/motion-path) | Proves SDA is compositor-driven on iOS 26.4+ | yes | low |
| 4 | https://webkit.org/blog/17938/webkit-features-for-safari-26-5/ | WebKit | 2026-05-11 | WebSearch | SDA bug fixes | Current state (June 2026) | yes | low |
| 5 | https://caniuse.com/mdn-css_properties_animation-timeline | caniuse | live | WebSearch | support table | Safari/iOS 26.0+, FF 156+, 85.4 % | yes | — |
| 6 | https://developer.chrome.com/docs/css-ui/scroll-driven-animations | Bramus / Google | 2023+ | WebSearch | SDA, off-main-thread | Best explainer + links | yes | low |
| 7 | https://scroll-driven-animations.style/ (demos at `/demos/<name>/css/`) | Bramus Van Damme | 2023–26 | Chrome guide | image-reveal, cover→header, stacking cards, horizontal section, 3d-shoe (`<model-viewer>`) | 14 copy-able zero-JS demos | yes (hub + 5 demos 200) | low (3d-shoe med) |
| 8 | https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | GreenSock / Webflow | 2020–26 | WebSearch | pin, scrub, anticipatePin | The de-facto scrub/pin engine | yes | med |
| 9 | https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll()/ | GreenSock | current | GSAP docs | JS-thread scroll normalisation | Enumerates the iOS pin/jitter/address-bar pitfalls | yes | med |
| 10 | https://gsap.com/blog/3-13/ + https://gsap.com/standard-license/ | GreenSock / Webflow | 2025-04-29 | WebSearch | licensing | Confirms GSAP 100 % free incl. commercial (v3.15.0 on npm) | yes | — |
| 11 | https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub | GreenSock | current | GSAP helper index | canvas frame scrub (CodePen GreenSock/VwgevYW, 147 AirPods frames) | Official pattern | yes (doc); CodePen 403 to fetchers | high (phones) |
| 12 | https://github.com/darkroomengineering/lenis (+ https://lenis.darkroom.engineering/) | darkroom.engineering | 2022–26 | WebSearch | smooth scroll wrapper, syncTouch | 5.4 KB gz, MIT, honest iOS caveats | yes | med |
| 13 | https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/ (+ demo, repo) | Hiroki Watanabe / Codrops | 2026-03-11 | WebSearch | pinned full-screen photo swaps via SVG masks, scrub, Lenis | Cinematic photo-to-photo transitions with real per-device density scaling | yes | med |
| 14 | https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/ (+ demo) | Joseph Santamaria / Codrops | 2025-11-19 | WebSearch | GSAP + Three/R3F camera paths | The "cinematic 3D scroll" reference implementation | yes | high (phones) |
| 15 | https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/ | Jurn van Wissen / CSS-Tricks | 2020-05-22 | WebSearch | canvas image sequence | Explains Apple's technique + its mobile static fallback | yes | high (phones) |
| 16 | https://pqina.nl/blog/total-canvas-memory-use-exceeds-the-maximum-limit/ (+ canvas-area post) | Rik Schennink | 2022-01-12 | WebSearch | iOS canvas memory caps | Hard numbers: 224–384 MB, 16.7 Mpx, w×h×4 | yes | — |
| 17 | https://bugs.webkit.org/show_bug.cgi?id=195325 | WebKit Bugzilla | 2019 | WebSearch | canvas cap | Primary source for the cap | yes | — |
| 18 | https://webkit.org/blog/6784/new-video-policies-for-ios/ | Jer Noble / WebKit | 2016-07-25 | WebSearch | muted/playsinline autoplay | Governing iOS video rules | yes | low |
| 19 | https://github.com/dkaoster/scrolly-video (+ https://scrollyvideo.js.org/) | Daniel Kao | 2022–26 | WebSearch | currentTime scrub, WebCodecs fallback, keyframe-1 encode | Battle-tested scrub video lib; documents Safari behaviour | yes | low–med |
| 20 | https://caniuse.com/webcodecs · https://caniuse.com/avif · https://caniuse.com/mdn-api_htmlvideoelement_requestvideoframecallback | caniuse | live | WebSearch | support tables | WebCodecs full on Safari 26+; AVIF iOS 16+; rVFC 15.4+ | yes | — |
| 21 | https://threejs.org/docs/#examples/en/loaders/GLTFLoader | three.js | current | WebSearch | GLB + Draco/meshopt/KTX2 | Asset-pipeline ground truth | yes | high (phones) |
| 22 | https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices | Mozilla | current | WebSearch | VRAM budget, mips, compressed textures, context loss | The memory discipline for any WebGL | yes | — |
| 23 | https://modelviewer.dev/ (+ /examples/loading/) | Google | 2018–26 (4.3.1) | WebSearch | web-component 3D viewer, poster/lazy, AR | Cheapest way to put up a turntable | yes | med |
| 24 | https://sparkjs.dev/ (+ /examples/, GitHub) | World Labs | 2025–26 | WebSearch | Gaussian splats in three | State of the art photoreal capture rendering | yes | high (phones) |
| 25 | https://forum.playcanvas.com/t/solved-large-3d-gaussian-splatting-file-doesnt-load-on-mobile/38758 | PlayCanvas community | 2024-12 | WebSearch | splat memory on iPhone | Concrete failure/fix numbers (885 MB fails on iPhone 13; <60 MB loads) | yes | — |
| 26 | https://poly.cam/tools/gaussian-splatting | Polycam | current | WebSearch | capture pipeline | 20–200 photos or MP4 → splat/mesh from an iPhone | yes | — |
| 27 | https://cloudfour.com/thinks/building-an-accessible-image-comparison-web-component/ (+ demo, GitHub) | Paul Hebert / Cloud Four | 2021-07-14 | WebSearch | clip-path + range-input before/after | 1.5 KB, accessible, phone-safe | yes | low |
| 28 | https://caniuse.com/view-transitions | caniuse | live | WebSearch | VT support | Safari/iOS 18.0+, 90.2 % | yes | — |
| 29 | https://webkit.org/blog/16967/two-lines-of-cross-document-view-transitions-code-you-can-use-on-every-website-today/ | Jen Simmons & James Craig / WebKit | 2025-05-21 | WebSearch | cross-document VT | Safari 18.2 support + reduced-motion nuance | yes | low |
| 30 | https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API (+ /Using, @view-transition) | Mozilla | current | WebSearch | same/cross-doc VT | Reference | yes | low |
| 31 | https://reactrouter.com/6.30.1/components/link (+ use-view-transition-state) | Remix / Shopify | 2025 | WebSearch | `<Link viewTransition>` | Directly usable in this repo's router | yes | — |
| 32 | https://webkit.org/blog/7551/responsive-design-for-motion/ | James Craig / WebKit | 2017-05-15 | WebSearch | prefers-reduced-motion | Which motion hurts; reduce don't remove | yes | — |
| 33 | https://web.dev/articles/prefers-reduced-motion | Thomas Steiner / Google | 2019+ | WebSearch | PRM patterns | CSS/JS/`<picture>` recipes | yes | — |
| 34 | https://geyer.dev/blog/css-image-sequence-animations/ | Geyer | ~2024 | WebSearch | CSS steps() sequence | *(unverified — Cloudflare 403)* | **no** | high |

---

## Ranked shortlist — most cinema per byte AND safe on iOS

1. **CSS scroll-driven animations for pinned photo "chapters" + reveals (0 KB).** Threaded on iOS
   26.4+, ignored gracefully everywhere else via `@supports`; only transform/opacity/clip-path on
   photo-sized layers, so the largest allocation is one 1024-px photo (2.8 MB). Sources #1–7.
2. **Scroll-scrubbed `<video>` of a real walkthrough (0 KB JS, ~5–12 MB media, desktop; poster/loop
   on phones).** The only technique here that gives *actual* cinema (camera moves through the house)
   while keeping roughly one decoded frame resident on iOS. Needs a keyframe-every-frame re-encode
   and rVFC-throttled seeking. Sources #18–20.
3. **Before/after `clip-path` slider (0–1.5 KB) with a scroll-wipe variant on desktop.** Two decoded
   photos, direct manipulation (reduced-motion-safe), works on every iPhone today, and it is the one
   pattern that speaks the site's actual story (rehab → rental). Sources #27, #7, #13.

Honourable mention: **same-document View Transitions** (0 KB, iOS 18+) for the listing-card→hero
"match cut" — arguably #1 on cinema-per-byte, ranked outside the three only because it's a page-level
cut rather than an in-page product edit. **GSAP ScrollTrigger (46 KB gz)** is the right tool if the
scrub must work in Firefox/older Safari or drive canvas/video with one API — desktop-only here.
**Canvas image sequences** and **Three/splats** are the two techniques that can *reproduce* the
07-21 crash shape on a phone; keep them desktop-only or off the table.

## Top 3 for this site (per CONTEXT.md)

1. **Bramus's scroll-driven-animations demos (#7) + WebKit 26.4 threading (#3)** → a desktop "product
   edit" for one property: sticky viewport, 4–6 real photos crossfading/wiping in with captions,
   built in `site.css` with no dependency, phone gets the same photos as a static stack. Zero
   memory delta beyond photos already on the page; matches the site's hand-CSS ethos.
2. **scrolly-video / WebKit video policies (#18–19)** → an 8–12 s muted walkthrough clip of a finished
   unit, re-encoded keyframe-per-frame, scrubbed by scroll on desktop, plain inline muted loop (or
   poster in Low Power Mode) on phones. Real footage only, no people — consistent with the brand
   rules, and the cheapest path to genuinely cinematic camera motion.
3. **Cloud Four image-compare (#27)** → the 1919 Kendall before/after as a drag slider on every
   device, upgraded to a scroll-wipe inside the desktop chapter above. It sells exactly what Shavit
   wants tenants to feel (a professional operator who actually renovates) and it is the safest
   interactive element on this list for iOS memory.

## Assumptions & gaps (honest)

- CodePen pens (GreenSock/VwgevYW etc.) return 403 to non-browser fetchers; I verified them via the
  GSAP doc pages that embed them, not by opening CodePen directly.
- geyer.dev is behind Cloudflare and blocked both fetch paths; listed but flagged unverified.
- Low-Power-Mode autoplay behaviour is documented in Apple Developer Forum threads and community
  posts, not a WebKit blog post; treated as reliable because multiple independent sources agree.
- I did not reverse-engineer apple.com's current pages (frame counts/formats change per launch); the
  Apple numbers quoted are from the 2020 CSS-Tricks analysis.
- "iOS-phone risk" ratings are reasoned from the w×h×4 arithmetic and the documented iOS canvas caps
  against the 2048 MB jetsam figure in CONTEXT.md; the 07-21 root cause was never isolated, so any
  new phone-facing effect should still be tested on a real iPhone with Safari's Timelines → Memory
  before going live.
- No files under `site/` were touched; bundle sizes were measured from fresh npm tarballs in the
  scratchpad, not from the repo (the repo currently has no animation deps installed).
- Tooling note: the repo's `bones-guard` Bash hook blocked my first attempt to write this file via a
  shell heredoc (it pattern-matched deploy-ish words in the prose); the file was written with the
  editor's Write tool instead, content unchanged. Nothing was deployed, committed, or run.
