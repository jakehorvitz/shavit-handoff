#!/usr/bin/env python3
"""Rev 5 — one house. South Norwood Street, start to now. 1080x1920.

Why this is a different film from rev 4:
  Rev 4 was ten photographs of three addresses. Jake called it a collage and he
  was right — every cut jumped to a new place, so nothing accumulated. Rev 5
  follows ONE house, so every cut is continuity instead of a jump, and the
  viewer is standing in the same building for the whole thing.

Emotion here is pacing, not adjectives (Shavit's register bans adjectives in
captions outright). The shape is:
    slow and warm  ->  violent burst  ->  dead stop  ->  faces
  - The exterior holds nearly three seconds. It is somebody's house, not a
    jobsite yet.
  - The BURST is eight real photographs at six frames each. This is the
    "time-lapse of the workers" Jake kept asking for, built from real frames of
    the same house at different stages rather than generated. Nothing invented.
  - The burst carries NO caption. Type would kill it.
  - Then everything stops for 3.2 seconds on the new stud wall. The silence
    after the noise is where the feeling is.

Run: python3 reel_rev5.py
"""
import os, glob, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageOps

SCRIPTS = os.path.dirname(os.path.abspath(__file__))
REEL = os.path.dirname(SCRIPTS)
BASE = os.path.join(REEL, "current-projects-team-2026-07-27")
NOR = os.path.join(BASE, "drive", "norwood")
TEAM = os.path.join(BASE, "palmier-team")
OUT = os.path.join(BASE, "reel")
FRAMES = os.path.join(OUT, "rev5_frames")
EV = os.path.join(REEL, "east-victoria-story-2026-07-23")
DMSANS = os.path.join(EV, "fonts", "DMSans.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"

shutil.rmtree(FRAMES, ignore_errors=True)
os.makedirs(FRAMES, exist_ok=True)

W, H, FPS = 1080, 1920, 30
GOLD, BRASS = (255, 192, 0), (176, 141, 87)
TRACK, BG = (58, 50, 36), (11, 11, 12)
WHITE = (255, 255, 255)
RULE_H = 4
MAXW = W - 144


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


FCAP = _var(SF, 70, 860)
FSUB = _var(DMSANS, 27, 500)
FCARD = _var(SF, 132, 860)
FNAME = _var(SF, 72, 860)
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


def tint(dr, xy, s, fnt, rgb, a, bg=(0, 0, 0)):
    if a <= 0.004:
        return
    dr.text(xy, s, font=fnt, fill=tuple(round(c * a + b * (1 - a)) for c, b in zip(rgb, bg)))


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


def draw_tracked(dr, x, y, s, fnt, rgb, a, tr):
    if a <= 0.004:
        return
    col = tuple(round(c * a + b * (1 - a)) for c, b in zip(rgb, (0, 0, 0)))
    for ch in s:
        dr.text((x, y), ch, font=fnt, fill=col)
        x += dr.textlength(ch, font=fnt) + tr


def tracked_w(dr, s, fnt, tr):
    return sum(dr.textlength(ch, font=fnt) + tr for ch in s) - tr


_sc = Image.new("L", (1, H), 0)
for y in range(H):
    t = (y - H * 0.54) / (H * 0.46)
    _sc.putpixel((0, y), 0 if t <= 0 else int(238 * ease(min(1.0, t))))
SCRIM = _sc.resize((W, H))
BLACK = Image.new("RGB", (W, H), (0, 0, 0))


def norwood(idx):
    hits = [h for h in sorted(glob.glob(os.path.join(NOR, idx + "*"))) if not h.endswith(".json")]
    return ImageOps.exif_transpose(Image.open(hits[0])).convert("RGB")


# --- the cut -----------------------------------------------------------------
CARDS = [
    dict(kind="card", secs=2.0, text="We Love\nBuilding\nHouses"),

    dict(kind="w", secs=2.8, n="006", sub="South Norwood Street",
         cap="Where it started", push=0.030, warm=1.06),
    dict(kind="w", secs=2.0, n="002", cap="The material arrives", push=0.020),
    dict(kind="w", secs=1.8, n="001", cap="Board and compound, staged", push=0.020),

    # THE BURST — real frames of the same house, six frames each, no type.
    dict(kind="b", secs=0.2, n="010"), dict(kind="b", secs=0.2, n="011"),
    dict(kind="b", secs=0.2, n="012"), dict(kind="b", secs=0.2, n="003"),
    dict(kind="b", secs=0.2, n="005"), dict(kind="b", secs=0.2, n="013"),
    dict(kind="b", secs=0.2, n="016"), dict(kind="b", secs=0.2, n="018"),

    dict(kind="w", secs=1.6, n="017", cap="Everything comes out", push=0.00),
    # DEAD STOP — the payoff, longest hold in the film.
    dict(kind="w", secs=3.2, n="n000", cap="New walls go up", push=0.025),
    dict(kind="w", secs=1.8, n="n001", push=0.020),

    dict(kind="card", secs=3.0, text="These are\nthe people\nthat make\nit possible"),

    dict(kind="t", secs=1.6, img="11_C1-allan-wiggins", name="Allan Wiggins"),
    dict(kind="t", secs=1.6, img="12_C2-pamela-montez", name="Pamela Montez"),
    dict(kind="t", secs=1.6, img="13_C3-jon-rutan", name="Jon Rutan"),
    dict(kind="t", secs=1.6, img="14_C4-darrin-hannibal", name="Darrin Hannibal"),
    dict(kind="t", secs=1.6, img="15_C5-monte-rimer", name="Monte Rimer"),
    dict(kind="t", secs=1.6, img="16_C6-riana-beardsley", name="Riana Beardsley"),
    dict(kind="t", secs=1.6, img="17_C7-tito-jonah", name="Tito and Jonah"),
    dict(kind="t", secs=1.6, img="18_C8-team-photo", name="So thankful for my team", thanks=True),

    dict(kind="o", secs=3.0, img="19_D1-outro"),
]

LENS = [max(1, int(round(FPS * c["secs"]))) for c in CARDS]
STARTS, cur = [], 0
for n in LENS:
    STARTS.append(cur)
    cur += n
NFRAMES = cur
RULE_END = STARTS[12]

SRC = {}
for c in CARDS:
    if c.get("n") and c["n"] not in SRC:
        SRC[c["n"]] = norwood(c["n"])
    if c.get("img") and c["img"] not in SRC:
        p = os.path.join(TEAM, c["img"] + ".jpg")
        if not os.path.exists(p):
            p = os.path.join(BASE, "palmier", c["img"] + ".jpg")
        SRC[c["img"]] = Image.open(p).convert("RGB")


def plate(c, t):
    im = SRC[c.get("n") or c["img"]]
    z = 1.0 + c.get("push", 0.0) * ease(t)
    if c["kind"] == "t":
        z = 1.04 - 0.04 * ease(min(1.0, t * 6))
    s = max(W / im.width, H / im.height) * z
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l = max(0, min(im.width - W, (im.width - W) // 2))
    tp = max(0, min(im.height - H, (im.height - H) // 2))
    im = im.crop((l, tp, l + W, tp + H))
    im = ImageEnhance.Contrast(im).enhance(1.06)
    if c.get("warm"):
        im = ImageEnhance.Brightness(im).enhance(c["warm"])
    return im


def rule(dr, gi):
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
        ty = (H - len(lines) * 150) // 2
        for ln in lines:
            dr.text(((W - dr.textlength(ln, font=FCARD)) // 2, ty), ln, font=FCARD, fill=WHITE)
            ty += 150
        rule(dr, STARTS[i] + f)
        return card

    card = plate(c, t)
    if c["kind"] == "b":
        dr = ImageDraw.Draw(card)
        rule(dr, STARTS[i] + f)
        return card

    if c["kind"] != "o":
        card = Image.composite(BLACK, card, SCRIM)
    dr = ImageDraw.Draw(card)

    if c["kind"] == "w" and c.get("cap"):
        lines = wrap(c["cap"].upper(), FCAP)
        ty = H - 160 - len(lines) * 86
        if c.get("sub"):
            a = seg(f, 2, 16)
            draw_tracked(dr, (W - tracked_w(dr, c["sub"].upper(), FSUB, 5.5)) // 2,
                         ty - 60 + round(10 * (1 - a)), c["sub"].upper(), FSUB, BRASS, a, 5.5)
        for k, ln in enumerate(lines):
            al = seg(f, 6 + k * 5, 24 + k * 5)
            tint(dr, ((W - dr.textlength(ln, font=FCAP)) // 2, ty + round(18 * (1 - al))),
                 ln, FCAP, WHITE, al)
            ty += 86

    elif c["kind"] == "t":
        fnt = FTHANKS if c.get("thanks") else FNAME
        s = c["name"] if c.get("thanks") else c["name"].upper()
        al = seg(f, 4, 18)
        tint(dr, ((W - dr.textlength(s, font=fnt)) // 2, H - 232 + round(14 * (1 - al))),
             s, fnt, WHITE, al)

    rule(dr, STARTS[i] + f)
    return card


for i in range(len(CARDS)):
    for f in range(LENS[i]):
        build(i, f).save(os.path.join(FRAMES, f"{STARTS[i] + f:05d}.png"))

print(f"{NFRAMES} frames, {len(CARDS)} beats, {NFRAMES / FPS:.1f}s")

mp4 = os.path.join(OUT, "rev5-onehouse-norwood.mp4")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS),
                "-i", os.path.join(FRAMES, "%05d.png"), "-c:v", "libx264",
                "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart", mp4], check=True)
print(f"wrote {mp4}")
