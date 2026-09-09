# PRODUCT.md — shavitrootman.com

## Register
Brand. A tenant-facing marketing site: the design carries first impressions for renters and for Shavit's professional reputation. There is no app shell, no dashboard.

## Users & Purpose
- Prospective tenants in Hillsdale MI, Niles MI, South Bend IN, and Cleveland-area OH looking for a rental. Mostly on phones, often coming from an Instagram or Facebook link.
- Secondary: business contacts Shavit shares the link with (desktop, all platforms including Windows).
- Primary job: see what is available or coming soon in their state and start a text/SMS conversation (the site's only conversion path is the SMS line 805-364-4415). Applications happen on Zillow by explicit decision (Shavit 7/19) — never build on-site applications.

## Brand personality
Operator-grade, understated, proud of the craft. Dark near-black surfaces with brass/gold accent, bold condensed display type, real photography of real renovations. "SHAVIT ROOTMAN / Managed by Charger Property Management".

## Hard constraints (from Shavit, verbatim history in repo docs)
- Two buckets only: Available Now and Coming 2026. Never enumerate the full portfolio ("I don't need the city to be able to get on my website...").
- Holding-company names and ownership language are banned strings (build gate enforces).
- No rents, no month-level ETAs, no fabricated testimonials or faked before/after photos.
- Coming-soon cards with no real photo use the gold house-mark placeholder — never another house's photo.

## Anti-references
- Generic SaaS landing kit (hero metric rows, icon card grids).
- Corporate property-management template (blue, stocky, lead forms everywhere).

## Accessibility
WCAG-minded and already audited (7/9): focus traps, inert overlays, reduced-motion honored. Keep ≥4.5:1 body contrast on the dark theme, 44px touch targets on mobile.

## Design system
Tokens in `src/design-tokens.css`, global styles in `src/site.css` (single stylesheet). Brand constants in `src/data.js`. Stack: Vite + React + react-router + vite-react-ssg, deployed on Netlify from `site/dist`.
