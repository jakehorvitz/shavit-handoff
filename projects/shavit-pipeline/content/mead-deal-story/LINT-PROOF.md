# Lint proof — mead-deal-story (2026-08-31)

`./shavit.sh lint mead-deal-story` against the real root stops at:

    unknown-fact: mead.strategy is not in facts; run shavit.sh fact add

That is the designed gate, not a defect: `facts/` does not exist yet and registry writes
are TTY-only, so Jake types the fifteen blocks in FACTS-TO-ADD.md before lint can clear.

To prove the machine rules that run around the fact check, the same post.md was linted
under a throwaway `SHAVIT_ROOT` in the session scratchpad, seeded with sandbox facts
whose values are the spans themselves. The real registry was never created or written.

    seeded 15 sandbox facts (throwaway)
    lint ok

Rules exercised and passed on this body:

| rule | result |
|---|---|
| `no-dollar` | pass, no `$` in the body. Acquisition price, renovation spend, ARV, equity, monthly rent, cap rate and ROI all stay on the website. |
| `full-states` | pass, "Michigan" spelled out. `#HillsdaleMI` does not match `\bMI\b` (no word boundary before the M), so it clears lint; see coach.md decision 3 for the brand-rule-4 tension. |
| `no-house-numbers` | pass, "Mead Street" carries no leading digits. |
| `phone-registry` | pass, no phone-shaped strings. |
| `uncited-numeral` | pass, the body contains no digits at all outside markers. |
| `no-bait` (warn) | clean, no allowlisted bait phrase fires. |
| `url-quote` | passed once the supporting line was supplied. |

The url claim's quote is pre-seeded in `claims.json`, so the real lint will clear that
check as soon as the fifteen facts exist:

    Shavit's 8/30 teaser VO and caption send viewers to the case studies; the Mead
    study is live at /case-studies/34-mead/ (verified HTTP 200 on 8/31).

Rendered caption length: **2,099 characters**, inside Instagram's 2,200 ceiling.
First 125 characters render as his complete one-liner, so nothing truncates mid-thought
above the "...more" fold.

## Remaining gates

1. `./shavit.sh fact add` x15, TTY, Jake types (three of them are shared with the Mead
   story posts; add once).
2. `./shavit.sh lint mead-deal-story`
3. `./shavit.sh verify mead-deal-story`, TTY
4. `./shavit.sh review mead-deal-story`
5. Shavit's approval, his 8/27 5:01 PM standing rule.
6. `./shavit.sh ship mead-deal-story --date <date>`
