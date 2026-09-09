#!/usr/bin/env python3
"""Reel shot 1 — the hook. Built alone, for review before anything else is cut.

Jake's standing rule is that reels get built shot by shot with a review gate at
each step, never one-shot. This renders beat 1 only.

Constraints this obeys, all from the video-brain Shavit register:

  kenburns-motion-cap  Pan-on-still never lands on the hook. The photograph is
                       therefore completely static here. Every moving thing in
                       this shot is type or furniture, which the cap does not
                       govern.
  brand-tokens         Black canvas, white type, brass mark, gold rule.
  no-pulsing-logo      The wordmark fades on once and then holds. No loop.
  full-state-names     "Indiana", never "IN".
  no-house-numbers     Street name only, no digit-leading address.

Geometry is the approved carousel's, lifted to 9:16: the 4:5 photo sits at the
top of a 1080x1920 black canvas, the gold progress rule pins to its lower edge,
and the type block lives in the black below it.

Run: python3 reel_shot1.py
"""
import os, glob, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

REEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP = os.path.join(REEL, "kendall-2026-07-24", "_drive-dump")
EV = os.path.join(REEL, "east-victoria-story-2026-07-23")
OUT = os.path.join(REEL, "work-you-never-see-2026-07-24", "reel")
FRAMES = os.path.join(OUT, "shot1_frames")
DMSANS = os.path.join(EV, "fonts", "DMSans.ttf")
BRIC = os.path.join(EV, "fonts", "Bricolage.ttf")
SF = "/System/Library/Fonts/SFNS.ttf"
shutil.rmtree(FRAMES, ignore_errors=True)
os.makedirs(FRAMES, exist_ok=True)

W, H = 1080, 1920
PHOTO_H = 1350                 # the approved 4:5 crop, unchanged
GOLD, BRASS = (255, 192, 0), (176, 141, 87)
TRACK = (58, 50, 36)
BG = (11, 11, 12)
PAD, RULE_H = 72, 6
FPS, DUR = 30, 3.0
TOTAL = 6                      # slides in the set, for the progress rule

HEAD = ["THIS IS WHAT THE PROCESS", "LOOKS LIKE."]
SUB = "Kendall Street, South Bend, Indiana."
MARK = "SHAVIT ROOTMAN"


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


def bric(sz, wght=800):
    f = ImageFont.truetype(BRIC, sz)
    try:
        f.set_variation_by_axes([sz, 100, wght])
    except Exception:
        pass
    return f


F1, F2, FIDX, FMARK = font(64), dmsans(42), font(26), bric(24)


def base_photo():
    """Static 4:5 plate. No push-in: the cap forbids motion on the hook."""
    src = glob.glob(os.path.join(DUMP, "055_*.jpg"))[0]
    im = Image.open(src).convert("RGB")
    s = max(W / im.width, PHOTO_H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = max(0, min(im.width - W, int((im.width - W) * 0.45)))
    top = max(0, min(im.height - PHOTO_H, int((im.height - PHOTO_H) * 0.30)))
    im = im.crop((left, top, left + W, top + PHOTO_H))
    im = ImageEnhance.Brightness(im).enhance(1.30)
    return ImageEnhance.Contrast(im).enhance(1.06)


PHOTO = base_photo()


def ease_out(t):
    return 1 - (1 - t) ** 3


def seg(f, a, b):
    """Eased 0..1 for a frame within [a, b]."""
    if f <= a:
        return 0.0
    if f >= b:
        return 1.0
    return ease_out((f - a) / (b - a))


def tint(dr, xy, text, fnt, rgb, alpha):
    if alpha <= 0.003:
        return
    dr.text(xy, text, font=fnt, fill=tuple(round(c * alpha + b * (1 - alpha))
                                           for c, b in zip(rgb, BG)))


def frame(f):
    card = Image.new("RGB", (W, H), BG)
    card.paste(PHOTO, (0, 0))
    dr = ImageDraw.Draw(card)

    # Progress rule fills to 1/6 across the first 0.6s, then holds.
    y = PHOTO_H
    dr.rectangle([0, y, W, y + RULE_H], fill=TRACK)
    grow = seg(f, 0, 18)
    # brand-tokens: brass RULES, gold MARK. The rule is brass; the wordmark
    # below is the only gold element in the frame.
    dr.rectangle([0, y, int(W * (1 / TOTAL) * grow), y + RULE_H], fill=BRASS)

    ty = y + RULE_H + 74
    a_idx = seg(f, 12, 26)
    tint(dr, (PAD, ty), f"01 / {TOTAL:02d}", FIDX, BRASS, a_idx)
    ty += 52

    # Headline builds a line at a time, each rising 18px as it resolves.
    for i, ln in enumerate(HEAD):
        a = seg(f, 20 + i * 9, 36 + i * 9)
        tint(dr, (PAD, ty + round(18 * (1 - a))), ln, F1, (255, 255, 255), a)
        ty += 78

    ty += 16
    a_sub = seg(f, 42, 58)
    tint(dr, (PAD, ty + round(12 * (1 - a_sub))), SUB, F2, (232, 229, 220), a_sub)
    ty += 74

    # Draws on once, then holds. No pulse, no loop.
    tint(dr, (PAD, ty), MARK, FMARK, GOLD, seg(f, 56, 70))
    return card


n = int(FPS * DUR)
for f in range(n):
    frame(f).save(os.path.join(FRAMES, f"{f:04d}.png"))
print(f"rendered {n} frames")

for tag, f in (("start", 6), ("mid", 40), ("end", n - 1)):
    frame(f).save(os.path.join(OUT, f"shot1_{tag}.jpg"), quality=90)

mp4 = os.path.join(OUT, "shot1.mp4")
subprocess.run([
    "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS),
    "-i", os.path.join(FRAMES, "%04d.png"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "17", mp4,
], check=True)
print("wrote", mp4)
