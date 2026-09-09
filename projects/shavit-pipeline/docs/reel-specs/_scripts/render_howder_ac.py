#!/usr/bin/env python3
"""Howder AC standalone post — split-screen card in the deck language.

rev 2 (Jake 8/25: "explain the features of the air conditioning or have it, like,
split screen with something else"): OUTSIDE condensers | INSIDE bedroom wall
head, gold chips, NEW FEATURE eyebrow, feature subs that explain what mini
splits give a tenant. Feature lines are composed spec register (Jake-authorized
for spec copy) and on the confirm list.

Jake 8/25: the dedicated AC post is a rendered post card, "new feature blank AC"
— gold NEW FEATURE chip over Shavit's 11:44 condenser photo, house band below.
Copy: line1 "Air conditioning." + subs from his 11:34 text (trim) and his 7/13
mini-splits note. Same bone/brass/ink treatment as render_howder_unitb.py.

Run: python3.13 render_howder_ac.py          (system python3 has no Pillow)
"""
import os
from PIL import Image, ImageDraw, ImageFont

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(os.path.dirname(REEL))
PHOTO = os.path.join(REPO, "photos", "43-howder-ac", "condensers-0825.png")
OUT = os.path.join(REPO, "docs", "howder-ac-post-spec", "final")
EV = os.path.join(REEL, "east-victoria-story-2026-07-23")
DMSANS = os.path.join(EV, "fonts", "DMSans.ttf")
BRIC = os.path.join(EV, "fonts", "Bricolage.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1350
GOLD = (176, 141, 87)
TRACK = (214, 209, 198)
BAND = (237, 234, 227)
INK = (18, 18, 20)
SUB = (92, 89, 84)
PAD, PAD_TOP, PAD_BOT, RULE_H = 72, 52, 54, 6
LH1, LH2 = 62, 44


def _axes(f, sz, weight):
    try:
        vals = []
        for ax in f.get_variation_axes():
            nm = ax["name"]
            nm = nm.decode() if isinstance(nm, (bytes, bytearray)) else nm
            low = nm.lower()
            if low.startswith("weight"):
                vals.append(weight)
            elif low.startswith("optical"):
                vals.append(max(ax["minimum"], min(ax["maximum"], sz)))
            else:
                vals.append(ax.get("default", ax["minimum"]))
        f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f


F1 = _axes(ImageFont.truetype(SF, 54), 54, 820)
F2 = _axes(ImageFont.truetype(DMSANS, 37), 37, 400)
FMARK = ImageFont.truetype(BRIC, 23)
try:
    FMARK.set_variation_by_axes([23, 100, 800])
except Exception:
    pass
FCHIP = _axes(ImageFont.truetype(SF, 24), 24, 820)
MAXW = W - PAD * 2

SCRATCH = ImageDraw.Draw(Image.new("RGB", (W, H)))


def wrap(dr, text, fnt, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if dr.textlength(t, font=fnt) <= maxw:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


# rev 4 (Jake 8/25: keep the split, fix the words — "just describe it",
# Hillsdale line OUT): headline is his suggested "every room, air conditioned";
# subs describe the hardware in the two photos. All on the confirm list.
LINE1 = "Every room, air conditioned."
SUBS = ["New mini splits: heating and cooling, room by room.",
        "Two condensers outside, wall units inside."]
EYEBROW = "NEW FEATURE"
# rev 5 (Jake): blank-wall bedroom OUT; the window bedroom angle reads better
INSIDE = os.path.join(REPO, "photos", "43-howder-unit2", "full", "06_bedroom-window.jpg")
GUTTER = 6
HALF = (W - GUTTER) // 2

l1 = wrap(SCRATCH, LINE1.upper(), F1, MAXW)
subs = [wrap(SCRATCH, s, F2, MAXW) for s in SUBS]
block = 40 + len(l1) * LH1 + 14 + sum(len(s) for s in subs) * LH2 + 12 + 28
band_h = block + RULE_H + PAD_TOP + PAD_BOT
photo_h = H - band_h
print(f"band: {band_h}px ({round(100 * band_h / H)}% of frame)")


def fitcrop(path, w, h, xbias, ybias, zoom=1.0):
    im = Image.open(path).convert("RGB")
    sc = max(w / im.width, h / im.height) * zoom
    im = im.resize((round(im.width * sc), round(im.height * sc)), Image.LANCZOS)
    left = max(0, min(im.width - w, int((im.width - w) * xbias)))
    top = max(0, min(im.height - h, int((im.height - h) * ybias)))
    return im.crop((left, top, left + w, top + h))


card = Image.new("RGB", (W, H), BAND)
# rev 6 (Jake 8/25: "fuck the split screen only feature the air conditioning"):
# single full-bleed frame of his 11:57 condenser photo. No chips.
card.paste(fitcrop(PHOTO, W, photo_h, 0.50, 0.40), (0, 0))

dr = ImageDraw.Draw(card)

dr.rectangle([0, photo_h, W, photo_h + RULE_H], fill=GOLD)

y = photo_h + RULE_H + (band_h - RULE_H - block) // 2
dr.text((PAD, y), EYEBROW, font=FCHIP, fill=GOLD)
y += 40
for ln in l1:
    dr.text((PAD, y), ln, font=F1, fill=INK)
    y += LH1
y += 14
for para in subs:
    for ln in para:
        dr.text((PAD, y), ln, font=F2, fill=SUB)
        y += LH2
y += 12
dr.text((PAD, y), "SHAVIT ROOTMAN", font=FMARK, fill=GOLD)

out = os.path.join(OUT, "01_ac-new-feature.jpg")
card.save(out, quality=90)
print("wrote", out)
