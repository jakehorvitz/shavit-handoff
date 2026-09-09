#!/usr/bin/env python3
"""
Shavit Rootman — social cover/banner art.

Mirrors the LIVE shavitrootman.com (verified 2026-07-09, not the stale navy/orange
screenshot and not the black+brass redesign branch):

  canvas    #000000        ink #ffffff        muted #8a8a8a
  accent    #FFC000  (gold — wordmark second word, CTA fill, hairline marks)
  headline  Bricolage Grotesque 700, UPPERCASE, letter-spacing -2px @120px
            → substituted with Helvetica Neue Bold + proportional negative tracking
  hero      full-bleed darkened property photo, left-aligned type, periods on lines
  wordmark  "SHAVIT" white + "ROOTMAN" gold, letterspaced, in a hairline bracket

Outputs:
  assets/tiles/cover_fb.jpg   1640x624   Facebook Page cover
  assets/tiles/cover_li.jpg   1584x396   LinkedIn profile background

No claims, no numbers. States are named because shavitrootman.com states them publicly.
"""
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import pathlib

ROOT = pathlib.Path(__file__).parent
TILES = ROOT / "assets" / "tiles"
# Full-res exteriors from the live site's asset library (1600px) — the 640px
# tiles are far too small and too portrait for a 2.6:1 banner.
SITE = pathlib.Path.home() / "projects/shavit-rootman-website/site/public/assets/properties"

BLACK = (0, 0, 0)
INK   = (255, 255, 255)
GOLD  = (255, 192, 0)
MUTED = (138, 138, 138)

HN = "/System/Library/Fonts/HelveticaNeue.ttc"
def font(size, weight="bold"):
    idx = {"light": 7, "regular": 0, "medium": 10, "bold": 1}[weight]
    return ImageFont.truetype(HN, max(1, int(size)), index=idx)


def tracked(draw, xy, text, f, fill, tracking=0.0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textlength(ch, font=f) + tracking
    return x - xy[0]


def tracked_w(draw, text, f, tracking=0.0):
    return sum(draw.textlength(c, font=f) for c in text) + tracking * max(0, len(text) - 1)


def compose(w, h, photo, out, *, safe_bottom=0.0, focus=0.5,
            wordmark=("SHAVIT ", "ROOTMAN"), brackets=True,
            text_valign="center", darken=0.44):
    SS = 2
    W, H = w * SS, h * SS

    # ---- full-bleed hero photo, darkened + desaturated like the site -------
    src = Image.open(photo).convert("RGB")
    ar = src.width / src.height
    if W / H > ar:
        nw, nh = W, int(W / ar)
    else:
        nw, nh = int(H * ar), H
    src = src.resize((nw, nh), Image.LANCZOS)
    ox = (nw - W) // 2
    oy = int((nh - H) * focus)
    img = src.crop((ox, oy, ox + W, oy + H))

    img = ImageEnhance.Color(img).enhance(0.62)      # desaturate, not drain
    img = Image.blend(img, Image.new("RGB", (W, H), BLACK), darken)

    # left-to-right scrim so the headline always sits on near-black
    scrim = Image.new("L", (W, 1), 0)
    sd = scrim.load()
    for i in range(W):
        t = min(1.0, i / (W * 0.72))
        t = t * t * (3 - 2 * t)
        sd[i, 0] = int(232 * (1 - t))
    img.paste(Image.new("RGB", (W, H), BLACK), (0, 0), scrim.resize((W, H)))

    # bottom vignette (keeps platform chrome legible)
    vg = Image.new("L", (1, H), 0)
    vd = vg.load()
    for j in range(H):
        t = max(0.0, (j / H - 0.68) / 0.32)
        vd[0, j] = int(165 * t * t)
    img.paste(Image.new("RGB", (W, H), BLACK), (0, 0), vg.resize((W, H)))

    d = ImageDraw.Draw(img)

    pad = int(W * 0.052)
    block_h = H * (1 - safe_bottom)

    # ---- type scale --------------------------------------------------------
    eyebrow_s = int(H * 0.046)
    head_s    = int(H * 0.185)
    f_eye  = font(eyebrow_s, "bold")
    f_head = font(head_s, "bold")

    eye_track  = eyebrow_s * 0.24
    head_track = -head_s * 0.022                 # the site's -2px @120px

    line_h = head_s * 1.06
    gap    = int(H * 0.052)

    total = eyebrow_s + gap + line_h * 2
    if text_valign == "top":
        # LinkedIn overlays the circular profile photo over the bottom-left of
        # the banner — keep the whole headline block up top so his face never
        # covers it.
        y = H * 0.065
    else:
        y = block_h * 0.5 - total / 2

    # eyebrow — the site letterspaces these hard
    tracked(d, (pad, y), "MICHIGAN  ·  OHIO  ·  INDIANA", f_eye, GOLD, eye_track)
    y += eyebrow_s + gap

    # headline — uppercase, tight, with periods (site style)
    for line in ("LIVE WITH US.", "WORK WITH US."):
        tracked(d, (pad, y), line, f_head, INK, head_track)
        y += line_h

    # ---- wordmark, top-right: first word white, second word gold
    wm_s = int(H * 0.052)
    f_wm = font(wm_s, "bold")
    wm_track = wm_s * 0.20
    w1, w2 = wordmark
    tw = tracked_w(d, w1, f_wm, wm_track) + tracked_w(d, w2, f_wm, wm_track)
    if brackets:
        # hairline frame + gold corner ticks (site style)
        bx2 = W - pad
        bx1 = bx2 - tw - wm_s * 1.7
        by1 = int(H * 0.085)
        by2 = by1 + wm_s * 2.3
        hair = max(1, int(H * 0.0035))
        d.rectangle([bx1, by1, bx2, by2], outline=(200, 200, 200), width=hair)
        tick = int(wm_s * 0.30)
        for cx, cy in ((bx1, by1), (bx2, by2)):
            d.rectangle([cx - tick // 2, cy - tick // 2, cx + tick // 2, cy + tick // 2], fill=GOLD)
        tx = bx1 + wm_s * 0.85
        ty = by1 + (by2 - by1 - wm_s * 1.18) / 2
    else:
        # clean wordmark, no frame — right-aligned at the top
        tx = W - pad - tw
        ty = int(H * 0.085)
    tx += tracked(d, (tx, ty), w1, f_wm, INK, wm_track)
    tracked(d, (tx, ty), w2, f_wm, GOLD, wm_track)

    img = img.resize((w, h), Image.LANCZOS)
    img.save(out, "JPEG", quality=94, optimize=True, progressive=True)
    print(f"wrote {out.name}  {w}x{h}")


if __name__ == "__main__":
    compose(1640, 624, SITE / "17-lo-presto/01.jpg",   TILES / "cover_fb.jpg", safe_bottom=0.14, focus=0.52)
    # LinkedIn: headline pinned to the top so the circular profile photo
    # (auto-overlaid bottom-left by LinkedIn) never covers it; clean wordmark,
    # no bracket frame; brighter so it reads as high quality.
    compose(1584, 396, SITE / "17-lo-presto/01.jpg", TILES / "cover_li.jpg",
            focus=0.40, text_valign="top", brackets=False, darken=0.34,
            wordmark=("ONE STOP SHOP ", "REAL ESTATE"))
