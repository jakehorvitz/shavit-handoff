#!/usr/bin/env python3
"""Build labelled contact sheets from a folder of photos, so a whole property
set can be reviewed cheaply instead of opening images one at a time.

Usage: python3 sheets.py <src_dir> <out_prefix> [cols] [thumb]

ImageMagick is not installed on this machine, so this replaces the `montage`
recipe in the East Victoria handoff. Each tile is labelled with its index so a
chosen frame can be traced back to the source file.
"""
import sys, os, glob
from PIL import Image, ImageDraw

if len(sys.argv) < 3:
    sys.exit("usage: sheets.py <src_dir> <out_prefix> [cols] [thumb]")

SRC = os.path.expanduser(sys.argv[1])
OUT = os.path.expanduser(sys.argv[2])
COLS = int(sys.argv[3]) if len(sys.argv) > 3 else 5
THUMB = int(sys.argv[4]) if len(sys.argv) > 4 else 300
ROWS = 5
PER = COLS * ROWS
PAD = 6
LABEL = 18

files = sorted(f for ext in ("jpg", "jpeg", "png")
               for f in glob.glob(os.path.join(SRC, f"*.{ext}")))
if not files:
    sys.exit(f"no images in {SRC}")

os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)
cell_h = THUMB + LABEL

for sheet_i in range(0, len(files), PER):
    batch = files[sheet_i:sheet_i + PER]
    rows = (len(batch) + COLS - 1) // COLS
    W = COLS * (THUMB + PAD) + PAD
    H = rows * (cell_h + PAD) + PAD
    canvas = Image.new("RGB", (W, H), "#111111")
    draw = ImageDraw.Draw(canvas)
    for i, path in enumerate(batch):
        try:
            im = Image.open(path)
            im.thumbnail((THUMB, THUMB))
            im = im.convert("RGB")
        except Exception as e:
            print(f"SKIP {path}: {e}")
            continue
        c, r = i % COLS, i // COLS
        x = PAD + c * (THUMB + PAD) + (THUMB - im.width) // 2
        y = PAD + r * (cell_h + PAD) + (THUMB - im.height) // 2
        canvas.paste(im, (x, y))
        idx = os.path.basename(path).split("_")[0]
        draw.text((PAD + c * (THUMB + PAD) + 4,
                   PAD + r * (cell_h + PAD) + THUMB + 2),
                  f"{idx}", fill="#FFC000")
    dest = f"{OUT}_{sheet_i // PER}.jpg"
    canvas.save(dest, quality=80)
    print(f"{dest}  ({len(batch)} tiles, idx {os.path.basename(batch[0]).split('_')[0]}"
          f"-{os.path.basename(batch[-1]).split('_')[0]})")
