# Deliverable 3 — Lead Log

**Why it exists:**
- It's the **off-site half of attribution** — GA4 only sees clicks and sessions.
- GA4 **can't see** what lands in Jake's inbox or happens on a call.
- The Lead Log captures **every email, conversation, and offer** — one row each.
- Result: the dashboard shows **real demand, not just traffic**.
- It's the source for "qualified inquiries," "seller conversations," and the **≥70% attribution** target.

## Make it a Google Sheet
1. Go to **sheets.google.com** → blank sheet → **File → Import →
   Upload** → `lead-log-template.csv` → **Replace spreadsheet** →
   *Convert text to numbers/dates: No* (keep dates as text-friendly `YYYY-MM-DD`).
2. Rename it **`Shavit — Lead Log`**. This is the name the Looker guide expects.
3. (Recommended) add a second tab named **`Monthly`** for IG/YT platform numbers —
   see §5 of the [Looker guide](../04-looker-studio/looker-studio-setup-guide.md).

## Columns (exactly 7, per the spec)

| Column | What goes in it | Allowed / example values |
|--------|-----------------|--------------------------|
| `date` | when the lead/event happened | `YYYY-MM-DD` |
| `market` | which market | `Hillsdale` · `Cleveland` · `South Bend` |
| `type` | which funnel | `tenant` · `seller` · `awareness` |
| `source` | where it came from | `instagram` · `youtube` · `substack` · `local` · `email` · `referral` |
| `campaign` | the UTM campaign it ties to | `openings` · `tenants` · `owners` · `awareness` · `substack` |
| `status` | pipeline stage | `new` · `contacted` · `qualified` · `toured` · `won` · `lost` |
| `outcome` | one-line note | free text |

> **Keep `campaign` matched to your UTM strings** ([../analytics/UTM-conventions.md](../analytics/UTM-conventions.md))
> so a logged email lines up with the GA4 campaign that drove it. That's how you hit
> the **≥70% source-attributed** target.

## How the dashboard reads it
- **Tenant inquiries** = rows where `type = tenant` (count by `market`).
- **Qualified seller conversations** = rows where `type = seller` AND `status = qualified`.
- **Source attribution %** = rows with a non-blank `source` ÷ all rows. Aim ≥70%.

## Optional extra columns (add to the right if useful — won't break anything)
- `days_vacant` — for the Tenant "avg days-vacant" tile.
- `email_alias` — paste the alias that received it (`rentals+cleveland`, `owners`)
  to cross-check against GA4's `email_click` param.
- `unit` — the specific property/unit, for per-opening tracking.

## Discipline (this is what makes it work)
- Log **every** inbound the day it lands — 30 seconds a row.
- Every opening gets at least one row when it goes live (so you can prove
  "every opening had trackable traffic").
- Review weekly; the monthly dashboard review reads straight off this sheet.
