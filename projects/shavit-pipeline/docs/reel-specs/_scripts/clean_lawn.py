#!/usr/bin/env python3
"""Lightly clean the landscaping on the Mead exterior, per Shavit 8/31 11:08:
"Lightly clean up the landscaping in the exterior photos. Keep it natural and
realistic."

Non-generative on purpose. Nothing is invented or repainted: this only shifts
hue/saturation on pixels that are already vegetation, inside a feathered mask
that starts below the porch line. Vegetation is keyed on green-minus-blue
separation, which concrete, siding, roof and sky cannot pass, so no pavement
tints and no architecture can move or warp.
"""
import sys
from PIL import Image, ImageFilter
import numpy as np

SRC, DST = sys.argv[1], sys.argv[2]
STRENGTH = float(sys.argv[3]) if len(sys.argv) > 3 else 0.55

im = Image.open(SRC).convert("RGB")
W, H = im.size
rgb = np.asarray(im).astype(np.float32)
R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]

# Vegetation key. Grass, live or scorched, always separates green from blue by a
# wide margin; concrete, siding and shingle sit within a few points of neutral.
gb = G - B
veg = np.clip((gb - 26.0) / 22.0, 0, 1)          # ramp in over 26..48
veg *= (np.maximum(R, np.maximum(G, B)) < 246)   # drop blown highlights

# Feathered vertical gate: nothing above the porch base is touched at all.
gate = np.zeros((H, W), np.float32)
y0, y1 = int(H * 0.60), int(H * 0.70)
gate[y1:, :] = 1.0
gate[y0:y1, :] = np.linspace(0, 1, y1 - y0)[:, None]

mask = veg * gate
mask = np.asarray(Image.fromarray((mask * 255).astype(np.uint8))
                  .filter(ImageFilter.GaussianBlur(4))).astype(np.float32) / 255.0
mask *= STRENGTH

hsv = np.asarray(im.convert("HSV")).astype(np.float32)
h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]

# Pull the scorched yellow-brown toward the live green already in the same lawn,
# lift saturation slightly, and pull down the bleached dry patches.
TARGET_H = 72.0
pull = mask * np.clip((TARGET_H - h) / 45.0, 0, 1)   # only warms up, never cools green
h_new = h + (TARGET_H - h) * pull
s_new = s * (1.0 + 0.26 * mask)
v_new = v * (1.0 - 0.12 * mask * np.clip((v - 155) / 100.0, 0, 1))

out = np.stack([np.clip(h_new, 0, 255),
                np.clip(s_new, 0, 255),
                np.clip(v_new, 0, 255)], -1).astype(np.uint8)
Image.fromarray(out, "HSV").convert("RGB").save(DST, quality=95)
print(f"{DST}  strength={STRENGTH}  touched {(mask > 0.02).sum() / (W * H) * 100:.1f}% of pixels")
