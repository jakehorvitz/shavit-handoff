#!/usr/bin/env python3
"""Mead Street — 8-slide case-study carousel.

Adapted from render_clarendon.py (which came from the shipped Kendall deck).
Nothing in the bone treatment, fonts, colours, band/rule metrics or chips
changed; only the card list and the photo source.

COPY RULE: every line is Shavit's, verbatim from his 8/27 3:48pm case-study
text (fenced in shavit-rootman-website/docs/case-studies/mead-34/NOTES.md),
trimmed for length or with a dollar figure or the house number removed. The
non-Shavit words are the standing brand elements only: the cover's series
one-liner (already shipped verbatim on Kendall and Clarendon), the closing
triple, "Proudly revitalizing Hillsdale, Michigan.", "Live with us. Work with
us.", the chips and the mark.

HEADER RULE (derived 8/31 from what Jake kept vs cut): present tense, a
standing principle, no comparison to other buyers, no metaphor or aphorism.
The deal narrative lives in the sublines. The cover is the one exception: it
carries the property name plus the series one-liner.

Jake's spec notes applied: rev 4 headers, rev 5 removals (old 3 and 8) and
image swaps, rev 6 cover.

Run: python3 render_mead.py
"""
import os
import re
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Verified frames, copied out of the website repo. READ-ONLY here.
DROP = os.path.join(os.path.dirname(REEL), "mead-case-study-post-spec", "img")
OUT = os.path.join(REEL, "mead-ig-2026-08-31", "final")
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
PAD, PAD_TOP, PAD_BOT = 72, 52, 54
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
    return Image.open(os.path.join(DROP, rel)).convert("RGB")


def fit(im, w, h, ybias, xbias, lift, zoom=1.0):
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


def collage(frames, photo_h, cols=2, rows=2):
    sheet = Image.new("RGB", (W, photo_h), BAND)
    tw = (W - (cols - 1) * GUTTER) // cols
    th = (photo_h - (rows - 1) * GUTTER) // rows
    for i, (rel, ybias, xbias, lift) in enumerate(frames[: cols * rows]):
        sheet.paste(fit(load(rel), tw, th, ybias, xbias, lift),
                    ((i % cols) * (tw + GUTTER), (i // cols) * (th + GUTTER)))
    return sheet


def split(before, after, photo_h, b, a):
    sheet = Image.new("RGB", (W, photo_h), BAND)
    sheet.paste(fit(load(before), HALF, photo_h, *b), (0, 0))
    sheet.paste(fit(load(after), W - HALF - GUTTER, photo_h, *a),
                (HALF + GUTTER, 0))
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
        cols, rows = c.get("collage_grid", (2, 2))
        card.paste(collage(c["collage"], photo_h, cols, rows), (0, 0))
    elif c.get("split"):
        before, after = c["split"]
        card.paste(split(before, after, photo_h, c["b"], c["a"]), (0, 0))
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
# The complete usable before set: five December 5 CleanShots. The stairwell is
# held out because no after matches it. No MLS watermark on any of these, they
# are Shavit's own screenshots, so there is no wm_crop anywhere in this deck.
BEFORE_TILES = [
    ("before-front.jpg",          0.45, 0.50, 1.00),
    ("before-rear-deck.jpg",      0.45, 0.50, 1.00),
    ("before-attic-room.jpg",     0.45, 0.50, 1.06),
    ("before-ceiling-failed.jpg", 0.45, 0.50, 1.06),
]

# ---------------------------------------------------------------------------
# The collage, rev 20. Jake, 8/31: "start with collage for one then end with our
# current image of one." So it OPENS the deck instead of closing it, and the
# frame that was the cover moves to slide 8. Nine finished frames, three by
# three, one tile per room so nothing repeats: front, living, both kitchen
# angles, the french doors, both baths and the two upstairs rooms.
#
# Three deliberate exclusions: deck-after (already out for weathered boards),
# after-11 (the side entry cut from slide 8 earlier today) and the near-duplicate
# rooms after-02 and after-10. Nine tiles at 356x270 also crop far less off a 3:2
# frame than twelve at 356x201 would.
COLLAGE_TILES = [
    ("exterior-cover-jake-hq.png", 0.50, 0.50, 1.00),  # front three-quarter, Jake's frame
    ("after-03.jpg",             0.50, 0.50, 1.00),  # living, sightline to kitchen
    ("after-04.jpg",             0.50, 0.50, 1.00),  # kitchen, range wall
    ("after-05.jpg",             0.50, 0.50, 1.00),  # kitchen, peninsula
    ("after-06.jpg",             0.50, 0.50, 1.00),  # french doors from inside
    ("after-07.jpg",             0.50, 0.50, 1.00),  # full bath
    ("after-08.jpg",             0.50, 0.50, 1.00),  # half bath
    ("after-09.jpg",             0.50, 0.50, 1.00),  # upstairs, en-suite doorway
    ("bedroom-after.jpg",        0.50, 0.50, 1.00),  # upstairs bedroom, landing door
]

CARDS = [
    # rev 11: every slide line is now from Shavit's 8/31 11:08 AM private text,
    # his own headers in his own order. Sublines are his sentences trimmed for
    # the band; nothing is composed. Two kinds of line are deliberately NOT
    # carried: the seller's hardship clause, because his new wording contradicts
    # the live site, and every named finish inventory, because his own note 2
    # ("remove copy that simply describes what the viewer can already see") and
    # the Budlong rule both exclude specs.

    # 01 — cover. rev 20: the collage opens the deck on Jake's instruction. Copy
    # is unchanged from the photo cover it replaces, so the series form Kendall and
    # Clarendon both ship (property name, town, one-liner) is intact and nothing
    # new is composed. Nine rooms at once is a harder scroll-stop than one facade.
    dict(collage=COLLAGE_TILES, collage_grid=(3, 3),
         tag="cover",
         line1="Mead Street",
         subs=["Hillsdale, Michigan",
               "A complete BRRRR renovation."],
         center=True, mark=True),

    # 02 — his slide 2 over the before collage. The hardship sentence sits between
    # these two and is held out until he settles health vs financial.
    dict(collage=BEFORE_TILES, collage_grid=(2, 2), chip="BEFORE",
         tag="before-collage",
         line1="Every home has a story.",
         subs=["This project began with a phone call, after one of our local mailers.",
               "Our role was not simply to purchase a house. It was to give the "
               "property a second life."]),

    # 03 — his slide 3 over the only true before-and-after pair. The origin claim
    # in the header is new and unsourced; queued for his confirm.
    dict(split=("bedroom-before.jpg", "bedroom-after.jpg"),
         b=(0.30, 0.62, 1.12), a=(0.42, 0.30, 1.00),
         tag="split-upstairs",
         line1="Our standard began here.",
         subs=["Every company has a project that changes how it operates. "
               "Mead Street became ours.",
               "The systems developed here still improve efficiency and "
               "simplify maintenance."]),

    # 04 — his slide 4. The deck already had this header in a longer form.
    dict(frame="after-06.jpg", ybias=0.50, xbias=0.50, lift=1.00,
         tag="durable",
         line1="Build for the tenth year.",
         subs=["The most important work is usually hidden behind the walls.",
               "Structural integrity and updated mechanicals, not temporary "
               "cosmetic improvements."]),

    # 05 — his slide 5 over the kitchen. His finish inventory is dropped, his two
    # reasoning sentences are kept, which is the slide's actual argument.
    dict(frame="after-04.jpg", ybias=0.50, xbias=0.50, lift=1.00,
         tag="kitchen",
         line1="A consistent standard.",
         subs=["A family should know what to expect when they move into one of "
               "our homes.",
               "Consistency is not about repetition. It is about dependable "
               "quality."]),

    # 06 — his slide 6 over the bathroom. Same treatment: the walk-in shower and
    # black fixtures are visible in the frame, so naming them breaks his note 2.
    dict(frame="after-07.jpg", ybias=0.50, xbias=0.50, lift=1.00,
         tag="bathroom",
         line1="Details matter.",
         subs=["Rental housing should never require lowering expectations.",
               "The goal is simple: homes that residents in Hillsdale are "
               "genuinely proud to live in."]),

    # 07 — his slide 7. His "families relocating from outside Hillsdale" sentence
    # is a new tenant claim with no source, so it is held; the two general
    # sentences carry the slide without it.
    dict(frame="after-10.jpg", ybias=0.50, xbias=0.50, lift=1.00,
         tag="outcome",
         line1="Quality attracts people.",
         subs=["Quality housing strengthens communities and supports local "
               "employers.",
               "Creating demand for great housing benefits everyone."]),

    # 08 — his closer. rev 17: headline replaced on his instruction, 8/31 1:48 PM
    # ("Change the one home at a time to / building communities - one project at a
    # time"), his wording and his hyphen, verbatim.
    # rev 22: Jake, "thats the only shot of the exterior house that I want" — his
    # own frame, and he re-uploaded it to the Drive folder at 1510x1042 to settle
    # the quality problem. It is the ONLY exterior after on the deck now: slide 8
    # and collage tile 1 are the same file, and no other after-exterior appears.
    # (The two befores in the slide 2 collage stay: they are the before half of a
    # before-and-after and are not the same kind of picture.)
    #
    # The resolution complaint is genuinely fixed rather than argued with. At
    # 522x359 this frame was upscaled 2.46x into the 1080x884 photo area; at
    # 1510x1042 it DOWNSCALES 0.85x. That is the whole difference between the soft
    # rev-20 render and this one, and it is why lift drops back to 1.00 — the
    # contrast bump at 1.02 was compensating for upscale mush that is no longer there.
    #
    # Section 16 still applies to this file and travels with it.
    #
    # rev 21 (superseded): slide 8 and collage tile 1 were exterior-after-clean-hq,
    # the native recut of _drop/2.jpeg. That asset stays built and is one line away.
    #
    # The old chain was 3600x2400 -> 1400x933 (JPEG) -> 1327x884. Two resamples and
    # a JPEG generation before the slide even started. The recut takes crop
    # (0,192,2666,1776) straight out of _drop/2.jpeg — the region located by
    # correlation against exterior-after.jpg, not guessed — and stays PNG through
    # the lawn fill, so the slide is one 2x downscale off the camera original with
    # no intermediate JPEG at all. 1.90x the pixels going in.
    #
    # This also puts exterior-cover-jake.jpg back off the deck. It was here for one
    # rev under "end with our current image of one"; asking for the collage's top
    # left supersedes that, and it is the frame section 16 says is not a photograph
    # of this property, so nothing is lost by its going.
    #
    # rev 18: frame swapped off after-11.jpg on Jake's 8/31 4:20 PM note ("more
    # professional"). after-11 was the side entry: chain-link fence, bare soil and
    # leaf litter on the treads, a service-door angle that closed the deck on the
    # least finished thing in the set. exterior-after-clean.jpg is the front
    # three-quarter at 1400x933 (vs after-11's 1024x683), whole house plus porch
    # plus garage, with the front lawn filled per Shavit's own 8/31 landscaping
    # note. Reusing the exterior to close is Jake's standing carousel rule; this
    # is the pulled-back angle, the cover is the tight one.
    dict(frame="exterior-cover-jake-hq.png", ybias=0.50, xbias=0.50, lift=1.00,
         tag="close",
         line1="Building communities - one project at a time",
         subs=["One more home preserved, one more family welcomed, one more "
               "investment made with a long-term perspective."],
         center=True, mark=True, cta="Live with us. Work with us."),
]



BAND_H = max(measure(c)[0] for c in CARDS) + RULE_H + PAD_TOP + PAD_BOT
print(f"uniform band: {BAND_H}px  ({round(100 * BAND_H / H)}% of frame)")
for i, c in enumerate(CARDS, start=1):
    blk, l1, subs = measure(c)
    print(f"  block {i:2d}: {blk:3d}px  hl {len(l1)} line(s), "
          f"sub {sum(len(s) for s in subs)} line(s)")

for f in os.listdir(OUT):
    if re.match(r"^\d\d_.*\.jpg$", f):
        os.remove(os.path.join(OUT, f))

N = len(CARDS)
pages, thumbs = [], []
for i, c in enumerate(CARDS, start=1):
    im = render(c, i, N, BAND_H)
    im.save(os.path.join(OUT, f"{i:02d}_{c['tag']}.jpg"), quality=95, subsampling=0)
    print(f"card {i:2d}  {c['tag']:16s}  {c['line1'][:52]}")
    pages.append(im)
    t = im.copy(); t.thumbnail((330, 330)); thumbs.append((t, f"{i:02d}"))

# Slide 7 alternates, same card and same copy against two other frames, so the
# open pick stays a photo pick and can never drift into being a copy pick.
# rev 11: these are re-rendered with every run. They were previously one-offs and
# went stale carrying the retired slide line.
for name, alt_frame in [("07a_outcome-alt-living", "after-03.jpg"),
                        ("07b_outcome-alt-room", "after-02.jpg")]:
    alt = dict(CARDS[6], frame=alt_frame)
    render(alt, 7, N, BAND_H).save(os.path.join(OUT, f"{name}.jpg"), quality=95, subsampling=0)
    print(f"alt      {name:24s} {alt_frame}")


pdf = os.path.join(OUT, "Mead-Carousel-MASTER.pdf")
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
