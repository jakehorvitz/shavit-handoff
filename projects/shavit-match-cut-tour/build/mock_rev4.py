#!/usr/bin/env python3
"""Rev-4 spec mocks: (1) outro fading in OVER the house (no sky-fall),
(2) bold testimonial pulls. Renders real composited frames for the spec page."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

W, H = 1080, 1920
GOLD = (255, 192, 0, 255)
BRIC = "fonts/Bricolage.ttf"
MAN = "fonts/Manrope.ttf"

def F(path, size, weight):
    f = ImageFont.truetype(path, size)
    try: f.set_variation_by_axes([weight] if path == MAN else [size, 100, weight])
    except Exception:
        try: f.set_variation_by_axes([weight])
        except Exception: pass
    return f

def tracked(d, xy, text, f, fill, tracking=0.0, anchor_center=False):
    widths = [d.textlength(c, font=f) for c in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (W - total) / 2 if anchor_center else xy[0]
    y = xy[1]
    for c, w_ in zip(text, widths):
        d.text((x, y), c, font=f, fill=fill)
        x += w_ + tracking
    return total

def frame(src):
    im = Image.open(src).convert("RGB")
    # center-crop to 9:16 then fit 1080x1920
    tw = im.height * 9 // 16
    if im.width > tw:
        x0 = (im.width - tw) // 2
        im = im.crop((x0, 0, x0 + tw, im.height))
    return im.resize((W, H), Image.LANCZOS)

# ---------- 1 · outro-over-the-house mock: 3 moments of the fade ----------
house = frame("upscaled/after_ext_4k.jpg")
outro = Image.open("plates/outro.png").convert("RGBA")

for tag, dim, plate_a in [("a_house", 0.0, 0), ("b_mid", 0.30, 128), ("c_full", 0.55, 255)]:
    base = ImageEnhance.Brightness(house).enhance(1.0 - dim).convert("RGBA")
    if plate_a:
        p = outro.copy()
        alpha = p.getchannel("A").point(lambda v: v * plate_a // 255)
        p.putalpha(alpha)
        base.alpha_composite(p)
    base.convert("RGB").save(f"mocks/outro_house_{tag}.jpg", quality=90)
    print("mock", tag)

# ---------- 2 · bold testimonial mock: current 700 vs bold 800 on the kitchen ----------
kitchen = frame("upscaled/kitchen_4k.jpg")

def scrim(img):
    d = ImageDraw.Draw(img)
    top = int(H * 0.54)
    for i in range(H - top):
        a = int(165 * (i / (H - top)) ** 1.4)
        d.line([(0, top + i), (W, top + i)], fill=(0, 0, 0, a))

def word_mock(name, weight, stroke):
    img = kitchen.convert("RGBA")
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    scrim(ov)
    d = ImageDraw.Draw(ov)
    f_pull = F(BRIC, 68, weight)
    x0 = int(W * 0.08); y = int(H * 0.735)
    for ln in ["PROFESSIONAL", "ACROSS THE BOARD."]:
        d.text((x0, y), ln, font=f_pull, fill=(255, 255, 255, 255),
               stroke_width=stroke, stroke_fill=(255, 255, 255, 255))
        y += 76
    d.rectangle([x0, y + 16, x0 + 54, y + 19], fill=GOLD)
    f_attr = F(MAN, 27, 600)
    tracked(d, (x0, y + 34), "JEFFREY S. RILING — US VETERAN", f_attr, (245, 239, 225, 195), tracking=5.5)
    img.alpha_composite(ov)
    img.convert("RGB").save(f"mocks/{name}.jpg", quality=90)
    print("mock", name)

word_mock("word_current_700", 700, 0)
word_mock("word_bold_800", 800, 1)
