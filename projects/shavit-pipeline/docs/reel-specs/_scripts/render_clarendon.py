#!/usr/bin/env python3
"""Clarendon Road — 10-slide carousel, copy is Shavit's docx 2 wording only.

rev 3 (2026-08-21, Jake's six voice notes on the rendered rev 2, transcribed in
final/ANNOTATIONS-2026-08-21.md):
  * cover A stays; 01b is rendered but leaves the send set.
  * slide 02 is the BEFORE collage (the rev 2 ALT_02 layout) INSIDE the deck.
  * slides 03 to 07 are SPLIT frames: before LEFT, after RIGHT, bone gutter,
    brass BEFORE / AFTER chips, one per docx BEFORE & AFTER category.
  * slide 10 closes on the exterior at a visibly different crop from 01
    (tight on porch, entry and gable). Jake's call: the exterior appears twice.
The renderer is rev 2's, extended: split() sits next to collage(); nothing
in the bone treatment, fonts, colours, band/rule metrics or chips changed.

Copied originally from render_kendall_secondchance.py (the shipped Kendall
deck, 8/3). COPY RULE (Jake, voice note on the spec, 8/21 01:11): every line on
every slide is a sentence or phrase of Shavit's, VERBATIM from his second
case-study docx (8/20 21:08; text at shavit-rootman-website/docs/tasks/sources/
clarendon-docx-2-rd-case-study-0820-9pm.txt, referenced below as L<n>), trimmed
for length or with a dollar figure, percentage or the house number removed, but
never rewritten, reordered within a sentence, or composed. The only non-docx
words are the standing end card (Live with us. Work with us.), the
"Proudly revitalizing Cleveland Heights, Ohio." close, the chips and the mark.

Photo rules (see FRAMES.md):
  * real photographs only; nothing generated. The MLS-watermarked befores are
    in the deck by Jake's decision (slide 02 collage, 03 to 07 left halves),
    watermark cropped out; confirming the rights with Shavit is on the list.
  * the only exterior (IMG_7691) appears on 01 and, at a different crop, 10.
  * no other frame is used twice; near-duplicate pairs count as one.
  * the person at the left edge of unit1-bedroom-before is excluded by crop
    wherever that file appears. No tenants' belongings in the AFTER frames.

Run: python3.13 render_clarendon.py          (system python3 has no Pillow)
"""
import os
import re
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# READ-ONLY. Never write into the website repo.
DROP = os.path.expanduser(
    "~/projects/shavit-rootman-website/docs/case-studies/clarendon-3220/_drop")
OUT = os.path.join(REEL, "clarendon-ig-2026-08-20", "final")
FB_OUT = os.path.join(REEL, "clarendon-ig-2026-08-20", "fb")
EV = os.path.join(REEL, "east-victoria-story-2026-07-23")
DMSANS = os.path.join(EV, "fonts", "DMSans.ttf")
BRIC = os.path.join(EV, "fonts", "Bricolage.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"
os.makedirs(OUT, exist_ok=True)
os.makedirs(FB_OUT, exist_ok=True)

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
GUTTER = 6                 # collage / split gap, bone shows through
HALF = (W - GUTTER) // 2   # 537: one half of a split frame


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
    """Text-block height for one card, excluding band padding."""
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


def load(rel):
    """Open a drop photo by path relative to DROP. .jpeg and .png both occur."""
    return Image.open(os.path.join(DROP, rel)).convert("RGB")


def fit(im, w, h, ybias, xbias, lift, zoom=1.0, wm_crop=0.0):
    """Cover-fit one PIL image into w x h. wm_crop trims that fraction off the
    BOTTOM first (the MLS Now watermark lives in the bottom-left corner of
    every before). zoom > 1 scales past cover before cropping."""
    if wm_crop:
        im = im.crop((0, 0, im.width, int(im.height * (1 - wm_crop))))
    s = max(w / im.width, h / im.height) * zoom
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = max(0, min(im.width - w, int((im.width - w) * xbias)))
    top = max(0, min(im.height - h, int((im.height - h) * ybias)))
    im = im.crop((left, top, left + w, top + h))
    if lift != 1.0:
        im = ImageEnhance.Brightness(im).enhance(lift)
        im = ImageEnhance.Contrast(im).enhance(1.06)
    return im


def plate(rel, ybias, xbias, lift, photo_h, zoom=1.0):
    return fit(load(rel), W, photo_h, ybias, xbias, lift, zoom)


def collage(frames, photo_h, cols=3, rows=3, wm_crop=0.0):
    """The before state as one page, bone gutters. Kendall's code, plus wm_crop.
    4 x 2 here rather than 3 x 3 because eight befores are usable and the tile
    (265 x 430) is close to their portrait aspect."""
    sheet = Image.new("RGB", (W, photo_h), BAND)
    tw = (W - (cols - 1) * GUTTER) // cols
    th = (photo_h - (rows - 1) * GUTTER) // rows
    for i, (rel, ybias, xbias, lift) in enumerate(frames[: cols * rows]):
        im = fit(load(rel), tw, th, ybias, xbias, lift, wm_crop=wm_crop)
        x = (i % cols) * (tw + GUTTER)
        y = (i // cols) * (th + GUTTER)
        sheet.paste(im, (x, y))
    return sheet


def split(before, after, photo_h, b, a, wm_crop=0.0):
    """rev 3. Before LEFT, after RIGHT, one bone gutter between, inside the
    same W x photo_h photo area. Instagram has no motion in a carousel, so the
    before-to-after read Jake asked for (notes on slides 03 and 04) is one
    frame. b and a are (ybias, xbias, lift) for each half. The before halves
    are 576 x 768 portraits: wm_crop takes the watermark off the bottom, then
    they cover 537 x 866 at ~1.2x. The after halves are 6000 x 4000 landscapes
    (or the one portrait bath frame) centre-cropped to 537 x 866; xbias picks
    the slice so the fixture that matters is whole."""
    sheet = Image.new("RGB", (W, photo_h), BAND)
    left = fit(load(before), HALF, photo_h, *b, wm_crop=wm_crop)
    right = fit(load(after), W - HALF - GUTTER, photo_h, *a)
    sheet.paste(left, (0, 0))
    sheet.paste(right, (HALF + GUTTER, 0))
    return sheet


def chip(dr, text, x=PAD):
    """Small brass chip, top-left of a photo area. The collage gets BEFORE; each
    half of a split gets its own (BEFORE at x=PAD, AFTER at the right half's
    PAD). Without them the grid / the halves read as after thumbnails."""
    pad_x, pad_y = 16, 9
    tw = dr.textlength(text, font=FCHIP)
    dr.rectangle([x, 40, x + tw + pad_x * 2, 40 + 24 + pad_y * 2], fill=GOLD)
    dr.text((x + pad_x, 40 + pad_y - 2), text, font=FCHIP, fill=(255, 255, 255))


def render(c, idx, total, band_h):
    photo_h = H - band_h
    card = Image.new("RGB", (W, H), BAND)
    if c.get("collage"):
        cols, rows = c.get("collage_grid", (3, 3))
        card.paste(collage(c["collage"], photo_h, cols, rows,
                           c.get("wm_crop", 0.0)), (0, 0))
    elif c.get("split"):
        before, after = c["split"]
        card.paste(split(before, after, photo_h, c["b"], c["a"],
                         c.get("wm_crop", 0.0)), (0, 0))
    else:
        card.paste(plate(c["frame"], c["ybias"], c["xbias"], c["lift"], photo_h,
                         c.get("zoom", 1.0)), (0, 0))
    dr = ImageDraw.Draw(card)
    if c.get("chip"):
        chip(dr, c["chip"])
    if c.get("split"):
        chip(dr, "BEFORE", PAD)
        chip(dr, "AFTER", HALF + GUTTER + PAD)

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


# ---------------------------------------------------------------------------
# Slide 02. Eight MLS befores, watermark cropped, 4 x 2. unit1-bedroom has a
# person at the far left edge of the frame; xbias 1.0 pushes the tile crop to
# the right-hand side of the source so the person falls outside the tile.
BEFORE_TILES = [
    ("before/unit1-kitchen-before.jpeg",          0.40, 0.50, 1.00),
    ("before/unit1-common-before.jpeg",           0.40, 0.50, 1.00),
    ("before/unit1-bedroom-before.jpeg",          0.40, 1.00, 1.00),
    ("before/unit2-common-or-bedroom-before-a.jpeg", 0.40, 0.50, 1.00),
    ("before/unit2-common-or-bedroom-before-b.jpeg", 0.40, 0.50, 1.00),
    ("before/unit3-before-a.jpeg",                0.40, 0.50, 1.06),
    ("before/unit3-before-b.jpeg",                0.40, 0.50, 1.10),
    # basement tile biased LEFT: an ambiguous dark shape at the right edge of
    # the source could read as a figure at thumbnail size; xbias 0.0 keeps the
    # window, the pipes and the washer and drops that edge.
    ("before/basement-before.jpeg",               0.40, 0.00, 1.25),
]

# Two headline options for slide 01, both Shavit's lines verbatim. Jake (8/21
# 09:06) chose A; 01b is still rendered for the record but leaves the send set.
HEADLINE_A = ("A complete multifamily transformation using the BRRRR "
              "investment strategy.")                               # docx L4
HEADLINE_B = "Created homes that we would be proud to live in ourselves."  # L72

EXTERIOR = "after-exterior/exterior-after.jpeg"   # IMG_7691, 886 x 886, the only one


def cover(line1):
    # ybias 0.12 keeps a sliver of sky above the gable peak; the crop comes out
    # of the lawn, not the house. Upscaled 1.22x. The house number on the porch
    # post is sub-legible at this size; see NOTES.txt.
    return dict(frame=EXTERIOR, line1=line1,
                # L2 "3220 CLARENDON ROAD" with the house number removed,
                # then L3 "Cleveland Heights, Ohio".
                subs=["Clarendon Road. Cleveland Heights, Ohio."],
                center=True, mark=True, ybias=0.12, xbias=0.50, lift=1.00,
                tag="exterior")


WHAT_IT_WAS = dict(
    # L23, head trimmed ("We acquired 3220 Clarendon Road in late 2025 as").
    line1="A vacant triplex in poor but inhabitable condition.",
    # L23 second sentence, head trimmed; then L74 verbatim.
    subs=["Its location within Cleveland Heights and proximity to the "
          "medical, educational, and employment centers surrounding "
          "University Circle.",
          "Acquired: Late 2025."])

WM = 0.06   # fraction trimmed off the bottom of each before in a split half

CARDS = [
    cover(HEADLINE_A),

    # 02 — the before collage, in the deck (Jake 09:07 / 09:09: "this is
    # exactly what I'm talking about for slide two").
    dict(collage=BEFORE_TILES, collage_grid=(4, 2), wm_crop=0.09,
         chip="BEFORE", tag="before-collage", **WHAT_IT_WAS),

    # 03 — KITCHENS. L49 header, L50 verbatim. Before: the downstairs kitchen
    # (oak cabinets, green walls). After: img_3052, the slice that holds the
    # sink, the range and the microwave whole.
    dict(split=("before/unit1-kitchen-before.jpeg", "after-unit1/img_3052.jpeg"),
         b=(0.50, 0.50, 1.00), a=(0.50, 0.65, 1.00), wm_crop=WM,
         tag="split-kitchen",
         line1="Kitchens.",
         subs=["The kitchens were modernized with cohesive finishes, updated "
               "cabinetry and surfaces, new fixtures, appliances, lighting, "
               "and durable flooring designed for long-term rental use."]),

    # 04 — BATHROOMS. L51 header, L52 verbatim. Before: the bathroom among the
    # unit3 befores (clawfoot tub, curtain, toilet). After: the one portrait
    # after frame in the drop, dsc06937 (glass shower, hex floor, vanity,
    # window), which fits a 537 x 866 half almost uncropped.
    dict(split=("before/unit3-before-b.jpeg", "after-unit3/dsc06937.jpeg"),
         b=(0.50, 0.55, 1.10), a=(0.50, 0.50, 1.00), wm_crop=WM,
         tag="split-bath",
         line1="Bathrooms.",
         subs=["Bathrooms throughout the property received substantial "
               "updates, replacing dated finishes with clean, durable "
               "materials and modern fixtures consistent with the standards "
               "used throughout our portfolio."]),

    # 05 — LIVING AREAS. L53 header; L54 first sentence; L54 tail. Before: the
    # downstairs living room (couch, plants at the window wall). After: the
    # three front windows slice of img_3045.
    dict(split=("before/unit1-common-before.jpeg", "after-unit1/img_3045.jpeg"),
         b=(0.50, 0.50, 1.00), a=(0.50, 1.00, 1.00), wm_crop=WM,
         tag="split-living",
         line1="Living areas.",
         subs=["Living areas were refreshed with new flooring, drywall "
               "repairs, paint, lighting, and finish work.",
               "A consistent standard throughout the building."]),

    # 06 — BEDROOMS as a split (there is no hallway/stair before, so the
    # after-only stair frame is dropped; see NOTES). Before: the unit2 bedroom
    # (bed, stuffed animals). After: img_3040, door and small windows slice.
    # Copy is his, true of bedrooms: L54 second sentence trimmed at both ends
    # ("to create | comfortable and functional homes | with a consistent ...")
    # and the tail of L34.
    dict(split=("before/unit2-common-or-bedroom-before-b.jpeg",
                "after-unit1/img_3040.jpeg"),
         b=(0.50, 0.50, 1.00), a=(0.50, 0.45, 1.00), wm_crop=WM,
         tag="split-bedroom",
         line1="Comfortable and functional homes.",
         subs=["Durable materials, cohesive finishes, functional layouts, "
               "and an emphasis on creating housing we would be comfortable "
               "living in ourselves."]),

    # 07 — BASEMENT & MECHANICAL SYSTEMS. L57 header; L58 both sentences with
    # their tails trimmed. Before: the dark basement laundry. After: the
    # CleanShot laundry frame, the slice with the sink, the panel and the PEX.
    dict(split=("before/basement-before.jpeg", "after-basement/basement-after-b.png"),
         b=(0.50, 0.50, 1.30), a=(0.50, 1.00, 1.00), wm_crop=WM,
         tag="split-basement",
         line1="Basement & mechanical systems.",
         subs=["The basement underwent substantial cleanup and moisture "
               "treatment.",
               "Mechanical and plumbing systems were also substantially "
               "improved."]),

    # 08 — the after. L36 with the dollar figures removed; L37 first sentence;
    # L76 verbatim. The one frame that shows a whole unit.
    dict(frame="after-unit3/ea720a197c48.png", ybias=0.50, xbias=0.50,
         lift=1.00, tag="unit3-wide",
         line1="Following renovation, the three units were leased.",
         subs=["The property attracted tenants including medical residents "
               "relocating from outside the area.",
               "Leased / Stabilized: June 2026."]),

    # 09 — the hold. L64 head; L43 with the house number removed.
    dict(frame="after-unit1/img_3048.jpeg", ybias=0.50, xbias=0.50, lift=1.00,
         tag="img_3048",
         line1="Refinancing rather than selling.",
         subs=["Rather than selling the property and realizing the value "
               "created as a one-time gain, we retained Clarendon Road as "
               "part of the long-term portfolio."]),

    # 10 — close on the exterior (Jake 09:08). Same IMG_7691 as the cover.
    # Jake 09:4x voice: the house at the end must be front and center, so this
    # is the cover framing (whole house, centred), not the tight porch crop; the
    # lift is the only difference and he has accepted the reuse.
    # L78 trimmed at both ends; then the standing close, tagline and mark,
    # Kendall 10 structure.
    dict(frame=EXTERIOR, zoom=1.0, ybias=0.12, xbias=0.50, lift=1.04,
         tag="exterior-close",
         line1="Fully leased, refinanced, and professionally managed.",
         subs=["Proudly revitalizing Cleveland Heights, Ohio."],
         center=True, mark=True, cta="Live with us. Work with us."),
]

ALT_COVER = cover(HEADLINE_B)   # 01b, rendered for the record, not in the send set

# Uniform band across every card INCLUDING 01b, so it drops in without the
# rule moving.
BAND_H = max(measure(c)[0] for c in CARDS + [ALT_COVER]) \
    + RULE_H + PAD_TOP + PAD_BOT
print(f"uniform band: {BAND_H}px  ({round(100 * BAND_H / H)}% of frame)")
for i, c in enumerate(CARDS + [ALT_COVER], start=1):
    blk, l1, subs = measure(c)
    print(f"  block {i:2d}: {blk:3d}px  hl {len(l1)} line(s), "
          f"sub {sum(len(s) for s in subs)} line(s)")

# Clear stale slide files from earlier revisions (tags changed), so the
# directory holds exactly this render.
for f in os.listdir(OUT):
    if re.match(r"^(\d\d_|01b_|ALT_).*\.jpg$", f):
        os.remove(os.path.join(OUT, f))

N = len(CARDS)
pages, thumbs = [], []


def thumb(im, label):
    t = im.copy()
    t.thumbnail((330, 330))
    thumbs.append((t, label))


for i, c in enumerate(CARDS, start=1):
    im = render(c, i, N, BAND_H)
    name = f"{i:02d}_{c['tag']}.jpg"
    im.save(os.path.join(OUT, name), quality=90)
    print(f"card {i:2d}  {c['tag']:14s}  {c['line1'][:52]}")
    pages.append(im)
    thumb(im, f"{i:02d}")

# 01b — the second headline, same frame, same band. Kept on disk for the
# record; not in the MASTER, not copied to the Desktop set (Jake 09:06).
im = render(ALT_COVER, 1, N, BAND_H)
im.save(os.path.join(OUT, "01b_exterior.jpg"), quality=90)
print(f"card 01b {ALT_COVER['line1']}  (not in send set)")
thumb(im, "01b (not sent)")

# MASTER.pdf — the ten numbered slides, option A cover.
pdf = os.path.join(OUT, "Clarendon-Carousel-MASTER.pdf")
pages[0].save(pdf, "PDF", save_all=True, append_images=pages[1:], resolution=96)
print("wrote", pdf)

# REVIEW-sheet — 4 across, labelled.
cols, pad, lab = 4, 10, 24
rows = -(-len(thumbs) // cols)
tw, th = thumbs[0][0].width, thumbs[0][0].height
sheet = Image.new("RGB", (cols * (tw + pad) + pad, rows * (th + pad + lab) + pad),
                  "#111111")
sd = ImageDraw.Draw(sheet)
for i, (t, label) in enumerate(thumbs):
    x = pad + (i % cols) * (tw + pad)
    y = pad + (i // cols) * (th + pad + lab)
    sheet.paste(t, (x, y))
    sd.text((x + 2, y + th + 4), label, font=FIDX, fill=GOLD)
sheet.save(os.path.join(OUT, "REVIEW-sheet.jpg"), quality=88)

# Facebook exports — unchanged from rev 2: landscape, <= 2048 wide, exterior
# then rooms, no befores. The exterior is square at 886 px; exported native.
FB = [
    ("after-exterior/exterior-after.jpeg", "01_exterior"),
    ("after-unit2/dsc09409.jpeg",          "02_kitchen"),
    ("after-unit1/img_3041.jpeg",          "03_front-room"),
    ("after-unit1/dsc09364.jpeg",          "04_bathroom"),
    ("after-unit3/dsc06916.jpeg",          "05_upper-kitchen"),
]
for rel, name in FB:
    im = load(rel)
    if im.width > 2048:
        s = 2048 / im.width
        im = im.resize((2048, round(im.height * s)), Image.LANCZOS)
    im.save(os.path.join(FB_OUT, f"{name}.jpg"), quality=90)
    print(f"fb  {name:18s} {im.width}x{im.height}")

print("wrote", OUT)
print("wrote", FB_OUT)
