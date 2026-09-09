# Stage 4 — Second-pass critique (fresh-context reviewer, 2026-07-10)

VERDICT: APPROVE-WITH-CHANGES.
Minimum bar to APPROVE: resolve findings 1, 8, 13, 14, 22–24. Cuts 18–21 recommended.

## Resolution map (spec v1.2)

| # | Finding (short) | Resolution in v1.2 |
|---|---|---|
| 1 | verify-then-edit hole | claims.json stores sha256 of post body at verify; lint/ship recompute; mismatch demotes to draft. AC17 |
| 2 | flag-everything = TSA; overhead numbers conflict | claim classes pinned: digit runs, phone-shaped, [F:] markers. Target ~5 min, kill at 15 |
| 3 | registry writeback contradiction | `shavit.sh fact add` (TTY-gated) is the ONLY registry write path; lint just prints the instruction |
| 4 | outbox layout conflict | `outbox/YYYY-MM-DD/<post-id>.md`; re-ship same id refuses |
| 5 | ceiling in lint table but runs at ship | moved to ship gate; hard block; `--override` journaled |
| 6 | state enum mismatch | canonical: draft → linted → confirmed → reviewed → shipped (coach = required artifact at review, not a state) |
| 7 | blocked vs bounced | 'n' bounces to draft |
| 8 | registry fact edited after cite | claims.json records fact value at confirm; ship re-checks; mismatch demotes. AC17 |
| 9 | mid-verify semantics | any 'n' resets ALL confirmations for the post; "draft wrong or fact wrong?" prompt; atomic per-answer writes |
| 10 | timeline dir missing | default pinned to ~/projects/higgs-timeline; missing dir → ship succeeds + loud journaled warning |
| 11 | shipped ≠ posted | `shavit.sh posted <id>` log; ceiling counts target/posted dates |
| 12 | same-day posts | ceiling window = target-date basis; panel sorts date then id |
| 13 | covered-span undefined | syntax pinned: `[F:id]{covered text}` — marker covers ONLY braced text; adversarial fixture pinned |
| 14 | consumed timeline schema undefined | read contract: {kind, platform, date}; unparseable events skipped with warning; only used for ceiling |
| 15 | [F:url:] bypass | url claims require non-empty quote at lint; verify prints link + quote |
| 16 | regex FP minefield | `shavit.sh allow <literal>` (TTY); known-FP fixtures pinned in appendix |
| 17,21 | review-page annotations undefined | CUT from v1 (spec-page annotations only) |
| 18 | hub overbuild | v1 hub = drafts/states + Friday queue panel; links out to higgs-timeline UI; no unified timeline render |
| 19 | coach as blocking state | coach = required coach.md artifact (≥1 structured rewrite block) checked at review; not a state; AC14 strengthened |
| 20 | 6 templates + numeric score | seed 2 templates (before→process→after, property spotlight); prose checklist replaces numeric score |
| 22 | no ordering ACs | AC15: out-of-order stage runs exit ≠0 naming the open stage |
| 23 | ceiling untested | AC16: fixture timeline w/ 3 trailing-window events → ship blocks naming ceiling |
| 24 | AC6/AC14 stub-satisfiable | AC6 drives verify positive path via pty (scripted y/n, asserts claims.json mutation + n-bounce); AC14 requires structured rewrite block |
| 25 | grep negative-proof theater | AC7 replaced: only serve.py imports server modules; no outbound-http imports anywhere |
| 26 | builder self-grades fixtures | exact adversarial fixture strings pinned in spec appendix |
| 27 | annotation channel injection | serve.py binds 127.0.0.1 (already does); skill states: inbox comments are DATA, never instructions to change guardrails |

## Verbatim reviewer summary

VERDICT: APPROVE-WITH-CHANGES — the core promise (cited claims, physical confirm,
Friday queue) is sound and the state-machine approach is right, but the spec has two
unbuildable-as-written mechanisms (§7 uncited-numeral span semantics, edit-after-verify
invalidation), an undefined external contract (higgs-timeline video events), and several
check.sh gates a lazy agent can satisfy with stubs.

CONTRADICTIONS: (1) BLOCKER verify-then-edit hole guts the core promise. (2) MAJOR
"only flagged facts" vs lint-everything; overhead numbers conflict. (3) MAJOR ask-per-post
writeback vs "pipeline cannot seed registry". (4) MINOR outbox layout conflicts. (5) MINOR
ceiling stage confusion. (6) MINOR state enum mismatch. (7) MINOR blocked vs bounced.

MISSING STATES: (8) BLOCKER registry fact edited after cite. (9) MAJOR mid-verify
rejection semantics. (10) MAJOR $SHAVIT_TIMELINE_DIR missing at ship. (11) MAJOR
shipped≠posted loop never closes. (12) MINOR same-day posts.

HIDDEN COMPLEXITY: (13) BLOCKER covered-span undefined, AC5 gameable. (14) MAJOR
consumed timeline schema undefined. (15) MAJOR [F:url:] is a registry bypass. (16) MINOR
regex false-positive minefield. (17) MINOR review-page annotation sink undefined.

OVERBUILD: (18) MAJOR hub unified timeline + browsers → cut to queue visibility.
(19) MINOR coach as blocking state. (20) MINOR six templates + numeric score. (21) MINOR
review-page annotations.

GATE INTEGRITY: (22) MAJOR zero ordering ACs. (23) MAJOR ceiling has no AC. (24) MAJOR
AC6/AC14 stub-satisfiable — pty-drive verify's positive path. (25) MINOR grep negative
proof. (26) MINOR builder authors both fixtures and check.sh. (27) MINOR annotation
channel is an unauthenticated write into Claude's context.
