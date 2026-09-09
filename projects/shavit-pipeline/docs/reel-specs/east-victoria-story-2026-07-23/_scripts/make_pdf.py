#!/usr/bin/env python3
"""Master PDF: page 1 = all 10 slides lined up (overview grid), then each slide
full-page to scroll through, then the caption page."""
import os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/final")
FONTS = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/fonts")
order = ["01_cover.jpg","02_foreclosure.jpg","03_wonit.jpg","04_basement.jpg","05_family.jpg",
         "06_dominion.jpg","07_revived.jpg","08_numbers.jpg","09_now.jpg","10_close.jpg"]
slides = [Image.open(os.path.join(ROOT, f)).convert("RGB") for f in order]

def sf(sz, bold=True):
    f = ImageFont.truetype("/System/Library/Fonts/SFNS.ttf", sz)
    try:
        vals=[]
        for ax in f.get_variation_axes():
            nm=ax["name"].decode() if isinstance(ax["name"],(bytes,bytearray)) else ax["name"]
            l=nm.lower()
            vals.append(820 if (l.startswith("weight") and bold) else 400 if l.startswith("weight") else max(ax["minimum"],min(ax["maximum"],sz)) if l.startswith("optical") else ax.get("default",ax["minimum"]))
        f.set_variation_by_axes(vals)
    except Exception: pass
    return f
def dm(sz):
    f = ImageFont.truetype(os.path.join(FONTS,"DMSans.ttf"), sz)
    try:
        vals=[]
        for ax in f.get_variation_axes():
            nm=ax["name"].decode() if isinstance(ax["name"],(bytes,bytearray)) else ax["name"]
            l=nm.lower()
            vals.append(400 if l.startswith("weight") else max(ax["minimum"],min(ax["maximum"],sz)) if l.startswith("optical") else ax.get("default",ax["minimum"]))
        f.set_variation_by_axes(vals)
    except Exception: pass
    return f

# ---- overview page: 5 cols x 2 rows ----
OW, OH = 2000, 1120
gap, mx, top = 26, 30, 150
cols, rows = 5, 2
tw = (OW - mx*2 - gap*(cols-1)) // cols
th = int(tw * 1350/1080)
ov = Image.new("RGB", (OW, OH), (11,11,12))
dr = ImageDraw.Draw(ov)
dr.text((mx, 40), "EAST VICTORIA STREET", font=sf(52, True), fill=(255,255,255))
dr.rectangle([mx, 108, mx+70, 113], fill=(176,141,87))
sub = "The full carousel, in order  ·  10 slides  ·  swipe through the pages that follow"
dr.text((mx, 118), sub, font=dm(26), fill=(165,162,154))
for i, s in enumerate(slides):
    c, r = i % cols, i // cols
    x = mx + c*(tw+gap); y = top + r*(th+gap)
    t = s.resize((tw, th))
    ov.paste(t, (x, y))
    dr.rectangle([x, y, x+46, y+40], fill=(0,0,0))
    dr.text((x+12, y+4), str(i+1), font=sf(28, True), fill=(255,192,0))
    dr.rectangle([x, y, x+tw-1, y+th-1], outline=(42,42,46), width=1)

# ---- caption page ----
cap = open(os.path.join(ROOT, "CAPTION.txt")).read()
W, H = 1080, 1350
cp = Image.new("RGB", (W, H), (11,11,12))
d2 = ImageDraw.Draw(cp)
d2.text((72, 60), "CAPTION", font=sf(30, True), fill=(255,192,0))
d2.rectangle([72,104,136,108], fill=(176,141,87))
y = 140; fb = dm(27); maxw = W-144
for para in cap.split("\n"):
    if not para.strip(): y += 18; continue
    words, cur = para.split(), ""
    for w in words:
        t=(cur+" "+w).strip()
        if d2.textlength(t, font=fb) <= maxw: cur=t
        else: d2.text((72,y),cur,font=fb,fill=(230,228,220)); y+=38; cur=w
    if cur: d2.text((72,y),cur,font=fb,fill=(230,228,220)); y+=38

pages = [ov] + slides + [cp]
out = os.path.join(ROOT, "East-Victoria-Carousel-MASTER.pdf")
pages[0].save(out, save_all=True, append_images=pages[1:], resolution=150.0)
print("saved", out, "pages:", len(pages))
