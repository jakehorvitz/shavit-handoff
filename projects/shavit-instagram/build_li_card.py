#!/usr/bin/env python3
"""
Shavit Rootman — LinkedIn relaunch announcement image (square 1200x1200).

Cinematic (banner-quality) but its OWN thing, not a banner clone:
  - different hero house (Budlong Street, not the banner's 17 Lo Presto)
  - NO glowing house icon
  - clean wordmark, NO bracket/border (Shavit dislikes the box)
  - wordmark reads SHAVIT ROOTMAN + "ONE STOP SHOP REAL ESTATE"
  - gold letterspaced eyebrow + huge white "LIVE WITH US. / WORK WITH US." headline

Output: assets/tiles/li_announcement.jpg  1200x1200
"""
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import pathlib

ROOT = pathlib.Path(__file__).parent
OUT  = ROOT / "assets" / "tiles" / "li_announcement.jpg"
SITE = pathlib.Path.home() / "projects/shavit-rootman-website/site/public/assets/properties"
PHOTO = SITE / "budlong-street/01.jpg"

BLACK = (0, 0, 0)
INK   = (255, 255, 255)
GOLD  = (255, 192, 0)

HN = "/System/Library/Fonts/HelveticaNeue.ttc"
def font(size, weight="bold"):
    idx = {"light": 7, "regular": 0, "medium": 10, "bold": 1}[weight]
    return ImageFont.truetype(HN, max(1, int(size)), index=idx)

def tracked_w(draw, text, f, tracking=0.0):
    return sum(draw.textlength(c, font=f) for c in text) + tracking * max(0, len(text) - 1)

def tracked(draw, xy, text, f, fill, tracking=0.0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textlength(ch, font=f) + tracking
    return x - xy[0]

SS = 2
S = 1200 * SS
pad = int(S * 0.062)

# ---- full-bleed hero photo, darkened + desaturated -------------------------
src = Image.open(PHOTO).convert("RGB")
ar = src.width / src.height
if 1 > ar:
    nw, nh = S, int(S / ar)
else:
    nw, nh = int(S * ar), S
src = src.resize((nw, nh), Image.LANCZOS)
ox = (nw - S) // 2
oy = int((nh - S) * 0.02)   # crop from the top so the full house (roof→foundation) is in frame
img = src.crop((ox, oy, ox + S, oy + S))
img = ImageEnhance.Color(img).enhance(0.62)
img = Image.blend(img, Image.new("RGB", (S, S), BLACK), 0.40)

# top scrim (no border now, so the wordmark needs a darker bed up top)
top = Image.new("L", (1, S), 0); td = top.load()
for j in range(S):
    t = max(0.0, 1 - j / (S * 0.40))
    td[0, j] = int(238 * t * t)
img.paste(Image.new("RGB", (S, S), BLACK), (0, 0), top.resize((S, S)))

# bottom scrim (carries the headline)
bot = Image.new("L", (1, S), 0); bd = bot.load()
for j in range(S):
    t = max(0.0, (j / S - 0.42) / 0.58)
    bd[0, j] = int(236 * t * t)
img.paste(Image.new("RGB", (S, S), BLACK), (0, 0), bot.resize((S, S)))

d = ImageDraw.Draw(img)

# ---- wordmark, top-right, clean (no bracket) -------------------------------
wm_s = int(S * 0.033)
f_wm = font(wm_s, "bold")
wm_track = wm_s * 0.20
w1, w2 = "SHAVIT ", "ROOTMAN"
tw = tracked_w(d, w1, f_wm, wm_track) + tracked_w(d, w2, f_wm, wm_track)
ty = int(S * 0.070)
tx = S - pad - tw
tx += tracked(d, (tx, ty), w1, f_wm, INK, wm_track)
tracked(d, (tx, ty), w2, f_wm, GOLD, wm_track)

# subtitle line under the wordmark
sub_s = int(S * 0.0165)
f_sub = font(sub_s, "bold")
sub_track = sub_s * 0.44
sub = "ONE STOP SHOP REAL ESTATE"
sw = tracked_w(d, sub, f_sub, sub_track)
tracked(d, (S - pad - sw, ty + wm_s * 1.42), sub, f_sub, GOLD, sub_track)

# ---- headline block, bottom-left -------------------------------------------
eyebrow_s = int(S * 0.030)
head_s    = int(S * 0.118)
f_eye  = font(eyebrow_s, "bold")
f_head = font(head_s, "bold")
eye_track  = eyebrow_s * 0.26
head_track = -head_s * 0.022
line_h = head_s * 1.05
gap    = int(S * 0.036)

total = eyebrow_s + gap + line_h * 2
y = S - pad - total
tracked(d, (pad, y), "MICHIGAN  ·  OHIO  ·  INDIANA", f_eye, GOLD, eye_track)
y += eyebrow_s + gap
for line in ("LIVE WITH US.", "WORK WITH US."):
    tracked(d, (pad, y), line, f_head, INK, head_track)
    y += line_h

img = img.resize((1200, 1200), Image.LANCZOS)
OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, "JPEG", quality=95, optimize=True, progressive=True)
print(f"wrote {OUT}  1200x1200")
