#!/usr/bin/env python3
"""
Rebuild of "Shavit — Long Form 1 (Collage)" as a NATIVE 9:16 vertical reel.

Source of truth for timing/content: the original 16:9 film (assets/films/),
scene-cut forensics July 2026. Changes requested by Jake (Jul 3 2026):
  - "WRITTEN OFF / REBUILT" caption -> just "REBUILT"
  - Address tags (RIVER STREET etc.) noticeably bigger
  - Dark dusk East-Saint-Joe shot under "A DIFFERENT ENDING" removed;
    caption appears ONCE, on the bright after-shot only
  - No snap-back transitions: every dissolve resolves fully before its scene
    ends; scene boundaries use symmetric crossfades
  - No stray black frames mid-film

Imagery: 12 full-frame plates outpainted to 9:16 by Higgsfield (assets/plates916/),
plus landscape band crops for the split/3-up collage scenes.
Audio: the original film's own soundtrack, untouched.

Run: python3 build_longform1_vertical.py
Out: deliver/Shavit — Long Form 1 (Collage) — Vertical Remaster 9x16.mp4
"""
import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
PLATES = ROOT / "assets/plates916"
CROPPED = ROOT / "assets/cropped"
HEROES = ROOT / "assets/heroes"
OUT_DIR = ROOT / "deliver"
AUDIO = ROOT / "build/longform1_audio_midwest.m4a"  # heartland-rock bed (Pixabay 307616), Shavit 7/3: Midwest music
OUT = OUT_DIR / "Shavit — Long Form 1 (Collage) — Vertical Remaster 9x16.mp4"

W, H = 1080, 1920
FPS = 30
DUR = 47.933
N_FRAMES = int(round(DUR * FPS))  # 1438

WHITE = (255, 255, 255)
GOLD = (255, 192, 0)
BRASS = (176, 141, 87)

# render scenes on an oversized canvas so Ken Burns never shows edges
KB = 1.14
RW, RH = int(W * KB), int(H * KB)

XFADE = 0.42  # seconds, symmetric crossfade at scene boundaries


def font(size, bold=True):
    for c in (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ):
        if Path(c).exists():
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


def fit_cover(im, size, x_bias=0.5, y_bias=0.5):
    im = im.convert("RGB")
    scale = max(size[0] / im.width, size[1] / im.height)
    nw, nh = math.ceil(im.width * scale), math.ceil(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    x = int((nw - size[0]) * x_bias)
    y = int((nh - size[1]) * y_bias)
    return im.crop((x, y, x + size[0], y + size[1]))


def grade(im, mode):
    im = im.convert("RGB")
    if mode == "cold":
        im = ImageEnhance.Color(im).enhance(0.30)
        im = ImageEnhance.Contrast(im).enhance(1.06)
        return Image.blend(im, Image.new("RGB", im.size, (10, 24, 42)), 0.16)
    if mode == "before":
        im = ImageEnhance.Color(im).enhance(0.58)
        return Image.blend(im, Image.new("RGB", im.size, (0, 22, 44)), 0.22)
    if mode == "warm":
        im = ImageEnhance.Color(im).enhance(1.12)
        return Image.blend(im, Image.new("RGB", im.size, (98, 48, 0)), 0.16)
    return im


def shade(im):
    """Cinematic top/bottom luminance ramps (RGBA composite)."""
    w, h = im.size
    alpha = np.full((h, w), 40, dtype=np.uint8)
    top_h = int(h * 0.16)
    alpha[:top_h, :] = np.maximum(alpha[:top_h, :], np.linspace(80, 0, top_h, dtype=np.uint8)[:, None])
    start, end = int(h * 0.55), int(h * 0.88)
    ramp = np.clip((np.arange(h) - start) / (end - start), 0, 1)
    alpha = np.maximum(alpha, (120 * ramp).astype(np.uint8)[:, None])
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    overlay.putalpha(Image.fromarray(alpha, "L"))
    return Image.alpha_composite(im.convert("RGBA"), overlay)


def text_size(draw, txt, fnt):
    b = draw.textbbox((0, 0), txt, font=fnt)
    return b[2] - b[0], b[3] - b[1]


def tracked(draw, xy, txt, fnt, fill, tracking, anchor_center_x=None, shadow=None):
    """Letterspaced text; if anchor_center_x set, centers the tracked run on it."""
    widths = [draw.textbbox((0, 0), ch, font=fnt)[2] for ch in txt]
    total = sum(widths) + tracking * (len(txt) - 1)
    x0 = (anchor_center_x - total / 2) if anchor_center_x is not None else xy[0]
    y = xy[1]
    passes = ([(3, 3, shadow)] if shadow else []) + [(0, 0, fill)]
    for dx, dy, col in passes:
        x = x0
        for ch, cw in zip(txt, widths):
            draw.text((x + dx, y + dy), ch, font=fnt, fill=col)
            x += cw + tracking


def caption_layer(main_lines, sub=None, main_size=96, sub_size=40, y_center=0.52,
                  gold=True, sub_tracking=14):
    """Centered gold headline + letterspaced white subline, like the original."""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    fnt = font(main_size)
    line_h = int(main_size * 1.14)
    total_h = line_h * len(main_lines) + (sub_size + 46 if sub else 0)
    y = int(H * y_center - total_h / 2)
    for line in main_lines:
        tw, _ = text_size(d, line, fnt)
        # soft shadow for legibility on bright plates
        d.text((int((W - tw) / 2) + 4, y + 4), line, font=fnt, fill=(0, 0, 0, 200))
        d.text((int((W - tw) / 2), y), line, font=fnt, fill=(GOLD if gold else WHITE) + (255,))
        y += line_h
    if sub:
        sf = font(sub_size)
        tracked(d, (0, y + 26), sub, sf, WHITE + (245,), sub_tracking,
                anchor_center_x=W / 2, shadow=(0, 0, 0, 190))
    return layer


def address_layer(name, sub):
    """Bigger address tags (Jake: 'addresses need to be bigger')."""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    nf = font(64)
    tw, th = text_size(d, name, nf)
    y = H - 430
    d.text((int((W - tw) / 2) + 3, y + 3), name, font=nf, fill=(0, 0, 0, 170))
    d.text((int((W - tw) / 2), y), name, font=nf, fill=WHITE + (255,))
    tracked(d, (0, y + th + 26), sub, font(44), WHITE + (245,), 12,
            anchor_center_x=W / 2, shadow=(0, 0, 0, 190))
    return layer


def label_chip(layer, txt, cx, y, size=40, tracking=10, fill=None):
    d = ImageDraw.Draw(layer)
    tracked(d, (0, y), txt, font(size), (fill or WHITE) + (250,), tracking,
            anchor_center_x=cx, shadow=(0, 0, 0, 200))


def plate(path, mode=None, size=(RW, RH), x_bias=0.5, y_bias=0.5):
    im = fit_cover(Image.open(path), size, x_bias=x_bias, y_bias=y_bias)
    if mode:
        im = grade(im, mode)
    return im


def stack_bands(paths, labels, modes=None, gap=8):
    """N landscape images stacked as full-width bands on the oversized canvas."""
    base = Image.new("RGB", (RW, RH), (6, 6, 6))
    n = len(paths)
    band_h = (RH - gap * (n - 1)) // n
    layer = Image.new("RGBA", (RW, RH), (0, 0, 0, 0))
    y = 0
    for i, p in enumerate(paths):
        im = fit_cover(Image.open(p), (RW, band_h))
        if modes and modes[i]:
            im = grade(im, modes[i])
        base.paste(im, (0, y))
        if labels and labels[i]:
            label_chip(layer, labels[i], RW * (0.5), y + 36, size=64, tracking=14)
        y += band_h + gap
    return Image.alpha_composite(base.convert("RGBA"), layer).convert("RGB")


class OutroScene:
    """The ORIGINAL film's animated Shavit outro (draw-on logo), embedded
    centered on the vertical canvas. The source outro sits on pure black,
    so the letterbox is invisible. Frames pre-extracted at 30fps into
    build/outro_frames/ by:
      ffmpeg -ss 41.966667 -i <original film> -vf fps=30,scale=1080:-2 f%04d.png
    """

    def __init__(self, t0, t1):
        self.t0, self.t1 = t0, t1
        self.files = sorted((ROOT / "build/outro_frames").glob("f*.png"))
        if not self.files:
            raise SystemExit("outro frames missing — run the ffmpeg extract first")
        self.cache = {}

    def frame(self, t):
        i = min(max(int(round((t - self.t0) * FPS)), 0), len(self.files) - 1)
        if i not in self.cache:
            src = Image.open(self.files[i]).convert("RGB")
            canvas = Image.new("RGB", (W, H), (0, 0, 0))
            canvas.paste(src, ((W - src.width) // 2, (H - src.height) // 2))
            self.cache[i] = canvas
        return self.cache[i]


def outro_frame():
    base = Image.new("RGBA", (RW, RH), (0, 0, 0, 255))
    d = ImageDraw.Draw(base)
    cx, cy = RW // 2, RH // 2 - 140
    d.line((cx - 74, cy, cx, cy - 74, cx + 74, cy), fill=GOLD + (255,), width=9)
    d.rectangle((cx - 74, cy, cx + 74, cy + 96), outline=GOLD + (255,), width=9)
    d.rectangle((cx - 16, cy + 40, cx + 16, cy + 96), outline=GOLD + (255,), width=7)
    d.text((cx, cy + 165), "SHAVIT", font=font(86), fill=WHITE + (255,), anchor="ma")
    d.text((cx, cy + 275), "ROOTMAN", font=font(86), fill=GOLD + (255,), anchor="ma")
    d.line((cx - 150, cy + 415, cx + 150, cy + 415), fill=BRASS + (255,), width=4)
    tracked(d, (0, cy + 450), "REAL ESTATE, OPERATED.", font(32), WHITE + (230,), 10, anchor_center_x=cx)
    return base.convert("RGB")


# ---------------------------------------------------------------- scenes ----
# Each scene: start, end, base(t01) -> RW x RH RGB, overlay RGBA (static),
# kb = (zoom_from, zoom_to, pan_x_from,to, pan_y_from,to) in fractions.

def kb_crop(im, t01, z0, z1, x0, x1, y0, y1):
    z = z0 + (z1 - z0) * t01
    cw, ch = int(W * KB / z), int(H * KB / z)
    cw, ch = min(cw, RW), min(ch, RH)
    px = (x0 + (x1 - x0) * t01) * (RW - cw)
    py = (y0 + (y1 - y0) * t01) * (RH - ch)
    return im.crop((int(px), int(py), int(px) + cw, int(py) + ch)).resize((W, H), Image.Resampling.BILINEAR)


def smoothstep(a):
    return a * a * (3 - 2 * a)


class Scene:
    def __init__(self, t0, t1, bases, overlay=None, kb=(1.0, 1.07, 0.5, 0.5, 0.5, 0.5),
                 dissolve=None):
        """bases: [img] or [img_a, img_b] with dissolve=(f_start, f_end) in scene fraction."""
        self.t0, self.t1 = t0, t1
        self.bases = bases
        self.overlay = overlay
        self.kb = kb
        self.dissolve = dissolve

    def frame(self, t):
        f = (t - self.t0) / (self.t1 - self.t0)
        f = min(max(f, 0.0), 1.0)
        img = kb_crop(self.bases[0], f, *self.kb)
        if len(self.bases) > 1:
            a, b = self.dissolve
            mix = smoothstep(min(max((f - a) / (b - a), 0.0), 1.0))
            if mix > 0:
                img2 = kb_crop(self.bases[1], f, *self.kb)
                img = Image.blend(img, img2, mix)
        if self.overlay is not None:
            img = Image.alpha_composite(img.convert("RGBA"), self.overlay).convert("RGB")
        return img


def build_scenes():
    S = []
    add = S.append
    # 1 · River Street kitchen — cold near-B&W, tag
    add(Scene(0.00, 3.93, [plate(PLATES / "s01_river_street.jpg", "cold")],
              address_layer("RIVER STREET", "HILLSDALE, MICHIGAN"), (1.0, 1.08, 0.5, 0.5, 0.42, 0.5)))
    # 2 · Cleveland Heights — porch push-in
    add(Scene(3.93, 6.83, [plate(PLATES / "s04_west_side.jpg", "before")],
              address_layer("WEST SIDE", "CLEVELAND, OHIO"), (1.04, 1.12, 0.5, 0.5, 0.35, 0.42)))
    # 3 · 2217 Parkview
    add(Scene(6.83, 9.77, [plate(PLATES / "s03_parkview.jpg")],
              address_layer("2217 PARKVIEW", "SOUTH BEND, INDIANA"), (1.08, 1.0, 0.5, 0.5, 0.45, 0.5)))
    # 4 · 50 DOORS over West Side kitchen
    add(Scene(9.77, 12.70, [plate(PLATES / "s04_west_side.jpg", "warm")],
              caption_layer(["50 DOORS"], "OWNED & OPERATED", main_size=110), (1.0, 1.09, 0.5, 0.5, 0.5, 0.55)))
    # 5 · REBUILT — ghost dissolve dark siding -> finished home; resolves by 78%
    add(Scene(12.70, 16.60,
              [plate(PLATES / "s05_rebuilt_pre.jpg", "before"), plate(PLATES / "s05_rebuilt_post.jpg", "warm")],
              caption_layer(["REBUILT"], main_size=120, y_center=0.47),
              (1.0, 1.10, 0.5, 0.5, 0.42, 0.5), dissolve=(0.30, 0.78)))
    # 6 · fireplace beat
    add(Scene(16.60, 18.53, [plate(PLATES / "s06_fireplace.jpg", "warm")],
              None, (1.10, 1.0, 0.5, 0.5, 0.55, 0.5)))
    # 7 · BEFORE / AFTER stacked split (Salem St)
    split = stack_bands([PLATES / "salem_band_before.jpg", PLATES / "salem_band_after.jpg"],
                        ["BEFORE", "AFTER"], modes=["before", None])
    add(Scene(18.53, 22.43, [split], None, (1.0, 1.05, 0.5, 0.5, 0.5, 0.5)))
    # 8 · THREE STATES · ONE PLAYBOOK — one state-accurate collage, held for
    # the full beat (Jake 7/3: the old variant B repeated one MI ranch as both
    # OH and IN — state labels must match real properties)
    threeA = stack_bands([HEROES / "09_budlong_street_hillsdale.jpg",
                          HEROES / "07_larchmere_duplex_cleveland.jpg",
                          HEROES / "03_2217_parkview_south_bend.jpg"], ["MICHIGAN", "OHIO", "INDIANA"])
    add(Scene(22.43, 29.27, [threeA],
              caption_layer(["THREE STATES"], "ONE PLAYBOOK", main_size=84, y_center=0.88),
              (1.0, 1.06, 0.5, 0.5, 0.5, 0.5)))
    # 10 · $12M+ over 34 Mead porch
    add(Scene(29.27, 31.00, [plate(PLATES / "s05_rebuilt_post.jpg", "warm")],
              caption_layer(["MADE IN AMERICA"], "LOCAL TO THE MIDWEST", main_size=88), (1.0, 1.07, 0.5, 0.5, 0.4, 0.45)))
    # 11 · A DIFFERENT ENDING — bright East Saint Joe ONLY (dark dusk shot removed)
    add(Scene(31.00, 33.17, [plate(PLATES / "s11_east_saint_joe.jpg")],
              caption_layer(["A DIFFERENT", "ENDING"], main_size=100, y_center=0.44),
              (1.0, 1.09, 0.45, 0.5, 0.5, 0.55)))
    # 12 · warm interior breath
    add(Scene(33.17, 35.13, [plate(PLATES / "s12_interior.jpg", "warm")],
              None, (1.08, 1.0, 0.45, 0.5, 0.5, 0.5)))
    # 13 · 200 BY 2030
    add(Scene(35.13, 38.03, [plate(PLATES / "s13_ranch.jpg", x_bias=0.42)],
              caption_layer(["200 BY 2030"], "THE GOAL", main_size=104), (1.0, 1.08, 0.5, 0.55, 0.5, 0.5)))
    # 14 · BUILDING COMMUNITIES, PROFITABLY.
    add(Scene(38.03, 41.97, [plate(PLATES / "s14_salem_after.jpg")],
              caption_layer(["BUILDING", "COMMUNITIES,", "LOCALLY."], main_size=86, y_center=0.50),
              (1.0, 1.09, 0.5, 0.45, 0.45, 0.5)))
    # 15 · outro — the ORIGINAL film's animated Shavit logo draw-on, verbatim
    add(OutroScene(41.97, DUR))
    return S


def render():
    scenes = build_scenes()
    grains = [Image.fromarray(
        np.random.default_rng(i).integers(118, 138, (H // 2, W // 2), dtype=np.uint8), "L")
        .resize((W, H)).convert("RGB") for i in range(4)]

    cmd = ["ffmpeg", "-y", "-v", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-i", str(AUDIO),
           "-map", "0:v", "-map", "1:a",
           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
           "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
           "-shortest", str(OUT)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    for n in range(N_FRAMES):
        t = n / FPS
        idx = max((i for i, s in enumerate(scenes) if s.t0 <= t), default=0)
        cur = scenes[idx]
        img = cur.frame(t)
        # one symmetric crossfade window centered on each scene boundary;
        # windows never overlap because every scene is far longer than XFADE
        if idx > 0 and t < cur.t0 + XFADE / 2:
            a = smoothstep((t - (cur.t0 - XFADE / 2)) / XFADE)
            img = Image.blend(scenes[idx - 1].frame(t), img, a)
        elif idx + 1 < len(scenes) and t > cur.t1 - XFADE / 2:
            a = smoothstep((t - (cur.t1 - XFADE / 2)) / XFADE)
            img = Image.blend(img, scenes[idx + 1].frame(t), a)
        img = Image.blend(img, grains[n % 4], 0.035)
        proc.stdin.write(img.tobytes())
        if n % 150 == 0:
            print(f"  frame {n}/{N_FRAMES}", flush=True)
    proc.stdin.close()
    proc.wait()
    if proc.returncode != 0:
        raise SystemExit("ffmpeg failed")
    print("wrote", OUT)


if __name__ == "__main__":
    OUT_DIR.mkdir(exist_ok=True)
    render()
