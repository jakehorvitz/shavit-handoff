#!/usr/bin/env python3
"""Howder Unit B — story carousel in the Clarendon deck language (rev 1, 8/24).

Copied from render_clarendon.py (the shipped 8/23 Clarendon deck); nothing in
the bone treatment, fonts, colours, band/rule metrics or chips changed. COPY
RULE (Jake, 8/21 01:11): every line on every slide is a sentence or phrase of
Shavit's, VERBATIM, trimmed for length only — here from his 7/15 iMessage story
(r134081), his 7/14 naming text (r134032) and his 8/24 texts (r139096/r139112).
Source file: shavit-rootman-website/docs/tasks/sources/
howder-imessage-story-sources-2026-08-24.txt. The only non-Shavit words are the
standing end card (Live with us. Work with us.), the chips and the mark.

Photo rules:
  * real photographs only. Befores are Shavit's own mid-rehab shots of Unit 2
    (assets/43-howder/unit2/raw, cataloged 7/13) — no MLS watermarks, wm_crop=0.
  * afters are the regraded 8/24 MLS set (photos/43-howder-unit2/full).
  * PAIRING CAVEAT: the befores are gut-stage frames; which gutted room became
    which finished room is NOT verifiable from the photos. The three splits are
    stage-representative and Shavit must confirm them at verify.
  * the exterior (website howder-street/01.jpg) appears on 01 and, at a
    different crop, on the close — the Clarendon precedent Jake accepted.

Run: python3.13 render_howder_unitb.py          (system python3 has no Pillow)
"""
import os
import re
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(os.path.dirname(REEL))
BEFORE = os.path.join(REPO, "assets", "43-howder", "unit2", "raw")
AFTER = os.path.join(REPO, "photos", "43-howder-unit2", "full")
# READ-ONLY. Never write into the website repo.
EXTERIOR = os.path.expanduser(
    "~/projects/shavit-rootman-website/site/public/assets/properties/howder-street/01.jpg")
OUT = os.path.join(REPO, "docs", "howder-unit-b-post-spec", "final")
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
GUTTER = 6
HALF = (W - GUTTER) // 2


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
# bold spec line (r15): DM Sans 700, drawn in INK — a sub wrapped in **...**
F2B = _axes(ImageFont.truetype(DMSANS, 37), 37, 700)
FCHIP = font(24)
MAXW = W - PAD * 2


def subfont(s):
    """A sub written as **text** renders bold in ink; plain subs stay F2/SUB."""
    if s.startswith("**") and s.endswith("**"):
        return s[2:-2], F2B, INK
    return s, F2, SUB


def cta_font(cta):
    sz = 60
    f = bric(sz)
    while SCRATCH.textlength(cta.upper(), font=f) > MAXW and sz > 24:
        sz -= 2
        f = bric(sz)
    return sz, f


def measure(c):
    l1 = wrap(SCRATCH, c["line1"].upper(), F1, MAXW)
    subs = [wrap(SCRATCH, subfont(s)[0], subfont(s)[1], MAXW)
            for s in c.get("subs", [])]
    h = IDX_H + len(l1) * LH1
    if subs:
        h += 14 + sum(len(s) for s in subs) * LH2
    if c.get("cta"):
        sz, _ = cta_font(c["cta"])
        h += 28 + sz + 8 + 14
    if c.get("mark"):
        h += 12 + 28
    return h, l1, subs


def load(path):
    """Absolute path in, RGB out — befores, afters and the exterior live in
    three different roots, so cards carry full paths."""
    return Image.open(path).convert("RGB")


def fit(im, w, h, ybias, xbias, lift, zoom=1.0, wm_crop=0.0):
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


def plate(path, ybias, xbias, lift, photo_h, zoom=1.0):
    return fit(load(path), W, photo_h, ybias, xbias, lift, zoom)


def collage(frames, photo_h, cols=3, rows=3, wm_crop=0.0):
    sheet = Image.new("RGB", (W, photo_h), BAND)
    tw = (W - (cols - 1) * GUTTER) // cols
    th = (photo_h - (rows - 1) * GUTTER) // rows
    for i, (path, ybias, xbias, lift) in enumerate(frames[: cols * rows]):
        im = fit(load(path), tw, th, ybias, xbias, lift, wm_crop=wm_crop)
        x = (i % cols) * (tw + GUTTER)
        y = (i // cols) * (th + GUTTER)
        sheet.paste(im, (x, y))
    return sheet


def split(before, after, photo_h, b, a, wm_crop=0.0):
    sheet = Image.new("RGB", (W, photo_h), BAND)
    left = fit(load(before), HALF, photo_h, *b, wm_crop=wm_crop)
    right = fit(load(after), W - HALF - GUTTER, photo_h, *a)
    sheet.paste(left, (0, 0))
    sheet.paste(right, (HALF + GUTTER, 0))
    return sheet


def chip(dr, text, x=PAD):
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
        for src in c.get("subs", []):
            t, f, col = subfont(src)
            for ln in wrap(dr, t, f, MAXW):
                dr.text((cx(ln, f), y), ln, font=f, fill=col)
                y += LH2
    if c.get("cta"):
        sz, fcta = cta_font(c["cta"])
        y += 28
        t = c["cta"].upper()
        xx = (W - dr.textlength(t, font=fcta)) // 2 if center else PAD
        dr.text((xx, y), t, font=fcta, fill=GOLD)
        rule_y = y + int(sz * 1.12)
        dr.rectangle([xx, rule_y, xx + dr.textlength(t, font=fcta), rule_y + 4],
                     fill=GOLD)
        y += sz + 8 + 14
    if c.get("mark"):
        y += 12
        m = "SHAVIT ROOTMAN"
        dr.text((cx(m, FMARK), y), m, font=FMARK, fill=GOLD)
    return card


def bef(name):
    return os.path.join(BEFORE, name)


def aft(name):
    return os.path.join(AFTER, name)


# Shavit's professional finals on the live site gallery. READ-ONLY.
SITE = os.path.expanduser(
    "~/projects/shavit-rootman-website/site/public/assets/properties/howder-b")


def site(name):
    return os.path.join(SITE, name)


# ---------------------------------------------------------------------------
# rev 2 (Jake, 8/25 12:20 AM): only BEFORE photos in each square — one full-
# bleed mid-rehab frame per slide, no splits, no afters in the middle. Band
# line1s follow the CASE-STUDY register (norwood-60 "Condition at Acquisition"
# captions: documentary, specific to the frame); subs stay Shavit's r134081
# sentences verbatim. The line1 captions are composed in that register and are
# on the confirm list.
#
# rev 7 (Shavit 8/25 06:40 "We already uploaded a post of the other unit, so
# the language has to be cohesive to both" + Jake "use the 43 Howder language
# we used previously"): every composed case-study line1 is OUT. All line1s and
# subs are now verbatim (trim-only) from the PUBLISHED 7/15 Unit 1 post
# (instagram.com/shavitness/reel/Da00jY0hkY8, pulled live 8/25) plus his 7/13
# reel-caption notes (kitchen plate copy) and his 8/24 texts. One splice:
# "wasn't" -> "was not" on 02 per the standing no-contraction style; flagged
# for verify.
#
# rev 15 (Shavit, call + iMessage 8/25 12:44 PM): FULL COPY REPLACEMENT.
# On the call he rejected photo-transcription copy ("what you're saying is
# obvious... that's what we're showing with the photo") and rewrote every
# slide himself in the brand-strategist register: market-level competitive
# advantage, no comparisons ("a Porsche doesn't need to say I'm better").
# All nine line1s and subs below are his 12:44 text VERBATIM. Photos, crops,
# chips, band language: unchanged. Only splice: his three em dashes become
# a comma (01, 03, 07) per the standing no-em-dash rule and the same
# treatment his 7/15 text got this morning; flagged for verify.
CARDS = [
    # 01 — cover. "Howder Unit B" (r139112) + "is done" (r139096, splice on the
    # confirm list); naming per r134032.
    # rev 8 (Jake, 8/25 AM: "make it more plain... more straightforward"): the
    # cover now says WHAT the unit is — his unit-mix phrase, "A" prepended
    # (Unit B = the 1-bed/1-bath per site properties.js + his 7/16 email;
    # on the confirm list).
    # rev 11 (Shavit 8/25 11:34: "for slide 01/08 we should put a collage. We
    # already had one post featuring this unit from the outside."): the
    # exterior cover is OUT. 2x2 collage of the finished unit — pro living
    # (b01), pro kitchen hero (b02), his corrected bath retouch, and the
    # regraded bedroom for room variety. Exterior remains only on the close.
    dict(collage=[(site("01.jpg"), 0.50, 0.50, 1.00),
                  (site("02.jpg"), 0.45, 0.50, 1.00),
                  (aft("bath-pro-fixed-0825.png"), 0.45, 0.50, 1.00),
                  (aft("05_bedroom.jpg"), 0.50, 0.50, 1.02)],
         collage_grid=(2, 2),
         line1="A new standard for rental housing.",
         subs=["Professionally renovated, professionally managed, and built "
               "for long-term ownership, not quick fixes."],
         center=True, mark=True,
         tag="cover-collage"),

    # 02 — gutted main floor, staircase + stranded bath (u2-05, the strongest
    # establishing gut shot per catalog). rev 8 (plain pass): the literary
    # story opener is OUT ("was not" splice no longer needed); line1 = his
    # purchase-condition sentence whole, the plainest fact in the post.
    dict(frame=bef("u2-05.jpg"), ybias=0.45, xbias=0.45, lift=1.06,
         chip="BEFORE", tag="before-gutted-floor",
         line1="We invest where others walk away.",
         subs=["Many investors avoid projects like this.",
               "We see opportunities to preserve homes, strengthen "
               "neighborhoods, and create housing that lasts for decades."]),

    # 03 — rev 3 (Jake's sec-8 notes, 23:58 + 00:03: "replace this photo" /
    # "different photo"): the u2-10 chimney gut is OUT; in its place the rear
    # addition open to the sky (u2-07), the most distinct frame in the catalog.
    # rev 8 (plain pass): the moody pull-quote is OUT; line1 = the tail of his
    # demolition sentence, one trim (the "Once demolition started, we quickly
    # discovered" head), which states plainly what the photo shows.
    dict(frame=bef("u2-07.jpg"), ybias=0.40, xbias=0.50, lift=1.06,
         chip="BEFORE", tag="before-open-sky",
         line1="We fix what most people never see.",
         subs=["The most important investment is behind the walls.",
               "Structural repairs, framing, plumbing, electrical, and "
               "insulation come before paint and flooring, because quality "
               "starts with the foundation."]),

    # 04 — studded-out room, exposed framing and joists (u2-01). rev 8 (plain
    # pass): trimmed to the plain declarative half of his bandage sentence.
    dict(frame=bef("u2-01.jpg"), ybias=0.45, xbias=0.50, lift=1.06,
         chip="BEFORE", tag="before-studs",
         line1="This was a rebuild, not a remodel.",
         subs=["Our goal was never to cover up problems.",
               "It was to solve them the right way, creating a property "
               "that will require less maintenance and perform better for "
               "years to come."]),

    # rev 5 (Jake, 8/25 12:25 AM): only three befores. The framing (u2-04) and
    # roofline (u2-02) cards are cut; the scope sentence moves to the bedroom
    # after-slide, the college line lives in the caption only.

    # rev 6 (Jake, 8/25 12:40 AM: "you probably have some on the website"):
    # the three AFTER slides now use SHAVIT'S PROFESSIONAL FINALS from the
    # live site gallery (site howder-b/01, 02, 04, READ-ONLY), not the
    # regraded phone shots. Bedroom slide replaced by the pro BATHROOM.
    # rev 9 (Jake, 8/25 AM voice note: "three slides be the story, and then
    # the rest is just you describing the house"): 02-04 stay the story;
    # 05-07 become SPEC slides describing the unit — the Unit 1 reel's own
    # room-plate register. 05/07 are composed spec captions per Jake's
    # directive, grounded in the pro frames, his 7/13 plate phrases, and the
    # listing facts (properties.js howder-b, his 7/16 email §2). Shavit
    # confirms at verify. His scope/standard/unit-mix sentences live in the
    # IG caption, no longer on slides.
    # 05 — the finished living/entry, pro shot (b01). "Open floor concept"
    # is his 7/13 living plate phrase; specs from the listing entry.
    # rev 11: AC featured per Shavit 8/25 11:34. rev 12: bold spec line.
    # rev 13 (Jake 8/25: "take out the airconditioning and make it its own
    # post"): AC is OUT of this deck and caption entirely — it moves to the
    # standalone content/howder-ac-story post built on Shavit's 11:44
    # condenser photo.
    dict(frame=site("01.jpg"), ybias=0.50, xbias=0.50, lift=1.00,
         chip="AFTER", tag="after-living",
         line1="Every square foot counts.",
         subs=["Opening the floor plan transformed how the home feels.",
               "Natural light, better flow, and a more functional layout "
               "make this 500-square-foot home live much larger than its "
               "size."]),

    # 06 — the kitchen hero, pro shot (b02): the full L, butcher block,
    # stainless suite, gold fixture. rev 7: his 7/13 kitchen plate copy from
    # the Unit 1 reel (render_captions.py rev 6) — every feature visible in
    # the pro frame; on the confirm list for Unit B.
    dict(frame=site("02.jpg"), ybias=0.45, xbias=0.50, lift=1.00,
         chip="AFTER", tag="after-kitchen",
         line1="Consistency is our competitive advantage.",
         subs=["Every CPM renovation follows the same design standard.",
               "The result is a cleaner look, faster maintenance, lower "
               "long-term costs, and a consistent experience for every "
               "tenant."]),

    # 07 — the bathroom. rev 10 (Shavit 8/25 10:42/10:52 "picture in slide
    # number 7 needs updated... The tile was not aligned on the photo"): his
    # corrected retouch replaces site b04. Saved from the iMessage attachment
    # to photos/43-howder-unit2/full/bath-pro-fixed-0825.png. Spec lines
    # unchanged and still visibly true of the corrected frame.
    dict(frame=aft("bath-pro-fixed-0825.png"), ybias=0.50, xbias=0.50,
         lift=1.00, chip="AFTER", tag="after-bath",
         line1="Built for daily use.",
         subs=["Large-format tile, quality fixtures, and durable materials "
               "were selected because they last longer and reduce future "
               "maintenance, not simply because they look good."]),

    # 08 — rev 14 (Jake 8/25: the AC card belongs IN the deck): the approved
    # r6 AC-post card as a deck slide — his 11:57 REAL condenser photo (the
    # 11:44 AI-cleaned send is discarded), NEW FEATURE chip, descriptive spec
    # copy. Facts howder.everyroom + howder.ac-desc (AC post FACTS list).
    dict(frame=os.path.join(REPO, "photos", "43-howder-ac",
                            "condensers-0825.png"),
         ybias=0.40, xbias=0.50, lift=1.00,
         chip="NEW FEATURE", tag="ac-new-feature",
         line1="Air conditioning is a difference you feel.",
         subs=["Very few rental properties in Hillsdale provide air "
               "conditioning.",
               "Our renovated homes feature high-efficiency mini-split "
               "systems, giving tenants independent heating and cooling "
               "while making the property more energy efficient and "
               "desirable."]),

    # 10 — close on the exterior at a different crop (Clarendon 10 structure).
    # rev 10 (Shavit 8/25 10:42: "I don't like the text of the on the last
    # slide. 'One family. One building...'"): his closer is OUT; the close now
    # copies the shipped Clarendon 8/23 slide-10 text pattern per Jake, minus
    # "refinanced" (verified for Clarendon, nowhere on record for Howder).
    # "Fully leased" per site properties.js howder-b lease-signed + Unit 1's
    # July tenant; "professionally managed" per the standing CPM manager line.
    # Both on the confirm list. The closer stays in the IG caption (his July
    # language) unless Shavit pulls it there too.
    dict(frame=EXTERIOR, zoom=1.30, ybias=0.55, xbias=0.40, lift=1.04,
         tag="exterior-close",
         line1="More than a renovation.",
         subs=["This project represents our commitment to raising the "
               "standard of rental housing in Hillsdale.",
               "Better homes. Better operations. Better communities."],
         center=True, mark=True, cta="Live with us. Work with us."),
]

BAND_H = max(measure(c)[0] for c in CARDS) + RULE_H + PAD_TOP + PAD_BOT
print(f"uniform band: {BAND_H}px  ({round(100 * BAND_H / H)}% of frame)")
for i, c in enumerate(CARDS, start=1):
    blk, l1, subs = measure(c)
    print(f"  block {i:2d}: {blk:3d}px  hl {len(l1)} line(s), "
          f"sub {sum(len(s) for s in subs)} line(s)")

for f in os.listdir(OUT):
    if re.match(r"^\d\d_.*\.jpg$", f) or f == "REVIEW-sheet.jpg":
        os.remove(os.path.join(OUT, f))

N = len(CARDS)
pages, thumbs = [], []

for i, c in enumerate(CARDS, start=1):
    im = render(c, i, N, BAND_H)
    name = f"{i:02d}_{c['tag']}.jpg"
    im.save(os.path.join(OUT, name), quality=90)
    print(f"card {i:2d}  {c['tag']:16s}  {c['line1'][:52]}")
    pages.append(im)
    t = im.copy()
    t.thumbnail((330, 330))
    thumbs.append((t, f"{i:02d}"))

pdf = os.path.join(OUT, "Howder-UnitB-Carousel-MASTER.pdf")
pages[0].save(pdf, "PDF", save_all=True, append_images=pages[1:], resolution=96)
print("wrote", pdf)

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
print("wrote", OUT)
