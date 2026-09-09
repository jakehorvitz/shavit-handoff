# Interrogation record — shavit-product-edit (stage 1)

**Original prompt (Jake, 2026-08-15 22:00, verbatim):** "Using updated Horvitz pipeline, I want
you to figure out and research heavy. Research heavy edits on websites, like cool product edits,
like the really, really cool ones. And I want you to make that into, like, uh, like, an actual
edit for [shavitrootman.com], the actual edit of the website. But before we do that, I want to
see your references and your sources of what you're looking at and so you can make it."
Follow-ups: "Please use Herter [herdr] agents." · "their job is the resource right now, the
research." · "especially once the deal case studies featured." · "I need to see it in the Palmya
[Palmier] timeline on how you plan to do it ... it's a video" · "If you need to use Higgs field, use
Higgs field. I wanna see images in the spec."

## Recon sources folded in (stage 1)
- Persistent memory: shavit-website-technical-state, shavit-website-7-22-walkthrough,
  shavit-site-ios-crash-saga, shavit-seo-2026, shavit-rootman-marketing-deal, herdr-installed,
  bones-soft-mode-default.
- Repo read: site/src/motion.jsx (IO reveals, LineReveal, ScrollLinkedColor), site.css safe-mode
  rule (max-width 767px strips animation/transition/filter except .intro), tenant-pages.jsx
  CaseStudiesSection (text cards, Carousel), public/case-studies/1919-kendall (static HTML, 4
  aligned 1400x933 before/after pairs + drag sliders), design-tokens.css (black canvas, brass
  #B08D57, Inter uppercase display), hero.mp4 (640x360, 79s, 3MB).
- Asset library: 106-frame Kendall Drive dump (~/projects/shavit-pipeline/docs/reel-specs/
  kendall-2026-07-24/_drive-dump), reel slate footage (walkthroughs, drone, roof) per
  HANDOFF-reels-aug-2026.md.
- herdr fleet wE (4 lanes): docs/product-edit/REFS-awards.md, REFS-technique.md,
  REFS-realestate.md, REFS-siteaudit.md.

## Stage-1 mockup (UI build → mockup contract)
- Working HTML mockup of Direction A: docs/product-edit/mockup/the-turn.html (real Kendall frames,
  site tokens; desktop sticky+wipe driven by scroll position; phone = static compares).
- Captured: the-turn-previs-desktop.mp4 (1920x1080, 30fps, 21s) + 7 desktop stills + 3 phone stills
  (mockup/stills/). Encoded via capture.mjs (headless Chromium) + ffmpeg. Zero generation calls
  (video-brain Shavit register: no generated/outpainted property imagery — real photos only).
- Palmier project "Shavit Website Edit - The Turn (previs)" (16:9 1080p30) with timelines
  SPEC 1 desktop previs (mp4 + 8 chapter notes), SPEC 2 key-frame storyboard, SPEC 3 phone fallback.
- Dossier artifact (references + sources + previs): https://claude.ai/code/artifact/10663a9a-da33-49ed-b100-c7ce2f69c8bb

## Round 0 — offline floor (before Jake's answers)
| id | dimension (weight) | band | why |
|---|---|---|---|
| taskSpecificity (20) | partial | "an actual edit" of the site; attach point steered to Deal Case Studies but slice not fixed |
| contextSufficiency (18) | covered | stack, files, constraints, assets all recovered from memory + repo |
| constraintsNonGoals (16) | partial | iOS safe-mode, no forms, real photos, brand rules known; dependency budget, phone parity, Shavit sign-off unstated |
| verification (16) | missing | no definition of done stated |
| outputContract (12) | partial | code in repo, Jake deploys; references artifact first; staging preview unspecified |
| roleFraming (10) | partial | "award-tier cinematic" implied; priority when cinema vs iOS-safety vs tenant-trust conflict unstated |
| examples (8) | partial | "the really really cool ones" = the reference dossier; favorites not yet picked. Jake did add: it must be SEEN as a video (Palmier) with images in the spec — delivered as the previs |

Round-0 score: 10 + 18 + 8 + 0 + 6 + 5 + 4 = **51/100** (below 85 — round 1 questions issued with the dossier).

## Round 1 — gap questions (weight order, ≤5)
Q1 taskSpecificity — which slice first (steer received: the Deal Case Studies are the product): (A) case-study opener "The Turn" scroll-scrubbed
   before→after on /case-studies/1919-kendall/ (recommended, 1-day), (B) home Deal Case Studies
   band becomes the cinematic strip, (C) scroll-scrubbed walkthrough video hero.
Q2 verification — definition of done: accept-edit.sh (build green, effect present in built HTML,
   phone fallback present, no filter/blur/backdrop in the new CSS, image budget), + on-device
   iPhone no-crash check, + Lighthouse desktop perf not below current, + Jake eyeball on staging.
Q3 constraintsNonGoals — dependency budget (zero-dep vs GSAP+Lenis), desktop-only cinema vs phone
   parity, does Shavit sign off before promote.
Q4 roleFraming — priority order when in conflict (recommend: no-crash > tenant trust > cinema).
Q5 examples — pick 1–3 favorites from the dossier to define the taste target.

## Round 1 — answers (Jake, verbatim)
(pending)

## Tightened prompt
(pending round-1 answers)

score: (pending)

---

## PIVOT — 2026-08-15 23:40 (Jake, verbatim)
"this is an edit not on the website this is specificially an instagramm reel so I don't understand
the question." → follow-up answers: **"Both, as a two-part"** (a showcase of the website itself +
a Kendall case-study reel in that cinematic-website style) and **"30–45s, one continuous
scroll-story"** for each. Round-1 answers that still stand: slice A ("The Turn" is the hero beat),
DoD "Yes, as proposed" (mechanism: executable gate + eyeball; re-targeted to a reel below), taste =
Oura Ring 4 + WaPo Notre-Dame + OH Architecture, ERA Residence, Apple AirPods discipline, and
"Push it further than the previs".

## Round 1 — re-banded for the two-reel deliverable
| id | dimension (weight) | band | evidence |
|---|---|---|---|
| taskSpecificity (20) | covered | Two 9:16 reels, 30–45s each. Part 1: product-showcase edit OF shavitrootman.com (site on screen in device frames, scrolling/revealing, kinetic type, the case-study before/after wipe as hero beat, ends on the URL; doubles as the 7/5 "marketing revamp announcement"). Part 2: 1919 Kendall rebuild told in the cinematic-website style (wipes, pinned chapters, counting numbers), site as end card. Built as Palmier timelines; exported mp4s. |
| contextSufficiency (18) | covered | Site + assets audited (REFS-siteaudit), Kendall pairs + 106-frame dump + reel-slate footage located, video-brain Shavit register read (17 rules), Palmier project + MCP driver working, previs footage already captured, existing slate conventions (shared end card, caption template, 2–3/wk ceiling). |
| constraintsNonGoals (16) | partial | Register applied as hard constraints: black/white/gold tokens, uppercase Inter, real photos only (no generated/outpainted property imagery), no digit-leading addresses on screen ("Kendall Street"), full state names, static logo/no pulsing, Ken-Burns ≤20% of still-derived runtime, de-identify people, disparage house never street, reputation not virality, drafts-not-posts (Jake/Shavit post). OPEN: dollar figures burned into picture are unruled (caption copy figures approved 8/7) — default = no $ on picture, figures in caption only, flagged for Shavit. |
| verification (16) | covered | Same mechanism Jake approved, re-targeted: `accept-edit.sh` runs on the exported mp4s — ffprobe 1080x1920 / 30fps / 30–45s / h264+aac; OCR sweep of sampled frames for forbidden strings (`$`, digit-leading addresses, "MI"/"OH"/"IN" abbreviations, holding-company names); last-2.2s static-signature sample; audio bed present; file ≤ 200 MB. Plus Jake's eyeball in Palmier (staging) and Shavit's OK before posting (promote = post = owner gate). |
| outputContract (12) | covered | Palmier project "Shavit Website Edit - The Turn (previs)" → renamed/extended to hold REEL 1 and REEL 2 timelines; two exported mp4s; caption drafts per templates/reel-caption.md; spec HTML with images (dossier previs section already carries stills). |
| roleFraming (10) | covered | Award-tier motion designer working inside a strict client register; priority when in conflict: register compliance > honesty of imagery > cinema. "Push it further than the previs." |
| examples (8) | covered | Taste refs chosen (Oura, WaPo Notre-Dame, OH Architecture, ERA, Apple discipline); previs animatic + stills exist as the visual example; reel-refs lane running for showcase-reel examples. |

Score: 20 + 18 + 8 + 16 + 12 + 10 + 8 = **92/100** (no undeferred missing dimension). Deferred: none.

## Tightened prompt (what stage 3 specs)
Make two Instagram reels for Shavit Rootman, 9:16 1080x1920 30fps, 30–45 seconds each, one
continuous scroll-story apiece, in the visual language of award-tier "product edit" websites
(pinned chapters with copy swaps, scroll-scrubbed reveals, before→after hairline wipes, counting
numbers, big uppercase type, disciplined loading of media) and inside Shavit's register (black
canvas, white uppercase Inter, gold #FFC000 rules, real photography only, no digit-leading
addresses, full state names, static logo, calm not viral).
- REEL 1 "The website": shavitrootman.com as the product — screen-captured scroll of the live
  site (desktop and phone) inside device frames, kinetic type calling out sections (Available Now,
  Deal Case Studies, Q&A, Text us), the Kendall before→after wipe as the hero beat, ends on the
  URL + shared end card. Serves as the marketing-revamp announcement.
- REEL 2 "Kendall Street": the 1919 Kendall rebuild as a cinematic scroll-story — exterior wipe,
  kitchen, living room (During→After, honestly), finished gallery, "Read the case study" → URL end
  card. Numbers in caption copy; on-picture $ only if Shavit rules yes.
Build in Palmier (timelines REEL 1 / REEL 2 + storyboard), export mp4, gate with accept-edit.sh
(format, duration, OCR forbidden-strings, static signature, audio), Jake reviews in Palmier,
Shavit approves before posting; Jake posts. Copy in Jake's voice (jakevoice), never "from Claude".

score: 92/100
