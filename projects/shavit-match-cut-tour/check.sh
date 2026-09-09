#!/usr/bin/env bash
# Stage-5 acceptance check for the Shavit match-cut tour build.
# Passes (exit 0) only when the render outputs exist AND clear the register/preflight gates.
# Until the shots are generated + assembled, this fails — that's the point.
set -u
ROOT="$(cd "$(dirname "$0")" && pwd)"
BUILD="$ROOT/build"
fail(){ echo "✗ $1"; exit 1; }
ok(){ echo "✓ $1"; }

# 1 · upscaled anchors present (preflight 2.2 — every 1080px still upscaled to 2K+)
[ -d "$BUILD/upscaled" ] || fail "no build/upscaled/ — run the upscale pass first"
n=$(ls "$BUILD/upscaled"/*.jpg 2>/dev/null | wc -l | tr -d ' ')
[ "$n" -ge 6 ] || fail "expected >=6 upscaled anchors, found $n"
for f in "$BUILD/upscaled"/*.jpg; do
  w=$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')
  [ "${w:-0}" -ge 2000 ] || fail "$(basename "$f") is ${w}px wide (<2000) — re-upscale"
done
ok "$n anchors upscaled to >=2K"

# 2 · per-shot clips generated + frame-diff QA log present
[ -d "$BUILD/shots" ] || fail "no build/shots/ — generate the i2v clips"
[ -f "$BUILD/qa/frame-diff.log" ] || fail "no build/qa/frame-diff.log — run frame-diff vs source (preflight 7.1)"
grep -qi "REJECT" "$BUILD/qa/frame-diff.log" && fail "frame-diff.log still has REJECT rows — re-roll them"
ok "shots generated + frame-diff clean"

# 3 · assembled cuts exist at spec length (~40s, 9:16, 30fps)
for cut in B_safe A_showcase; do
  mp4="$BUILD/$cut.mp4"
  [ -f "$mp4" ] || fail "missing $cut.mp4"
  read -r W H FR DUR < <(ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,r_frame_rate,duration -of csv=p=0 "$mp4" 2>/dev/null | tr ',' ' ')
  [ "${H:-0}" -gt "${W:-1}" ] || fail "$cut.mp4 not vertical (${W}x${H})"
  d=${DUR%.*}; [ "${d:-0}" -ge 30 ] && [ "${d:-0}" -le 45 ] || fail "$cut.mp4 duration ${DUR}s out of 30-45s"
  ok "$cut.mp4 ${W}x${H} ${DUR}s"
done

# 4 · register OCR gate over sampled frames (no '$', no house number, states spelled out)
[ -f "$BUILD/qa/register-ocr.log" ] || fail "no build/qa/register-ocr.log — run register OCR pass"
grep -Eq '\$|, (MI|OH|IN)\b|\b(MI|OH|IN) [0-9]|[0-9]+ (River|Street)' "$BUILD/qa/register-ocr.log" \
  && fail "register OCR hit a forbidden token (\$ / state abbrev / house number)"
ok "register OCR clean (no \$, full state names, no house number)"

# 5 · AI-disclosure + provenance recorded
[ -f "$BUILD/DISCLOSURE.txt" ] || fail "no build/DISCLOSURE.txt (AI-assisted label + Mellencamp license basis + A-needs-Shavit-override)"
ok "disclosure + provenance recorded"

echo "ALL ACCEPTANCE CHECKS PASSED"
