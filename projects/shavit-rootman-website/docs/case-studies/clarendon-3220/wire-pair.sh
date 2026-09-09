#!/usr/bin/env bash
# Wire a new before/after pair into the case study.
#   ./wire-pair.sh <before-image> <after-image> <slug> "<Label>"
# Crops both to an identical 1400x933 frame and prints the HTML block to paste
# into the Before & After section of index.html.
set -euo pipefail
[ $# -eq 4 ] || { echo "usage: $0 <before> <after> <slug> \"<Label>\""; exit 1; }
BEFORE=$1; AFTER=$2; SLUG=$3; LABEL=$4
DIR="$(cd "$(dirname "$0")" && pwd)"; OUT="$DIR/img"

crop(){ # centre-crop to 3:2, then resize to the house frame
  local W H NW NH
  W=$(sips -g pixelWidth "$1" | awk '/pixelWidth/{print $2}')
  H=$(sips -g pixelHeight "$1" | awk '/pixelHeight/{print $2}')
  if [ $((W*2)) -gt $((H*3)) ]; then NW=$((H*3/2)); NH=$H; else NW=$W; NH=$((W*2/3)); fi
  cp "$1" "$2"
  sips -c "$NH" "$NW" "$2" --out "$2" >/dev/null
  sips -z 933 1400 "$2" --out "$2" >/dev/null
}
crop "$BEFORE" "$OUT/$SLUG-before.jpg"
crop "$AFTER"  "$OUT/$SLUG-after.jpg"
echo "wrote img/$SLUG-before.jpg and img/$SLUG-after.jpg (1400x933 each)"
echo
cat <<HTML
    <div class="baset rv">
      <p class="baset__l">$LABEL</p>
      <div class="ba" style="--pos:50%">
        <img src="img/$SLUG-after.jpg" alt="$LABEL after renovation.">
        <img class="ba__before" src="img/$SLUG-before.jpg" alt="$LABEL before renovation.">
        <span class="ba__chip ba__chip--b">Before</span>
        <span class="ba__chip ba__chip--a">After</span>
        <input class="ba__range" type="range" min="0" max="100" value="50" step="0.1"
               aria-label="Reveal the before and after photograph of the $LABEL">
        <span class="ba__handle"></span>
        <span class="ba__grip">&#8596;</span>
      </div>
      <p class="ba__cap">TODO caption.</p>
    </div>
HTML
