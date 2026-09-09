#!/usr/bin/env python3
"""43 Howder unit 2 — MLS photo prep, v2 "match Shavit's pro finals" grade.

Reads raw/*.JPG (Shavit's phone shots, iMessage-compressed 1541x2048).
Corrections only (no generative edits). The v2 grade is tuned to the measured
tone of Shavit's retouched finals (site howder-b/01-05): median luminance
~166-194, warm R/B ratio ~1.13, lifted shadows, clean near-white walls.
Outputs:
  full/    corrected full-frame portrait (native res)
  square/  corrected 1:1 crops at 2048x2048
"""
import math
import os
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
FULL = os.path.join(HERE, "full")
SQUARE = os.path.join(HERE, "square")
os.makedirs(FULL, exist_ok=True)
os.makedirs(SQUARE, exist_ok=True)

TARGET_RB = 1.13     # warmth ratio measured off Shavit's finals
MED_AIRY = 178       # empty rooms (his b01/b05 run 192-194; 178 keeps texture)
MED_BUSY = 168       # kitchen/bath/laundry (his b02-b04 run 166-170)

# Tour order: living -> dining -> kitchen -> bedrooms -> bath -> laundry -> nook
ORDER = [
    ("IMG_20260824_194510094.JPG", "01_living-room", MED_AIRY),
    ("IMG_20260824_192912912.JPG", "02_dining-area", MED_AIRY),
    ("IMG_20260824_192959416.JPG", "03_kitchen", MED_BUSY),
    ("IMG_20260824_193013359.JPG", "04_kitchen-range", MED_BUSY),
    ("IMG_20260824_193037250.JPG", "05_bedroom", MED_AIRY),
    ("IMG_20260824_193051145.JPG", "06_bedroom-window", MED_AIRY),
    ("IMG_20260824_193046591.JPG", "07_bedroom-2", MED_AIRY),
    ("IMG_20260823_205203787.JPG", "08_bathroom", MED_BUSY),
    ("IMG_20260824_193128907.JPG", "09_laundry", MED_BUSY),
    ("IMG_20260824_193103470.JPG", "10_closet-nook", MED_AIRY),
]

def apply_luts(im, luts):
    ch = im.split()
    return Image.merge("RGB", [ch[i].point(luts[i]) for i in range(3)])

def sample(im):
    return list(im.resize((160, 120)).getdata())

def med_lum(im):
    lums = sorted(0.299 * r + 0.587 * g + 0.114 * b for r, g, b in sample(im))
    return lums[len(lums) // 2]

for src, name, target_med in ORDER:
    im = ImageOps.exif_transpose(Image.open(os.path.join(RAW, src))).convert("RGB")

    # 1. Gray-world white balance, then a deliberate warm bias toward TARGET_RB
    px = sample(im)
    n = len(px)
    rm = sum(p[0] for p in px) / n
    gm = sum(p[1] for p in px) / n
    bm = sum(p[2] for p in px) / n
    gray = (rm + gm + bm) / 3
    g_r = max(0.85, min(1.30, gray / rm))
    g_g = max(0.85, min(1.30, gray / gm))
    g_b = max(0.85, min(1.30, gray / bm))
    w = math.sqrt(TARGET_RB)
    g_r *= w
    g_b /= w
    im = apply_luts(im, [[min(255, int(v * g + 0.5)) for v in range(256)]
                         for g in (g_r, g_g, g_b)])

    # 2. White point only (no black crush — shadows stay lifted like his finals)
    lums = sorted(0.299 * r + 0.587 * g + 0.114 * b for r, g, b in sample(im))
    hi = max(lums[int(len(lums) * 0.997)], 60)
    wp = [min(255, int(v * 250.0 / hi + 0.5)) for v in range(256)]
    im = apply_luts(im, [wp, wp, wp])

    # 3. Gamma to the airy target median, soft knee above 88% to protect whites
    m = max(1, min(254, med_lum(im)))
    gam = max(0.40, min(1.05, math.log(target_med / 255.0) / math.log(m / 255.0)))
    glut = []
    for v in range(256):
        x = (v / 255.0) ** gam
        if x > 0.88:
            x = 0.88 + (x - 0.88) * 0.75
        glut.append(max(0, min(255, int(255 * x + 0.5))))
    im = apply_luts(im, [glut, glut, glut])

    # 4. Polish: warm saturation for the floors, gentle contrast, unsharp
    im = ImageEnhance.Color(im).enhance(1.16)
    im = ImageEnhance.Contrast(im).enhance(1.02)
    im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=3))

    im.save(os.path.join(FULL, name + ".jpg"), quality=92, optimize=True)

    # 5. Square crop -> 2048
    wdt, hgt = im.size
    side = min(wdt, hgt)
    top = int((hgt - side) * 0.45)
    sq = im.crop((0, top, side, top + side)).resize((2048, 2048), Image.LANCZOS)
    sq = sq.filter(ImageFilter.UnsharpMask(radius=1.2, percent=50, threshold=2))
    sq.save(os.path.join(SQUARE, name + ".jpg"), quality=92, optimize=True)

    px2 = sample(im)
    n2 = len(px2)
    rm2 = sum(p[0] for p in px2) / n2
    bm2 = sum(p[2] for p in px2) / n2
    lums2 = sorted(0.299 * r + 0.587 * g + 0.114 * b for r, g, b in px2)
    print(f"{name}: med={lums2[n2 // 2]:.0f} p5={lums2[n2 // 20]:.0f} "
          f"R/B={rm2 / bm2:.3f} gamma={gam:.2f}")

print("done")
