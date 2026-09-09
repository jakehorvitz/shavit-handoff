#!/usr/bin/env python3
"""Render the 115 Oak sequence: each photo takes the whole screen, then settles
into its corner, until all four are holding the frame as a quad.

Jake's direction, third pass and the one that works:

    "Address one frame, and then it goes up into a corner. Then another one
     comes. It takes the whole screen, and then goes to a corner, so on and so
     forth. But it has to look natural, has to be fast. It's gotta be cool."

WHY THIS READS AS NATURAL RATHER THAN AS AN EFFECT

Two properties do all the work, and both come free from the geometry.

1. The frame is 9:16 and every cell is 9:16, so a photo travelling from full
   screen to a corner is a PURE UNIFORM SCALE. Nothing warps, nothing re-crops,
   no aspect snaps at the end. It is literally the same image getting smaller,
   which is why it reads as a physical object receding rather than an animation.

2. Nothing ever enters. The four photos start stacked full-screen, front to
   back, and each one SHRINKS AWAY to expose the next one already full-screen
   behind it. There is no slide-in, no fade-up, and not one frame of empty
   background at any point in the clip -- the region a shrinking photo vacates
   is always either a corner already filled or the next photo underneath.

THE STACK IS ORDERED SO A FULL-SCREEN PHOTO COVERS THE GRID

Jake: "it needs to be reversed, the photo is blocking the others when its
fullscreen, it should block the grid when its full screen."

The first cut left each parked photo sitting ON TOP of the next full-screen one,
so a corner thumbnail interrupted every full-screen beat. Now a photo drops to
the BACK the moment it parks, which means:

  * a full-screen photo owns the entire frame, uninterrupted
  * as it settles into its corner it exposes the next one, already full-screen
  * the corners accumulate underneath, hidden, until the LAST photo settles --
    and the whole quad arrives at once, which is the payoff of the block

So the z-order back-to-front is: parked corners, then the still-stacked
full-screen photos in reverse, then the active one on top. Walking that list
front-to-back and stopping at the first full-screen photo culls everything it
hides, so at most two photos are ever drawn per frame.

The corner order is the reading order, and the kitchen is deliberately last:
it is the strongest photo, so it gets the final full-screen beat and then sits
bottom-right where the eye finishes.

Motion, in frames at 30fps:
    0-16     photo 1 holds the whole screen
    16-31    photo 1 settles into the top-left, exposing photo 2 full screen
    45-60    photo 2 settles into the top-right
    74-89    photo 3 settles into the bottom-left
    103-118  photo 4 settles into the bottom-right, revealing all four at once
    118-145  the quad holds -- but every photo keeps running its own pan and
             push, so nothing in frame is ever actually still

Easing is ease-in-out cubic: starts at rest, ends at rest, no overshoot. A
bounce would read as a cartoon, which is the opposite of the brief.

Each photo also carries its own camera for the entire clip (see MOVES). The pans
are free resolution, not a Ken Burns fake -- a 3:4 source cropped to 9:16 throws
away 25% of its width, and the pan spends exactly that discarded strip, so no
photo is ever upscaled past 1:1.
"""
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageOps

BASE = Path(__file__).resolve().parent.parent / "current-projects-team-2026-07-27"
SRC = BASE / "drive" / "oak-new"
# Filename is versioned on purpose. Palmier caches an imported asset's frame
# count, so overwriting a file in place while changing its length makes the
# timeline read past the end and render black -- exactly what happened when
# this clip went from 90 frames to 105. A new length gets a new filename.
OUT = BASE / "conform-0729" / "OAK-sequence-v3.mp4"
FRAMES = Path("/private/tmp/claude-501/-Users-jakehorvitz-Personal-Jarvis"
              "/0713bcaa-6a61-433a-8ac0-8407957e1d21/scratchpad/oak/frames")

W, H, FPS, N = 1080, 1920, 30, 145

# The seam is a white BORDER carried by each photo, never a white canvas. At
# full screen it falls outside the frame and is invisible; as a photo shrinks it
# appears on its own, which is what gives the settle a printed edge.
GUTTER = 6
BORDER = GUTTER // 2
CELL_W, CELL_H = (W - GUTTER) // 2, (H - GUTTER) // 2
SCRIM_TOP, SCRIM_MAX = 1180, 0.62

# Working copies are cut to this height before any per-frame cropping. Above the
# 1920px full-screen draw, so nothing is ever resampled up.
WORK_H = 2100

# name, col, row -- in the order they take the screen.
TILES = [
    ("000_1BvyBfpYq4wHby6rmsA507fexWrDQ1Sb2.jpg", 0, 0),   # ladder room  -> top-left
    ("001_1QbkyP6x6HytiQABefSCD7p7n_vtCd9hV.jpg", 1, 0),   # green room   -> top-right
    ("003_1TgpmRxTSpaYEqNbj6O_8qXPGZWiZX102.jpg", 0, 1),   # arch         -> bottom-left
    ("002_1N7bhleWSV0W0nbv2T2KO4cPSnlgXQwRi.jpg", 1, 1),   # kitchen      -> bottom-right
]

# One camera per photo: (zoom start, zoom end, anchorX start, anchorX end).
# Anchors come off a three-way crop comparison of each photo -- 000 must stay
# left or its left-hand window is cut, 001 leans right to keep the window and the
# stacked flooring boxes, 002 centres so the base cabinets, sink and faucet all
# survive, 003 leans left to hold the arch while losing the folding chair.
# Amplitudes are small: at full screen a pan is four times more visible than it
# is in a cell, and this clip spends most of its length full screen.
MOVES = [
    (1.00, 1.06, 0.06, 0.20),   # ladder room -- push in, pan right
    (1.07, 1.00, 0.70, 0.58),   # green room  -- pull back, pan left
    (1.00, 1.05, 0.50, 0.36),   # arch        -- push in, pan left
    (1.06, 1.00, 0.44, 0.58),   # kitchen     -- pull back, pan right
]

# Jake: "each photo needs to be slower no need to rush." Every photo now owns the
# screen clean for 16 frames instead of 6 and settles over 15 instead of 12, so
# each gets a ~1s cycle rather than 0.6s. Paid for by trimming GEN8 and Norwood
# 3/3 in build_rev8 -- the music bed left no headroom to simply extend into.
OPEN_HOLD = 16     # photo 1 owns the screen before anything moves
SHRINK = 15        # how long a photo takes to settle into its corner
GAP = 14           # how long the newly exposed photo owns the screen
STEP = SHRINK + GAP


def ease_in_out_cubic(t):
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def lerp(a, b, t):
    return a + (b - a) * t


def load_source(name):
    """Full uncropped frame, exposure-matched, cut to working height."""
    im = ImageOps.exif_transpose(Image.open(SRC / name)).convert("RGB")
    if im.height > WORK_H:
        im = im.resize((round(im.width * WORK_H / im.height), WORK_H), Image.LANCZOS)

    # 003 is a low-contrast copy-of-a-copy and reads as a fault next to the
    # others. Gated on the actual histogram so the good three are untouched.
    px = sorted(im.convert("L").getdata())
    if px[-len(px) // 100] - px[len(px) // 100] < 200:
        im = ImageOps.autocontrast(im, cutoff=(1, 1))
        im = ImageEnhance.Color(im).enhance(1.12)
    return ImageEnhance.Color(im).enhance(1.04)


def framed(im, zoom, anchor_x, size):
    """Crop the 9:16 window at this zoom and pan position, then fit `size`."""
    cw = im.height * (W / H) / zoom
    ch = im.height / zoom
    x = (im.width - cw) * anchor_x
    y = (im.height - ch) / 2
    return im.crop((round(x), round(y), round(x + cw), round(y + ch))) \
             .resize(size, Image.LANCZOS)


def main():
    if shutil.which("ffmpeg") is None:
        sys.exit("ffmpeg not on PATH")
    FRAMES.mkdir(parents=True, exist_ok=True)
    for stale in FRAMES.glob("*.png"):
        stale.unlink()

    srcs = [load_source(n) for n, _, _ in TILES]
    starts = [OPEN_HOLD + i * STEP for i in range(len(TILES))]
    if starts[-1] + SHRINK > N:
        sys.exit(f"last photo settles at {starts[-1] + SHRINK}, past the {N}-frame clip")

    scrim = Image.new("L", (W, H - SCRIM_TOP))
    sd = ImageDraw.Draw(scrim)
    for yy in range(H - SCRIM_TOP):
        sd.line([(0, yy), (W, yy)],
                fill=int(SCRIM_MAX * 255 * (yy / (H - SCRIM_TOP - 1)) ** 1.6))
    scrim_fill = Image.new("RGB", (W, H - SCRIM_TOP), (0, 0, 0))

    for f in range(N):
        canvas = Image.new("RGB", (W, H), (0, 0, 0))
        u = f / (N - 1)

        settled = [0.0 if f <= s else min(1.0, (f - s) / SHRINK) for s in starts]

        # Z-order, back to front: photos already parked in their corners, then
        # the ones still stacked full-screen, then the active one on top. A
        # parked photo therefore sits BEHIND the next full-screen photo, which
        # is what lets a full-screen beat own the frame uninterrupted.
        n = len(TILES)
        active = next((i for i in range(n) if settled[i] < 1.0), None)
        if active is None:
            order = list(range(n))                        # all parked, no overlap
        else:
            order = ([i for i in range(n) if settled[i] >= 1.0]
                     + list(range(n - 1, active, -1)) + [active])

        # Walk front to back and stop at the first photo still at full screen:
        # it covers everything behind it, so nothing further needs drawing.
        keep = []
        for i in reversed(order):
            keep.append(i)
            if settled[i] <= 0.0:
                break

        for i in reversed(keep):                          # back to front
            p = ease_in_out_cubic(settled[i]) if 0 < settled[i] < 1 else settled[i]
            col, row = TILES[i][1], TILES[i][2]

            sw = max(2, round(lerp(W, CELL_W, p)))
            sh = max(2, round(lerp(H, CELL_H, p)))
            cx = lerp(W / 2, col * (CELL_W + GUTTER) + CELL_W / 2, p)
            cy = lerp(H / 2, row * (CELL_H + GUTTER) + CELL_H / 2, p)
            x, y = round(cx - sw / 2), round(cy - sh / 2)

            z0, z1, ax0, ax1 = MOVES[i]
            tile = framed(srcs[i], lerp(z0, z1, u), lerp(ax0, ax1, u), (sw, sh))

            if p > 0:
                canvas.paste((255, 255, 255),
                             (x - BORDER, y - BORDER, x + sw + BORDER, y + sh + BORDER))
            canvas.paste(tile, (x, y))

        # The address tag lands on the bottom row, and the kitchen there is white
        # cabinets -- white type on white casework. Every other shot in the film
        # happens to be dark where the tag sits; this one has to be told.
        canvas.paste(scrim_fill, (0, SCRIM_TOP), scrim)
        canvas.save(FRAMES / f"{f:04d}.png")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS),
        "-i", str(FRAMES / "%04d.png"),
        "-c:v", "libx264", "-preset", "slow", "-crf", "16",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(OUT),
    ], check=True)
    print(f"wrote {OUT}  {N} frames = {N / FPS:.2f}s")
    for i, s in enumerate(starts, 1):
        print(f"  photo {i}: full screen until f{s}, settled by f{s + SHRINK}")


if __name__ == "__main__":
    main()
