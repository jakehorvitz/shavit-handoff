#!/usr/bin/env python3
"""Current Projects, then the Team — rev 4 render, 1080x1920.

Built the way the studio builds them: frame-by-frame in PIL, piped to ffmpeg.
The Palmier pass that preceded this had the clips in the right order but no
craft on them — no eases, no type animation, no progress rule, no scrim. This
is the stitch.

House conventions carried over from reel_full.py (the Kendall reel):
  - Black canvas #0b0b0c, brass rules, gold mark.
  - Cubic ease-out on everything; nothing moves linearly.
  - Type reveals by alpha AND a small upward rise, staggered line by line.
  - A cumulative brass progress rule.
  - Contrast 1.06 on every plate.

Where this reel deliberately differs from Kendall, per the rev 4 spec Jake
grilled through four revisions:
  - Full-bleed photo with a bottom scrim, not a photo + separate text band.
    The spec mockups are overlay captions, so overlay is what gets built.
  - Hard cuts, no cross-dissolves. Kendall dissolves at 36 frames; this cut is
    meant to hit. The movement lives in the pushes and the type, not in blends.
  - Caption grammar is two lines: small brass address, big white "what is being
    made". Jake killed the street-name-only version outright.

kenburns-motion-cap: pushes here are 2-4 percent and eased to a stop, which is
an anchored push rather than a pan across a still. No frame drifts.

Run: python3 reel_rev4.py
"""
import os, glob, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

SCRIPTS = os.path.dirname(os.path.abspath(__file__))
REEL = os.path.dirname(SCRIPTS)
BASE = os.path.join(REEL, "current-projects-team-2026-07-27")
SRCDIR = os.path.join(BASE, "palmier")
MOTION = os.path.join(BASE, "motion", "A5-norwood-framing-TRIM2s.mp4")
OUT = os.path.join(BASE, "reel")
FRAMES = os.path.join(OUT, "frames")
A5DIR = os.path.join(OUT, "_a5")
EV = os.path.join(REEL, "east-victoria-story-2026-07-23")
DMSANS = os.path.join(EV, "fonts", "DMSans.ttf")
BRIC = os.path.join(EV, "fonts", "Bricolage.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"

shutil.rmtree(FRAMES, ignore_errors=True)
os.makedirs(FRAMES, exist_ok=True)
os.makedirs(A5DIR, exist_ok=True)

W, H, FPS = 1080, 1920, 30
GOLD, BRASS = (255, 192, 0), (176, 141, 87)
TRACK, BG = (58, 50, 36), (11, 11, 12)
WHITE = (255, 255, 255)
PAD = 72
RULE_H = 4
MAXW = W - PAD * 2


def _var(path, sz, weight):
    f = ImageFont.truetype(path, sz)
    try:
        vals = []
        for ax in f.get_variation_axes():
            nm = ax["name"]
            nm = nm.decode() if isinstance(nm, (bytes, bytearray)) else nm
            low = nm.lower()
            vals.append(weight if low.startswith("weight")
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
        pass
    return f


FCAP = _var(SF, 68, 860)      # the big "what is being made" line
FSUB = _var(DMSANS, 27, 500)  # the small brass address
FCARD = _var(SF, 132, 860)    # title cards
FNAME = _var(SF, 72, 860)     # team names
FTHANKS = _var(DMSANS, 50, 400)
SCRATCH = ImageDraw.Draw(Image.new("RGB", (W, H)))


def ease(t):
    return 1 - (1 - max(0.0, min(1.0, t))) ** 3


def seg(f, a, b):
    if f <= a:
        return 0.0
    if f >= b:
        return 1.0
    return ease((f - a) / (b - a))


def tint(dr, xy, text, fnt, rgb, alpha, bg=BG):
    """Alpha-composited text against a known backdrop, as the studio does it."""
    if alpha <= 0.004:
        return
    dr.text(xy, text, font=fnt,
            fill=tuple(round(c * alpha + b * (1 - alpha)) for c, b in zip(rgb, bg)))


def wrap(text, fnt):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if SCRATCH.textlength(t, font=fnt) <= MAXW:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def tracked(dr, s, fnt, tr):
    return sum(dr.textlength(ch, font=fnt) + tr for ch in s) - tr


def draw_tracked(dr, x, y, s, fnt, rgb, alpha, tr, bg=BG):
    if alpha <= 0.004:
        return
    col = tuple(round(c * alpha + b * (1 - alpha)) for c, b in zip(rgb, bg))
    for ch in s:
        dr.text((x, y), ch, font=fnt, fill=col)
        x += dr.textlength(ch, font=fnt) + tr


# The scrim: a single reusable vertical gradient, transparent at 52% height to
# near-solid at the bottom. Built once, pasted per frame.
_scrim = Image.new("L", (1, H), 0)
for y in range(H):
    t = (y - H * 0.52) / (H * 0.48)
    _scrim.putpixel((0, y), 0 if t <= 0 else int(235 * ease(min(1.0, t))))
SCRIM = _scrim.resize((W, H))
BLACK = Image.new("RGB", (W, H), (0, 0, 0))


# ---------------------------------------------------------------------------
# The cut. secs come straight from the rev 4 timing table.
# ---------------------------------------------------------------------------
CARDS = [
    dict(kind="card", secs=2.0, text="We Love\nBuilding\nHouses"),
    dict(kind="card", secs=2.2, text="Ever wonder\nhow it\nhappens?"),

    dict(kind="work", secs=2.2, img="01_A1-norwood-delivery",
         sub="South Norwood Street", cap="Drywall and flooring, delivered",
         push=0.00, ybias=.5),
    dict(kind="work", secs=2.0, img="02_A2-norwood-materials",
         sub="South Norwood Street", cap="Board and compound, staged",
         push=0.020, ybias=.5),
    dict(kind="work", secs=2.0, img="03_A3-norwood-stripped",
         sub="South Norwood Street", cap="Down to the brick and the studs",
         push=0.030, ybias=.5),
    dict(kind="work", secs=1.8, img="04_A4-norwood-debris",
         sub="South Norwood Street", cap="Tearing out plaster and lath",
         push=0.00, ybias=.5),
    dict(kind="work", secs=1.8, img="__A5__",
         sub="South Norwood Street", cap="Framing the new [ ROOM - PENDING ]",
         push=0.00, ybias=.5, gold=True),
    dict(kind="work", secs=1.8, img="06_A6-barry-chimney",
         sub="Barry Street", cap="Old tile out, back to the brick",
         push=0.025, ybias=.5),
    dict(kind="work", secs=1.8, img="07_A7-barry-supplies",
         sub="Barry Street", cap="[ CAPTION - PENDING ]",
         push=0.030, ybias=.5, gold=True),
    dict(kind="work", secs=1.8, img="08_A8-howder-joists",
         sub="Howder Street", cap="New floor over open joists",
         push=0.00, ybias=.5),
    dict(kind="work", secs=1.8, img="09_A9-howder-rafters",
         sub="Howder Street", cap="Setting the new roof rafters",
         push=0.040, ybias=.35),
    dict(kind="work", secs=2.0, img="10_A10-howder-crew",
         sub="Howder Street", cap="New subfloor going down",
         push=0.020, ybias=.5),

    dict(kind="card", secs=3.0, text="These are\nthe people\nthat make\nit possible"),

    dict(kind="team", secs=1.6, img="11_C1-allan-wiggins", name="Allan Wiggins"),
    dict(kind="team", secs=1.6, img="12_C2-pamela-montez", name="Pamela Montez"),
    dict(kind="team", secs=1.6, img="13_C3-jon-rutan", name="Jon Rutan"),
    dict(kind="team", secs=1.6, img="14_C4-darrin-hannibal", name="Darrin Hannibal"),
    dict(kind="team", secs=1.6, img="15_C5-monte-rimer", name="Monte Rimer"),
    dict(kind="team", secs=1.6, img="16_C6-riana-beardsley", name="Riana Beardsley"),
    dict(kind="team", secs=1.6, img="17_C7-tito-jonah", name="Tito and Jonah"),
    dict(kind="team", secs=1.6, img="18_C8-team-photo", name="So thankful for my team",
         thanks=True),

    dict(kind="outro", secs=3.0, img="19_D1-outro"),
]

LENS = [int(round(FPS * c["secs"])) for c in CARDS]
STARTS, cur = [], 0
for n in LENS:
    STARTS.append(cur)
    cur += n
NFRAMES = cur
# The progress rule spans the work block only: first card through the last
# work frame, per the spec ("empty at the first card, full on the last").
RULE_END = STARTS[12]

# A5 is the one live-motion beat. Pull its frames out of the Higgsfield clip.
if os.path.exists(MOTION) and not glob.glob(os.path.join(A5DIR, "*.png")):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", MOTION,
                    "-vf", f"fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase,"
                           f"crop={W}:{H}", os.path.join(A5DIR, "%04d.png")], check=True)
A5 = sorted(glob.glob(os.path.join(A5DIR, "*.png")))

SRC = {}
for c in CARDS:
    key = c.get("img")
    if key and key != "__A5__" and key not in SRC:
        SRC[key] = Image.open(os.path.join(SRCDIR, key + ".jpg")).convert("RGB")


def plate(c, t, fi):
    """The photograph, cover-cropped, under an eased anchored push."""
    if c.get("img") == "__A5__":
        im = (Image.open(A5[min(fi, len(A5) - 1)]).convert("RGB") if A5
              else SRC["01_A1-norwood-delivery"])
        z = 1.0
    else:
        im = SRC[c["img"]]
        z = 1.0 + c.get("push", 0.0) * ease(t)
    if c["kind"] == "team":
        z = 1.04 - 0.04 * ease(min(1.0, t * 6))       # settle from 104%
    s = max(W / im.width, H / im.height) * z
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = max(0, min(im.width - W, (im.width - W) // 2))
    top = max(0, min(im.height - H, int((im.height - H) * c.get("ybias", .5))))
    im = im.crop((left, top, left + W, top + H))
    return ImageEnhance.Contrast(im).enhance(1.06)


def rule(dr, gi):
    """Cumulative brass rule, bottom of frame, across the work block only."""
    if gi >= RULE_END:
        return
    y = H - RULE_H
    dr.rectangle([0, y, W, H], fill=TRACK)
    dr.rectangle([0, y, int(W * (gi / RULE_END)), H], fill=BRASS)


def build(i, f):
    c = CARDS[i]
    n = LENS[i]
    t = f / max(1, n - 1)

    if c["kind"] == "card":
        card = Image.new("RGB", (W, H), BG)
        dr = ImageDraw.Draw(card)
        lines = c["text"].upper().split("\n")
        lh = 150
        ty = (H - len(lines) * lh) // 2
        for ln in lines:
            x = (W - dr.textlength(ln, font=FCARD)) // 2
            dr.text((x, ty), ln, font=FCARD, fill=WHITE)
            ty += lh
        rule(dr, STARTS[i] + f)
        return card

    photo = plate(c, t, f)
    card = photo.copy()
    if c["kind"] != "outro":
        card = Image.composite(BLACK, card, SCRIM)
    dr = ImageDraw.Draw(card)

    if c["kind"] == "work":
        col = GOLD if c.get("gold") else WHITE
        lines = wrap(c["cap"].upper(), FCAP)
        block = len(lines) * 84
        ty = H - 150 - block
        a = seg(f, 2, 14)
        draw_tracked(dr, (W - tracked(dr, c["sub"].upper(), FSUB, 5.5)) // 2,
                     ty - 52 + round(10 * (1 - a)), c["sub"].upper(), FSUB,
                     BRASS, a, 5.5, (0, 0, 0))
        for k, ln in enumerate(lines):
            al = seg(f, 6 + k * 5, 22 + k * 5)
            x = (W - dr.textlength(ln, font=FCAP)) // 2
            tint(dr, (x, ty + round(16 * (1 - al))), ln, FCAP, col, al, (0, 0, 0))
            ty += 84

    elif c["kind"] == "team":
        fnt = FTHANKS if c.get("thanks") else FNAME
        s = c["name"] if c.get("thanks") else c["name"].upper()
        al = seg(f, 4, 18)                      # name lands after the face
        x = (W - dr.textlength(s, font=fnt)) // 2
        tint(dr, (x, H - 232 + round(14 * (1 - al))), s, fnt, WHITE, al, (0, 0, 0))

    rule(dr, STARTS[i] + f)
    return card


for i in range(len(CARDS)):
    for f in range(LENS[i]):
        build(i, f).save(os.path.join(FRAMES, f"{STARTS[i] + f:05d}.png"))

print(f"{NFRAMES} frames, {len(CARDS)} beats, {NFRAMES / FPS:.1f}s")

mp4 = os.path.join(OUT, "current-projects-team-rev4.mp4")
subprocess.run([
    "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS),
    "-i", os.path.join(FRAMES, "%05d.png"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
    "-movflags", "+faststart", mp4,
], check=True)
print(f"wrote {mp4}  ({NFRAMES} frames, {NFRAMES / FPS:.1f}s)")
