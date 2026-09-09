#!/usr/bin/env python3
"""Rev 11 — the Kendall cards re-skinned off the East Victoria lockup.

Shavit, 7/26: "It's too identical to E Victoria. I vote to change." Rev 10 had
deliberately rebuilt the type on the East Victoria renderer so the two posts
would match in the grid; he read matching as repetition. This renderer keeps
every brand element (gold, the wordmark, the end card, the tagline) and changes
the two things that make the thumbnail read as a repeat:

  A. No scrim. The photo runs full-bleed and undarkened in the upper region and
     the type sits in a solid band below it. East Victoria reads as "text fading
     into a photo"; this reads as "photo above a hard band". It also stops
     dimming the bottom half of the frame, which on these slides is exactly
     where the ladders, extraction gear and opened floor live — the detail the
     post is actually about.

  C. The word kickers ("Opening up", "The middle") become a numeric step index
     plus a gold progress rule across the top edge of the band. The post's
     thesis is that this is a process document, so the furniture should say so.

The band height is measured across all six cards and then applied uniformly, so
the type baseline sits in the same place on every slide and the set reads as one
designed run rather than six independently-fitted cards.

Run: python3 render_cards_v11.py
"""
import os, glob
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP = os.path.join(REEL, "kendall-2026-07-24", "_drive-dump")
OUT = os.path.join(REEL, "work-you-never-see-2026-07-24",
                   "final-v11-bone" if os.environ.get("BONE") == "1" else "final-v11")
EV = os.path.join(REEL, "east-victoria-story-2026-07-23")
DMSANS = os.path.join(EV, "fonts", "DMSans.ttf")
BRIC = os.path.join(EV, "fonts", "Bricolage.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1350

# BONE=1 flips the band from near black to bone. Jake, 7/26: "im not a fan of
# the black band". If the objection is the colour rather than the band itself,
# this is the same geometry inverted, and it separates hardest from East
# Victoria in the grid because the thumbnail goes from dark to light.
BONE = os.environ.get("BONE") == "1"

if BONE:
    GOLD = (176, 141, 87)     # brass; bright gold has no contrast on bone
    TRACK = (214, 209, 198)
    BAND = (237, 234, 227)
    INK = (18, 18, 20)
    SUB = (92, 89, 84)
else:
    GOLD = (255, 192, 0)
    TRACK = (58, 50, 36)      # unfilled progress rule, a dimmed gold
    BAND = (11, 11, 12)       # matches the site's #0b0b0c
    INK = (255, 255, 255)
    SUB = (198, 195, 188)     # subline on solid black, one step below white
PAD = 72                      # left/right margin, unchanged from rev 10
PAD_TOP = 58                  # below the progress rule
PAD_BOT = 60
RULE_H = 6
LH1, LH2 = 70, 52
IDX_H = 42


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


SCRATCH = ImageDraw.Draw(Image.new("RGB", (W, H)))
F1, F2, FIDX, FMARK = font(58), dmsans(41), font(26), bric(24)
MAXW = W - PAD * 2


def cta_font(cta):
    """Shrink the tagline until it fits the measure, as rev 10 did."""
    sz = 64
    f = bric(sz)
    while SCRATCH.textlength(cta.upper(), font=f) > MAXW and sz > 24:
        sz -= 2
        f = bric(sz)
    return sz, f


def measure(c):
    """Text-block height for one card, excluding band padding."""
    l1 = wrap(SCRATCH, c["line1"].upper(), F1, MAXW)
    l2 = wrap(SCRATCH, c["line2"], F2, MAXW) if c.get("line2") else []
    h = IDX_H + len(l1) * LH1
    if l2:
        h += 14 + len(l2) * LH2
    if c.get("cta"):
        sz, _ = cta_font(c["cta"])
        h += 30 + sz + 8 + 16
    if c.get("mark"):
        h += 12 + 30
    return h, l1, l2


def plate(frame, ybias, xbias, lift, photo_h):
    """Crop and expose one Kendall frame to 1080 x photo_h. No darkening —
    the type lives in the band now, so the image never has to carry text."""
    src = glob.glob(os.path.join(DUMP, f"{frame}_*.jpg"))[0]
    im = Image.open(src).convert("RGB")
    s = max(W / im.width, photo_h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = max(0, min(im.width - W, int((im.width - W) * xbias)))
    top = max(0, min(im.height - photo_h, int((im.height - photo_h) * ybias)))
    im = im.crop((left, top, left + W, top + photo_h))
    if lift != 1.0:
        im = ImageEnhance.Brightness(im).enhance(lift)
        im = ImageEnhance.Contrast(im).enhance(1.06)
    return im


def render(c, idx, total, band_h):
    photo_h = H - band_h
    card = Image.new("RGB", (W, H), BAND)
    card.paste(plate(c["frame"], c["ybias"], c["xbias"], c["lift"], photo_h), (0, 0))
    dr = ImageDraw.Draw(card)

    # C: progress rule across the top edge of the band, filled to this slide.
    dr.rectangle([0, photo_h, W, photo_h + RULE_H], fill=TRACK)
    dr.rectangle([0, photo_h, int(W * idx / total), photo_h + RULE_H], fill=GOLD)

    block, l1, l2 = measure(c)
    center = c.get("center", False)
    # The band is uniform across all six, but the blocks are not — so centre
    # each block optically inside it. Top-aligning left the short cards (1 and
    # 5) with a slab of dead black under the type.
    y = photo_h + RULE_H + (band_h - RULE_H - block) // 2

    def cx(t, fnt):
        return (W - dr.textlength(t, font=fnt)) // 2 if center else PAD

    step = f"{idx:02d} / {total:02d}"
    dr.text((cx(step, FIDX), y), step, font=FIDX, fill=GOLD)
    y += IDX_H

    for ln in l1:
        dr.text((cx(ln, F1), y), ln, font=F1, fill=INK)
        y += LH1
    if l2:
        y += 14
        for ln in l2:
            dr.text((cx(ln, F2), y), ln, font=F2, fill=SUB)
            y += LH2
    if c.get("cta"):
        sz, fcta = cta_font(c["cta"])
        y += 30
        t = c["cta"].upper()
        xx = (W - dr.textlength(t, font=fcta)) // 2 if center else PAD
        dr.text((xx, y), t, font=fcta, fill=GOLD)
        bb = dr.textbbox((xx, y), t, font=fcta)
        dr.rectangle([bb[0], bb[3] + 8, bb[2], bb[3] + 12], fill=GOLD)
        y += sz + 8 + 16
    if c.get("mark"):
        y += 12
        m = "SHAVIT ROOTMAN"
        dr.text((cx(m, FMARK), y), m, font=FMARK, fill=GOLD)
    return card


# Copy and framing are rev 10's, approved by Shavit on 7/25 — only the skin
# changes here. lift is retained per-card because the interiors are dim; darken
# and the scrim fractions are gone with the scrim.
CARDS = [
    dict(frame="055", line1="This is what the process looks like.",
         line2="Kendall Street, South Bend, Indiana.",
         center=True, mark=True, ybias=0.30, xbias=0.45, lift=1.30),
    dict(frame="091", line1="We learn the house from the inside and out.",
         line2="Ceilings opened end to end before anything goes back.",
         ybias=0.34, xbias=0.50, lift=1.42),
    dict(frame="089", line1="We know what is behind every wall.",
         line2="Ladders, extraction gear, and a floor you cannot see.",
         ybias=0.26, xbias=0.36, lift=1.34),
    dict(frame="098", line1="So the family will never have to.",
         line2="New floor, new paint, new light, and a restored fireplace.",
         ybias=0.52, xbias=0.50, lift=1.12),
    dict(frame="073", line1="New floor. New light. New kitchen.",
         line2="A South Bend rebuild, finished top to bottom.",
         ybias=0.46, xbias=0.66, lift=1.14),
    dict(frame="019", line1="The work you never see is the work we sell.",
         line2="Kendall Street, South Bend, Indiana. Finished.",
         center=True, mark=True, cta="Live with us. Work with us.",
         ybias=0.20, xbias=0.50, lift=1.00),
]

# One band height for all six, so the baseline never moves between slides.
BAND_H = max(measure(c)[0] for c in CARDS) + RULE_H + PAD_TOP + PAD_BOT
print(f"uniform band: {BAND_H}px  ({round(100 * BAND_H / H)}% of frame)")

thumbs = []
for i, c in enumerate(CARDS, start=1):
    im = render(c, i, len(CARDS), BAND_H)
    im.save(os.path.join(OUT, f"{i:02d}_{c['frame']}.jpg"), quality=88)
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
