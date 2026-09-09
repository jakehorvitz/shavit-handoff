#!/usr/bin/env python3
"""Render the closing card for the work-you-never-see carousel, using the
finished Kendall exterior as the background instead of a flat black canvas.

Matches render_final.py: 1080x1350, SF for headings, DM Sans for the sub line,
gold mark. Run: python3 render_closing.py
"""
import os, glob
from PIL import Image, ImageDraw, ImageFont

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = glob.glob(os.path.join(REEL, "kendall-2026-07-24", "_drive-dump", "019_*.jpg"))[0]
OUT = os.path.join(REEL, "work-you-never-see-2026-07-24", "assets", "s6-closing-card.jpg")
DMSANS = os.path.join(REEL, "east-victoria-story-2026-07-23", "fonts", "DMSans.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"

W, H = 1080, 1350
GOLD = (255, 192, 0)
IVORY = (244, 242, 236)

# background, cover-cropped so the whole width of the house survives the crop
im = Image.open(SRC).convert("RGB")
scale = max(W / im.width, H / im.height)
im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
# bias the crop upward so the house sits high and the type gets clean lawn below
left = (im.width - W) // 2
top = max(0, int((im.height - H) * 0.28))
im = im.crop((left, top, left + W, top + H))

# scrim: darken overall, then a stronger gradient into the lower half for type
im = Image.blend(im, Image.new("RGB", (W, H), (0, 0, 0)), 0.42)
grad = Image.new("L", (1, H))
for y in range(H):
    t = max(0.0, (y - H * 0.34) / (H * 0.66))
    grad.putpixel((0, y), int(232 * (t ** 1.25)))
grad = grad.resize((W, H))
im = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), im, grad)

dr = ImageDraw.Draw(im)
f_head = ImageFont.truetype(SF, 62)
f_cta = ImageFont.truetype(DMSANS, 34)
f_mark = ImageFont.truetype(SF, 27)


def centre(text, fnt, y, fill):
    x = (W - dr.textlength(text, font=fnt)) // 2
    dr.text((x, y), text, font=fnt, fill=fill)
    return y


y = 806
for line in ("THE WORK YOU NEVER SEE", "IS THE WORK WE SELL"):
    centre(line, f_head, y, IVORY)
    y += 76

# brass rule
y += 34
dr.line([(W // 2 - 92, y), (W // 2 + 92, y)], fill=(176, 141, 87), width=2)
y += 44

centre("LIVE WITH US.  WORK WITH US.", f_cta, y, GOLD)
y += 92
centre("SHAVIT ROOTMAN", f_mark, y, IVORY)

im.save(OUT, quality=88)
print("wrote", OUT, im.size)
