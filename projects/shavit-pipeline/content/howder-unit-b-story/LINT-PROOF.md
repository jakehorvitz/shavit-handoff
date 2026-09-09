# Lint proof — howder-unit-b-story (2026-08-24 11:30 PM)

Real run: `./shavit.sh lint howder-unit-b-story` passed no-dollar, full-states,
no-house-numbers, and phone-registry, then died at
`unknown-fact: howder.unitb-done` — expected, the registry (`facts/*.yaml`) is
empty and TTY-only.

Simulated tail (shavit.py functions, the 11 FACTS-TO-ADD ids stubbed in):
- claims parsed: 11, all ids present in FACTS-TO-ADD.md, no strays
- uncited numerals: none (0.4 / 3-bed / 2-bath / 1-bed / 1-bath all inside spans)

Verdict: lint goes green as soon as the 11 `fact add` blocks in FACTS-TO-ADD.md
are registered. No post.md edits needed (editing after verify demotes to draft,
so add facts FIRST, then lint → verify → review → ship).
