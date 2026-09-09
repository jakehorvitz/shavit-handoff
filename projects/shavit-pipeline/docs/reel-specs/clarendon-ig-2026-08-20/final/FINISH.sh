#!/usr/bin/env bash
# FINISH.sh — one-shot finisher for the Clarendon Road carousel + Facebook post.
# Written 2026-08-21 by agent clarendon-ig-fb.
#
# WHY THIS EXISTS
#   The agent session was blocked from running ANY shell command in this repo by
#   bones-guard (PreToolUse hook on Bash, ~/.claude/settings.json): .bones/state.sha256
#   is missing, so the guard refuses every Bash call with [state-integrity], including
#   its own remedy `bones status`. The guard says not to reword commands around it, so
#   nothing was. Read/Write were not blocked: every file is in place; only the
#   execution steps below are outstanding.
#
# UNSEAL FIRST, from your own terminal (bones.sh auto-seals a missing state.sha256):
#   cd ~/projects/shavit-pipeline && bones status
# then:
#   bash docs/reel-specs/clarendon-ig-2026-08-20/final/FINISH.sh
#
# What it does, in order:
#   1. renders the 10 slides + 01b + ALT_02 + MASTER.pdf + REVIEW-sheet + FB exports
#   2. registers the FB post with shavit.sh new (idempotent; never overwrites post.md)
#   3. proves both posts pass every machine lint rule on marker-stripped copies,
#      then shows the expected unknown-fact stop on the real posts (no facts/ yet)
#   4. copies the send-ready set to ~/Desktop/Shavit - Clarendon Carousel/
#   5. git add by name + commit (never -A / .)
#   6. prints the spec URL
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$REPO"
SPEC_DIR="docs/reel-specs/clarendon-ig-2026-08-20"
FINAL="$SPEC_DIR/final"
FB="$SPEC_DIR/fb"
PY="${PYTHON:-python3.13}"          # system python3 has no Pillow

echo "== 1/6 render"
"$PY" docs/reel-specs/_scripts/render_clarendon.py

echo "== 2/6 register the Facebook post (no-op if post.md exists)"
./shavit.sh new -p facebook clarendon-triplex-fb

echo "== 3/6 lint proof"
LINT_OUT="$FINAL/LINT-OUTPUT.txt"
: > "$LINT_OUT"
strip_markers() {  # stdin -> stdout, [F:id]{text} -> text (same regex as shavit.py MARKER_RE)
  python3 -c 'import re,sys; sys.stdout.write(re.sub(r"\[F:([^\]]+)\]\{([^}]*)\}", r"\2", sys.stdin.read()))'
}
for id in clarendon-deal-story clarendon-triplex-fb; do
  tmp="content/_lintcheck-$id"
  rm -rf "$tmp"; mkdir -p "$tmp"
  strip_markers < "content/$id/post.md" > "$tmp/post.md"
  {
    echo "### $id — markers stripped to text (proves prose passes every machine rule)"
    echo "\$ ./shavit.sh lint _lintcheck-$id"
    ./shavit.sh lint "_lintcheck-$id" 2>&1 || true
    echo
    echo "### $id — real post.md (expected: unknown-fact until Jake runs fact add)"
    echo "\$ ./shavit.sh lint $id"
    ./shavit.sh lint "$id" 2>&1 || true
    echo
  } | tee -a "$LINT_OUT"
  rm -rf "$tmp"
done
echo "lint output saved to $LINT_OUT"

echo "== 4/6 Desktop copy (rev 3: replaced in full; no 01b, no ALT; 02 is the before collage)"
DESK="$HOME/Desktop/Shavit - Clarendon Carousel"
rm -rf "$DESK"
mkdir -p "$DESK/facebook"
cp "$FINAL"/0[1-9]_*.jpg "$FINAL"/10_*.jpg "$DESK/"
cp "$FINAL"/Clarendon-Carousel-MASTER.pdf "$FINAL"/REVIEW-sheet.jpg \
   "$FINAL"/CAPTION.txt "$FINAL"/FRAMES.md "$FINAL"/NOTES.txt "$DESK/"
cp "$FB"/0[1-5]_*.jpg "$FB"/CAPTION.txt "$DESK/facebook/"
echo "copied to: $DESK"

echo "== 5/6 commit by name"
git add \
  docs/reel-specs/_scripts/render_clarendon.py \
  docs/reel-specs/clarendon-ig-2026-08-20.html \
  "$FINAL" "$FB" \
  content/clarendon-deal-story/post.md \
  content/clarendon-deal-story/coach.md \
  content/clarendon-deal-story/FACTS-TO-ADD.md \
  content/clarendon-deal-story/LINT-PROOF.md \
  content/clarendon-triplex-fb/post.md \
  content/clarendon-triplex-fb/coach.md \
  content/clarendon-triplex-fb/state \
  docs/tasks/2026-08-21-clarendon-ig-fb.md \
  docs/tasks/2026-08-21-clarendon-ig-rev3.md
git commit -m "docs(reel): Clarendon Road carousel rev 3, Jake's six notes applied

Slide 02 is the before collage inside the deck; 03 to 07 are split
before-left / after-right frames per docx category; 10 closes on the
exterior at a different crop; cover A stays, 01b leaves the send set.
Copy unchanged: Shavit docx 2 wording only. Renderer extended (split()),
not forked. Spec bumped to rev 3. Nothing posted. Website repo untouched.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XvXhnEsGhe1co4pwZntmR8" || echo "(nothing to commit, or commit skipped)"

echo "== 6/6 done"
echo "spec: http://localhost:8766/docs/reel-specs/clarendon-ig-2026-08-20.html   (this repo's spec server is on 8766)"
echo "desktop: $DESK"
