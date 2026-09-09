# Shavit website, design, social, and legacy archive handoff audit

Audit date: 2026-09-08 (local). Read-only source inspection; no source edits, deploys, posts, or account changes. This report records local state, not a fresh verification of hosted sites or account access. Original `.git` directories, dependency trees, build output, and caches were not traversed for content.

## Start here: which project is which

| Source | Role | Status / what to open first |
|---|---|---|
| `~/projects/shavit-rootman-website/site/` | **Canonical production website source** | Most recent commit `f577d2b` on Sep 7, “rename lease status to leased.” Read `src/data.js`, `src/properties.js`, `src/tenant-pages.jsx`, and `PRODUCT.md`. |
| `~/projects/shavit-rootman-website/final-shavit-real-estate/` | Original Claude Design handoff and alternative static prototypes | Preserve as design history. Includes multi-page/standalone/one-pager/print variants, editable JSX, photography, and original website brief/portfolio PDFs. These are historical prototypes. |
| `~/projects/shavit-product-edit/` | August website snapshot plus cinematic website/Kendall reel development and later Mead teaser | **Unique creative work is in `docs/product-edit/`.** Do not accidentally deploy this older `site/` over the canonical website. |
| `~/projects/shavit-instagram/` | Expanded social footprint redesign | Open `index.html` or `Shavit-Social-Remodel.pdf`; it now covers Instagram, Facebook, Meta Business Suite, LinkedIn, Substack, YouTube. Includes earlier Instagram-only PDF and brief. Drafts/specs, not proof that account changes happened. |
| `~/projects/shavit-facebook-suite/` | Facebook Page + Meta Business Suite spec | Open `index.html` or `Shavit-Facebook-Suite-Spec.pdf`. Original July 6 concept, separate from broader later social remodel. |
| `~/Desktop/Personal Jarvis/.claude/worktrees/priceless-bohr-90032a/shavit/` | June strategy, analytics, templates, content playbook and content-engine package | Valuable historical deliverables. Read its README, but follow the current handoff rules over obsolete operating instructions. |
| `~/Desktop/Shavit/website/` | Pre-migration website source | Archival React/Babel static site with companies/owners/tenant/forms routes and old analytics. Keep under `archive`, not the deploy path. |
| `~/Desktop/Shavit/Shavit_Strategy_Analytics.html` and `Shavit_Marketing_Playbook.html` | Earlier presentation/strategy artifacts | Preserve as standalone historical designs. |

The four `~/projects/shavit-*` repositories audited here have **no configured Git remotes**. A new handoff repo should copy the latest working files, not only committed files. Keep the source location + current commit in provenance, without importing old Git history.

## How the current website works

The marketing site is a static React 18 application built with Vite 5, React Router 6, and `vite-react-ssg`. Netlify serves generated output from `site/dist`. There is no active on-site application flow; current product intent is for tenants to browse marketed homes and contact the business, with Zillow handling applications.

Important files:

- `site/src/data.js`: brand name, public contact details, homepage SEO and social-share copy, social links, clean section routes.
- `site/src/properties.js`: marketed listings, statuses, real location versus visual state grouping, images and galleries.
- `site/src/properties.staged.js`: intentionally separate unpublished listings; currently an empty list. Staging assets are outside `public`.
- `site/src/tenant-pages.jsx`: homepage listing sections, case-study cards, meet/accessibility content.
- `site/src/design-tokens.css` and `site/src/site.css`: design system and styling. No Tailwind or animation library in the current site.
- `site/src/components.jsx`, `nav.jsx`, `footer.jsx`, `intro.jsx`, `motion.jsx`: reusable UI, overlays, header/footer and motion.
- `site/src/routes.jsx`: routes, SEO/schema, section scrolling and phone crash diagnostic switches.
- `site/public/case-studies/`: deployable standalone HTML case studies for Kendall (1919), Clarendon (3220), and Mead (34), with public assets and CSS.
- `docs/case-studies/`: editable drafts, author/source notes, reviewed image pairing decisions and staging sources.
- `site/scripts/gen-sitemap.mjs` / `patch-ssg-csp.mjs`: sitemap generation and SSG security-header fixes.
- `site/public/_headers` and `_redirects`: preserve these during deployment.

Run from the current site's `site` directory:

```sh
npm ci
npm run dev
```

For a production build and preview:

```sh
npm run build
npm run preview
```

These are verified package scripts, not a newly performed build. `npm run build` regenerates `public/sitemap.xml`, runs SSG, and patches CSP; generated sitemap changes can appear in Git status. The repository-level Netlify config sets only `publish = "site/dist"`; a fresh Git integration also needs an appropriate build command, such as `cd site && npm ci && npm run build`. Never publish the repository root: it contains private/internal material and historically contained secrets.

The top-level `accept.sh`, `accept-revision.sh`, and `accept-714.sh` capture successive historical requirements. They are useful evidence, but some assertions have been retired or superseded by later Shavit-directed content. Do not claim all historical scripts are the current release gate without reviewing them. `serve.py` can preview annotated draft pages on port 8765 and stores annotation feedback; inspect its output paths before using on the handoff copy.

### Design and content rules to carry forward

Current website direction is near-black with brass/gold accents, condensed display type, restrained motion, and real renovation photography. The current source and newer social builder explicitly replace stale early navy/orange design notes. Current title is “Shavit Rootman | Charger Property Management”; social share copy leads with “Investing in Midwest Communities.” Branding is “Shavit Rootman / Managed by Charger Property Management.”

Only market the intended listings; never expose a complete portfolio or holding-company directory. Do not guess dates, rents, building types, before/after matches, or facts absent a supplied source. Case studies contain specifically authored financial narratives and should retain their documented scope; early blanket restrictions in old specs are not a reliable statement of every later exception. The public website phone is +1 (805) 364-4415 and `src/data.js` currently uses `info@chargerpropertymanagement.com`. Keep account credentials outside the repo.

A July iOS Safari crash was associated with a huge GPU allocation rather than JS heap use. The source retains mobile guards that strip heavy animations/transitions/filters/blend modes and diagnostic `?kill=` switches. Preserve the fallback and verify real mobile Safari before introducing new visual effects.

### Historical backend warning

`SETUP-GUIDE.md`, `site/supabase/`, and the earlier `SPEC.html` describe lead forms, Supabase, Resend and Turnstile. **That launch guide is obsolete for the current SMS-first marketing site.** Preserve it as history, clearly labeled, rather than sending the successor through those account-creation steps. Never include `.launch-secrets`, `.supabase-secrets`, or `site/.env`.

## Website and case-study outstanding work

These are carried items evidenced locally, not new required changes:

1. `src/data.js` records that the `info@chargerpropertymanagement.com` mailbox/forwarder needed setup and a round-trip email check. Verify business ownership and functioning mail separately; local source does not prove completion.
2. `src/routes.jsx` intentionally omits the registered business PostalAddress until Shavit confirms it. Do not guess.
3. `SEO-interrogation.md` contains an unfinished SEO workflow (pipeline state says stage 3). Treat its July/August questions as historical evidence and reconcile with current source/account state.
4. Clarendon notes flag before-photo licensing, chronology and docx1/docx2 conflicts for confirmation. Its revised page exists in public output source, so “needs confirmation” and “not published” are different claims.
5. Norwood is a draft in `docs/case-studies/norwood-60/`. Its notes say a public copy exists, but this audit found **no** `site/public/case-studies/60-s-norwood/` directory. Treat the draft as unpublished in this snapshot until checked. Missing acquisition/renovation figures and dates; final matching-angle after photos remain useful next inputs.
6. Mead notes' heading still says photography pending, but its open-items section explicitly resolves photos on Aug 27. Preserve the newer resolution. Building type was not supplied, so use “home.” The rejected old AI exterior must never become a real-property photo. A floor-plan graphic with unconfirmed measurements was intentionally excluded.
7. Current working-tree additions include Ewing photo choice artifacts, Clarendon/Mead source drops and image folders, a Barry Zillow staging pull, task/source notes, `SEO-interrogation.md`, annotation tooling, and a modified sitemap. Include reviewed creative assets, but avoid raw message dumps and unknown private source packets by default.

## Reels and product-edit work

`docs/product-edit/exports/CURRENT` explicitly says **v4**. The latest selected pair is:

- `REEL-1-the-website-v4.mp4` (~28.4 MiB)
- `REEL-2-kendall-street-v4.mp4` (~24.7 MiB)

These were built through Aug 16. The v3 staging README/conformance report predates v4; label it as review history. Its captions are drafts. Source commit `da1c7b5` describes v4's updated Contact Us beat. Retain v1–v3 exports in version history media rather than presenting them as final.

Unique project materials include `SPEC-reels.html`, `shavit-edit-dossier.html`, research/reference markdown and dossier parts, `reel1/` HTML renderers and captured footage, `mockup/` before-after reel renderers, `endcard/`, `audio/` licensing notes and beds, captions, QC outputs, staging contact sheets, and Palmier timeline IDs. A publication ruling was still documented for financial/address text visible within recorded website screens and music choice. Existence of an export is not proof of final publication approval.

The **Mead teaser is untracked working-tree work** under `docs/product-edit/mead-teaser/`, including source video, transcript, 19 source images, inserts, Palmier wiring scripts and exports v1–v15. Latest numbered full exports found are `mead-teaser-v15.mp4` and `mead-teaser-v15-text.mp4`; no CURRENT selector or approval record was found in that folder, so call them latest versions, not automatically approved finals. Retain alternate `*-preview` videos as drafts.

Rebuild prerequisites and limitations:

- Node + Playwright/Chromium for frame renders and site captures; Python for timeline wiring/QC; FFmpeg/ffprobe; Tesseract for the OCR acceptance script; Pillow and NumPy for one QC helper.
- Current scripts hardcode Jake's browser cache path, local `~/projects/shavit-*` paths, and a Palmier project in `~/Documents/Palmier Pro/`. These must be mapped to the successor's installed tools/workspace before rerendering.
- `recut.py`, `accept-edit.sh`, and Mead wiring scripts call `shavit-pipeline/docs/reel-specs/_scripts/pmcp.py`. Include that connector/helper if packaging the pipeline; never imply the scripts are standalone without it.
- `accept-edit.sh` checks current export formats, audio, OCR regions, end card and Palmier state. Run only in a restored development copy with dependencies, after path/configuration review.

Size management: this project's docs total ~2,390 MiB across 4,640 files. Roughly 4,435 JPGs are predominantly generated render frames. Finished exports are 239 MiB; Mead teaser total is 868 MiB (569 MiB exports); `mockup/` 552 MiB; `reel1/` 700 MiB. Media release archives with a checksum manifest and restore tool fit this handoff better than committing all frame sequences to Git. Preserve render frames in an optional reproducibility archive if the promise is “all creative work,” or explicitly inventory omitted generated caches; do not silently omit original footage or current exports.

## Social designs and how to maintain them

Instagram's `BRIEF.md` is the July 1 baseline and now stale in important details: it says navy/orange and Creator account; current `index.html`/`build_spec.py` propose the live black/brass/gold system and a Business account. The expanded social PDF, updated HTML/builder, Facebook and LinkedIn banners, LinkedIn launch card, and their builders are **uncommitted**. Copy working files.

Useful deliverables:

- `Shavit-Social-Remodel.pdf`: broader social proposal.
- `Shavit-Instagram-Remodel.pdf`: earlier or narrower deliverable; preserve the version distinction.
- `index.html`: self-contained imagery and printable proposal covering profile, bio, pinned row, grid evolution, five highlights, platform footprint, rollout, draft captions and KPIs.
- `assets/tiles/cover_fb.jpg`: Facebook cover, 1640×624.
- `assets/tiles/cover_li.jpg`: LinkedIn banner, 1584×396.
- `assets/tiles/li_announcement.jpg`: LinkedIn launch card, 1200×1200.
- `build_spec.py`: Python standard-library builder of self-contained HTML from local assets.
- `build_banner.py` / `build_li_card.py`: Pillow builders; currently resolve source photos through Jake's canonical website path and use a macOS font. Make these paths portable before rebuilding on a different machine.

Facebook suite's `index.html` also embeds its images, so it is the simplest portable preview. Its `assets/` is empty because `build_spec.py` reads listing images from the canonical website path at build time. Its exported PDF is already available. The Page naming, ownership/access, Business Suite connections and actual account activation must be checked with the owner; the spec is not an account audit.

The social brief identifies the non-watermarked Desktop `Shavit Social Media content FINAL` library as canonical posting media, and the “Marketing Material Mockups (Watermarked)” set as approval-only. Root's media lane is auditing those separately.

## Legacy June marketing and analytics package

The archived `shavit/` folder is a coherent deliverable set worth preserving intact after a privacy scan:

1. `01-strategy-deck/`: 12-slide navigable/printable HTML deck plus full and slides 4–12 PDF exports.
2. `02-site-changes/`: reference copies and instructions for old GA4/GTM, `/links` UTM hub and events.
3. `03-lead-log/`: seven-column CSV template with example rows and operating instructions. Label examples as examples; do not mix with real lead records.
4. `04-looker-studio/`: dashboard build guide; it does not prove a live report was connected.
5. `05-90-day-targets/`: target tracker CSV/Markdown; targets are not performance results.
6. `06-content-playbook/`: five no-camera formats and four-week starter calendar.
7. `07-content-engine/`: source-unit/post templates, rotation rules, prompt pack, Creatomate template, platform mappings, approval UI, Make runbook and local video render scripts.
8. `analytics/`: UTM conventions and GTM/GA4 setup.
9. `analytics-tracker/`: interactive manual-entry tracker and PDF.

The engine README explicitly says components were built but the service connections/scenario were not running. Its historical “auto-post after 24h” instructions, generated/Street View property sourcing, lead-form/email/owner funnels, dated pricing and account setup claims must be labeled historical. Current work requires approved real property imagery and human-controlled posting. Do not activate the archive's automation while preparing a handoff.

The old Desktop website uses vendored React, `src/*.jsx`, `app.bundle.js` and Babel standalone (`build_bundle.js`). `node serve.js` previews on 127.0.0.1:8803; `node build_bundle.js` rebuilds JSX. Package.json has no meaningful automated test. Preserve it as an earlier design, with its `/links`, analytics and forms clearly separated from the current Vite/SSG site.

Active source currently under Desktop/Documents has an iCloud risk. The handoff's maintained checkout should live in a normal development directory such as `~/projects/shavit-handoff`.

## Manifest and exclusion recommendations

Include source snapshots, docs/specs/deliverable PDFs, current optimized public assets, design exports, image provenance decisions, current plus historical creative exports, source footage/images, and helper scripts. Keep a human-readable “current versus archive” index. For private GitHub sharing, use source files in Git and private release archives for media, with per-file sizes/hashes and a restore command.

Exclude credentials and machine state:

- `.launch-secrets`, `.supabase-secrets`, `site/.env`, `.env*` except deliberately sanitized examples.
- `.git`, `.netlify`, `site/supabase/.temp`, `.playwright-mcp`, node_modules, dist, browser caches, `.DS_Store`.
- Original pipeline `.bones`/`.loop` runtime internals are unnecessary executable machine state; preserve selected specs/reviews as historical documents instead.
- Raw iMessage dumps such as `docs/tasks/sources/howder-imessage-story-sources-2026-08-24.txt`, annotation inboxes (`docs/spec-inbox.jsonl`), and unreviewed document/photo drops require deliberate curation. Summarize project-relevant decisions without publishing private unrelated conversation.
- Quarantine `rejected-photos/`, misleading/AI property photography, unconfirmed floor plans, and third-party reference video from the approved media library. If preserving as history, place in clearly marked rejected/reference archives with provenance, not posting assets.

Some original docs instruct future agents or contain personal paths. Treat those as historical source material, not a replacement for the handoff's root operating instructions.

`~/Desktop/property-manager-dashboard-interactive/` was checked for relevance: generic React/Vite template README; no Shavit, Rootman, Charger, Hillsdale, Niles, Kendall, Cleveland or Salem references anywhere in inspected source/config/docs. **Exclude from the Shavit handoff unless separate memory evidence ties it to the engagement.**
