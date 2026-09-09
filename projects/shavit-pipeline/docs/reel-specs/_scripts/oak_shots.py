#!/usr/bin/env python3
"""Render the four 115 Oak photos as four ordinary full-screen shots, each with
its own camera move. Supersedes oak_grid.py.

Jake: "nvm cut the grid just make transtions and camera movments between the
photos it just lookds weird."

So there is no grid, no corners, no stack. Oak is now four shots that behave
like every other shot in the film: full frame, one camera move each, joined by
transitions. The transitions themselves are NOT baked in here -- they are three
cross-dissolves declared in build_rev8's PICTURE_EDL, which is the same
machinery Ludlam and Barry already use. Four rooms of one house is exactly what
a dissolve is for; a hard cut would read as four separate properties.

The camera moves alternate push-in with pull-back and the pans alternate
direction, so no two shots in a row feel the same.

The pans are free resolution, not a Ken Burns fake. A 3:4 source cropped to 9:16
throws away 25% of its width; the pan spends exactly that discarded strip, so no
frame is ever upscaled past 1:1. This is also why the shots are pre-rendered
rather than keyframed in Palmier: the editor can only push into pixels the
conformed asset already contains, and a horizontal pan needs the ones a static
9:16 crop would have thrown away.
"""
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

BASE = Path(__file__).resolve().parent.parent / "current-projects-team-2026-07-27"
SRC = BASE / "drive" / "oak-new"
CONFORM = BASE / "conform-0729"
FRAMES = Path("/private/tmp/claude-501/-Users-jakehorvitz-Personal-Jarvis"
              "/0713bcaa-6a61-433a-8ac0-8407957e1d21/scratchpad/oak/shots")

W, H, FPS = 1080, 1920, 30
N = 44                 # frames per shot, before the 10-frame dissolve overlaps

# Jake: "make sure that all photos are of the highest quality."
#   * Sources are used at FULL resolution. There is no working-height downscale
#     any more: 000 is 4032px tall, and supersampling 4032 -> 1920 in one step is
#     sharper than going through an intermediate 2100.
#   * Zoom is clamped per photo so a crop is never smaller than 1920 tall. Three
#     of the four sources are only 2048px, and the old moves peaked at 1.09,
#     which was quietly upscaling them by about 2%.
#   * Encoded at CRF 12 rather than 16.
CRF = "12"

# Jake: "remove any shadows on the oak street photos." There were never any
# synthetic drop shadows in these shots -- those belonged to the grid treatment
# that got cut. What is left is real shadow in the rooms, so this is a shadow
# LIFT: a curve that raises the dark end and fades to nothing by mid grey, so
# highlights and the window blowouts are untouched.
SHADOW_LIFT, SHADOW_KNEE = 34, 140

# out-file stem, source, (zoom start, zoom end, anchorX start, anchorX end)
#
# Anchors come off a rendered three-way crop comparison of each photo at
# 0.0 / 0.5 / 1.0, not defaulted to centre: 000 must sit left or its left-hand
# window is cut off, 001 leans right to keep the window and the stacked flooring
# boxes, 002 centres so the base cabinets, sink and faucet all survive, and 003
# leans left to hold the arch while losing the folding chair. The pan then moves
# within that window, so the framing stays correct for the whole shot.
SHOTS = [
    ("OAK-1-ladder",  "000_1BvyBfpYq4wHby6rmsA507fexWrDQ1Sb2.jpg", (1.00, 1.08, 0.02, 0.24)),
    ("OAK-2-green",   "001_1QbkyP6x6HytiQABefSCD7p7n_vtCd9hV.jpg", (1.09, 1.00, 0.76, 0.54)),
    ("OAK-3-arch",    "003_1TgpmRxTSpaYEqNbj6O_8qXPGZWiZX102.jpg", (1.00, 1.07, 0.54, 0.30)),
    ("OAK-4-kitchen", "002_1N7bhleWSV0W0nbv2T2KO4cPSnlgXQwRi.jpg", (1.08, 1.00, 0.40, 0.62)),
]


def lerp(a, b, t):
    return a + (b - a) * t


def shadow_curve():
    """LUT that lifts the dark end and reaches zero effect by mid grey."""
    out = []
    for v in range(256):
        w = max(0.0, 1.0 - v / SHADOW_KNEE) ** 2
        out.append(min(255, round(v + SHADOW_LIFT * w)))
    return out * 3          # one copy per RGB channel


def load_source(name):
    """Full-resolution frame, exposure-matched, shadows lifted."""
    im = ImageOps.exif_transpose(Image.open(SRC / name)).convert("RGB")

    # 003 is a low-contrast copy-of-a-copy and reads as a fault beside the
    # others. Gated on the actual histogram so the good three are untouched.
    px = sorted(im.convert("L").getdata())
    if px[-len(px) // 100] - px[len(px) // 100] < 200:
        im = ImageOps.autocontrast(im, cutoff=(1, 1))
        im = ImageEnhance.Color(im).enhance(1.12)

    im = im.point(shadow_curve())
    return ImageEnhance.Color(im).enhance(1.04)


def framed(im, zoom, anchor_x):
    """Crop the 9:16 window at this zoom and pan position, then fit the frame."""
    cw = im.height * (W / H) / zoom
    ch = im.height / zoom
    x = (im.width - cw) * anchor_x
    y = (im.height - ch) / 2
    return im.crop((round(x), round(y), round(x + cw), round(y + ch))) \
             .resize((W, H), Image.LANCZOS)


def main():
    if shutil.which("ffmpeg") is None:
        sys.exit("ffmpeg not on PATH")
    CONFORM.mkdir(parents=True, exist_ok=True)

    for stem, src, (z0, z1, ax0, ax1) in SHOTS:
        work = FRAMES / stem
        work.mkdir(parents=True, exist_ok=True)
        for stale in work.glob("*.png"):
            stale.unlink()

        im = load_source(src)
        # Never crop tighter than the output height, or the shot gets upscaled.
        zmax = im.height / H
        cz0, cz1 = min(z0, zmax), min(z1, zmax)
        if (cz0, cz1) != (z0, z1):
            print(f"  {stem}: zoom clamped {max(z0, z1):.3f} -> {zmax:.3f} "
                  f"(source {im.width}x{im.height}) to avoid upscaling")
        for f in range(N):
            u = f / (N - 1)
            framed(im, lerp(cz0, cz1, u), lerp(ax0, ax1, u)).save(work / f"{f:04d}.png")

        out = CONFORM / f"{stem}.mp4"
        subprocess.run([
            "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS),
            "-i", str(work / "%04d.png"),
            "-c:v", "libx264", "-preset", "slower", "-crf", CRF,
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out),
        ], check=True)
        move = "push in" if z1 > z0 else "pull back"
        pan = "pan right" if ax1 > ax0 else "pan left"
        print(f"wrote {out.name}  {N}f  {im.width}x{im.height} src  ({move}, {pan})")


if __name__ == "__main__":
    main()
