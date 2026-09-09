# Build context + anti-requirements — shavitrootman.com migration

## ⚠️ READ FIRST — the previous iteration FAILED as a skeleton rewrite.
A prior attempt reinvented the site as a minimal marketing page with its own
`site-header`/`primary-nav` classes and an ~8KB stylesheet. That is WRONG and
REJECTED. The gate now enforces design fidelity (real CSS weight, hero video,
signature design classes, original content). Your job is a **FAITHFUL PORT** of the
existing luxury design — convert module syntax ONLY, do not redesign, simplify, or
reduce anything.

## What "faithful port" means (non-negotiable)
- The REAL design CSS is ALREADY copied in for you: `site/src/site.css` (3296 lines)
  and `site/src/design-tokens.css` (454 lines). IMPORT BOTH unchanged. Do NOT shrink,
  replace, or rewrite them. The rendered pages must look like the original design.
- PORT the 17 original components from `final-shavit-real-estate/project/src/*.jsx`
  into `site/src/`, converting ONLY the module system:
  - remove the `/* global ... */` banner → add `import { ... }` for React hooks and the
    other components/data it uses;
  - remove the `window.X = X` / `Object.assign(window,...)` footer → `export`;
  - change `const { useState: useAppState } = React` → `import { useState } from 'react'`.
  Keep ALL JSX, class names, SVGs, animations, copy, and structure otherwise intact.
- The components use these data globals — define them in `site/src/data.js` with THESE
  names (they already exist in the original `Shared.jsx`, copy their values):
  `SHAVIT_PHOTOS`, `STOCK`, `URLS`, `CONTACT`, `HERO_VIDEO`. Keep any SEO `pages`
  metadata you need for `<Head>` too, but the components import the names above.
- The hero video is at `site/public/assets/hero.mp4` — wire `HERO_VIDEO` to `/assets/hero.mp4`.
  Photos/portrait are under `site/public/assets/` (photos/, properties/, shavit-portrait.png).

## Keep the GOOD infrastructure from the prior pass
Reuse the vite-react-ssg setup, the `<Head>`/SEO pattern, per-route metadata,
`sitemap.xml`, `robots.txt`, `_headers`, `og-image.svg`, and the Supabase function +
schema. Just render the REAL page components (HomePage, CompaniesPage, CaseStudiesPage,
MeetPage, ContactPage, AccessibilityPage) inside the SSG layout at the 6 routes.

## The content DELTA to apply during the port (SPEC.html §2 authoritative)
1. Remove every "Invest With Me" CTA/button and all accredited-investor / investment-amount /
   debt-equity copy. Investor CTAs become a single "Get in touch" → /contact.
2. Brand = "Charger Realty Management" (nav/footer/intro wordmark/titles) + "by Shavit Rootman"
   subline. Keep subsidiary company names (Barootman, Charger Realty, DSR, Charger Property
   Management) on the Companies page.
3. Rebuild ContactPage as a real form: name/email/phone/message ONLY + Cloudflare Turnstile
   (`import.meta.env.VITE_TURNSTILE_SITE_KEY`) + hidden honeypot; POST JSON to
   `import.meta.env.VITE_LEADS_ENDPOINT`; success/error states. Keep the direct email/phone rows.
4. LogoIntro → client-only (mounted-guard returning null on the server) so the curtain is NOT
   baked into prerendered HTML; add a `prefers-reduced-motion` guard.
5. Hero `<video>`: add a `poster` + don't autoplay under `prefers-reduced-motion` (keep the video).

## HARD DO-NOTs
- Do NOT rewrite/shrink/replace `site.css` or `design-tokens.css`. Import them as-is.
- Do NOT reinvent the layout, nav, footer, or components with new minimal markup. PORT the originals.
- Do NOT re-introduce "Invest With Me", "accredited", investment amounts, or debt/equity fields.
- Do NOT keep Google Forms in ANY form (no `Forms.jsx`, no `docs.google.com/forms`, no
  `PLACEHOLDER_` IDs, no "Open in Google Forms"). The Supabase contact form is the ONLY intake.
- Do NOT ship `uploads/` into `site/` or dist.
- Do NOT hardcode secrets: no `service_role`, Resend, or Turnstile SECRET keys client-side. Only
  the Supabase ANON key + Turnstile SITE key, via `import.meta.env` (VITE_ prefix), never literals.
- Do NOT keep dev bundles: no `unpkg.com`, `@babel/standalone`, `react.development.js`.
- Do NOT touch anything outside `site/` except READING from `final-shavit-real-estate/`.
- Do NOT invent financials, testimonials, or claims not in the source.
- Do NOT run destructive commands or touch real data.
