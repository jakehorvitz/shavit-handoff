#!/usr/bin/env python3
import os, glob
from PIL import Image, ImageDraw, ImageFont
D = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/_drive-dump")
files = sorted(glob.glob(os.path.join(D, "*.jpg")))
files = [f for f in files if os.path.basename(f)[:3].isdigit()]
TILE, COLS, PER = 300, 5, 25
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 34)
except Exception:
    font = ImageFont.load_default()
for s in range((len(files)+PER-1)//PER):
    batch = files[s*PER:(s+1)*PER]
    rows = (len(batch)+COLS-1)//COLS
    sheet = Image.new("RGB", (COLS*TILE, rows*TILE), (17,17,17))
    dr = ImageDraw.Draw(sheet)
    for i, f in enumerate(batch):
        idx = int(os.path.basename(f)[:3])
        try:
            im = Image.open(f).convert("RGB")
        except Exception:
            continue
        im.thumbnail((TILE-8, TILE-8))
        x, y = (i%COLS)*TILE, (i//COLS)*TILE
        sheet.paste(im, (x+4, y+4))
        dr.rectangle([x+4,y+4,x+40,y+40], fill=(0,0,0))
        dr.text((x+8,y+2), f"{idx}", fill=(255,200,0), font=font)
    out = os.path.join(D, f"_sheet_{s}.jpg")
    sheet.save(out, quality=72)
    print(out, len(batch))
print("done")
