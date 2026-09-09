# Deliverable 7 — Autonomous short-form content engine

A pipeline that **generates short-form vertical videos and posts them to 7 platforms
on a schedule**, with a one-tap approval gate. Carries the website's black/gold theme
into every clip. No camera, Shavit never on screen. Spec:
[`../../docs/superpowers/specs/2026-06-15-shavit-autonomous-shortform-content-engine-design.md`](../../docs/superpowers/specs/2026-06-15-shavit-autonomous-shortform-content-engine-design.md).

## The loop (runs ~2–3×/week)

```
[schedule] → 1 PICK pillar×market → 2 SOURCE visual (real photo | Street View | AI)
   → 3 GENERATE script + 7 captions → 4 ASSEMBLE 9:16 MP4 (black/gold)
   → 5 SAFETY PASS → 6 APPROVE (1-tap, or auto-post after 24h) → 7 POST + LOG
```

Platforms: **TikTok · Instagram Reels · YouTube Shorts · Facebook Reels · LinkedIn · X · Threads** (no Pinterest).

## What's built (BUILD) vs what you connect (RUNBOOK)

| File | What it is |
|---|---|
| `content-store/source-units.csv` | the content store (Google Sheet template) |
| `content-store/rotation-logic.md` | the pillar×market picker + no-stall fallback |
| `content-store/posts-log.csv` | the post log (Sheet `Posts` tab) |
| `prompts/brand-voice.md` | voice + hard guardrails (shared) |
| `prompts/01-script-and-captions.md` | generates beats + 7 native captions |
| `prompts/02-compliance-pass.md` | brand-safety gate (blocks bad auto-posts) |
| `video/creatomate-template.json` | 9:16 black/gold video template |
| `distribution/platform-captions.md` | per-platform caption + UTM rules |
| `distribution/ayrshare-mapping.md` | one API → all 7 platforms |
| `approval/index.html` | review queue (approve/veto + 24h timer) |
| `make-scenario-runbook.md` | **[RUNBOOK]** module-by-module Make build |
| `SETUP.md` | **[RUNBOOK]** accounts, keys, go-live checklist |

## Honest status
- **Built + verified:** the Creatomate template (valid JSON, brand tokens), the
  approval page (renders, all 7 captions, 24h timer), the prompt pack + compliance
  gate, the content store, the distribution mapping, and the LinkedIn analytics
  re-enable (`linkedin_click`).
- **Needs you (can't be automated by the assistant):** create Make/Creatomate/Ayrshare
  accounts, connect your 7 socials, paste API keys, import the template, wire the
  scenario. All step-by-step in `SETUP.md` + `make-scenario-runbook.md`.
- The pipeline only *runs* once those accounts are connected — this folder is
  everything-ready-to-connect, not a live posting bot today.

## Brand-safety
Two guards keep AI content on-brand: the **compliance pass** (Module 5) auto-checks
every script/caption against the hard rules (no capital-raise, no fabricated numbers,
no distress-seller language), and **your 24h veto** before anything posts.
