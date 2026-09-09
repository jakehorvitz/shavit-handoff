# Lane: technique  →  write REFS-technique.md, then touch DONE-technique
Read docs/product-edit/CONTEXT.md first.

Map the TECHNIQUES behind cinematic product edits to their implementation cost and iOS Safari
memory risk, with primary sources. Cover at minimum:
1. CSS scroll-driven animations (animation-timeline: scroll()/view()) — MDN + caniuse; iOS
   Safari support status as of Aug 2026.
2. GSAP ScrollTrigger (+ GSAP is free since 2024/25 — confirm license/version) and Lenis
   smooth scroll — bundle size, pin/scrub patterns, known iOS pitfalls.
3. Scroll-scrubbed image sequences (Apple AirPods style: N JPEG/WebP frames drawn to canvas)
   — memory math (frames × decoded size), what count is safe on iOS, alternatives (video with
   currentTime scrub; WebCodecs; AVIF sequence).
4. Scroll-scrubbed <video> (currentTime seeking) — iOS autoplay/inline rules, keyframe
   interval requirement, jank.
5. WebGL / Three.js / React-Three-Fiber product turntables and 3D house models — cost,
   asset pipeline (GLB from photos? Polycam/Luma/Gaussian splats?), iOS memory.
6. Before/after reveal patterns for renovation photos: drag slider, scroll-wipe, clip-path
   reveal, crossfade-on-scroll — which is cheapest and best on phones.
7. View Transitions API (cross-document + same-document) for page-to-page cinematic cuts —
   support in Safari 2026.
8. prefers-reduced-motion and progressive enhancement patterns; how top sites degrade on
   phones.
For each: primary doc URL (MDN, W3C, GSAP docs, Three docs, WebKit blog), one or two demo URLs
(Codrops, CodePen, official examples), bundle/perf cost, iOS risk (low/med/high + reasoning
tied to the site's 2048MB jetsam crash), and a one-line "fit for a Midwest rental-house
showcase". Finish with a ranked shortlist: the 3 techniques that give the most cinema per
byte AND are safe on iOS.
