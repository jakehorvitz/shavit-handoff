#!/bin/bash
# Rebuild the landscaping-cleaned Mead exterior used by slide 1.
# Two passes, PNG in between so the frame is only JPEG-encoded once at the end.
#   1. fix_lawn_patches.py  fills bare soil with grass cloned from this same photo
#   2. clean_lawn.py        evens the dry grass that is already there
# Needs python3.13: the repo default python3 is 3.14 and has Pillow but no numpy.
set -euo pipefail
IMG="$(cd "$(dirname "$0")/../../mead-case-study-post-spec/img" && pwd)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
python3.13 "$(dirname "$0")/fix_lawn_patches.py" "$IMG/exterior-after.jpg" "$TMP/step1.png" 0.85
python3.13 "$(dirname "$0")/clean_lawn.py"       "$TMP/step1.png" "$IMG/exterior-after-clean.jpg" 0.50
echo "wrote $IMG/exterior-after-clean.jpg"
