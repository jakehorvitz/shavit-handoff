# Shavit Rootman — No-LinkedIn Marketing + Analytics

All five deliverables from the 2026-06-11 marketing spec
(`docs/superpowers/specs/2026-06-11-shavit-no-linkedin-marketing-analytics-design.md`).

The throughline is **attribution**: every funnel is UTM-tagged, every on-site
intent fires a GA4 event, and everything off-site lands in the Lead Log — so the
Looker Studio dashboard shows real demand by market, not just traffic.

```
Reel/Short (UTM, by market)
  → /links hub (4 UTM buttons)
    → Openings / Tenants / Owners / Substack
      → email (the key conversion)   ──► GA4 events ─┐
                                                     ├─► Looker Studio (1 page, shared w/ Shavit)
      → off-site reply / call / offer ──► Lead Log ──┘        reviewed monthly vs 90-day targets
```

## The five deliverables

| # | Deliverable | Where | Status |
|---|-------------|-------|--------|
| 1 | **Strategy deck** (black/gold HTML, 12 slides) | [`01-strategy-deck/index.html`](01-strategy-deck/index.html) | ✅ built & previewed |
| 2 | **Site changes** (`/links` hub, GA4+GTM, CSP, 5 events, UTM routes) | implemented in `~/Desktop/Shavit/website/` · ref copies in [`02-site-changes/`](02-site-changes/) | ✅ built & event-tested |
| 3 | **Lead Log** template (7 cols + example rows) | [`03-lead-log/lead-log-template.csv`](03-lead-log/lead-log-template.csv) | ✅ |
| 4 | **Looker Studio** dashboard build guide | [`04-looker-studio/looker-studio-setup-guide.md`](04-looker-studio/looker-studio-setup-guide.md) | ✅ |
| 5 | **90-day targets** tracker | [`05-90-day-targets/`](05-90-day-targets/) | ✅ |
| 6 | **No-camera content playbook** (5 formats + Higgsfield prompts + 4-week calendar) | [`06-content-playbook/`](06-content-playbook/) | ✅ |
| 7 | **Autonomous short-form content engine** (generates + auto-posts to 7 platforms incl. LinkedIn; Creatomate template, prompt pack, compliance gate, approval queue, Make runbook) | [`07-content-engine/`](07-content-engine/) | ✅ built, connect per SETUP |
| — | **Analytics setup** (GTM/GA4 guide + UTM conventions) | [`analytics/`](analytics/) | ✅ |
| — | **Live analytics tracker** (interactive, fill-in, flags on/off track vs the 90-day targets — your view until Looker is connected) | [`analytics-tracker/index.html`](analytics-tracker/index.html) | ✅ |

## Open the deck
`open shavit/01-strategy-deck/index.html` — arrow keys / space / click to navigate,
**F** for fullscreen. Prints to PDF (one slide per page).

## Jake's setup checklist (in order)
1. **GTM/GA4** — follow [`analytics/GTM-GA4-setup-guide.md`](analytics/GTM-GA4-setup-guide.md);
   paste your real `GTM-XXXXXXX` into `~/Desktop/Shavit/website/gtm-loader.js`.
2. **Lead Log** — import [`03-lead-log/lead-log-template.csv`](03-lead-log/lead-log-template.csv)
   into a Google Sheet named `Shavit — Lead Log`.
3. **Dashboard** — build it per [`04-looker-studio/looker-studio-setup-guide.md`](04-looker-studio/looker-studio-setup-guide.md); share read-only with Shavit.
4. **Confirm placeholders** — YouTube channel URL in `links/index.html`; verify Gmail
   plus-addressing on `info@shavitrootman.com`.
5. **Deploy the site** — static files only; rebuild the bundle only if you touch JSX.

## What's verified vs what needs Jake
- **Verified locally:** `/links` renders on-brand; all 5 GTM events fire
  (`email_click`, `openings_click`, `owners_page_view`, `substack_click`,
  `youtube_click`); CSP serves with the two new allowances; no console errors; deck
  navigates and renders at presentation size.
- **Needs Jake (can't be done without Google login):** real GTM/GA4 IDs, the GA4
  property + container build, the Looker Studio report, and the shared link. Every
  one is documented step-by-step in `analytics/` and `04-looker-studio/`.
```
shavit/
├─ README.md                         ← you are here
├─ 01-strategy-deck/                  Deliverable 1 — HTML deck (+ portrait/house imagery)
├─ 02-site-changes/                   Deliverable 2 — reference copies + change log
│  └─ README.md                       what changed in the live site + deploy steps
├─ 03-lead-log/                       Deliverable 3 — CSV template + usage README
├─ 04-looker-studio/                  Deliverable 4 — dashboard build guide
├─ 05-90-day-targets/                 Deliverable 5 — targets tracker (.md + .csv)
├─ 06-content-playbook/               Deliverable 6 — no-camera production system + calendar
├─ 07-content-engine/                 Deliverable 7 — autonomous short-form pipeline (build + runbook)
├─ analytics-tracker/                 Interactive fill-in tracker (open index.html) — live view till Looker
└─ analytics/                         GTM/GA4 setup guide + UTM conventions
```
