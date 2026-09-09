#!/usr/bin/env bash
# B hero proof: before push-in ⟶ match-dissolve (0.5s xfade) ⟶ after push-in.
# The dissolve is EDIT-side (ffmpeg), keeping B clean under no-generated-architecture.
# Usage: assemble_b_proof.sh <before_clip.mp4> <after_clip.mp4>
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
B="${1:?before clip}"; A="${2:?after clip}"
# xfade at t=4.3s of the 5s before-clip; conform to 30fps
ffmpeg -y -loglevel error -i "$B" -i "$A" -filter_complex \
  "[0:v]fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920[v0]; \
   [1:v]fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920[v1]; \
   [v0][v1]xfade=transition=fade:duration=0.5:offset=4.3[v]" \
  -map "[v]" -c:v libx264 -pix_fmt yuv420p -crf 18 "$DIR/shots/B_hero_proof.mp4"
echo "✓ $DIR/shots/B_hero_proof.mp4"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of csv=p=0 "$DIR/shots/B_hero_proof.mp4"
