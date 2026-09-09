#!/usr/bin/env python3
"""S1/O1 rebuild: paint out door numbers (clone, invisible), render website-language
plates (Bricolage, split-gold wordmark, eyebrow tracking) as full-frame overlay PNGs."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

W, H = 1080, 1920
GOLD = (255, 192, 0, 255)          # site --color-brass
IVORY = (245, 239, 225, 255)
BRIC = "fonts/Bricolage.ttf"
MAN = "fonts/Manrope.ttf"

def F(path, size, weight):
    f = ImageFont.truetype(path, size)
    try: f.set_variation_by_axes([weight] if path == MAN else [size, 100, weight])
    except Exception:
        try: f.set_variation_by_axes([weight])
        except Exception: pass
    return f

def tracked(d, xy, text, f, fill, tracking=0.0, anchor_center=False, W_=W):
    """Draw text with letter-spacing (tracking in px per char)."""
    widths = [d.textlength(c, font=f) for c in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (W_ - total) / 2 if anchor_center else xy[0]
    y = xy[1]
    for c, w_ in zip(text, widths):
        d.text((x, y), c, font=f, fill=fill)
        x += w_ + tracking
    return total

# ---------- 1 · paint the door number out of the before-still (clone siding) ----------
def paint_out(src, dst, box, src_off):
    im = Image.open(src).convert("RGB")
    sx = im.width / W; sy = im.height / H          # scale from 1080x1920 coords
    x, y, w_, h_ = [int(v) for v in (box[0]*sx, box[1]*sy, box[2]*sx, box[3]*sy)]
    patch = im.crop((x + int(src_off*sx), y, x + int(src_off*sx) + w_, y + h_))
    patch = patch.filter(ImageFilter.GaussianBlur(0.6))
    im.paste(patch, (x, y))
    im.save(dst, quality=95)
    print("painted", dst)

# before still: "12" on the white door trim ~ (272,1322) 66x58 in 1080x1920 space; clone from 90px left
paint_out("prepped/before_ext.jpg", "prepped/before_ext_clean.jpg", (268, 1318, 74, 66), -95)

# ---------- 2 · S1 testimonial plates: full-frame, bottom scrim, left-aligned ----------
def scrim(img):
    d = ImageDraw.Draw(img)
    top = int(H * 0.54)
    for i in range(H - top):
        a = int(165 * (i / (H - top)) ** 1.4)
        d.line([(0, top + i), (W, top + i)], fill=(0, 0, 0, a))

def s1_plate(name, lines, attr):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    scrim(img)
    d = ImageDraw.Draw(img)
    f_pull = F(BRIC, 68, 800)      # B1: true bold + hairline stroke
    x0 = int(W * 0.08); y = int(H * 0.735)
    for ln in lines:
        d.text((x0, y), ln, font=f_pull, fill=(255, 255, 255, 255),
               stroke_width=1, stroke_fill=(255, 255, 255, 255))
        y += 76
    d.rectangle([x0, y + 16, x0 + 54, y + 19], fill=GOLD)           # gold rule
    f_attr = F(MAN, 27, 600)
    tracked(d, (x0, y + 34), attr, f_attr, (245, 239, 225, 195), tracking=5.5)
    img.save(f"plates/{name}.png"); print("plate", name)

s1_plate("w1", ["PROFESSIONAL", "ACROSS THE BOARD."], "JEFFREY S. RILING — US VETERAN")
s1_plate("w2", ["A MAN OF HIS WORD."],                "NICKY — CLEVELAND INVESTOR")
s1_plate("w3", ["TRUSTWORTHY FRIEND."],               "NICKY — CLEVELAND INVESTOR")
s1_plate("w4", ["MAKES YOU FEEL", "LIKE FAMILY."],    "JEFFREY S. RILING — US VETERAN")

# ---------- 3 · payoff title + address (S1 grammar) ----------
img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); scrim(img)
d = ImageDraw.Draw(img)
f_t = F(BRIC, 84, 800)
x0 = int(W * 0.08); y = int(H * 0.70)
for ln in ["THE HOUSE THAT", "CAME BACK."]:
    d.text((x0, y), ln, font=f_t, fill=(255, 255, 255, 255),
           stroke_width=1, stroke_fill=(255, 255, 255, 255)); y += 92
d.rectangle([x0, y + 18, x0 + 54, y + 21], fill=GOLD)
# address — prominent location line (register-safe: street + city + state, no house number)
tracked(d, (x0, y + 38), "RIVER STREET", F(MAN, 34, 700), (255,255,255,255), tracking=3.5)
tracked(d, (x0, y + 82), "HILLSDALE, MICHIGAN", F(MAN, 27, 600), (245,239,225,205), tracking=4.5)
img.save("plates/title.png"); print("plate title (with prominent address)")

# ---------- 4 · O1 outro: site footer replica ----------
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
cy = int(H * 0.40)
f_eye = F(MAN, 26, 700)
tracked(d, (0, cy), "BUILT IN MICHIGAN, OHIO & INDIANA", f_eye, GOLD, tracking=7.0, anchor_center=True)
# split-gold wordmark
f_wm = F(BRIC, 92, 700)
w1 = d.textlength("SHAVIT ", font=f_wm); w2 = d.textlength("ROOTMAN", font=f_wm)
xw = (W - (w1 + w2)) / 2; yw = cy + 64
d.text((xw, yw), "SHAVIT ", font=f_wm, fill=(255, 255, 255, 255))
d.text((xw + w1, yw), "ROOTMAN", font=f_wm, fill=GOLD)
f_sub = F(MAN, 21, 500)
tracked(d, (0, yw + 128), "MADE IN AMERICA · LOCAL TO THE MIDWEST", f_sub, (245,239,225,140), tracking=6.0, anchor_center=True)
# gold CTA pill
f_cta = F(MAN, 25, 800)
cta = "WORK WITH ME"
cw = sum(d.textlength(c, font=f_cta) for c in cta) + 6.0 * (len(cta) - 1)
bx = (W - cw) / 2 - 34; by = yw + 210
d.rounded_rectangle([bx, by, bx + cw + 68, by + 66], radius=6, fill=GOLD)
tracked(d, (0, by + 18), cta, f_cta, (10, 10, 10, 255), tracking=6.0, anchor_center=True)
# disclosure
f_dis = F(MAN, 15, 500)
tracked(d, (0, int(H * 0.93)), "AI-ASSISTED VISUALIZATION", f_dis, (255,255,255,80), tracking=4.0, anchor_center=True)
img.save("plates/outro.png"); print("plate outro (O1 footer replica)")
