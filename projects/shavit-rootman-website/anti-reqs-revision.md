# Build context + anti-requirements — shavitrootman.com TENANT-HUB REVISION

## What this build is
Restructure the LIVE site in `site/` per `SPEC-REVISION.html` (§1–§8 — §8 council
amendments are BINDING). The site currently works and looks premium. You are changing
its CONTENT ARCHITECTURE, not its design language.

## ⚠️ The prior failure mode (do not repeat)
A previous iteration rewrote the site as a minimal skeleton with its own tiny stylesheet.
REJECTED. The gate enforces: dist CSS >= 86KB, signature classes USED in markup
(band__inner, h-mega, eyebrow, gold-rule, ccard, band--iron, split__), hero <video> kept,
LogoIntro client-only. Compose new sections from EXISTING primitives in
`site/src/components.jsx` (VideoHero, Eyebrow, GoldRule, Counter, StatsGrid, Btn) and
`site/src/motion.jsx` (Reveal, LineReveal). APPEND new CSS to `site/src/site.css`
(never shrink/replace it or design-tokens.css). No new stylesheet files.

## Hard anti-requirements
- NEVER touch: `site/supabase/**` (functions/migrations stay, dormant), `netlify.toml`,
  `.env` values themselves, hero video asset, `design-tokens.css`.
- NEVER add: any `<form>`, any fetch to supabase, any mailto to info@shavitrootman.com,
  any Turnstile/Cloudflare script, "Build your portfolio" copy, LinkedIn/Substack embeds.
- NEVER show: Barootman, DSR Enterprises, Charger Property Holdings, Indiana Charger
  Holdings, past-project addresses (Lo Presto, W South, Griswold, Waldron, Rippon),
  the senator letter, substackcdn images. "Charger Property Management" is the ONLY
  entity name allowed (as the management face + footer legal line).
- NEVER delete data outside `site/src` + `site/public` content files listed in the spec.
- Approved numbers ONLY: 50+ doors · 3 states · $12M+ portfolio · (200 by 2030 → /meet only).
- Wordmark stays "Charger Realty Management, by Shavit Rootman" this build — but route
  every brand string through `data.js` BRAND/SUBLINE constants (spec T14).

## Seed data honesty
`site/src/properties.js` ships with the §2 seed listings. Rent/beds/dates are SEED
values — mark the file header `// SEED DATA — replace with Shavit-confirmed facts before
promote (bones stage 8)`. Use plausible Hillsdale/Cleveland/South Bend rents ($800–$1,600).
Staged/unconfirmed listings go in `site/src/properties.staged.js` (NEVER imported).
Photos: derive listing images from existing `site/public/assets/properties/*.jpg` — copy
+ rename to `site/public/assets/listings/<id>.jpg`, resized/compressed <=250KB, 4:3.
Proof-strip images: copy + rename to `standard-01-before.jpg` etc. (neutral names).
Then DELETE the old address-named originals from `site/public/assets/properties/` and
remove their `data.js` references (they leak parcel names via filenames).

## Definition of done
`./accept-revision.sh` exits 0. Run it yourself before claiming done. Every FAIL line
names the criterion — fix, rebuild, rerun.
