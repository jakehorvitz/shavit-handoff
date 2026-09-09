# UTM conventions — Shavit Rootman

Every outbound link Jake controls (IG bio, reel CTAs, Substack, email signatures)
should carry UTM parameters so GA4 can attribute the session to a channel and
campaign. **One convention, used everywhere.**

## The rule

- **All lowercase.** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
- Words separated by `_` (never spaces or camelCase).
- Put UTMs in the **query string**, before the `#` hash route:
  `https://shavitrootman.com/?utm_source=instagram&utm_medium=social&utm_campaign=openings&utm_content=reel_cleveland_2026_06#openings`

## The four parameters

| Param | What it answers | Allowed values |
|-------|-----------------|----------------|
| `utm_source` | Which platform? | `instagram`, `youtube`, `substack`, `email`, `qr`, `local` |
| `utm_medium` | What kind of link? | `social`, `bio`, `video`, `newsletter`, `email_sig`, `print` |
| `utm_campaign` | Which funnel/goal? | `openings`, `tenants`, `owners`, `awareness`, `substack` |
| `utm_content` | Which exact creative? | free-form, dated, market-tagged — see below |

## `utm_content` naming (the granular one)

Pattern: `{format}_{market}_{yyyy}_{mm}` — lets you compare reels and markets.

| Example | Means |
|---------|-------|
| `links_hub` | the `/links` bio page itself |
| `reel_cleveland_2026_06` | a June 2026 reel about Cleveland |
| `carousel_hillsdale_2026_07` | a July carousel about Hillsdale |
| `yt_southbend_2026_06` | a South Bend YouTube long-form |
| `marketwalk_cleveland_2026_06` | a Market Walk reel |

## Standing campaign values (keep these stable — they map to dashboard sections)

| `utm_campaign` | Dashboard section | Funnel |
|----------------|-------------------|--------|
| `awareness` | Awareness strip | operator brand |
| `openings` | Tenant demand | fill rentals |
| `tenants` | Tenant demand | fill rentals |
| `owners` | Seller demand | direct sellers |
| `substack` | Awareness strip | newsletter |

## Quick copy-paste templates

**Instagram reel → openings (Cleveland, June 2026):**
```
https://shavitrootman.com/?utm_source=instagram&utm_medium=video&utm_campaign=openings&utm_content=reel_cleveland_2026_06#openings
```
**Instagram bio → /links hub:**
```
https://shavitrootman.com/links
```
(the hub's own buttons are already UTM-tagged with `utm_content=links_hub`)

**YouTube description → owners funnel:**
```
https://shavitrootman.com/?utm_source=youtube&utm_medium=video&utm_campaign=owners&utm_content=yt_southbend_2026_06#contact
```

## Gotchas

- **Don't UTM-tag internal links** (nav clicks within the site) — it resets
  attribution. Only tag links that bring people *in* from another channel.
- **`mailto:` links can't carry UTMs** to GA — that's why the seller funnel routes
  through an on-site page (`#contact?utm_campaign=owners`) first, *then* the email.
  The email itself is captured as the `email_click` key event.
- Keep a copy of every campaign string in the **Lead Log** `campaign` column so
  off-site outcomes (emails, calls) tie back to the same campaign GA4 sees.
