#!/usr/bin/env python3
"""Render a Charger/Shavit IG story in the approved 'clean story' format.

Format source: Shavit's 8/28/26 reference screenshot ("This is a clean story!"):
soft beige gradient canvas, thin typewriter caption top-center, two rounded-corner
photo cards staggered left/right, location sticker space bottom-right (Jake adds
the real sticker in the IG app).

Usage:
  python3 tools/render_story.py config.json
Config:
  {"caption": ["line one", "line two"],
   "top_photo": "path", "bottom_photo": "path",
   "top_label": "BEFORE", "bottom_label": "AFTER",   # optional, "" to omit
   "out": "story.png"}
"""
import json, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1080, 1920
# Rev 3 (Shavit 8/28 14:00 GC): background black-and-white ("color combination
# hard to read"), typewriter dropped ("AI text") — brand canvas + SF Pro, the
# face the shipped carousels used. Captions come in uppercase via the config.
FONT = "/System/Library/Fonts/SFNS.ttf"
CAPTION_WEIGHT = "Semibold"
DETAIL_WEIGHT = "Medium"

# monochrome charcoal gradient — brand black canvas, white type
STOPS = [(0.0, (28, 28, 28)), (0.30, (44, 44, 44)), (1.0, (14, 14, 14))]


def load_font(size, weight=None):
    f = ImageFont.truetype(FONT, size)
    if weight:
        try:
            f.set_variation_by_name(weight)
        except Exception:
            pass
    return f


def gradient_bg():
    im = Image.new("RGB", (W, H))
    px = im.load()
    for y in range(H):
        t = y / (H - 1)
        for (t0, c0), (t1, c1) in zip(STOPS, STOPS[1:]):
            if t0 <= t <= t1:
                f = (t - t0) / (t1 - t0)
                c = tuple(int(a + (b - a) * f) for a, b in zip(c0, c1))
                break
        for x in range(W):
            px[x, y] = c
    return im


def spaced_text(draw_target, xy, text, font, tracking, fill, anchor_center_x=None):
    widths = [font.getbbox(ch)[2] - font.getbbox(ch)[0] for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x, y = xy
    if anchor_center_x is not None:
        x = anchor_center_x - total // 2
    d = ImageDraw.Draw(draw_target)
    for ch, w in zip(text, widths):
        d.text((x, y), ch, font=font, fill=fill)
        x += w + tracking
    return total


def fit(lines, size, tracking, max_w=960, weight=None):
    """Shrink size/tracking until the widest line fits max_w."""
    while size > 24:
        font = load_font(size, weight)
        widest = max(
            sum(font.getbbox(ch)[2] - font.getbbox(ch)[0] for ch in ln) + tracking * (len(ln) - 1)
            for ln in lines
        )
        if widest <= max_w:
            return size, tracking
        if tracking > 4:
            tracking -= 2
        else:
            size -= 2
    return size, tracking


def caption_layer(lines, location=None, y0=88, size=62, tracking=14):
    """Returns (layer, y_end): caption block + optional smaller location line."""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    size, tracking = fit(lines, size, tracking, weight=CAPTION_WEIGHT)
    font = load_font(size, CAPTION_WEIGHT)
    blocks = [(lines, font, tracking, int(size * 1.42), (255, 255, 255, 250))]
    if location:
        lsize, ltrack = fit([location], 34, 6, weight=DETAIL_WEIGHT)
        blocks.append(([location], load_font(lsize, DETAIL_WEIGHT), ltrack, int(lsize * 1.42), (255, 255, 255, 200)))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    y = y0
    for blines, bfont, btrack, lh, _fill in blocks:
        for line in blines:
            spaced_text(shadow, (0, y + 4), line, bfont, btrack, (0, 0, 0, 200), anchor_center_x=W // 2 + 3)
            y += lh
        y += 14
    shadow = shadow.filter(ImageFilter.GaussianBlur(6))
    layer.alpha_composite(shadow)
    y = y0
    for blines, bfont, btrack, lh, fill in blocks:
        for line in blines:
            spaced_text(layer, (0, y), line, bfont, btrack, fill, anchor_center_x=W // 2)
            y += lh
        y += 14
    return layer, y


def card(photo_path, box, radius=36):
    x0, y0, x1, y1 = box
    cw, ch = x1 - x0, y1 - y0
    im = Image.open(photo_path).convert("RGB")
    # center-crop to card aspect
    target = cw / ch
    w, h = im.size
    if w / h > target:
        nw = int(h * target)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((cw, ch), Image.LANCZOS)
    mask = Image.new("L", (cw, ch), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, cw, ch], radius=radius, fill=255)
    return im, mask


def drop_shadow(box, radius=36, blur=26, alpha=80, dy=16):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    x0, y0, x1, y1 = box
    ImageDraw.Draw(layer).rounded_rectangle([x0, y0 + dy, x1, y1 + dy], radius=radius, fill=(0, 0, 0, 140))
    return layer.filter(ImageFilter.GaussianBlur(blur))


def label_layer(text, box, size=34, tracking=8):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if not text:
        return layer
    font = load_font(size, DETAIL_WEIGHT)
    x0, y0, x1, y1 = box
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    spaced_text(shadow, (x0 + 39, y1 - size - 35), text, font, tracking, (0, 0, 0, 255))
    layer.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(3)))
    spaced_text(layer, (x0 + 36, y1 - size - 38), text, font, tracking, (255, 255, 255, 250))
    return layer


def render(cfg):
    bg = gradient_bg().convert("RGBA")
    cap, cap_end = caption_layer(cfg["caption"], cfg.get("location"), size=cfg.get("caption_size", 62))
    # cards fill the space below the caption block, staggered left/right
    top = cap_end + 26
    gap = 18
    card_h = (1874 - top - gap) // 2
    top_box = (0, top, 935, top + card_h)
    bot_box = (145, top + card_h + gap, W, 1874)
    for box, key, lkey in [(top_box, "top_photo", "top_label"), (bot_box, "bottom_photo", "bottom_label")]:
        bg.alpha_composite(drop_shadow(box))
        im, mask = card(cfg[key], box)
        bg.paste(im, (box[0], box[1]), mask)
        bg.alpha_composite(label_layer(cfg.get(lkey, ""), box))
    bg.alpha_composite(cap)
    out = cfg["out"]
    bg.convert("RGB").save(out, quality=95)
    print("wrote", out)


if __name__ == "__main__":
    render(json.load(open(sys.argv[1])))
