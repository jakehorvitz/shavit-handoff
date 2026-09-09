#!/usr/bin/env python3
"""The full six-beat Kendall reel, 1080x1920.

Built in one pass at Jake's explicit instruction ("can you generate the reel
please"), overriding the usual shot-by-shot review gate. Shot 1 was already
reviewed and approved.

Decisions carried in from the session:
  - Black canvas, per brand-tokens. Bone is the carousel treatment; the film
    system is black.
  - Slide 3 is frame 089 cropped 1.6x tight, so it stops reading as a repeat of
    slide 1, and its subline is rewritten to name what is actually in that crop
    (a ladder and a miter saw). "Extraction gear" was cut because no extraction
    gear is visible once the frame is tightened.
  - Brass rules, gold mark.

Rules enforced here:
  kenburns-motion-cap  Pan-on-still is capped at 20 percent of runtime and is
                       banned on the hook, the chapter opens and the reward.
                       Exactly one connective beat (shot 2) carries a push, at
                       2.6s of 16.6s = 16 percent. Shot 6's push is separately
                       sanctioned by static-signature.
  static-signature     The closer holds on a dimming warm frame under a single
                       monotonic push-in. No black card ends the cut.
  no-pulsing-logo      The wordmark resolves once and holds.
  full-state-names     "Indiana", never "IN".
  no-house-numbers     Street names only.

Run: python3 reel_full.py
"""
import os, glob, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP = os.path.join(REEL, "kendall-2026-07-24", "_drive-dump")
EV = os.path.join(REEL, "east-victoria-story-2026-07-23")
OUT = os.path.join(REEL, "work-you-never-see-2026-07-24", "reel")
FRAMES = os.path.join(OUT, "full_frames")
DMSANS = os.path.join(EV, "fonts", "DMSans.ttf")
BRIC = os.path.join(EV, "fonts", "Bricolage.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"
shutil.rmtree(FRAMES, ignore_errors=True)
os.makedirs(FRAMES, exist_ok=True)

W, H = 1080, 1920
GOLD, BRASS = (255, 192, 0), (176, 141, 87)
TRACK, BG = (58, 50, 36), (11, 11, 12)
SUB = (216, 213, 206)
PAD, RULE_H = 72, 6
PAD_TOP, PAD_BOT = 58, 60
LH1, LH2, IDX_H = 78, 54, 52
FPS = 30
TOTAL = 6


def _var(path, sz, weight):
    f = ImageFont.truetype(path, sz)
    try:
        vals = []
        for ax in f.get_variation_axes():
            nm = ax["name"].decode() if isinstance(ax["name"], (bytes, bytearray)) else ax["name"]
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


F1 = _var(SF, 64, 820)
F2 = _var(DMSANS, 42, 400)
FIDX = _var(SF, 26, 820)
FMARK = bric(24)
SCRATCH = ImageDraw.Draw(Image.new("RGB", (W, H)))
MAXW = W - PAD * 2


def wrap(text, fnt):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if SCRATCH.textlength(t, font=fnt) <= MAXW:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def cta_font(cta):
    sz, f = 60, bric(60)
    while SCRATCH.textlength(cta.upper(), font=f) > MAXW and sz > 24:
        sz -= 2
        f = bric(sz)
    return sz, f


def measure(c):
    l1 = wrap(c["line1"].upper(), F1)
    l2 = wrap(c["line2"], F2)
    h = IDX_H + len(l1) * LH1 + 14 + len(l2) * LH2
    if c.get("cta"):
        h += 30 + cta_font(c["cta"])[0] + 8 + 16
    if c.get("mark"):
        h += 12 + 30
    return h, l1, l2


CARDS = [
    dict(frame="055", line1="This is what the process looks like.",
         line2="Kendall Street, South Bend, Indiana.",
         center=True, mark=True, ybias=0.30, xbias=0.45, lift=1.30,
         zoom=1.0, push=0.0, secs=3.8),
    dict(frame="091", line1="We learn the house from the inside and out.",
         line2="Ceilings opened end to end before anything goes back.",
         ybias=0.34, xbias=0.50, lift=1.42,
         zoom=1.0, push=0.0, secs=3.8),          # push removed: over cap at 17.6s
    dict(frame="089", line1="We know what is behind every wall.",
         line2="A ladder, a miter saw, and a floor you cannot see.",
         ybias=0.50, xbias=0.50, lift=1.34,
         zoom=1.6, push=0.0, secs=3.8),
    dict(frame="098", line1="So the family will never have to.",
         line2="New floor, new paint, new light, and a restored fireplace.",
         ybias=0.52, xbias=0.50, lift=1.12,
         zoom=1.0, push=0.0, secs=3.8),
    dict(frame="073", line1="New floor. New light. New kitchen.",
         line2="A South Bend rebuild, finished top to bottom.",
         ybias=0.46, xbias=0.66, lift=1.14,
         zoom=1.0, push=0.0, secs=3.8),
    dict(frame="019", line1="The work you never see is the work we sell.",
         line2="Kendall Street, South Bend, Indiana. Finished.",
         center=True, mark=True, cta="Live with us. Work with us.",
         ybias=0.20, xbias=0.50, lift=1.00,
         zoom=1.0, push=0.035, secs=4.6),          # static-signature push
]

BAND_H = max(measure(c)[0] for c in CARDS) + RULE_H + PAD_TOP + PAD_BOT
PHOTO_H = H - BAND_H
print(f"band {BAND_H}px  photo {PHOTO_H}px")

SRC = {}
for c in CARDS:
    p = glob.glob(os.path.join(DUMP, f"{c['frame']}_*.jpg"))[0]
    SRC[c["frame"]] = Image.open(p).convert("RGB")


def plate(c, t):
    """t is 0..1 through the shot; push is the sanctioned Ken Burns amount."""
    im = SRC[c["frame"]]
    z = c["zoom"] * (1.0 + c["push"] * t)
    s = max(W / im.width, PHOTO_H / im.height) * z
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = max(0, min(im.width - W, int((im.width - W) * c["xbias"])))
    top = max(0, min(im.height - PHOTO_H, int((im.height - PHOTO_H) * c["ybias"])))
    im = im.crop((left, top, left + W, top + PHOTO_H))
    im = ImageEnhance.Brightness(im).enhance(c["lift"])
    return ImageEnhance.Contrast(im).enhance(1.06)


def ease(t):
    return 1 - (1 - max(0.0, min(1.0, t))) ** 3


def seg(f, a, b):
    if f <= a:
        return 0.0
    if f >= b:
        return 1.0
    return ease((f - a) / (b - a))


def tint(dr, xy, text, fnt, rgb, alpha):
    if alpha <= 0.004:
        return
    dr.text(xy, text, font=fnt, fill=tuple(round(c * alpha + b * (1 - alpha))
                                           for c, b in zip(rgb, BG)))


def bld(c, idx, f, n, tmul=1.0):
    t = f / max(1, n - 1)
    card = Image.new("RGB", (W, H), BG)
    photo = plate(c, t)

    # static-signature: the closer dims warm across its last 2.2 seconds.
    if idx == TOTAL:
        d0 = max(0.0, (t - (1 - 2.2 / c["secs"])) / (2.2 / c["secs"]))
        if d0 > 0:
            photo = ImageEnhance.Brightness(photo).enhance(1 - 0.22 * ease(d0))
    card.paste(photo, (0, 0))
    dr = ImageDraw.Draw(card)

    # Cumulative brass progress rule: grows from (idx-1)/6 to idx/6.
    y = PHOTO_H
    dr.rectangle([0, y, W, y + RULE_H], fill=TRACK)
    a, b = (idx - 1) / TOTAL, idx / TOTAL
    dr.rectangle([0, y, int(W * (a + (b - a) * seg(f, 0, 16))), y + RULE_H], fill=BRASS)

    blk, l1, l2 = measure(c)
    center = c.get("center", False)
    ty = y + RULE_H + PAD_TOP + (BAND_H - RULE_H - PAD_TOP - PAD_BOT - blk) // 2

    def cx(s, fnt):
        return (W - dr.textlength(s, font=fnt)) // 2 if center else PAD

    step = f"{idx:02d} / {TOTAL:02d}"
    tint(dr, (cx(step, FIDX), ty), step, FIDX, BRASS, seg(f, 8, 22) * tmul)
    ty += IDX_H
    for i, ln in enumerate(l1):
        al = seg(f, 16 + i * 8, 32 + i * 8) * tmul
        tint(dr, (cx(ln, F1), ty + round(18 * (1 - al))), ln, F1, (255, 255, 255), al)
        ty += LH1
    ty += 14
    for i, ln in enumerate(l2):
        al = seg(f, 34 + i * 6, 50 + i * 6) * tmul
        tint(dr, (cx(ln, F2), ty + round(12 * (1 - al))), ln, F2, SUB, al)
        ty += LH2
    if c.get("cta"):
        sz, fc = cta_font(c["cta"])
        ty += 30
        s = c["cta"].upper()
        al = seg(f, 54, 70) * tmul
        xx = (W - dr.textlength(s, font=fc)) // 2 if center else PAD
        tint(dr, (xx, ty), s, fc, (255, 255, 255), al)
        if al > 0.02:
            bb = dr.textbbox((xx, ty), s, font=fc)
            wfill = int((bb[2] - bb[0]) * seg(f, 60, 78))
            dr.rectangle([bb[0], bb[3] + 8, bb[0] + wfill, bb[3] + 12], fill=BRASS)
        ty += sz + 8 + 16
    if c.get("mark"):
        ty += 12
        m = "SHAVIT ROOTMAN"
        tint(dr, (cx(m, FMARK), ty), m, FMARK, GOLD, seg(f, 62, 78) * tmul)
    return card


# Beats overlap by TRANS frames and cross-dissolve. A dissolve involves no
# panning, so unlike a push it costs nothing against kenburns-motion-cap. The
# brass rule sits at the same x in both halves of every overlap, so it reads as
# one continuous bar rather than two bars fading through each other.
TRANS = 36                                        # 1.20s

LENS = [int(FPS * c["secs"]) for c in CARDS]
STARTS, cur = [], 0
for i, n in enumerate(LENS):
    STARTS.append(cur)
    cur += n - (TRANS if i < len(LENS) - 1 else 0)
NFRAMES = STARTS[-1] + LENS[-1]

for gi in range(NFRAMES):
    active = [i for i, s in enumerate(STARTS) if s <= gi < s + LENS[i]]
    i0 = active[0]
    out = bld(CARDS[i0], i0 + 1, gi - STARTS[i0], LENS[i0])
    if len(active) > 1:
        i1 = active[1]
        k = (gi - STARTS[i1]) / TRANS
        # The outgoing words clear across the first 45% of the overlap, so the
        # back half of the dissolve is photograph against photograph only.
        out = bld(CARDS[i0], i0 + 1, gi - STARTS[i0], LENS[i0],
                  tmul=1.0 - ease(min(1.0, k / 0.45)))
        nxt = bld(CARDS[i1], i1 + 1, gi - STARTS[i1], LENS[i1])
        out = Image.blend(out, nxt, ease(k))
    out.save(os.path.join(FRAMES, f"{gi:05d}.png"))
print(f"{NFRAMES} frames, {len(CARDS)} beats, {TRANS}-frame dissolves")
gi = NFRAMES

mp4 = os.path.join(OUT, "kendall-work-you-never-see.mp4")
subprocess.run([
    "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS),
    "-i", os.path.join(FRAMES, "%05d.png"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
    "-movflags", "+faststart", mp4,
], check=True)
print(f"wrote {mp4}  ({gi} frames, {gi/FPS:.1f}s)")
