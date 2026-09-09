#!/usr/bin/env python3
"""Render the six finished cards for the work-you-never-see carousel.

Matches render_final.py: 1080x1350, SF headings, DM Sans sub line, gold accents,
brass rule. Photo backgrounds carry a darken plus a bottom gradient scrim so the
uppercase type stays at full contrast.

Run: python3 render_cards.py
"""
import os, glob
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP = os.path.join(REEL, "kendall-2026-07-24", "_drive-dump")
OUT = os.path.join(REEL, "work-you-never-see-2026-07-24", "final")
DMSANS = os.path.join(REEL, "east-victoria-story-2026-07-23", "fonts", "DMSans.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1350
GOLD = (255, 192, 0)
IVORY = (244, 242, 236)
BRASS = (176, 141, 87)
PAD = 84

# frame, headline, subline, y bias, x bias, brightness lift, darken
# y/x bias: 0 = top/left of the scaled frame, 1 = bottom/right.
# The interiors are dim to begin with, so they get a lift and a lighter darken;
# the exterior is already bright and only needs the scrim.
# last value is scrim strength: pale floors need a heavier foot than dim ones
CARDS = [
    ("055", "THIS IS WHAT THE PROCESS LOOKS LIKE", None, 0.30, 0.45, 1.30, 0.16, 236, 0.46),
    ("091", "WE LEARN THE HOUSE FROM THE INSIDE AND OUT", None, 0.34, 0.50, 1.42, 0.14, 218, 0.48),
    ("089", "WE KNOW WHAT IS BEHIND EVERY WALL", None, 0.26, 0.36, 1.34, 0.16, 218, 0.50),
    ("098", "SO THE FAMILY WILL NEVER HAVE TO", None, 0.62, 0.50, 1.12, 0.18, 252, 0.44),
    ("073", "NEW FLOOR. NEW LIGHT. NEW KITCHEN.", None, 0.52, 0.66, 1.14, 0.18, 250, 0.46),
    ("019", "THE WORK YOU NEVER SEE\nIS THE WORK WE SELL",
     "LIVE WITH US.  WORK WITH US.", 0.26, 0.50, 1.00, 0.34, 240, 0.46),
]


def fit(draw, text, max_w, start=64, low=34):
    """Largest SF size at which text wraps into at most three lines."""
    for size in range(start, low - 1, -2):
        f = ImageFont.truetype(SF, size)
        words, lines, cur = text.split(), [], ""
        for w in words:
            t = (cur + " " + w).strip()
            if draw.textlength(t, font=f) <= max_w:
                cur = t
            else:
                if cur:
                    lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        if len(lines) <= 3 and all(draw.textlength(l, font=f) <= max_w for l in lines):
            return f, lines
    f = ImageFont.truetype(SF, low)
    return f, [text]


def build(frame, headline, subline, ybias, xbias, lift, darken, scrim, start, dest):
    src = glob.glob(os.path.join(DUMP, f"{frame}_*.jpg"))[0]
    im = Image.open(src).convert("RGB")
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = max(0, min(im.width - W, int((im.width - W) * xbias)))
    top = max(0, min(im.height - H, int((im.height - H) * ybias)))
    im = im.crop((left, top, left + W, top + H))

    # dim interiors need lifting before anything is laid over them
    if lift != 1.0:
        im = ImageEnhance.Brightness(im).enhance(lift)
        im = ImageEnhance.Contrast(im).enhance(1.06)

    im = Image.blend(im, Image.new("RGB", (W, H), (0, 0, 0)), darken)
    # scrim starts low and stays shallow, so the photograph survives
    grad = Image.new("L", (1, H))
    for y in range(H):
        t = max(0.0, (y - H * start) / (H * (1.0 - start)))
        grad.putpixel((0, y), int(scrim * (t ** 1.30)))
    im = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)),
                         im, grad.resize((W, H)))

    dr = ImageDraw.Draw(im)
    blocks = []
    for para in headline.split("\n"):
        f, lines = fit(dr, para, W - PAD * 2)
        blocks.append((f, lines))

    lh = int(blocks[0][0].size * 1.18)
    total = sum(len(l) for _, l in blocks) * lh
    if subline:
        total += 34 + 44 + 46
    y = int(H * 0.84) - total

    for f, lines in blocks:
        for ln in lines:
            dr.text(((W - dr.textlength(ln, font=f)) // 2, y), ln, font=f, fill=IVORY)
            y += int(f.size * 1.18)

    if subline:
        y += 34
        dr.line([(W // 2 - 92, y), (W // 2 + 92, y)], fill=BRASS, width=2)
        y += 44
        fs = ImageFont.truetype(DMSANS, 34)
        dr.text(((W - dr.textlength(subline, font=fs)) // 2, y), subline, font=fs, fill=GOLD)
        y += 92
        fm = ImageFont.truetype(SF, 27)
        m = "SHAVIT ROOTMAN"
        dr.text(((W - dr.textlength(m, font=fm)) // 2, y), m, font=fm, fill=IVORY)

    im.save(dest, quality=88)
    return im


thumbs = []
for i, (frame, head, sub, yb, xb, lift, dk, sc, st) in enumerate(CARDS, start=1):
    dest = os.path.join(OUT, f"{i:02d}_{frame}.jpg")
    im = build(frame, head, sub, yb, xb, lift, dk, sc, st, dest)
    print(f"card {i}  {frame}  {head.splitlines()[0][:44]}")
    t = im.copy()
    t.thumbnail((330, 330))
    thumbs.append(t)

# review contact sheet, all six in order
cols, pad = 3, 10
tw, th = thumbs[0].width, thumbs[0].height
sheet = Image.new("RGB", (cols * (tw + pad) + pad,
                          2 * (th + pad) + pad), "#111111")
for i, t in enumerate(thumbs):
    sheet.paste(t, (pad + (i % cols) * (tw + pad), pad + (i // cols) * (th + pad)))
sheet.save(os.path.join(OUT, "REVIEW-sheet.jpg"), quality=86)
print("wrote", OUT)
