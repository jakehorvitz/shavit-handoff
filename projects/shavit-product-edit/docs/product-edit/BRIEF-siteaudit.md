# Lane: siteaudit  →  write REFS-siteaudit.md, then touch DONE-siteaudit
Read docs/product-edit/CONTEXT.md first. This lane reads CODE, not the web (a little web is ok).

Audit the current site so the edit attaches to reality. Work in
/Users/jakehorvitz/projects/shavit-product-edit/site (read-only). Produce:
1. Section map of the home page and every route (site/src/routes.jsx, tenant-pages.jsx,
   components.jsx): what each section is, its purpose, and its current motion (data-reveal,
   intro, montage, hero video, glows, grain, kill switches). Quote the exact selectors/files.
2. The mobile safe-mode rule(s) in site.css that strip animation on phones — quote them, and
   list the ?kill= switches in routes.jsx/tenant-pages.jsx. Explain what a new effect must do
   to coexist (e.g. opt-in class exempted like .intro, or desktop-only media query).
3. Asset inventory: every property photo folder with counts + a few sample dimensions/sizes
   (use `sips -g pixelWidth -g pixelHeight` or `file`), hero.mp4 (duration/resolution via
   ffprobe if present, else file size), the 1919 Kendall case-study assets, and whether any
   before/after PAIRS exist (same room, before and after). Note anything >250KB.
4. Data model: properties.js shape (fields, statuses, which have photos/rent/sqft), data.js
   BRAND, and how listings render (card component, carousel).
5. Build/tooling: package.json scripts, vite config, SSG entry, how to run dev/build/preview,
   the acceptance scripts at repo root (accept-714.sh) and what they assert.
6. Propose 3 concrete ATTACH POINTS for a cinematic edit, ranked, each with: where in the DOM,
   which assets would feed it, what the desktop experience is, what the phone fallback is,
   estimated code footprint, and risk. Think like a product designer: the edit must serve a
   prospective tenant deciding whether this landlord is professional and quality-focused.
7. Anything that would block or bite the build (missing node_modules in the worktree, image
   weight, react-router version, SSG hydration quirks noted in code comments).
Cite file:line for every claim. Deliverable format otherwise as CONTEXT.md.
