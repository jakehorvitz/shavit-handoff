#!/usr/bin/env python3
"""Render testimonial/title text plates as transparent PNGs (1080x1920) for ffmpeg overlay.
Brand: uppercase, white type in a black@~72% box with subtle brass keyline, attr line below."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
BRASS = (176, 141, 87, 255)
GOLD = (255, 192, 0, 255)

def font(size, bold=True):
    # HelveticaNeue.ttc index 0 regular; try named index for Bold
    for idx in (0,):
        try:
            f = ImageFont.truetype(FONT, size, index=idx)
            return f
        except Exception:
            continue
    return ImageFont.truetype(FONT, size)

def plate(name, main, attr=None, y_frac=0.60, main_size=54, color=(255,255,255,255), keyline=BRASS):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_main = font(main_size)
    lines = main.split("\n")
    # measure block
    widths, heights = [], []
    for ln in lines:
        bb = d.textbbox((0, 0), ln, font=f_main)
        widths.append(bb[2] - bb[0]); heights.append(bb[3] - bb[1])
    bw = max(widths); lh = max(heights) + 14
    bh = lh * len(lines)
    pad = 26
    x0 = (W - bw) / 2 - pad
    y0 = H * y_frac - pad
    # box
    d.rounded_rectangle([x0, y0, x0 + bw + 2*pad, y0 + bh + 2*pad], radius=10,
                        fill=(0, 0, 0, 185), outline=keyline, width=2)
    # text (letterspaced-ish via tracking not supported; fine)
    y = H * y_frac
    for ln, w_ in zip(lines, widths):
        d.text(((W - w_) / 2, y), ln, font=f_main, fill=color)
        y += lh
    if attr:
        f_a = font(28, bold=False)
        bb = d.textbbox((0, 0), attr, font=f_a)
        aw = bb[2] - bb[0]
        d.text(((W - aw) / 2, y0 + bh + 2*pad + 18), attr, font=f_a, fill=(232, 223, 206, 255))
    img.save(f"plates/{name}.png")
    print("plate", name)

import os
os.makedirs("plates", exist_ok=True)
plate("w1", "PROFESSIONAL\nACROSS THE BOARD.", "— JEFFREY S. RILING · US VETERAN")
plate("w2", "A MAN OF HIS WORD.", "— NICKY · CLEVELAND INVESTOR")
plate("w3", "TRUSTWORTHY FRIEND.", "— NICKY · CLEVELAND INVESTOR")
plate("w4", "...MAKES YOU FEEL\nLIKE FAMILY.", "— JEFFREY S. RILING · US VETERAN")
plate("title", "THE HOUSE THAT\nCAME BACK.", None, y_frac=0.56, main_size=64)
plate("addr", "RIVER STREET · HILLSDALE, MICHIGAN", None, y_frac=0.16, main_size=34, color=BRASS, keyline=(176,141,87,140))

# outro signature stack (over dimming sky, not a black card)
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
f_close = font(46)
closer = "BUILT IN MICHIGAN,\nOHIO & INDIANA."
y = H * 0.36
for ln in closer.split("\n"):
    bb = d.textbbox((0, 0), ln, font=f_close)
    d.text(((W - (bb[2]-bb[0])) / 2, y), ln, font=f_close, fill=GOLD)
    y += 66
# brass ring S mark
cx, cy, r = W/2, H*0.53, 46
d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=BRASS, width=4)
f_s = font(52)
bb = d.textbbox((0,0), "S", font=f_s)
d.text((cx-(bb[2]-bb[0])/2 - bb[0], cy-(bb[3]-bb[1])/2 - bb[1]), "S", font=f_s, fill=BRASS)
f_wm = font(40)
bb = d.textbbox((0,0), "SHAVIT ROOTMAN", font=f_wm)
d.text(((W-(bb[2]-bb[0]))/2, H*0.53 + 70), "SHAVIT ROOTMAN", font=f_wm, fill=(244,241,234,255))
f_tag = font(20, bold=False)
tag = "MADE IN AMERICA · LOCAL TO THE MIDWEST"
bb = d.textbbox((0,0), tag, font=f_tag)
d.text(((W-(bb[2]-bb[0]))/2, H*0.53 + 130), tag, font=f_tag, fill=(150,143,130,255))
f_dis = font(16, bold=False)
dis = "AI-ASSISTED VISUALIZATION"
bb = d.textbbox((0,0), dis, font=f_dis)
d.text(((W-(bb[2]-bb[0]))/2, H*0.92), dis, font=f_dis, fill=(120,114,104,255))
img.save("plates/outro.png")
print("plate outro")
