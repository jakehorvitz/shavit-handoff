#!/usr/bin/env python3
"""Conform the three properties Jake added on 2026-07-29 to the rev6 film format.

Jake's must-feature list is eight properties; Norwood, Howder, Barry, Oak and
Ewing were already covered, leaving these:

  15 E Saint Joe -> drive/saintjoe 001 (before exterior) + 000 (after exterior)
  1114 Cedar     -> drive/cedar 000
  11 Ludlam      -> drive/ludlam-new 000

Ludlam's source is portrait and takes an ordinary 9:16 crop. The other three are
landscape shots of whole houses, where a 9:16 crop would cut the house in half --
the whole house IS the subject, especially for the Saint Joe before/after. Those
get letterboxed on black, the same treatment the three-person crew photo already
uses in this film, so the register does not change.

Also emits a stacked before/after variant of Saint Joe so the two framings can be
compared as one image before picking which version goes on the timeline.
"""
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

BASE = Path(__file__).resolve().parent.parent / "current-projects-team-2026-07-27"
DRIVE = BASE / "drive"
OUT = BASE / "conform-0729"
OUT.mkdir(exist_ok=True)

W, H = 1080, 1920
TARGET = W / H

SAINTJOE_BEFORE = DRIVE / "saintjoe/001_1A49iMHxyrWrGl38JBaT96RlqkIF3Yg1O.png"
SAINTJOE_AFTER = DRIVE / "saintjoe/000_1nWle3k0IxSgyNkfTTmgCA0Nba-65AkPz.png"
CEDAR = DRIVE / "cedar/000_1jbT204XHZx-Gssbi2AewLoo_919Ia-kH.png"
LUDLAM = DRIVE / "ludlam-new/000_1BuUmgZboG7sKO4E-_I0hwymT-Bnap_GL.jpg"


def load(p):
    return ImageOps.exif_transpose(Image.open(p)).convert("RGB")


def crop_916(img, bias=0.5):
    w, h = img.size
    if w / h > TARGET:
        nw = round(h * TARGET)
        x = round((w - nw) * bias)
        return img.crop((x, 0, x + nw, h))
    nh = round(w / TARGET)
    y = round((h - nh) * bias)
    return img.crop((0, y, w, y + nh))


def sharpen_if_up(img, src_w):
    return ImageEnhance.Sharpness(img).enhance(1.25) if src_w < W else img


def letterbox(src, dest, band_h=None):
    """Full width on black. band_h pins the image height so a pair matches."""
    img = load(src)
    h = band_h or round(W * img.size[1] / img.size[0])
    band = sharpen_if_up(img.resize((W, h), Image.LANCZOS), img.size[0])
    frame = Image.new("RGB", (W, H), "black")
    frame.paste(band, (0, (H - h) // 2))
    frame.save(dest, quality=95, subsampling=0)
    return dest


def full_916(src, dest, bias=0.5):
    img = load(src)
    out = crop_916(img, bias).resize((W, H), Image.LANCZOS)
    sharpen_if_up(out, img.size[0]).save(dest, quality=95, subsampling=0)
    return dest


def stacked(before, after, dest, band_h=780, gap=48):
    """Both states in one frame, matched width, for a single-beat before/after."""
    frame = Image.new("RGB", (W, H), "black")
    top = (H - (band_h * 2 + gap)) // 2
    for i, src in enumerate((before, after)):
        img = load(src)
        # centre-crop to the band's ratio, then scale, so both halves match exactly
        ratio = W / band_h
        w, h = img.size
        if w / h > ratio:
            nw = round(h * ratio)
            img = img.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
        else:
            nh = round(w / ratio)
            img = img.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
        frame.paste(img.resize((W, band_h), Image.LANCZOS), (0, top + i * (band_h + gap)))
    frame.save(dest, quality=95, subsampling=0)
    return dest


def contact(paths, dest, tile_w=270):
    ims = [Image.open(p).resize((tile_w, round(tile_w / TARGET)), Image.LANCZOS) for p in paths]
    sheet = Image.new("RGB", (tile_w * len(ims), ims[0].size[1]), "#111111")
    for i, im in enumerate(ims):
        sheet.paste(im, (i * tile_w, 0))
    sheet.save(dest, quality=92)
    return dest


def main():
    # Saint Joe: pin both exteriors to one band height so the cut reads as a
    # straight swap of the same house rather than a change of shot size.
    band = 900
    b = letterbox(SAINTJOE_BEFORE, OUT / "SAINTJOE-before.jpg", band)
    a = letterbox(SAINTJOE_AFTER, OUT / "SAINTJOE-after.jpg", band)
    s = stacked(SAINTJOE_BEFORE, SAINTJOE_AFTER, OUT / "SAINTJOE-stacked.jpg")

    c = letterbox(CEDAR, OUT / "CEDAR-exterior.jpg")
    l = full_916(LUDLAM, OUT / "LUDLAM-exterior.jpg", bias=0.5)

    contact([b, a, s, c, l], OUT / "CAND-props.jpg")
    for p in (b, a, s, c, l):
        print("wrote", p.name)
    print("review", OUT / "CAND-props.jpg")


if __name__ == "__main__":
    main()
