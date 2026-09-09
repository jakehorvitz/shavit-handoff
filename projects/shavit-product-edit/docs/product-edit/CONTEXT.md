# Shared context — shavitrootman.com "product edit" research (read first)

You are one lane of a 4-agent research fleet. Jake Horvitz (the operator) wants to add ONE
genuinely cinematic, award-tier "product edit" experience to shavitrootman.com — the way the
best product pages (Apple, luxury brands, top Awwwards sites) sell an object with scroll,
motion, video and 3D. Here the "product" is a house: a renovated Midwest rental.
Before anything is built, Jake wants to SEE the references and sources. Your job is evidence,
not opinions: every reference must carry a URL, who made it, where you found it, and what
technique it uses. Do not invent sites. If you cannot open a URL, say so.

## The site (facts, verified 2026-08-15)
- Repo/worktree: /Users/jakehorvitz/projects/shavit-product-edit  (app in `site/`, Vite 5 +
  React 18 + react-router 6 + vite-react-ssg; no Tailwind, no animation library; hand CSS in
  site/src/site.css (4,343 lines) + site/src/motion.jsx + site/src/intro.jsx).
- Live at https://shavitrootman.com (Netlify). Brand: SHAVIT ROOTMAN / Managed by Charger
  Property Management. Navy + orange/gold. Tagline "Investing in Midwest Communities".
- Inventory: ~16 rental listings in Hillsdale MI, South Bend IN (+ Cleveland OH neighborhoods
  with no photos). Photos per property under site/public/assets/properties/<slug>/ and
  listings/<id>.jpg. There is a site/public/assets/hero.mp4. One published case study:
  /case-studies/1919-kendall/ (a rehab; before/after photos exist).
- Primary audience (Shavit's words): prospective and current tenants who want confidence they
  are renting from a professional, responsive, quality-focused property manager. Secondary:
  investors. Goal is reputation/brand, not lead-gen.

## HARD CONSTRAINTS (do not propose anything that violates these)
1. iOS Safari crash history: on 2026-07-21 the site crash-looped iOS Safari (WebContent hit
   the 2048MB jetsam cap in <500ms from ONE giant graphics allocation; JS heap was only 4MB).
   Shipped fix: on phones (max-width 767px) ALL CSS animations/transitions/filters/blend-modes
   are stripped except the intro. Root cause never isolated. => Any new effect must either be
   desktop-only with a graceful phone fallback, OR be proven memory-safe on iOS (small
   composited layers, no full-viewport blur/filter, no huge canvases, no dozens of decoded
   full-res images at once). Say explicitly how each technique behaves on iOS Safari memory.
2. Real photos only. No AI-generated or stock house imagery. No people identifiable in photos.
3. No forms on site (SMS-only CTA to 805-364-4415). Nothing that collects data.
4. Never enumerate all managed homes; only "Available Now" / "Coming 2026". No holding-company
   names, no "owned by", no rent-return promises beyond what exists, no invented facts.
5. Copy must read human ("personal touch, from Jake, not Claude") — you are not writing copy.
6. Performance budget matters: 8GB dev Mac, Netlify static hosting, no backend. Prefer
   zero-dependency or one small lib (GSAP/Lenis/Three are candidates, cost them honestly).

## Output rules
- Write your deliverable to docs/product-edit/REFS-<lane>.md (lane name given in your brief).
- Every reference row: URL · maker/studio · year · award/source URL where you found it ·
  technique(s) · why it is great (one line) · verified-open? (yes/no, via WebFetch or curl) ·
  iOS-phone risk (low/med/high + why).
- Aim for quality over quantity: 8-15 strong references per lane, each real and current.
- End your file with a "Top 3 for this site" section: which references best translate to a
  Midwest rental-house showcase and why.
- When completely finished, create an empty file docs/product-edit/DONE-<lane>.
- Do not edit any file under site/. Do not commit. Do not deploy. Do not touch .bones/.
