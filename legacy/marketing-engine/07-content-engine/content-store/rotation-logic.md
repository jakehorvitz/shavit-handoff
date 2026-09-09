# Rotation logic — the picker

How the pipeline (Make Module 2) chooses the next Source Unit each run. Goal: never
repeat the same pillar/market back-to-back, never neglect a market, and **never
stall or invent a property** when real assets are thin.

## Inputs
- The `source-units.csv` sheet (status `unused`/`used`).
- The most recent `used` row → gives `last_pillar` and `last_market`.

## Pillars
- **Proof pillars** (need a real asset): `numbers`, `before_after`, `openings`
- **Conceptual pillars** (no specific house needed): `operator_note`, `market_walk`

## Selection algorithm
1. **Markets round-robin.** Target market = next in `Hillsdale → Cleveland → South Bend → …` after `last_market`.
2. **Prefer proof when assets exist.** Among `unused` rows for the target market, if any has a non-empty `asset_folder_url` (proof pillar with real photos), pick the one whose `pillar` ≠ `last_pillar`.
3. **Fallback to conceptual.** If no `unused` proof row has assets, pick an `unused` conceptual row for the target market (`operator_note` via text/AI visual, `market_walk` via Street View). The engine keeps running with authentic, no-asset-needed content.
4. **Market empty?** If the target market has no eligible `unused` row, advance to the next market and repeat.
5. **All used?** If every row is `used`, surface a "restock the content store" alert (Module writes to the approval queue as a notice) — do not recycle silently.

## State updates (Module 9, after a successful post)
- Flip the chosen row `status` → `used`.
- Append the post to `posts-log.csv` (date, platform, pillar, market, campaign, utm_content, post_url).

## Why this shape
- Round-robin markets enforces the spec's "track and post by market — don't treat them the same."
- Proof-first-then-conceptual is the authenticity/autonomy balance: real houses when we have them, honest conceptual content when we don't — never a synthetic "his" property.
