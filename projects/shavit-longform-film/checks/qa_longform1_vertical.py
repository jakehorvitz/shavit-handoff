#!/usr/bin/env python3
"""
QA gate for the Long Form 1 vertical remaster.

Checks (all must pass):
 1. Container: 1080x1920, 30fps, 47.6-48.3s, has audio stream.
 2. No black frames outside the outro (scene 15 starts 41.97s).
 3. No snap transitions: consecutive-frame luma diff must stay under
    SNAP_T everywhere (all boundaries are crossfades by construction).
 4. Gold-caption schedule: saturated-gold pixels appear only inside the
    three expected merged caption runs; nothing gold during the split
    (18.5-22.4s) or the interior breath (33.4-34.9s). Catches duplicate /
    stray captions like the old double "A DIFFERENT ENDING".
 5. No near-black dusk shot in 29-34s (the removed weird-lighting scene).
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
VID = ROOT / "deliver/Shavit — Long Form 1 (Collage) — Vertical Remaster 9x16.mp4"
FPS = 30
SNAP_T = 30.0          # mean abs luma diff; crossfaded cuts stay ~<14
OUTRO_START = 41.97

fails = []


def probe():
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(VID)],
        capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def frames_gray(scale=(216, 384)):
    cmd = ["ffmpeg", "-v", "error", "-i", str(VID), "-f", "rawvideo",
           "-pix_fmt", "gray", "-vf", f"scale={scale[0]}:{scale[1]}", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    n = len(raw) // (scale[0] * scale[1])
    return np.frombuffer(raw[: n * scale[0] * scale[1]], dtype=np.uint8).reshape(n, scale[1], scale[0])


def frames_rgb_band(scale=(216, 384)):
    cmd = ["ffmpeg", "-v", "error", "-i", str(VID), "-f", "rawvideo",
           "-pix_fmt", "rgb24", "-vf", f"scale={scale[0]}:{scale[1]}", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    n = len(raw) // (scale[0] * scale[1] * 3)
    return np.frombuffer(raw[: n * scale[0] * scale[1] * 3], dtype=np.uint8).reshape(n, scale[1], scale[0], 3)


# 1 · container
p = probe()
v = next(s for s in p["streams"] if s["codec_type"] == "video")
a = [s for s in p["streams"] if s["codec_type"] == "audio"]
dur = float(p["format"]["duration"])
if (v["width"], v["height"]) != (1080, 1920):
    fails.append(f"resolution {v['width']}x{v['height']} != 1080x1920")
from fractions import Fraction
if abs(float(Fraction(v["r_frame_rate"])) - FPS) > 0.01:
    fails.append(f"fps {v['r_frame_rate']} != {FPS}")
if not (47.6 <= dur <= 48.3):
    fails.append(f"duration {dur:.2f}s out of range")
if not a:
    fails.append("no audio stream")

g = frames_gray()
N = g.shape[0]
t_of = lambda i: i / FPS

# 2 · black frames outside outro
means = g.reshape(N, -1).mean(axis=1)
black = [i for i in range(N) if means[i] < 10 and t_of(i) < OUTRO_START - 0.3]
if black:
    fails.append(f"black frames outside outro at t={[round(t_of(i),2) for i in black[:5]]}")

# 3 · snap transitions
diffs = np.abs(g[1:].astype(np.int16) - g[:-1].astype(np.int16)).reshape(N - 1, -1).mean(axis=1)
snaps = [(round(t_of(i + 1), 2), round(float(d), 1)) for i, d in enumerate(diffs) if d > SNAP_T]
if snaps:
    fails.append(f"snap-like frame jumps: {snaps[:8]}")

# 4 · gold caption schedule
rgb = frames_rgb_band()
r = rgb[..., 0].astype(np.int16); gg = rgb[..., 1].astype(np.int16); b = rgb[..., 2].astype(np.int16)
gold = (r > 190) & (gg > 130) & (gg < 215) & (b < 90)
ratio = gold.reshape(N, -1).mean(axis=1)
present = ratio > 0.0012
runs, start = [], None
for i in range(N):
    if present[i] and start is None:
        start = i
    if (not present[i] or i == N - 1) and start is not None:
        if t_of(i) - t_of(start) > 0.25:
            runs.append((round(t_of(start), 2), round(t_of(i), 2)))
        start = None
BLOCKS = [(9.77, 16.60), (22.43, 29.27), (29.27, 33.17), (35.13, 41.97), (41.97, dur)]
for run in runs:
    if not any(e0 - 1.0 <= run[0] and run[1] <= e1 + 1.0 for e0, e1 in
               [(min(b[0] for b in BLOCKS), 16.60), (22.43, 33.17), (35.13, dur)]):
        fails.append(f"gold caption outside expected windows: {run}")
for e0, e1 in BLOCKS:
    i0, i1 = int((e0 + 0.5) * FPS), int((e1 - 0.5) * FPS)
    cov = present[i0:i1].mean() if i1 > i0 else 1.0
    if cov < 0.7:
        fails.append(f"caption block {e0}-{e1}s only {cov:.0%} covered — caption missing/weak")
quiet = [(18.9, 22.0), (33.5, 34.8)]
for q0, q1 in quiet:
    i0, i1 = int(q0 * FPS), int(q1 * FPS)
    if present[i0:i1].mean() > 0.05:
        fails.append(f"caption pixels found in quiet window {q0}-{q1}s")

# 5 · removed dark dusk shot: 29-34s must never go near-black
win = means[int(29 * FPS):int(34 * FPS)]
if win.min() < 22:
    fails.append(f"very dark frame in 29-34s window (min luma {win.min():.0f}) — dusk shot back?")

print(f"duration={dur:.2f}s  frames={N}  gold_runs={runs}")
print(f"max frame diff={diffs.max():.1f} @ t={t_of(int(diffs.argmax())+1):.2f}s")
if fails:
    print("\nQA: FAIL")
    for f in fails:
        print("  ✗", f)
    sys.exit(1)
print("\nQA: PASS — all checks green")
