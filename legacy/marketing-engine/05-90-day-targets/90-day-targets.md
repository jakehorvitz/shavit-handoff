# 90-day "good" targets — Shavit Rootman

**How to use this:**
- It's the **yardstick for the first quarter**, baked straight from the marketing spec.
- **Read the dashboard against this table** in every monthly review.
- **Fill the month columns** as you go (or use [`90-day-targets.csv`](90-day-targets.csv) as a Sheet/dashboard tile).
- Every metric **maps to a dashboard section** and a **data source** (see tables below).

> "Good" here means **operator-credible momentum from a small base** — not vanity
> growth. The point is warm partnerships when inquiries reopen, filled units, and a
> trickle of real seller conversations.

## The targets

| # | Metric | Target | Dashboard section | Where the number comes from |
|---|--------|--------|-------------------|------------------------------|
| 1 | **Posting floor** | hit the cadence in **≥80% of weeks** | Awareness | posting log — weeks with 2 reels + 1 carousel ÷ total weeks |
| 2 | **IG follower growth** | **5–10% / month** from a small base | Awareness | Lead Log `Monthly` tab (`ig_followers`), month-over-month |
| 3 | **Qualified tenant inquiries** | **3–5 per available unit** | Tenant demand | Lead Log rows `type=tenant` ÷ open units |
| 4 | **Trackable traffic per opening** | **every opening** has attributed traffic | Tenant demand | GA4 `openings_click` + a Lead Log row per opening |
| 5 | **Source attribution** | **≥70%** of inquiries source-attributed | Tenant + Seller | Lead Log rows with a non-blank `source` ÷ all |
| 6 | **Direct-seller conversations** | **1–3 / month** credible, across markets | Seller demand | Lead Log rows `type=seller`, `status=qualified`+ |

## Tracking grid (fill monthly)

| Metric | Target | Month 1 | Month 2 | Month 3 | On track? |
|--------|--------|---------|---------|---------|-----------|
| Posting floor (weeks ≥80%) | ≥80% | | | | |
| IG follower growth | 5–10%/mo | | | | |
| Qualified tenant inquiries / unit | 3–5 | | | | |
| Trackable traffic per opening | every opening | | | | |
| Source attribution rate | ≥70% | | | | |
| Direct-seller conversations / mo | 1–3 | | | | |

## How each ties to the analytics stack
- **1, 2** → Awareness strip. #1 is a discipline metric (your posting log); #2 needs
  the `Monthly` tab since IG follows aren't in GA4.
- **3, 4, 5** → Tenant demand. #4 is the "no opening goes dark" check — every live
  unit should show either an `openings_click`/session in GA4 or a logged inquiry.
- **6** → Seller demand, straight from the Lead Log (`type=seller`).

## Guardrails (from the spec — "good" can still go wrong)
- **Don't sound like a capital raise.** No return claims, no "invest with us." Hitting
  targets while drifting salesy is a miss, not a win.
- **Don't over-polish.** Operator credibility is the moat; phone footage + real numbers
  beats guru gloss.
- **Don't blur the three markets.** Track and post Hillsdale / Cleveland / South Bend
  separately — the `market` column and per-market tables exist for exactly this.
