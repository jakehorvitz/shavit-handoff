#!/usr/bin/env python3
"""Rev 12 — no band at all. The type sits on the room.

Jake, 7/26 on the rev 11 spec: "im not a fan of the black band is there
something else we can do". Rev 11's step index and gold progress rule survive
untouched; the black band does not.

Every one of these frames already has a large, quiet, evenly lit surface at the
top — the ceiling on the interiors, the sky on the exterior. Rev 12 puts the
type there in ink, with the progress rule pinned to the very top edge of the
frame. Nothing is scrimmed, nothing is covered, and the full photograph is
visible on every card. It is also the exact inverse of East Victoria, whose
whole signature is white type on a dark bottom scrim, which is what Shavit was
reacting to.

Legibility is not left to chance. For each card the renderer samples the actual
pixels under the text block and picks dark ink or white ink from the measured
luminance, so a card whose ceiling turns out dark cannot silently ship with
unreadable type. The index takes the same ink as the headline rather than gold,
because gold on a bright ceiling was the one thing that failed in testing; gold
is reserved for the progress rule and the tagline underline.

Run: python3 render_cards_v12.py
"""
import os, glob
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageStat

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP = os.path.join(REEL, "kendall-2026-07-24", "_drive-dump")
OUT = os.path.join(REEL, "work-you-never-see-2026-07-24", "final-v12")
EV = os.path.join(REEL, "east-victoria-story-2026-07-23")
DMSANS = os.path.join(EV, "fonts", "DMSans.ttf")
BRIC = os.path.join(EV, "fonts", "Bricolage.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1350
GOLD = (255, 192, 0)
TRACK = (58, 50, 36)
INK_DARK, SUB_DARK = (18, 18, 20), (62, 60, 57)
INK_LIGHT, SUB_LIGHT = (255, 255, 255), (216, 213, 206)
PAD, RULE_H, LH1, LH2, IDX_H = 72, 6, 70, 52, 42
TOP = RULE_H + 62          # first baseline, under the progress rule
LUMA_SPLIT = 138           # above this the backdrop is bright enough for ink


def font(sz, bold=True):
    f = ImageFont.truetype(SF, sz)
    try:
        vals = []
        for ax in f.get_variation_axes():
            nm = ax["name"].decode() if isinstance(ax["name"], (bytes, bytearray)) else ax["name"]
            low = nm.lower()
            vals.append((820 if bold else 400) if low.startswith("weight")
                        else max(ax["minimum"], min(ax["maximum"], sz)) if low.startswith("optical")
                        else ax.get("default", ax["minimum"]))
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
            vals.append(400 if low.startswith("weight")
                        else max(ax["minimum"], min(ax["maximum"], sz)) if low.startswith("optical")
                        else ax.get("default", ax["minimum"]))
        f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f


F1, F2, FIDX, FMARK = font(58), dmsans(41), font(26), bric(24)
SCRATCH = ImageDraw.Draw(Image.new("RGB", (W, H)))
MAXW = W - PAD * 2


def wrap(text, fnt, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if SCRATCH.textlength(t, font=fnt) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def cta_font(cta):
    sz, f = 64, bric(64)
    while SCRATCH.textlength(cta.upper(), font=f) > MAXW and sz > 24:
        sz -= 2
        f = bric(sz)
    return sz, f


def measure(c):
    l1 = wrap(c["line1"].upper(), F1, MAXW)
    l2 = wrap(c["line2"], F2, MAXW) if c.get("line2") else []
    h = IDX_H + len(l1) * LH1
    if l2:
        h += 14 + len(l2) * LH2
    if c.get("cta"):
        h += 30 + cta_font(c["cta"])[0] + 8 + 16
    if c.get("mark"):
        h += 12 + 30
    return h, l1, l2


def plate(c):
    """Full frame, no scrim and no darken. Only the exposure lift survives."""
    src = glob.glob(os.path.join(DUMP, f"{c['frame']}_*.jpg"))[0]
    im = Image.open(src).convert("RGB")
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = max(0, min(im.width - W, int((im.width - W) * c["xbias"])))
    top = max(0, min(im.height - H, int((im.height - H) * c["ybias"])))
    im = im.crop((left, top, left + W, top + H))
    if c["lift"] != 1.0:
        im = ImageEnhance.Brightness(im).enhance(c["lift"])
        im = ImageEnhance.Contrast(im).enhance(1.06)
    return im


def render(c, idx, total):
    card = plate(c)
    block, l1, l2 = measure(c)

    # Measure what the type will actually land on, then choose ink from it.
    region = card.crop((PAD, TOP, W - PAD, min(H, TOP + block))).convert("L")
    luma = ImageStat.Stat(region).mean[0]
    bright = luma >= LUMA_SPLIT
    ink, sub = (INK_DARK, SUB_DARK) if bright else (INK_LIGHT, SUB_LIGHT)

    dr = ImageDraw.Draw(card)
    dr.rectangle([0, 0, W, RULE_H], fill=TRACK)
    dr.rectangle([0, 0, int(W * idx / total), RULE_H], fill=GOLD)

    center = c.get("center", False)
    y = TOP

    def cx(t, fnt):
        return (W - dr.textlength(t, font=fnt)) // 2 if center else PAD

    step = f"{idx:02d} / {total:02d}"
    dr.text((cx(step, FIDX), y), step, font=FIDX, fill=ink)
    y += IDX_H
    for ln in l1:
        dr.text((cx(ln, F1), y), ln, font=F1, fill=ink); y += LH1
    if l2:
        y += 14
        for ln in l2:
            dr.text((cx(ln, F2), y), ln, font=F2, fill=sub); y += LH2
    if c.get("cta"):
        sz, fcta = cta_font(c["cta"])
        y += 30
        t = c["cta"].upper()
        xx = (W - dr.textlength(t, font=fcta)) // 2 if center else PAD
        dr.text((xx, y), t, font=fcta, fill=ink)
        bb = dr.textbbox((xx, y), t, font=fcta)
        dr.rectangle([bb[0], bb[3] + 8, bb[2], bb[3] + 12], fill=GOLD)
        y += sz + 8 + 16
    if c.get("mark"):
        y += 12
        m = "SHAVIT ROOTMAN"
        dr.text((cx(m, FMARK), y), m, font=FMARK, fill=ink)
    return card, luma, bright


# Copy, photo selection and order are rev 10's, approved by Shavit. ybias is
# retuned per card so the quiet ceiling (or sky) sits under the type block.
CARDS = [
    dict(frame="055", line1="This is what the process looks like.",
         line2="Kendall Street, South Bend, Indiana.",
         center=True, mark=True, ybias=0.02, xbias=0.45, lift=1.30),
    dict(frame="091", line1="We learn the house from the inside and out.",
         line2="Ceilings opened end to end before anything goes back.",
         ybias=0.04, xbias=0.50, lift=1.42),
    dict(frame="089", line1="We know what is behind every wall.",
         line2="Ladders, extraction gear, and a floor you cannot see.",
         ybias=0.02, xbias=0.36, lift=1.34),
    dict(frame="098", line1="So the family will never have to.",
         line2="New floor, new paint, new light, and a restored fireplace.",
         ybias=0.10, xbias=0.50, lift=1.12),
    dict(frame="073", line1="New floor. New light. New kitchen.",
         line2="A South Bend rebuild, finished top to bottom.",
         ybias=0.08, xbias=0.66, lift=1.14),
    dict(frame="019", line1="The work you never see is the work we sell.",
         line2="Kendall Street, South Bend, Indiana. Finished.",
         center=True, mark=True, cta="Live with us. Work with us.",
         ybias=0.00, xbias=0.50, lift=1.00),
]

thumbs = []
for i, c in enumerate(CARDS, start=1):
    im, luma, bright = render(c, i, len(CARDS))
    im.save(os.path.join(OUT, f"{i:02d}_{c['frame']}.jpg"), quality=88)
    print(f"card {i}  {c['frame']}  luma {luma:5.1f}  ink {'dark' if bright else 'white'}  {c['line1'][:38]}")
    t = im.copy(); t.thumbnail((330, 330)); thumbs.append(t)

cols, pad = 3, 10
tw, th = thumbs[0].width, thumbs[0].height
sheet = Image.new("RGB", (cols * (tw + pad) + pad, 2 * (th + pad) + pad), "#111111")
for i, t in enumerate(thumbs):
    sheet.paste(t, (pad + (i % cols) * (tw + pad), pad + (i // cols) * (th + pad)))
sheet.save(os.path.join(OUT, "REVIEW-sheet.jpg"), quality=86)
print("wrote", OUT)
