# Stage 1 — Brainstorm + Prompt Interrogation
### Shavit Rootman · Cinematic Match-Cut Property Tour (short-form)
_bones-pipeline · stage 1/10 · 2026-07-05_

## The concept in one line
A short (~20–30s) vertical cinematic **tour** that match-cuts between **real** Shavit
property photos, where AI (Higgsfield + Kling i2v) animates only the **motion between**
rooms — never the rooms themselves — with on-screen words lifted from **real client
testimonials** and a chosen music bed. Reputation-first, not hype.

## What we already hold (inputs verified this session)
- **176 real anchor images** from 57 @shavitness posts (2018→2026), provenance-logged
  → `anchors/` (symlink) + `anchors/manifest.csv`. Includes ready-made match-cut fuel
  like "River Street, Hillsdale — before & after" and "Second Chance Ranch."
- **3 real testimonials** from the old site (`old-website/.../HomePage.jsx`):
  1. **Gary Pauken · Hillsdale Resident** — pull *"REDUCED FEES / QUICKER SALE / HIGHER PROFITS"*
     ⚠ profit/fee language — brushes [[no-dollar-figures]] + [[flexing-is-red-flag]].
  2. **Jeffrey S. Riling · US Veteran** — pull *"PROFESSIONAL ACROSS THE BOARD"* — reputation-safe.
  3. **Nicky · Cleveland Real Estate Investor** — pull *"RELIABLE PARTNER / TRUSTWORTHY FRIEND"* — reputation-safe.
- **video-brain** third brain governs every generation (preflight/analyze/check).
- **Higgsfield MCP** (generate_image, generate_video/Kling, upscale_image) is live.

## Governing constraints (non-negotiable, from the brain)
- **[[no-generated-architecture]]** (standing/HARD) — every property pixel from a real photo.
- **[[walkthrough-no-corners]]** — no corner-turns / room-invention on interiors.
- **[[hallucinate-transitions-not-rooms]]** (proposed 7/5) — AI only in the sub-0.5s blur
  BETWEEN two real anchors; rooms hold, transitions move. **Dwell time is the discriminator.**
- **[[upscale-before-motion]]** — all 176 anchors are ~1080px (IG cap) → EVERY still must be
  upscaled to 2K/4K before i2v. This is the universal first build step.
- **Register:** no `$`/dollar sums, full state names (Michigan not MI), no house numbers,
  black/white/brass brand tokens, static (non-pulsing) logo, closer "…LOCALLY." not "PROFITABLY."
- **[[meta-ai-disclosure-mandate]]** — AI-motion label required.
- **[[machine-gates-vs-taste]]** — clearing gates ≠ Shavit approval; taste sign-off still required.

## Anti-requirements (what this is deliberately NOT)
- NOT a Ken Burns pan-on-stills slideshow (that's the v3/v6 failure the client rejected).
- NOT a fake AI walkthrough that flies through hallucinated rooms.
- NOT an income-claim / hype ad — no "$", no profit-flexing as the hook.
- NOT generated/outpainted architecture anywhere.
- NOT dependent on new footage — ships from the pulled archive + upscale.

## The three spec-mandated deliverables (Jake's asks, locked for stage 3)
1. **Frame-by-frame storyboard mockup** — every beat: which real anchor, the transition
   device between it and the next, on-screen word, timecode, motion verb.
2. **Background-music options** — a shortlist to pick from (license-safe), matched to the
   reputation tone, with the loudness/aspect rules baked in.
3. **On-screen words = testimonial fragments** — sourced above; register-filtered.

## Interrogation — open decisions that change the spec (for the kill-or-commit gate)
1. **Duration/platform** — 20s Reel/Short, or a tighter 12–15s? Default: **~24s vertical 9:16**.
2. **Which testimonial(s)** — lead with the two reputation-safe ones (Jeffrey + Nicky) and
   drop/soften Gary's profit language? Default: **Jeffrey + Nicky; Gary only if de-flexed**.
3. **One property or a portfolio sweep?** — a single-asset arc ([[serialized-single-asset]])
   reads deeper; a multi-property sweep shows range. Default: **single hero property (River
   Street before→after) as the spine**, 1–2 supporting cuts.
4. **How aggressive are the transitions** — subtle match-dissolves (premium, safest) vs.
   the flashier whip/light-tunnel? Default: **restrained match-dissolves**, one signature whip.
5. **Music lane** — orchestral-restraint, warm-piano, or modern-cinematic-minimal? (drives the shortlist)

## Build approach (feeds stage 3 spec + stage 5 acceptance)
Pick anchors → upscale each → i2v one slow move per real still → assemble real→blur→real in
the edit (model never carries between spaces) → composite testimonial type in safe zone →
score to chosen bed → frame-diff QA vs source → export multi-aspect @30fps. Acceptance check
(stage 5) runs preflight on every job + the register OCR gate before a credit is spent.
