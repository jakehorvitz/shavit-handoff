#!/usr/bin/env python3
"""Fill the bare soil in the Mead front lawn with grass, per Shavit 8/31 11:08
("Lightly clean up the landscaping in the exterior photos. Keep it natural and
realistic.") and Jake's follow-up, "fix the patchy grass".

Not generative. Every grass pixel written here is cloned from a donor patch of
real grass elsewhere in the SAME photograph, so the lighting, the time of day,
the camera and the species all match by construction. The donor is relit to the
target's own local luminance, so the sun gradient and shadows of the original
survive the fill.

Scope is a hand-authored polygon over the front lawn only. Nothing outside it is
readable by this script, so pavement, the porch block, the stone veneer, the
plant bed and the house cannot be touched no matter what the colour test does.

    python3.13 fix_lawn_patches.py IN OUT [strength]
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SRC = sys.argv[1]
DST = sys.argv[2]
STRENGTH = float(sys.argv[3]) if len(sys.argv) > 3 else 0.88

# Per-frame configuration, keyed by input filename. The lawn is a hand-authored
# polygon in every case: colour cannot separate this lawn's bare soil (low
# saturation grey) from concrete, and sunlit concrete is warm enough to read as
# soil, so both classifier attempts failed. A polygon kept deliberately inside
# the real lawn means pavement, porch, veneer, plant bed and house are simply
# unreachable, whatever the colour test does.
CONFIG = {
    # The tight cover crop, 1400x933.
    "exterior-after.jpg": dict(
        lawn=[(468, 657), (560, 649), (650, 647), (760, 648), (860, 648), (960, 654),
              (1060, 662), (1125, 667),
              (1125, 711), (1060, 719), (960, 723), (860, 721), (760, 714), (660, 699),
              (560, 679), (468, 670)],
        donors=[(64, 720, 214, 800), (8, 784, 158, 864),
                (1248, 752, 1398, 832), (120, 800, 270, 880)],
        donor_scale=0.60, tile=(76, 38), feather=5),

    # The wide frame, _drop/2.jpeg resampled to 1800x1200. Whole house, garage,
    # driveway and street tree. This is the cover from rev 15 on.
    "exterior-wide.jpg": dict(
        # Right edge deliberately runs PAST the bare ground into real grass, so
        # the crossfade happens grass-on-grass. Ending it on the boundary left a
        # hard-edged bright rectangle.
        lawn=[(470, 718), (560, 712), (660, 708), (770, 706), (880, 707), (980, 710),
              (1075, 714), (1150, 722),
              (1150, 800), (1075, 800), (980, 792), (880, 788), (770, 782), (660, 772),
              (560, 758), (470, 742)],
        donors=[(0, 800, 200, 900), (1270, 790, 1470, 890), (1590, 830, 1790, 930)],
        donor_scale=0.85, tile=(120, 58), feather=22),
}

# rev 21: a high-resolution recut of an already-configured frame reuses that
# frame's polygon, scaled by the width ratio, instead of getting a second
# hand-authored one. Two hand-drawn polygons over the same lawn would drift from
# each other and there is no reason for them to disagree.
DERIVED_FROM = {
    # the 2666x1776 native recut of _drop/2.jpeg, crop (0,192)
    "exterior-after-hq.png": ("exterior-after.jpg", 1400),
}


def _scaled(cfg, s):
    """Same polygon, same donors, same tile, in a bigger frame."""
    return dict(
        lawn=[(round(x * s), round(y * s)) for x, y in cfg["lawn"]],
        donors=[tuple(round(v * s) for v in d) for d in cfg["donors"]],
        donor_scale=cfg["donor_scale"],
        tile=(round(cfg["tile"][0] * s), round(cfg["tile"][1] * s)),
        feather=max(1, round(cfg["feather"] * s)),
    )


_key = os.path.basename(SRC)
if _key in DERIVED_FROM:
    _parent, _parent_w = DERIVED_FROM[_key]
    _s = Image.open(SRC).width / _parent_w
    CONFIG[_key] = _scaled(CONFIG[_parent], _s)
    print(f"{_key}: reusing {_parent}'s polygon scaled {_s:.4f}x")
if _key not in CONFIG:
    sys.exit(f"no lawn polygon configured for {_key}; add one to CONFIG")
_c = CONFIG[_key]
LAWN = _c["lawn"]
DONOR_BOXES = _c["donors"]
DONOR_SCALE = _c["donor_scale"]
TILE_W, TILE_H = _c["tile"]
FEATHER = _c.get("feather", 5)
# Heavy overlap averages several patches per pixel and smooths the blade
# texture away, which reads as a soft bright rectangle. Keep it light.
OVERLAP, SEED = 0.22, 11

GRASS_GB = 45          # green-minus-blue above this is living grass
BARE_GB = 54           # below this, inside the lawn, is soil to be filled
BARE_RAMP = 22         # how fast coverage ramps from good grass to bare soil
COVER_FLOOR = 1.0      # 1.0 = resurface the WHOLE lawn, not just the bare parts.
                       # Filling only the bare spots leaves the lawn reading
                       # patchy, because the surviving thatch and the original
                       # blotchy shading are exactly what made it look patchy.
LIGHT_BLUR = 55        # radius of the light field. Small radii reproduce the
                       # original blotches; this keeps only the real sun gradient.

im = Image.open(SRC).convert("RGB")
W, H = im.size
a = np.asarray(im).astype(np.float32)
gb = a[..., 1] - a[..., 2]

pool = []
for box in DONOR_BOXES:
    x0, y0, x1, y1 = box
    frac = (gb[y0:y1, x0:x1] >= GRASS_GB).mean()
    assert frac >= 0.95, f"donor {box} is only {frac*100:.1f}% grass"
    d = im.crop(box).resize((max(8, int((x1 - x0) * DONOR_SCALE)),
                             max(8, int((y1 - y0) * DONOR_SCALE))), Image.LANCZOS)
    # Shrinking softens the blades. The lawn around the fill is sharp, so put the
    # detail back or the filled area reads as a smudge next to real grass.
    d = d.filter(ImageFilter.UnsharpMask(radius=1.2, percent=165, threshold=2))
    pool.append(np.asarray(d).astype(np.float32))
    print(f"donor {box}: {frac*100:5.1f}% grass -> {pool[-1].shape[1]}x{pool[-1].shape[0]}")

# ---- masks ------------------------------------------------------------------
# Feather INWARD only. A plain blur of the polygon spreads the mask outward as
# well, which pushed the fill up over the porch and the stone veneer. Multiplying
# the blurred mask by the hard one gives a soft inner falloff with a hard outer
# limit exactly on the authored boundary, so the edge can never leave the lawn.
poly_img = Image.new("L", (W, H), 0)
ImageDraw.Draw(poly_img).polygon(LAWN, fill=255)
hard = np.asarray(poly_img).astype(np.float32) / 255.0
soft = np.asarray(poly_img.filter(ImageFilter.GaussianBlur(FEATHER))).astype(np.float32) / 255.0
poly = soft * hard

bare = np.clip((BARE_GB - gb) / BARE_RAMP, 0, 1)     # 1 = pure soil, 0 = good grass
bare = np.maximum(bare, COVER_FLOOR)
bare = np.asarray(Image.fromarray((bare * 255).astype(np.uint8))
                  .filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255.0
m = poly * bare * STRENGTH

# ---- quilt the donor patches over the lawn ---------------------------------
# A tile larger than the depth-scaled donor used to skip every patch silently
# and leave the lawn black. Check it up front instead.
small = [i for i, d in enumerate(pool) if d.shape[0] < TILE_H or d.shape[1] < TILE_W]
assert not small, (f"TILE {TILE_W}x{TILE_H} exceeds donor(s) {small} at "
                   f"{[pool[i].shape[1::-1] for i in small]}; shrink TILE or raise DONOR_SCALE")

rng = np.random.default_rng(SEED)
acc = np.zeros((H, W, 3), np.float32)
wsum = np.zeros((H, W, 1), np.float32) + 1e-6
win = (np.hanning(TILE_H + 2)[1:-1, None] * np.hanning(TILE_W + 2)[None, 1:-1])[..., None]
win = np.maximum(win, 0.02)

xs = [p[0] for p in LAWN]; ys = [p[1] for p in LAWN]
bx0, bx1 = max(0, min(xs) - TILE_W), min(W, max(xs) + TILE_W)
by0, by1 = max(0, min(ys) - TILE_H), min(H, max(ys) + TILE_H)
sx, sy = max(1, int(TILE_W * (1 - OVERLAP))), max(1, int(TILE_H * (1 - OVERLAP)))

for y in range(by0, by1, sy):
    for x in range(bx0, bx1, sx):
        d = pool[rng.integers(len(pool))]
        oy = int(rng.integers(0, d.shape[0] - TILE_H + 1))
        ox = int(rng.integers(0, d.shape[1] - TILE_W + 1))
        patch = d[oy:oy + TILE_H, ox:ox + TILE_W]
        if rng.random() < 0.5:
            patch = patch[:, ::-1]
        if rng.random() < 0.5:
            patch = patch[::-1, :]
        h = min(TILE_H, H - y); w = min(TILE_W, W - x)
        if h <= 0 or w <= 0:
            continue
        acc[y:y + h, x:x + w] += patch[:h, :w] * win[:h, :w]
        wsum[y:y + h, x:x + w] += win[:h, :w]

tiled = acc / wsum
covered = wsum[..., 0] > 0.05
print(f"quilt covers {covered.sum()} px")

# ---- relight the donor to the LAWN'S OWN GRASS, not to the soil ------------
# Matching the donor to the target's raw luminance blows it out: bare soil is far
# brighter than grass, so the fill came back neon. What the fill should match is
# how bright the grass already is at that spot, which is what carries the sun and
# the shadow across the lawn. So build a luminance field from the real grass
# pixels only and let it diffuse across the bare ground.
def lowpass(x, r=24):
    return np.asarray(Image.fromarray(np.clip(x, 0, 255).astype(np.uint8))
                      .filter(ImageFilter.GaussianBlur(r))).astype(np.float32)

def blur_f(x, r):
    lo, hi = float(x.min()), float(x.max())
    q = (x - lo) / max(hi - lo, 1e-6) * 255.0
    b = np.asarray(Image.fromarray(q.astype(np.uint8))
                   .filter(ImageFilter.GaussianBlur(r))).astype(np.float32)
    return b / 255.0 * (hi - lo) + lo

# Match PER CHANNEL, not just luminance: matching brightness alone left the fill
# with a yellow cast, because the donor's hue is its own, not the lawn's.
gmask = (gb >= GRASS_GB).astype(np.float32)
den = blur_f(gmask, LIGHT_BLUR)
lo_d = np.stack([lowpass(tiled[..., c]) for c in range(3)], -1)

gain = np.empty_like(a)
for c in range(3):
    num = blur_f(a[..., c] * gmask, LIGHT_BLUR)
    tgt = np.where(den > 0.02, num / np.maximum(den, 1e-6), a[..., c].mean())
    gain[..., c] = np.clip(tgt / np.maximum(lo_d[..., c], 1.0), 0.88, 1.12)
relit = np.clip(tiled * gain, 0, 255)

out = a * (1 - m[..., None]) + relit * m[..., None]
Image.fromarray(out.astype(np.uint8)).save(DST, quality=95)
print(f"{DST}  strength={STRENGTH}  filled {(m > 0.05).sum()} px "
      f"({(m > 0.05).sum() / (W * H) * 100:.2f}% of frame)")
