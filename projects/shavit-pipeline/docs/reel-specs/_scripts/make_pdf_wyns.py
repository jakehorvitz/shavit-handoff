#!/usr/bin/env python3
"""Master PDF for the work-you-never-see carousel. Same shape as the East
Victoria master: page 1 is the whole carousel in order, then every slide full
page, then the caption page. Adapted to six slides on a 3 by 2 overview grid."""
import os
from PIL import Image, ImageDraw, ImageFont

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.join(REEL, "work-you-never-see-2026-07-24", "final")
FONTS = os.path.join(REEL, "east-victoria-story-2026-07-23", "fonts")
order = ["01_055.jpg", "02_091.jpg", "03_089.jpg", "04_098.jpg", "05_073.jpg", "06_019.jpg"]
slides = [Image.open(os.path.join(ROOT, f)).convert("RGB") for f in order]


def sf(sz, bold=True):
    f = ImageFont.truetype("/System/Library/Fonts/SFNS.ttf", sz)
    try:
        vals = []
        for ax in f.get_variation_axes():
            nm = ax["name"].decode() if isinstance(ax["name"], (bytes, bytearray)) else ax["name"]
            l = nm.lower()
            vals.append(820 if (l.startswith("weight") and bold) else 400 if l.startswith("weight")
                        else max(ax["minimum"], min(ax["maximum"], sz)) if l.startswith("optical")
                        else ax.get("default", ax["minimum"]))
        f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f


def dm(sz):
    f = ImageFont.truetype(os.path.join(FONTS, "DMSans.ttf"), sz)
    try:
        vals = []
        for ax in f.get_variation_axes():
            nm = ax["name"].decode() if isinstance(ax["name"], (bytes, bytearray)) else ax["name"]
            l = nm.lower()
            vals.append(400 if l.startswith("weight")
                        else max(ax["minimum"], min(ax["maximum"], sz)) if l.startswith("optical")
                        else ax.get("default", ax["minimum"]))
        f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f


# ---- overview page: 3 cols x 2 rows ----
OW = 2000
gap, mx, top = 26, 30, 150
cols, rows = 3, 2
tw = (OW - mx * 2 - gap * (cols - 1)) // cols
th = int(tw * 1350 / 1080)
OH = top + rows * th + (rows - 1) * gap + mx
ov = Image.new("RGB", (OW, OH), (11, 11, 12))
dr = ImageDraw.Draw(ov)
dr.text((mx, 40), "THE WORK YOU NEVER SEE", font=sf(52, True), fill=(255, 255, 255))
dr.rectangle([mx, 108, mx + 70, 113], fill=(176, 141, 87))
sub = "Kendall Street, South Bend, Indiana  \u00b7  the full carousel, in order  \u00b7  6 slides  \u00b7  pages that follow show each one full size"
dr.text((mx, 118), sub, font=dm(26), fill=(165, 162, 154))
for i, s in enumerate(slides):
    c, r = i % cols, i // cols
    x = mx + c * (tw + gap)
    y = top + r * (th + gap)
    ov.paste(s.resize((tw, th)), (x, y))
    dr.rectangle([x, y, x + 46, y + 40], fill=(0, 0, 0))
    dr.text((x + 12, y + 4), str(i + 1), font=sf(28, True), fill=(255, 192, 0))
    dr.rectangle([x, y, x + tw - 1, y + th - 1], outline=(42, 42, 46), width=1)

# ---- caption page ----
cap = open(os.path.join(ROOT, "CAPTION.txt")).read()
W, H = 1080, 1350
cp = Image.new("RGB", (W, H), (11, 11, 12))
d2 = ImageDraw.Draw(cp)
d2.text((72, 60), "CAPTION", font=sf(30, True), fill=(255, 192, 0))
d2.rectangle([72, 104, 136, 108], fill=(176, 141, 87))
y = 140
fb = dm(27)
maxw = W - 144
for para in cap.split("\n"):
    if not para.strip():
        y += 18
        continue
    cur = ""
    for w in para.split():
        t = (cur + " " + w).strip()
        if d2.textlength(t, font=fb) <= maxw:
            cur = t
        else:
            d2.text((72, y), cur, font=fb, fill=(230, 228, 220)); y += 38; cur = w
    if cur:
        d2.text((72, y), cur, font=fb, fill=(230, 228, 220)); y += 38

pages = [ov] + slides + [cp]
out = os.path.join(ROOT, "Kendall-Work-You-Never-See-MASTER.pdf")
pages[0].save(out, save_all=True, append_images=pages[1:], resolution=150.0)
print("saved", out, "pages:", len(pages))
