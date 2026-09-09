# shavit-rootman-website source snapshot

## HEAD

```text
f577d2bdaef8eb38c56f1e378a45765ecc0cde8c
```

## working_tree

```text
M .bones/gates/1-brainstorm.ok
 M .bones/gates/2-kill-or-commit.ok
 D .bones/gates/3-spec.ok
 D .bones/gates/4-council.ok
 D .bones/gates/archive/2026-07-15T03-31-41Z-back-to-5/5-build-loop.ok
 D .bones/gates/archive/2026-07-15T03-31-41Z-back-to-5/6-review-security.ok
 D .bones/gates/archive/2026-07-15T03-31-41Z-back-to-5/7-staging.ok
 M .bones/guard.sha256
 M .bones/state.json
 M .bones/state.sha256
 M site/public/sitemap.xml
?? .DS_Store
?? .bones-archive-714-revision-20260730/
?? SEO-interrogation.md
?? docs/case-studies/clarendon-3220/_drop/
?? docs/case-studies/mead-34/_drop/
?? docs/case-studies/mead-34/img/
?? docs/ewing-front-photo-2026-09-02.html
?? docs/ewing-options/
?? docs/spec-inbox.jsonl
?? docs/tasks/2026-08-21-listings-shavit-0820pm.md
?? docs/tasks/sources/howder-imessage-story-sources-2026-08-24.txt
?? serve.py
?? site/.DS_Store
?? site/staging-assets/33-barry-zillow-pull/
?? spec-annotate.js
```

## history

```text
f577d2b 2026-09-07 fix(site): rename lease status to leased
0583934 2026-09-02 feat(site): 1902 E Ewing gets its real shoot — exterior hero + 10-photo gallery
0326e78 2026-09-02 Revert "feat(site): 1902 E Ewing leads with the real exterior, not the CPM kitchen"
978e9aa 2026-09-02 feat(site): 1902 E Ewing leads with the real exterior, not the CPM kitchen
fb52fb3 2026-08-31 feat(site): /case-studies is a real URL, no "#" — plus Shavit's house-number strip
e439d9b 2026-08-27 fix(case-studies): Mead snapshot grid 4x4 — status joins the grid, no blank cell (Jake 8/27)
8f70d58 2026-08-27 feat(case-studies): 34 Mead photos wired — hero, three sliders, ten-tile gallery
323c3f0 2026-08-27 feat(case-studies): publish 34 Mead St from Shavit's 8/27 text — photography pending
b4a7b2a 2026-08-27 chore(site): sitemap catches up to the Howder B gallery (uncommitted 8/24 leftover)
31d3450 2026-08-27 feat(site): one uniform card-line frame + address abbreviation, per Shavit
f718a9a 2026-08-27 feat(site): list 19 E St Joe (4bd/1ba, $1,900/mo) + beds/baths joined with "and"
872acc7 2026-08-24 feat(site): Howder Unit B gallery adds dining + bedroom touch-ups, tour order
487eac9 2026-08-24 feat(site): Howder Unit B gallery adds dining + bedroom touch-ups, tour order
2172fa8 2026-08-24 feat(site): 43 Howder Unit B gets its own finished gallery from Shavit's 8/24 photos
a1fa54f 2026-08-24 feat(site): 60 S Norwood in-progress case study from Shavit's 8/24 text + Drive befores
c82fcb4 2026-08-21 feat(site): publish 3220 Clarendon case study, restore Kendall prev/next
81b74fa 2026-08-21 feat(case-studies): 3220 Clarendon from Shavit's 8/20 docx + photos
45fd625 2026-08-21 feat(site): Shavit 8/20 pm texts — 179 State removed, 1902 E Ewing lease-signed
f8df029 2026-08-20 fix(case-studies): keep unpublished addresses out of shipped page source
90db892 2026-08-20 feat(site): 179 State lease-signed per Shavit 8/20, unbreak Kendall case-study nav
6002b62 2026-08-19 feat(site): 33 Barry Unit A leased + Shavit's real photos, 179 State available
da1c7b5 2026-08-16 feat(reels): v4 — Contact Us beat shows the live 8/16 contact rewrite
22c7d14 2026-08-16 feat(site): Contact Us rewrite per Shavit 8/16 — plain Call/Email rows, info@chargerpropertymanagement.com
5d0db11 2026-08-16 docs(product-edit): v3 conformance + staging pack
b0505a0 2026-08-16 feat(reels): v3 per Jake's review — 'Introducing our new website', category-name titles, carousel via transform (no shake), shared Shavit end card on both reels; gate classifier by category-vs-source
e400b6c 2026-08-16 docs(product-edit): staging pack for v2 (contact sheets, gate logs, review checklist, benchmark read)
1305cfc 2026-08-16 docs(product-edit): 5.5 conformance report + stage-6 review disposition
aeaa900 2026-08-16 feat(reels): v2 exports with EDM bed (Mixkit House 02), clean Reel 1 render, review fixes; gate patched (deps/staleness guards, region-based OCR); PASS 0 FAIL / 25 site-UI WARN
b8f5a1e 2026-08-16 feat(reels): v3 renders after herd QC (Reel 1 layout/cuts/Mac/end card; Reel 2 fast linear swipes, numbers panel, close+end card); recut.py; version-aware gate
73e3f17 2026-08-15 docs(product-edit): reel-refs lane (18 refs) folded into spec section 10 as v2 polish targets
4fd1747 2026-08-15 feat(reels): REEL 1 + REEL 2 v1 rendered, Palmier timelines, exports, accept-edit.sh gate (exit 0, 19 site-UI warns), captions, spec v1.2
af1d88d 2026-08-15 docs(product-edit): pivot to two IG reels; kill-or-commit, live-site captures, Reel 1 device-frame storyboard, SPEC-reels v1
646d2cb 2026-08-15 docs(product-edit): stage-1 recon dossier, 4-lane herdr research, The Turn previs mockup + captures
767f3d8 2026-08-11 feat(site): surface 1919 Kendall in Deal Case Studies, carousel the row
a1f078d 2026-08-11 feat(site): publish 1919 Kendall case study at /case-studies/1919-kendall/
608cbc6 2026-08-11 feat(case-studies): 1919 Kendall deal case study, draft 1
30cfa41 2026-08-09 feat(site): Shavit's 8/9 texts — St Joe leased, ½ unit removed, one phone layout
c17a53f 2026-08-05 feat(site): Shavit's 8/4 review — One Stop Shop, tabbed Q&A, prices
3f5a04b 2026-07-28 fix(nav): Contact Us lands on a real contact section, not the Q&A accordion
e8b138e 2026-07-28 feat(site): Cedar is leased, Kendall is rented — Shavit's 7/27 comments
808cd80 2026-07-26 fix(site): share card reads Midwest mission; prequal decline goes formal
1bfb995 2026-07-16 docs(shavit): consolidate every outstanding ask into one email draft
67a58d0 2026-07-16 fix(schema): Cedar's structured data claimed Indiana, not Michigan
b24f8eb 2026-07-16 fix(howder): Unit A is 3 bed / 2 bath per Shavit's own write-up
b7f4c8d 2026-07-16 Revert "feat(scope): only Shavit's texted list ships — remove the 5 Lease Signed showcases"
6aac88d 2026-07-16 feat(scope): only Shavit's texted list ships — remove the 5 Lease Signed showcases
a8def3c 2026-07-16 fix(cedar): group 1114 Cedar under Indiana per Shavit's 7/15 text
b52053d 2026-07-15 fix(7/15): placeholder fills square media; montage address bottom-right
276203e 2026-07-15 docs: Howder Unit B Drive audit — folder is all gut-rehab progress, no listing photos
036106e 2026-07-15 fix(7/15): align button rows across cards; montage addr bottom-right; Cedar no blur bars
2244290 2026-07-14 fix(7/14): even buttons, no brand flash, photos-first order, addresses+zips, montage chip
7782a4b 2026-07-14 fix(7/14): pull porch shot from montage; card buttons one even line
8967e79 2026-07-14 feat(photos): Jake's 7/14 gallery picks + Cedar single edited exterior
d4e4052 2026-07-14 feat(montage): montage uses Jake's explicit 7/14 approve/fade set, not all-available
8d7ba5a 2026-07-14 fix(7/14 v4): no blur bars anywhere — St Joe card leads with clean interior
4002a7e 2026-07-14 fix(7/14 v3): Jake's phone review — EXIF double-rotation, whole-house square heroes, em dashes out of copy
368fce2 2026-07-14 feat(7/14 v2): Howder + St Joe photo galleries from Shavit's Drive (16 verified photos)
a4eafc1 2026-07-14 fix(7/14 v2): montage replaces hero video; brand splash non-blocking; addr chip bottom-right; Cedar 8-photo gallery from Shavit's text
ea72b0c 2026-07-14 test(714): stage 6-7 evidence — review fix, staging e2e artifacts, bones gates
8f43818 2026-07-14 fix(714): PrequalModal Tab focus trap + initial focus on credit input (stage-6 review finding)
78c5825 2026-07-14 feat(714): full 7/14 revision build — bugs, prequal, portfolio, menu, montage
5b33ff4 2026-07-14 spec(714): 7/13 content edits + v6 council-reviewed build spec + bones stage 1-4 gates
aa68f3d 2026-07-03 Remove $12M+ portfolio stat per Shavit 7/3 ('remove all portfolio value... including website')
de5a17c 2026-07-02 Remove before/after pairs from The Standard per Jake (assets parked in staging-assets)
74f1d7e 2026-07-02 bones: pipeline complete
5f20674 2026-07-02 bones: operate/learn closed — pipeline complete (Jake's go on record)
864eb6d 2026-07-02 bones: promote to shavitrootman.com (stages 8-9, Jake: 'Ship it')
f4f16e9 2026-07-02 The Standard: wire real before/after pairs (frame-pulls from June property videos)
fd60381 2026-07-02 Tenant-hub revision: state-organized inventory, brand flip to Shavit Rootman, links-only contact
6be2da4 2026-07-01 bones: complete pipeline (stages 9-10, present + operate)
73e2339 2026-07-01 Launch shavitrootman.com: Supabase+Resend+Turnstile+Netlify wiring, cutover fixes
e65c4a1 2026-07-01 docs: launch setup guide (Netlify/Supabase/Resend/Turnstile) + Stage 6 complete
d8208a0 2026-07-01 seo+a11y(stage6): crawlable react-router Links (nav/footer/TriPaths), footer headings h5->h3, charset-first. Lighthouse home 100/100/100/100, contact a11y 98 best-practices/seo 100
f6269d5 2026-07-01 a11y+sec(stage6): video poster+reduced-motion, Counter reduced-motion, FAQ aria-expanded, form field-level errors+assertive alert, btn contrast fix, reduced-motion CSS, branded 404, Turnstile post-mount, nav active mounted-guard, ViteReactSSG basename. Verified: hydration-clean when served per-path (vite-preview SPA-fallback was the only source)
ff34d68 2026-06-30 sec(stage6): harden Edge Function — per-IP rate limit, try/catch generic errors (no leak), CORS origin allowlist, email-failure isolation, subject newline-strip, reply-to; add leads(ip,created_at) index
691d8c3 2026-06-30 fix(stage5): revert codex over-scrub (restore footer companies + Nicky case study + investor-relations FAQ); lock footer-companies check; gate green 40/0
5250eb1 2026-06-30 feat(stage5): faithful ESM port of full design — 6 prerendered routes, real components, contact form, SEO/a11y/security; passes hardened fidelity gate
a522998 2026-06-30 fix(stage5): reopen gate — copy real design CSS+video, harden accept.sh for fidelity, demand faithful port
7695658 2026-06-30 chore(stage5): scaffold Vite+react-router+vite-react-ssg, acceptance gate, anti-reqs
d227524 2026-06-30 chore: snapshot synced React source + bones spec before Vite migration
```
