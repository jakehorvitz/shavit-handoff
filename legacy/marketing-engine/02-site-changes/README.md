# Deliverable 2 — Site changes (analytics + `/links` hub)

These changes were implemented **live** in the real site source at
`~/Desktop/Shavit/website/`. The files in this folder are **reference copies** so
the change set is captured alongside the other deliverables. Source of truth is
the website repo; rebuild/deploy from there.

---

## What changed (7 edits, all in `~/Desktop/Shavit/website/`)

| # | File | Change |
|---|------|--------|
| 1 | `gtm-loader.js` *(new)* | Self-hosted Google Tag Manager bootstrap. Exists as a same-origin file so the strict CSP (`script-src 'self'`, no inline) stays intact. **Set your `GTM-XXXXXXX` inside this file.** |
| 2 | `analytics.js` *(new)* | Funnel event tracker. Pushes the 5 named events to the GTM dataLayer via delegated click-listening + hash-route detection. No edits to the React bundle required. |
| 3 | `ga4-loader.js` *(new, optional)* | Direct-GA4 alternative to GTM. **Disabled by default.** Use *either* GTM *or* this — never both. |
| 4 | `index.html` | Added the three `<script>` includes in `<head>` (gtm-loader + analytics active; ga4-loader commented). |
| 5 | `_headers` | **CSP loosened by exactly two entries** (the only loosening): `script-src` += `https://www.googletagmanager.com`; `connect-src` += `https://*.google-analytics.com`. |
| 6 | `serve.js` | Same two CSP entries (so local preview matches prod) + directory-index resolution so `/links` serves `links/index.html` locally. |
| 7 | `links/index.html` *(new)* | The `/links` bio-hub page (Instagram bio target). Black/gold brand, UTM-tagged buttons, loads the same self-hosted analytics. |

> **Note:** `app.bundle.js` was **not** touched and does **not** need rebuilding —
> `analytics.js` works entirely by event delegation, so no JSX changed.

---

## The 5 tracked events (per the marketing spec)

| Event | Fires when | Funnel | Notes |
|-------|-----------|--------|-------|
| `email_click` | any `mailto:` clicked | **all (KEY EVENT / conversion)** | `email_alias` param splits funnels: `rentals+hillsdale` → tenant, `owners` → seller |
| `openings_click` | visitor lands on `#openings` | tenant | route-detected, fires from anywhere |
| `owners_page_view` | visitor lands on `#contact?utm_campaign=owners` (or `#owners`) | seller | the direct-seller funnel |
| `substack_click` | any `*.substack.com` link clicked | awareness | |
| `youtube_click` | any `youtube.com` / `youtu.be` link clicked | awareness | |

All five were verified firing in the local preview (no console errors).

---

## The `/links` hub buttons (all UTM-tagged)

IG bio target → `https://shavitrootman.com/links`

| Button | Destination | Campaign |
|--------|-------------|----------|
| View Openings | `…/?utm_source=instagram&utm_medium=social&utm_campaign=openings&utm_content=links_hub#openings` | openings |
| Tenant Info | `…?utm_campaign=tenants…#tenants` | tenants |
| For Owners — Direct Sale | `…?utm_campaign=owners…#contact` | owners |
| Substack | `https://shavitrootman.substack.com/?utm_campaign=substack…` | substack |
| (footer) Instagram · YouTube · Email | social row | — |

UTM convention is lowercase `utm_source/medium/campaign/content` — see
[`../analytics/UTM-conventions.md`](../analytics/UTM-conventions.md).

---

## Jake's to-do before this goes live

1. **`gtm-loader.js`** — replace `GTM-XXXXXXX` with your real GTM container ID.
2. **GTM** — build the container (GA4 config tag + 5 Custom-Event triggers + 5 GA4
   event tags). Full walkthrough: [`../analytics/GTM-GA4-setup-guide.md`](../analytics/GTM-GA4-setup-guide.md).
3. **`links/index.html`** — confirm the YouTube channel URL (placeholder
   `https://www.youtube.com/@shavitrootman`).
4. **Email aliases** — verify Gmail plus-addressing works on `info@shavitrootman.com`
   (`rentals+hillsdale@`, `owners@`) before printing them on Openings/Tenants pages.
5. **Deploy** — rebuild only if you edit JSX (`node build_bundle.js`); otherwise just
   ship the static files. The Netlify-ready zip already serves `/links` as a pretty URL.

## Deploy / preview locally
```bash
cd ~/Desktop/Shavit/website
node serve.js                 # http://127.0.0.1:8803  → site, /links, analytics
# (rebuild bundle ONLY if you changed src/*.jsx)
node build_bundle.js
```
