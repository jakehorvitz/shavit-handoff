# Make.com scenario — module-by-module build

Build this scenario in Make.com. It runs the 7-step loop end to end. Each module
below names the Make app + the exact asset it consumes from this folder. Connections
(API keys, OAuth) are set per `SETUP.md` — never pasted here.

> Why a runbook and not an importable blueprint: Make blueprints are brittle to
> author blind (they encode account IDs + connection UUIDs). Building module-by-module
> against your own connections is more reliable and takes ~30–45 min.

## Module 1 — Schedule trigger
- App: **Make › Schedule**
- Run: Mon / Wed / Fri at 09:00 (≈2–3 clips/week). Tune later.

## Module 2 — Pick the Source Unit
- App: **Google Sheets › Search Rows** on `source-units` where `status = unused`.
- Then a **Tools › Set variable** block implementing `content-store/rotation-logic.md`:
  compute target market (round-robin off the last `used` row), prefer a proof row
  with a non-empty `asset_folder_url`, else a conceptual row. Output the chosen row.

## Module 3 — Source the visual (Router)
- App: **Make › Router**, 3 routes by `pillar`:
  - proof (`numbers`/`before_after`/`openings`) → **Google Drive › Download a File** from `asset_folder_url`; host it to a public URL (Drive share link or Cloudinary).
  - `market_walk` → use a prebuilt Google Street View / Earth Studio still URL for the market.
  - `operator_note` → **Higgsfield › generate_image** (or a brand still) for an abstract visual.
- Output: `image_url`.

## Module 4 — Generate script + captions
- App: **Anthropic Claude** (or OpenAI) › Create a Completion.
- System + User = `prompts/01-script-and-captions.md` (paste `brand-voice.md` and
  `platform-captions.md` into the System block as instructed). Pass `market, pillar,
  headline, numbers_json, month`.
- Parse the returned JSON (`beats`, `captions`, `hashtags`).

## Module 5 — Compliance gate
- App: **Anthropic Claude** (or OpenAI) › Create a Completion = `prompts/02-compliance-pass.md`.
- Pass Module 4's JSON + `numbers_json`. Branch on `verdict`:
  - `pass` → continue with Module 4 output.
  - `fix` → continue with `fixed`.
  - `hold` → write to the approval queue flagged `hold` (human required); skip auto-post timer.

## Module 6 — Render the video
- App: **Creatomate › Render a Template** using `video/creatomate-template.json`.
- Modifications: `image_url`, `beat_hook`=beats.hook, `beat_proof`=beats.proof,
  `beat_cta`=beats.cta, `caption_track`=auto. Output: the MP4 URL.

## Module 7 — Write to the approval queue
- App: **Google Drive / HTTP** → write/append the item to `approval/queue.json`:
  `{ id, market, pillar, video_url, captions, verdict, expires_at = now+24h }`.
- The approval page reads this. Approve → resume webhook (Module 8 now). No action
  by `expires_at` → Module 8 fires automatically (a second Schedule/Sleep path).

## Module 8 — Post to all 7 (on approve or 24h timeout)
- App: **HTTP › Make a request** (or the Ayrshare app) per `distribution/ayrshare-mapping.md`.
- Iterate the 7 platforms; each gets its native caption + the same MP4.

## Module 9 — Log + close the loop
- App: **Google Sheets**: append each post to `posts-log.csv`
  (`date,platform,pillar,market,campaign,utm_content,post_url`) and update the Source
  Unit row `status → used`.

## Notes
- Keep a **Make error handler** on Modules 4–8 that writes failures to the approval
  queue as a notice (don't silently drop a run).
- Cost control: Modules 4–5 are cheap LLM calls; Module 6 (Creatomate) and Module 8
  (Ayrshare) carry the per-render/per-post cost — 2–3 runs/week keeps it ~$30–80/mo.
