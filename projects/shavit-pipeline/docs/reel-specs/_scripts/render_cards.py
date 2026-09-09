#!/usr/bin/env python3
"""Render the six work-you-never-see cards in the shipped Shavit brand style.

The type treatment is copied from the East Victoria renderer so the two posts sit
together in the grid: gold kicker, short brass rule, heavy white uppercase
headline, DM Sans sentence-case support line, gold Bricolage call to action with
an underline, gold mark. Only the image handling differs, because the Kendall
interiors are dim and need per-card exposure and crop control.

Run: python3 render_cards.py
"""
import os, glob
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP = os.path.join(REEL, "kendall-2026-07-24", "_drive-dump")
OUT = os.path.join(REEL, "work-you-never-see-2026-07-24", "final")
EV = os.path.join(REEL, "east-victoria-story-2026-07-23")
DMSANS = os.path.join(EV, "fonts", "DMSans.ttf")
BRIC = os.path.join(EV, "fonts", "Bricolage.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1350
BRASS = (176, 141, 87)
GOLD = (255, 192, 0)


def font(sz, bold=True):
    f = ImageFont.truetype(SF, sz)
    try:
        vals = []
        for ax in f.get_variation_axes():
            nm = ax["name"].decode() if isinstance(ax["name"], (bytes, bytearray)) else ax["name"]
            low = nm.lower()
            if low.startswith("weight"):
                vals.append(820 if bold else 400)
            elif low.startswith("optical"):
                vals.append(max(ax["minimum"], min(ax["maximum"], sz)))
            else:
                vals.append(ax.get("default", ax["minimum"]))
        f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f


def bric(sz, wght=800):
    f = ImageFont.truetype(BRIC, sz)
    try:
        f.set_variation_by_axes([sz, 100, wght])
    except Exception:
        try:
            f.set_variation_by_axes([wght])
        except Exception:
            pass
    return f


def dmsans(sz):
    f = ImageFont.truetype(DMSANS, sz)
    try:
        vals = []
        for ax in f.get_variation_axes():
            nm = ax["name"].decode() if isinstance(ax["name"], (bytes, bytearray)) else ax["name"]
            low = nm.lower()
            if low.startswith("weight"):
                vals.append(400)
            elif low.startswith("optical"):
                vals.append(max(ax["minimum"], min(ax["maximum"], sz)))
            else:
                vals.append(ax.get("default", ax["minimum"]))
        f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f


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


def scrim(base, frac=0.52, peak=235):
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    top = int(H * (1 - frac))
    for yy in range(top, H):
        a = int(peak * ((yy - top) / (H - top)) ** 1.15)
        d.line([(0, yy), (W, yy)], fill=(0, 0, 0, a))
    return Image.alpha_composite(base.convert("RGBA"), ov)


def plate(frame, ybias, xbias, lift, darken):
    """Crop and expose one Kendall frame to 4:5."""
    src = glob.glob(os.path.join(DUMP, f"{frame}_*.jpg"))[0]
    im = Image.open(src).convert("RGB")
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = max(0, min(im.width - W, int((im.width - W) * xbias)))
    top = max(0, min(im.height - H, int((im.height - H) * ybias)))
    im = im.crop((left, top, left + W, top + H))
    if lift != 1.0:
        im = ImageEnhance.Brightness(im).enhance(lift)
        im = ImageEnhance.Contrast(im).enhance(1.06)
    if darken:
        im = Image.blend(im, Image.new("RGB", (W, H), (0, 0, 0)), darken)
    return im


def caption(base, kicker, line1, line2=None, center=False, mark=False, cta=None,
            frac=0.52, peak=235):
    im = scrim(base, frac, peak)
    dr = ImageDraw.Draw(im)
    pad = 72
    maxw = W - pad * 2
    f1, f2, fk = font(58), dmsans(41), font(26)
    l1 = wrap(dr, line1.upper(), f1, maxw)
    l2 = wrap(dr, line2, f2, maxw) if line2 else []
    lh1, lh2 = 70, 52
    cta_sz, fcta = 64, None
    if cta:
        cta = cta.upper()
        fcta = bric(cta_sz)
        while dr.textlength(cta, font=fcta) > maxw and cta_sz > 24:
            cta_sz -= 2
            fcta = bric(cta_sz)
    cta_h = (30 + cta_sz + 8 + 16) if cta else 0
    block = ((30 if kicker else 0) + 22 + len(l1) * lh1
             + (14 + len(l2) * lh2 if l2 else 0) + cta_h + (46 if mark else 0))
    y = H - pad - block

    def cx(t, fnt):
        return (W - dr.textlength(t, font=fnt)) // 2 if center else pad

    if kicker:
        kx = (W - dr.textlength(kicker.upper(), font=fk)) // 2 if center else pad
        dr.text((kx, y), kicker.upper(), font=fk, fill=GOLD)
        y += 30
    rx = (W - 64) // 2 if center else pad
    dr.rectangle([rx, y, rx + 64, y + 4], fill=BRASS)
    y += 22
    for ln in l1:
        dr.text((cx(ln, f1), y), ln, font=f1, fill=(255, 255, 255))
        y += lh1
    if l2:
        y += 14
        for ln in l2:
            dr.text((cx(ln, f2), y), ln, font=f2, fill=(232, 229, 220))
            y += lh2
    if cta:
        y += 30
        cxx = (W - dr.textlength(cta, font=fcta)) // 2 if center else pad
        dr.text((cxx, y), cta, font=fcta, fill=GOLD)
        ubb = dr.textbbox((cxx, y), cta, font=fcta)
        dr.rectangle([ubb[0], ubb[3] + 8, ubb[2], ubb[3] + 12], fill=GOLD)
        y += cta_sz + 8 + 16
    if mark:
        y += 12
        m = "SHAVIT ROOTMAN"
        fm = bric(24)
        mx = (W - dr.textlength(m, font=fm)) // 2 if center else pad
        dr.text((mx, y), m, font=fm, fill=GOLD)
    return im.convert("RGB")


CARDS = [
    dict(frame="055", kicker=None,
         line1="This is what the process looks like.",
         line2="Kendall Street, South Bend, Indiana.",
         center=True, mark=True,
         ybias=0.30, xbias=0.45, lift=1.30, darken=0.10, frac=0.56, peak=242),
    dict(frame="091", kicker="Opening up",
         line1="We learn the house from the inside and out.",
         line2="Ceilings opened end to end before anything goes back.",
         ybias=0.34, xbias=0.50, lift=1.42, darken=0.08, frac=0.58, peak=238),
    dict(frame="089", kicker="The middle",
         line1="We know what is behind every wall.",
         line2="Ladders, extraction gear, and a floor you cannot see.",
         ybias=0.26, xbias=0.36, lift=1.34, darken=0.10, frac=0.58, peak=240),
    dict(frame="098", kicker="The same room",
         line1="So the family will never have to.",
         line2="New floor, new paint, new light, and a restored fireplace.",
         ybias=0.52, xbias=0.50, lift=1.12, darken=0.10, frac=0.56, peak=246),
    dict(frame="073", kicker="Finished",
         line1="New floor. New light. New kitchen.",
         line2="A South Bend rebuild, finished top to bottom.",
         ybias=0.46, xbias=0.66, lift=1.14, darken=0.10, frac=0.56, peak=246),
    dict(frame="019", kicker=None,
         line1="The work you never see is the work we sell.",
         line2="Kendall Street, South Bend, Indiana. Finished.",
         center=True, mark=True, cta="Live with us. Work with us.",
         ybias=0.20, xbias=0.50, lift=1.00, darken=0.16, frac=0.62, peak=246),
]

thumbs = []
for i, c in enumerate(CARDS, start=1):
    base = plate(c["frame"], c["ybias"], c["xbias"], c["lift"], c["darken"])
    im = caption(base, c.get("kicker"), c["line1"], c.get("line2"),
                 center=c.get("center", False), mark=c.get("mark", False),
                 cta=c.get("cta"), frac=c.get("frac", 0.52), peak=c.get("peak", 235))
    dest = os.path.join(OUT, f"{i:02d}_{c['frame']}.jpg")
    im.save(dest, quality=88)
    print(f"card {i}  {c['frame']}  {c['line1'][:46]}")
    t = im.copy()
    t.thumbnail((330, 330))
    thumbs.append(t)

cols, pad = 3, 10
tw, th = thumbs[0].width, thumbs[0].height
sheet = Image.new("RGB", (cols * (tw + pad) + pad, 2 * (th + pad) + pad), "#111111")
for i, t in enumerate(thumbs):
    sheet.paste(t, (pad + (i % cols) * (tw + pad), pad + (i // cols) * (th + pad)))
sheet.save(os.path.join(OUT, "REVIEW-sheet.jpg"), quality=86)
print("wrote", OUT)
