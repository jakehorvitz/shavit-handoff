# shavit-pipeline — Stage 1 brainstorm + interrogation

Date: 2026-07-10

## Problem (Jake's words, tightened)
Content for the Shavit Rootman brand keeps shipping with hallucinated stats, invented
phone numbers, missing/wrong locations, weak bios, and easy errors from not reading
source material. Need a system that (a) mechanically forces Jake to check important
information before anything ships, (b) cites where every fact comes from, and
(c) embeds real Instagram/marketing expertise instead of generic copy.

## Recon findings
- `~/projects/video-brain/Shavit.md` — the **Shavit Register**: 17 hard rules already
  on record (no `$` figures, no house numbers, full state names MI/OH/IN spelled out,
  no Zillow photos, no generated architecture, de-identify people,
  disparage-house-not-street, reputation-not-virality, 2–3 posts/week ceiling,
  brand tokens: black canvas / white type / brass rules / gold mark / uppercase Inter).
  → These become machine-checkable lint rules + prose brand rules in the new pipeline.
- Existing Shavit projects: shavit-instagram (BRIEF.md + Remodel PDFs),
  shavit-rootman-website (live-site palette source), shavit-facebook-suite,
  shavit-edits, shavit-longform-film, shavit-match-cut-tour. Video is covered
  elsewhere; the gap is **text content with facts in it**.
- Relevant installed skills to orchestrate (not reinvent): social-content, jakevoice,
  real-estate-listing, instagram-research, deep-research, content-repurposer,
  ecc:marketing-agent, impeccable/ui-ux-pro-max (review page).

## Jake's interrogation answers (2026-07-10)
1. **Ground truth:** BOTH — canonical facts registry AND ask-per-post. Design:
   registry-first; any claim not covered by the registry hard-blocks the draft and
   asks Jake live; his answer is written back into the registry so it never asks twice.
2. **v1 scope:** Instagram + Facebook + LinkedIn (video excluded — covered by other
   Shavit projects).
3. **Ship gate:** BOTH — generated HTML review page (post preview, every fact
   highlighted with its citation) for reading comfort, plus a binding per-fact
   terminal confirm (y/n each claim; one 'n' or one uncited fact = post blocked).

## Approaches considered
**A. Skill + state machine ("bones for content") — RECOMMENDED.**
A `shavit.sh` driver (same enforcement philosophy as bones-pipeline) + a
`shavit-content` Claude Code skill. Stages per post/batch: intake → facts pull →
draft (playbook + voice) → machine lint (forbidden strings, phone-must-match-registry,
uncited-numeral detection) → per-fact Jake confirm (TTY) → HTML review page →
owner ship gate → outbox (drafts, never auto-posts) → post-log/learn.
Pros: mechanical enforcement (the whole point), fast to ship, composes existing skills.
Cons: terminal-centric UX.

**B. Full web app/dashboard.** Nicer UX, but weeks not days, and attacks Jake's
start>finish failure mode. Rejected for v1.

**C. Prose-only skill (checklists in SKILL.md).** Zero enforcement — an agent can
rationalize past prose. That is exactly today's failure. Rejected.

## Marketing/Instagram expertise plan
`playbook/` directory compiled from: Shavit-Instagram-Remodel.pdf +
Shavit-Social-Remodel.pdf (existing strategy docs), the Shavit Register rules
(reputation-not-virality, posting ceiling), an instagram-research pass on comparable
Midwest rehab/investor accounts, and platform-specific format guidance
(IG caption/carousel, FB post, LinkedIn post). Consulted at draft time; the review
page scores the draft against it (advisory, not the gate).

## Deferred dimensions (flagged for spec)
- Exact facts-registry seed contents (Jake must supply/verify phone, license, bio
  ground truth — the pipeline cannot invent these; seeding is a spec milestone).
- Post-performance feedback loop (stage 10 concern, thin v1: a simple post log).
