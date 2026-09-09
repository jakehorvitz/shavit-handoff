# Per-platform caption + UTM rules

One MP4, seven native captions. The generation prompt (`01-script-and-captions.md`)
must produce a caption per platform following these rules. Every link uses the
lowercase UTM convention (`utm_source/medium/campaign/content`) — see
[`../../analytics/UTM-conventions.md`](../../analytics/UTM-conventions.md).

## Shared link + UTM
- **Bio-link target:** `https://shavitrootman.com/links`
- **utm_medium:** `video` (these are all short-form video posts)
- **utm_campaign:** the pillar's funnel — `openings`/`tenants` → `openings`;
  `numbers`/`before_after`/`operator_note` → `awareness`; `market_walk` → `owners`
- **utm_content pattern:** `{pillar}_{market}_{yyyy}_{mm}` (lowercase, e.g. `numbers_hillsdale_2026_06`)

## Per-platform rules

| Platform | utm_source | Max length | Hashtags | First person? | CTA phrasing |
|---|---|---|---|---|---|
| TikTok | `tiktok` | ~150 chars, hook-first | 3–5, niche (#realestate #brrrr #{market}) | no | "openings in bio" |
| Instagram Reels | `instagram` | hook + 1 line | 3–5 | no | "tenant info + openings in bio" |
| YouTube Shorts | `youtube` | title-like first line | 2–3 + `#Shorts` | no | "link in description" |
| Facebook Reels | `facebook` | 1–2 fuller sentences | 0–2 | no | "details in bio" |
| LinkedIn | `linkedin` | 2–4 sentence reflection | 0 (no hashtag spam) | **yes** | "more on how I operate — link" |
| X / Twitter | `x` (Ayrshare key: `twitter`) | ≤ 240 chars, 1–2 lines | 1–2 | optional | "link" |
| Threads | `threads` | casual one-liner aside | 0–2 | optional | "openings in bio" |

## Rules that apply to every caption
- Name the market.
- No capital-raise / no fabricated numbers / no distress-seller language (per `prompts/brand-voice.md`).
- Append the UTM link except where the platform pushes link-in-bio (TikTok/IG/Threads → "in bio"; YouTube → description; LinkedIn/X/Facebook → inline link OK).
