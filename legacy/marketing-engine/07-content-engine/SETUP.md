# SETUP — connect the accounts and go live

Everything in this folder is built. This is the part only you can do: create the
accounts, connect your socials, paste the API keys into Make (they never touch the
assistant or this repo). ~60–90 min one-time.

## 0. Prerequisites
- A Google account (Sheets + Drive) — already have it.
- Business/Creator accounts where platforms require them (TikTok, Instagram → IG
  Business/Creator linked to a Facebook Page, YouTube channel).

## 1. Content store (5 min)
- Import `content-store/source-units.csv` into a Google Sheet named **`Shavit — Source Units`**.
- Add a second tab **`Posts`** from `content-store/posts-log.csv`.
- Create a Google Drive folder **`Shavit Assets`**; inside it, one subfolder per
  property with real photos. Paste each subfolder's share URL into the matching
  Source Unit row's `asset_folder_url`.

## 2. API keys (paste into Make connections only)
| Service | Where to get the key | Used by |
|---|---|---|
| Anthropic (Claude) or OpenAI | console.anthropic.com / platform.openai.com | Modules 4, 5 |
| Creatomate | creatomate.com → Project → API keys; import `video/creatomate-template.json` | Module 6 |
| Ayrshare | ayrshare.com → dashboard → API key | Module 8 |
| Higgsfield (optional) | already connected; for `operator_note` visuals | Module 3 |

## 3. Connect the 7 socials in Ayrshare (the long part)
In the Ayrshare dashboard → **Social Accounts → Link**, connect each and approve OAuth:
- [ ] TikTok (Business/Creator) [ ] Instagram (Business/Creator via FB)
- [ ] YouTube [ ] Facebook (Page) [ ] LinkedIn [ ] X/Twitter [ ] Threads

> You do this in Ayrshare's own UI — the assistant never sees these logins.

## 4. Build the Make scenario
- Follow `make-scenario-runbook.md` module by module.
- In each Make module, pick the connection you created in step 2/3 (never paste keys into the repo).

## 5. Approval queue
- Host `approval/index.html` somewhere you'll check (Netlify drop, GitHub Pages, or
  locally). Set `WEBHOOK` in it to your Make custom-webhook URL.
- The scenario writes `approval/queue.json`; you Approve/Veto there.

## 6. Go-live checklist
- [ ] Source Units sheet has ≥3 unused rows (mix of markets)
- [ ] At least one property subfolder has real photos
- [ ] Claude/OpenAI, Creatomate, Ayrshare keys connected in Make
- [ ] All 7 socials linked in Ayrshare
- [ ] Creatomate template imported, renders a test MP4
- [ ] Run the scenario once manually → item appears in the approval queue
- [ ] Approve it → confirm it posts to all 7 → check `Posts` tab logged it
- [ ] Turn the Schedule trigger ON

## Rough monthly cost (2–3 clips/week)
Make (~$10–20) + Creatomate (~$10–40) + Ayrshare (~$20+) + LLM (a few $) ≈ **$40–80/mo**.

## Brand-safety reminder
The compliance pass (Module 5) + your 24h veto are the guardrails. Don't remove them
to "speed things up" — they're what keep an off-brand or capital-raise-sounding clip
from auto-posting to 7 platforms at once.
