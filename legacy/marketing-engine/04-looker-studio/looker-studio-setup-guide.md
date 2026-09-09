# Looker Studio dashboard — build guide (Shavit Rootman)

**The gist:**
- **One page. KISS.** Three stacked sections — **Awareness → Tenant demand → Seller demand**.
- **Two data sources:** GA4 (automatic) + the Lead Log Google Sheet (manual).
- **One shareable link** — read-only, sent to Shavit.
- **Reviewed monthly** — that's the cadence the whole stack feeds.
- **Build time:** ~30–40 min once GA4 has a few days of data.

> Looker Studio is free at **lookerstudio.google.com**. You build this in Jake's
> Google account. Do GTM + GA4 first ([../analytics/GTM-GA4-setup-guide.md](../analytics/GTM-GA4-setup-guide.md))
> and let GA4 collect a few days of data, or the charts read zero.

---

## Step 0 — Prereqs
- GA4 property live and publishing (Step 1–7 of the GTM/GA4 guide).
- Lead Log Sheet created from [`../03-lead-log/lead-log-template.csv`](../03-lead-log/lead-log-template.csv)
  (File → Import the CSV into a new Google Sheet named **`Shavit — Lead Log`**).

---

## Step 1 — New report + connect the two sources (~5 min)
1. **lookerstudio.google.com** → **Create** → **Report**.
2. **Add data** → **Google Analytics** → pick the `Shavit Rootman` GA4 property → **Add**.
3. **Add data** again → **Google Sheets** → pick `Shavit — Lead Log` →
   tick **Use first row as headers** → **Add**.
4. Rename the report (top-left) to **`Shavit Rootman — Marketing`**.
5. Set the default date range control to **Last 28 days** (Insert → Date range control,
   drop it top-right).

---

## Step 2 — Page layout

One page, three labeled bands top-to-bottom. Use **Insert → Text** for each band
title, then scorecards/charts under it.

```
┌─────────────────────────────────────────────────────────────┐
│  SHAVIT ROOTMAN — MARKETING            [ Last 28 days ▼ ]    │
├─────────────────────────────────────────────────────────────┤
│  AWARENESS                                                   │
│  [Site sessions] [Substack clicks] [YouTube clicks]  + trend │
│  (IG reach/follows + YT views → typed in monthly, see §5)    │
├─────────────────────────────────────────────────────────────┤
│  TENANT DEMAND                                               │
│  [Openings sessions] [Rental email clicks] [Inquiries logged]│
│  [Avg days-vacant]   + table: inquiries by market            │
├─────────────────────────────────────────────────────────────┤
│  SELLER DEMAND                                               │
│  [Owners page views] [Seller email clicks] [Qual. convos]    │
│  + table: seller conversations by market                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 3 — AWARENESS strip (GA4 + manual)

| Tile | Type | Source | Metric / setup |
|------|------|--------|----------------|
| **Site sessions** | Scorecard | GA4 | Metric = `Sessions` |
| **Substack clicks** | Scorecard | GA4 | Metric = `Event count`; add filter **Event name = `substack_click`** |
| **YouTube clicks** | Scorecard | GA4 | `Event count`, filter **Event name = `youtube_click`** |
| **Sessions trend** | Time series | GA4 | Dimension = `Date`, Metric = `Sessions` |

> **IG reach / follows and YT views/watch time** aren't in GA4 (different platforms,
> no free auto-connector). Enter them monthly — see **§5 Manual monthly inputs**.

**How to filter a scorecard to one event:** select the scorecard → right panel →
**Add a filter** → Create filter → `Event name` **Equal to** `substack_click` → Apply.

---

## Step 4 — TENANT DEMAND (GA4 + Lead Log)

| Tile | Type | Source | Setup |
|------|------|--------|-------|
| **Openings sessions** | Scorecard | GA4 | `Event count`, filter **Event name = `openings_click`** |
| **Rental email clicks** | Scorecard | GA4 | `Event count`, filter Event name = `email_click` **AND** `email_alias` **contains** `rentals` |
| **Inquiries logged** | Scorecard | Lead Log | Metric = `Record Count`, filter **type = `tenant`** |
| **Avg days-vacant** | Scorecard | Lead Log | Metric = avg of `days_vacant` *(add this column if you track it)*; else omit |
| **Inquiries by market** | Table | Lead Log | Dimension = `market`; Metric = `Record Count`; filter **type = `tenant`** |

> `email_alias` is the param `analytics.js` sends with every `email_click`
> (e.g. `rentals+hillsdale` → alias `rentals+hillsdale`). Filtering **contains
> `rentals`** isolates tenant emails; **contains `owners`** isolates seller emails.

---

## Step 5 — SELLER DEMAND (GA4 + Lead Log)

| Tile | Type | Source | Setup |
|------|------|--------|-------|
| **Owners page views** | Scorecard | GA4 | `Event count`, filter **Event name = `owners_page_view`** |
| **Seller email clicks** | Scorecard | GA4 | `Event count`, filter Event name = `email_click` **AND** `email_alias` **contains** `owners` |
| **Qualified conversations** | Scorecard | Lead Log | `Record Count`, filter **type = `seller`** AND **status = `qualified`** |
| **Conversations by market** | Table | Lead Log | Dimension = `market`; Metric = `Record Count`; filter **type = `seller`** |

---

## §5 — Manual monthly inputs (the few things GA4 can't see)

GA4 covers the site. These come from the platforms themselves; type them into a
second tab of the Lead Log called **`Monthly`** (columns: `month · ig_reach ·
ig_followers · yt_views · yt_watch_min · notes`), then add that tab as a third
data source and point the Awareness scorecards at it.

| Metric | Where to read it (free) |
|--------|--------------------------|
| IG reach | Instagram app → Professional dashboard → Reach |
| IG followers | Instagram profile (record the number monthly) |
| YT views / watch time | YouTube Studio → Analytics → Overview |

Keeping these in the Sheet means **one shareable dashboard** shows everything,
even the platform numbers, without paid connectors.

---

## Step 6 — Targets reference + share

1. Add a small **Text box** in the footer linking the 90-day targets
   ([`../05-90-day-targets/90-day-targets.md`](../05-90-day-targets/90-day-targets.md)),
   so every monthly review reads the dashboard against the same goals.
2. **Share** (top right) → **Manage access** → set link to **Anyone with the link →
   Viewer** → copy link → send to Shavit. He sees it read-only; he can't edit.
3. **Schedule delivery** (optional): Share → Schedule email delivery → monthly →
   Shavit + Jake. That *is* the monthly review artifact.

---

## Definition-of-done checklist
- [ ] GA4 + Lead Log both connected
- [ ] Awareness: sessions, substack_click, youtube_click tiles read live data
- [ ] Tenant: openings_click, rental email_click, inquiries-by-market table
- [ ] Seller: owners_page_view, seller email_click, qualified-conversations table
- [ ] `Monthly` tab feeding IG reach/follows + YT views
- [ ] Read-only link sent to Shavit
- [ ] Footer links the 90-day targets
