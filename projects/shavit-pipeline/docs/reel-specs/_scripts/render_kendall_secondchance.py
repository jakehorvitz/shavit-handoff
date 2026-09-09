#!/usr/bin/env python3
"""1919 Kendall — "Every home has a second chance", 10-slide carousel.

Supersedes the six-card "work you never see" set. Two things changed on the
8/2 call and in Shavit's 22:08 text:

  1. Shavit rewrote the copy slide by slide, ten slides, and sent it as one
     message. That text is reproduced VERBATIM in CARDS below — it is the
     source of truth, not this file's prose and not any spec HTML.
  2. "All the photos you have are from during the process." He asked for the
     before state added as ONE collage page, not seven separate slides:
     "I don't think people have the energy to go watch like seven before
     photos." Slide 2 is that collage.

Treatment is rev 11 in bone, not rev 12. Two reasons: reel_full.py records the
standing split ("Bone is the carousel treatment; the film system is black"),
and Shavit's new copy runs to three tiers on half the slides — type-on-ceiling
(rev 12) has nowhere to put that much text without covering the room.

Frame selection is deliberate about one thing: the dump contains several
photos of the prior occupants' belongings (051, 067, 069, 088, 097). None are
used. That is the same call that removed the dog-breeding slide from East
Victoria — the post is about the house, never about who lived in it.

Run: python3.13 render_kendall_secondchance.py
"""
import os, glob
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP = os.path.join(REEL, "kendall-2026-07-24", "_drive-dump")
OUT = os.path.join(REEL, "work-you-never-see-2026-07-24", "final-0803")
EV = os.path.join(REEL, "east-victoria-story-2026-07-23")
DMSANS = os.path.join(EV, "fonts", "DMSans.ttf")
BRIC = os.path.join(EV, "fonts", "Bricolage.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1350

GOLD = (176, 141, 87)      # brass — bright gold has no contrast on bone
TRACK = (214, 209, 198)
BAND = (237, 234, 227)
INK = (18, 18, 20)
SUB = (92, 89, 84)

PAD = 72
PAD_TOP = 52
PAD_BOT = 54
RULE_H = 6
LH1, LH2 = 62, 44
IDX_H = 40
GUTTER = 6                 # collage tile gap, bone shows through


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


def font(sz, bold=True):
    return _axes(ImageFont.truetype(SF, sz), sz, 820 if bold else 400)


def dmsans(sz):
    return _axes(ImageFont.truetype(DMSANS, sz), sz, 400)


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
F1, F2, FIDX, FMARK = font(54), dmsans(37), font(25), bric(23)
FCHIP = font(24)
MAXW = W - PAD * 2


def cta_font(cta):
    sz = 60
    f = bric(sz)
    while SCRATCH.textlength(cta.upper(), font=f) > MAXW and sz > 24:
        sz -= 2
        f = bric(sz)
    return sz, f


def measure(c):
    """Text-block height for one card, excluding band padding.

    Shavit's sublines are kept as separate paragraphs rather than joined,
    because on slides 3 and 6 they are lists ("Cabinets. Trim. Tile. Paint.
    Lighting.") whose line break is doing the work.
    """
    l1 = wrap(SCRATCH, c["line1"].upper(), F1, MAXW)
    subs = [wrap(SCRATCH, s, F2, MAXW) for s in c.get("subs", [])]
    h = IDX_H + len(l1) * LH1
    if subs:
        h += 14 + sum(len(s) for s in subs) * LH2
    if c.get("cta"):
        sz, _ = cta_font(c["cta"])
        h += 28 + sz + 8 + 14
    if c.get("mark"):
        h += 12 + 28
    return h, l1, subs


def plate(frame, ybias, xbias, lift, photo_h, zoom=1.0):
    """zoom > 1 scales past cover before cropping, so one frame can appear twice
    as two different pictures. Slide 9 reuses the cover exterior tight on the
    facade — Jake, 8/3, after Shavit rejected a before photo leading."""
    src = glob.glob(os.path.join(DUMP, f"{frame}_*.jpg"))[0]
    im = Image.open(src).convert("RGB")
    s = max(W / im.width, photo_h / im.height) * zoom
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = max(0, min(im.width - W, int((im.width - W) * xbias)))
    top = max(0, min(im.height - photo_h, int((im.height - photo_h) * ybias)))
    im = im.crop((left, top, left + W, top + photo_h))
    if lift != 1.0:
        im = ImageEnhance.Brightness(im).enhance(lift)
        im = ImageEnhance.Contrast(im).enhance(1.06)
    return im


def collage(frames, photo_h, cols=3, rows=3):
    """The before state as one page. Nine frames, 3x3, bone gutters.

    Shavit: "maybe you can add a collage of them ... I don't think people have
    the energy to go watch like seven before photos."

    3x3 rather than 3x2 because the photo area is 1080 x 866, so a nine-up tile
    is 356 x 285 — an aspect of 1.25 against the source photos' 1.33. Almost no
    crop. A 3x2 tile would be 1.25 wide-to-tall the other way and gut them.
    """
    sheet = Image.new("RGB", (W, photo_h), BAND)
    tw = (W - (cols - 1) * GUTTER) // cols
    th = (photo_h - (rows - 1) * GUTTER) // rows
    for i, (frame, ybias, xbias, lift) in enumerate(frames[: cols * rows]):
        src = glob.glob(os.path.join(DUMP, f"{frame}_*.jpg"))[0]
        im = Image.open(src).convert("RGB")
        s = max(tw / im.width, th / im.height)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        left = max(0, min(im.width - tw, int((im.width - tw) * xbias)))
        top = max(0, min(im.height - th, int((im.height - th) * ybias)))
        im = im.crop((left, top, left + tw, top + th))
        if lift != 1.0:
            im = ImageEnhance.Brightness(im).enhance(lift)
            im = ImageEnhance.Contrast(im).enhance(1.05)
        x = (i % cols) * (tw + GUTTER)
        y = (i // cols) * (th + GUTTER)
        sheet.paste(im, (x, y))
    return sheet


def chip(dr, text):
    """Small brass chip, top-left of the photo. Only the collage gets one —
    without it the grid reads as 'after' thumbnails."""
    pad_x, pad_y = 16, 9
    tw = dr.textlength(text, font=FCHIP)
    dr.rectangle([PAD, 40, PAD + tw + pad_x * 2, 40 + 24 + pad_y * 2], fill=GOLD)
    dr.text((PAD + pad_x, 40 + pad_y - 2), text, font=FCHIP, fill=(255, 255, 255))


def render(c, idx, total, band_h):
    photo_h = H - band_h
    card = Image.new("RGB", (W, H), BAND)
    if c.get("collage"):
        card.paste(collage(c["collage"], photo_h), (0, 0))
    else:
        card.paste(plate(c["frame"], c["ybias"], c["xbias"], c["lift"], photo_h,
                         c.get("zoom", 1.0)), (0, 0))
    dr = ImageDraw.Draw(card)
    if c.get("chip"):
        chip(dr, c["chip"])

    dr.rectangle([0, photo_h, W, photo_h + RULE_H], fill=TRACK)
    dr.rectangle([0, photo_h, int(W * idx / total), photo_h + RULE_H], fill=GOLD)

    block, l1, subs = measure(c)
    center = c.get("center", False)
    y = photo_h + RULE_H + (band_h - RULE_H - block) // 2

    def cx(t, fnt):
        return (W - dr.textlength(t, font=fnt)) // 2 if center else PAD

    step = f"{idx:02d} / {total:02d}"
    dr.text((cx(step, FIDX), y), step, font=FIDX, fill=GOLD)
    y += IDX_H

    for ln in l1:
        dr.text((cx(ln, F1), y), ln, font=F1, fill=INK)
        y += LH1
    if subs:
        y += 14
        for para in subs:
            for ln in para:
                dr.text((cx(ln, F2), y), ln, font=F2, fill=SUB)
                y += LH2
    if c.get("cta"):
        sz, fcta = cta_font(c["cta"])
        y += 28
        t = c["cta"].upper()
        xx = (W - dr.textlength(t, font=fcta)) // 2 if center else PAD
        dr.text((xx, y), t, font=fcta, fill=GOLD)
        # Anchor the rule off the type size, not textbbox. Bricolage reports a
        # tight cap-height box, so bb[3] lands mid-glyph and the rule reads as
        # a strikethrough through the tagline.
        rule_y = y + int(sz * 1.12)
        dr.rectangle([xx, rule_y, xx + dr.textlength(t, font=fcta), rule_y + 4],
                     fill=GOLD)
        y += sz + 8 + 14
    if c.get("mark"):
        y += 12
        m = "SHAVIT ROOTMAN"
        dr.text((cx(m, FMARK), y), m, font=FMARK, fill=GOLD)
    return card


# Six before rooms, chosen to cover the whole house without showing a single
# belonging: old kitchen, living room, sunroom, bath, and two bedrooms. The
# before exterior is NOT here — it now carries slide 2 on its own, which is
# where Jake put it (8/3) so the before never leads but still reads as the
# reveal directly under "second chance".
# Ordered outside-in and read left to right: exterior, then the rooms you walk
# through, then the bedrooms. Jake, 8/3: the before exterior comes back off its
# own slide and into here, plus two more so the grid fills evenly.
BEFORE_TILES = [
    ("004", 0.44, 0.50, 1.06),   # exterior, blue-grey siding, overgrown beds
    ("045", 0.42, 0.50, 1.12),   # original kitchen, wood cabinets
    ("102", 0.44, 0.50, 1.10),   # living room, drop ceiling, brick fireplace
    ("038", 0.40, 0.50, 1.06),   # sunroom, red floor, red-trim windows
    ("033", 0.46, 0.52, 1.22),   # original bath, wood wainscot
    ("043", 0.46, 0.50, 1.16),   # two-tone wainscot room, pass-through
    ("006", 0.44, 0.50, 1.30),   # bedroom, dark green carpet
    ("084", 0.44, 0.50, 1.14),   # bedroom, yellow wall, dark carpet
    ("087", 0.46, 0.50, 1.14),   # carpeted room, built-in shelving
]

# Copy is Shavit's, verbatim from his 8/2 22:08 text. Do not paraphrase it here.
CARDS = [
    # Jake, 8/3: "no addresses". House number off, street name stays — that is
    # the standing no-house-numbers rule (reel_full.py), same as East Victoria.
    # Jake, 8/3: cover is the place, the thesis lands second, then we go into it.
    # Splitting these two also gives the before exterior somewhere to live that
    # is not the cover, which was Shavit's objection.
    dict(frame="019", line1="Every home has a second chance.",
         subs=["Kendall Street. South Bend, Indiana."],
         center=True, mark=True, ybias=0.44, xbias=0.50, lift=1.02),

    # Shavit's original running order, restored. The only departure is the
    # photography: slide 1 is the FINISHED exterior, because he rejected a
    # before photo leading, and the before exterior moved into this collage.
    dict(collage=BEFORE_TILES, chip="BEFORE",
         line1="We do not start with paint.",
         subs=["We begin by understanding the structure, the systems, "
               "and everything behind the walls."]),

    dict(frame="078", line1="Every decision has a purpose.",
         subs=["Electrical. Plumbing. HVAC. Insulation. Framing.",
               "If it matters to the family living here, it matters to us."],
         ybias=0.42, xbias=0.06, lift=1.46),

    dict(frame="091", line1="Quality is built long before the finishes.",
         subs=["The best renovations are not measured by what you can see. "
               "They are measured by what will never become a problem later."],
         ybias=0.34, xbias=0.50, lift=1.40),

    dict(frame="026", line1="Then we rebuild.",
         subs=["New layout. New kitchen. New flooring. New lighting.",
               "Every improvement is intentional."],
         ybias=0.40, xbias=0.50, lift=1.16),

    dict(frame="066", line1="Every detail represents a decision.",
         subs=["Cabinets. Trim. Tile. Paint. Lighting.",
               "Hundreds of decisions come together to create one home."],
         ybias=0.46, xbias=0.50, lift=1.02),

    dict(frame="060", line1="The goal is simple.",
         subs=["Build a home we would proudly hand to our own family.",
               "Nothing less."],
         ybias=0.40, xbias=0.50, lift=1.00),

    dict(frame="018", line1="When the work is finished,",
         subs=["the renovation disappears.",
               "What remains is a home that feels natural, comfortable, "
               "and ready for its next chapter."],
         ybias=0.46, xbias=0.44, lift=1.04),

    # Jake, 8/3: "don't reuse the same image" — so the exterior appears once, on
    # the cover. 030 carries this line instead: the front windows look straight
    # out at the neighbouring houses, which is the literal picture of
    # "strengthen neighborhoods", and it repeats no other room in the deck.
    dict(frame="030", line1="This is why we invest.",
         subs=["Not simply to renovate houses.",
               "To strengthen neighborhoods, preserve housing, and create "
               "places families are proud to call home."],
         ybias=0.46, xbias=0.50, lift=1.02),

    dict(frame="098", line1="One home. One family. One neighborhood at a time.",
         # Jake, 8/3. Replaced "South Bend's 46613 and 46614" — the ZIPs were
         # Shavit's, unverified, and read as a service-area callout.
         subs=["Proudly revitalizing South Bend, Indiana."],
         center=True, mark=True, cta="Live with us. Work with us.",
         ybias=0.44, xbias=0.50, lift=1.02),
]

BAND_H = max(measure(c)[0] for c in CARDS) + RULE_H + PAD_TOP + PAD_BOT
print(f"uniform band: {BAND_H}px  ({round(100 * BAND_H / H)}% of frame)")

thumbs = []
for i, c in enumerate(CARDS, start=1):
    im = render(c, i, len(CARDS), BAND_H)
    tag = "collage" if c.get("collage") else c["frame"]
    im.save(os.path.join(OUT, f"{i:02d}_{tag}.jpg"), quality=90)
    print(f"card {i:2d}  {tag:8s}  {c['line1'][:52]}")
    t = im.copy()
    t.thumbnail((330, 330))
    thumbs.append(t)

cols, pad = 4, 10
rows = -(-len(thumbs) // cols)          # was hardcoded to 2, which dropped slide 11
tw, th = thumbs[0].width, thumbs[0].height
sheet = Image.new("RGB", (cols * (tw + pad) + pad, rows * (th + pad) + pad), "#111111")
for i, t in enumerate(thumbs):
    sheet.paste(t, (pad + (i % cols) * (tw + pad), pad + (i // cols) * (th + pad)))
sheet.save(os.path.join(OUT, "REVIEW-sheet.jpg"), quality=88)
print("wrote", OUT)
