#!/usr/bin/env python3
"""Conform Shavit's 2026-07-29 feedback assets to the rev6 film format.

Sources (all from his iMessage thread, verified in shavit-0729/):
  A_barry-finished.heic  -> 33 Barry, finished room      (replaces the GEN3 chimney plate)
  OAK1.jpg / OAK2.jpg    -> 115 Oak, in-progress         (byte-identical to drive/oak-new 001 and 003)
  D_ewing-video.MOV      -> 1902 E Ewing, South Bend     (the Indiana feature)

Film format is 1080x1920 / 30fps, per the rev6 timeline. Recipe follows the one
in RESUME-rev6-motion-build.md: exif_transpose first, then a 9:16 crop, then
Lanczos to 1080 wide with light unsharp when the source is upscaled.

Crop candidates are written side by side so the framing gets eyeballed before
anything lands on the timeline -- five of the crew portraits were already
re-cropped once because centring was judged from filenames instead of pixels.
"""
import subprocess
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

BASE = Path(__file__).resolve().parent.parent / "current-projects-team-2026-07-27"
SRC = BASE / "shavit-0729"
OUT = BASE / "conform-0729"
OUT.mkdir(exist_ok=True)

W, H = 1080, 1920
TARGET = W / H  # 0.5625


def crop_916(img, bias=0.5):
    """Crop to 9:16. bias picks the window on the long axis: 0 = left/top, 1 = right/bottom."""
    img = ImageOps.exif_transpose(img)
    w, h = img.size
    if w / h > TARGET:
        # too wide -- slide a full-height window horizontally
        nw = round(h * TARGET)
        x = round((w - nw) * bias)
        box = (x, 0, x + nw, h)
    else:
        # too tall -- slide a full-width window vertically
        nh = round(w / TARGET)
        y = round((h - nh) * bias)
        box = (0, y, w, y + nh)
    return img.crop(box)


def conform(img, dest, sharpen_if_upscaled=True):
    upscaling = img.size[0] < W
    out = img.resize((W, H), Image.LANCZOS)
    if upscaling and sharpen_if_upscaled:
        out = ImageEnhance.Sharpness(out).enhance(1.25)
    out.convert("RGB").save(dest, quality=95, subsampling=0)
    return dest


def contact(paths, dest, tile_w=300):
    """Lay candidates side by side at review size."""
    ims = [Image.open(p).resize((tile_w, round(tile_w / TARGET)), Image.LANCZOS) for p in paths]
    sheet = Image.new("RGB", (tile_w * len(ims), ims[0].size[1]), "black")
    for i, im in enumerate(ims):
        sheet.paste(im, (i * tile_w, 0))
    sheet.save(dest, quality=92)
    return dest


def main():
    # --- Barry finished: 3024x4032 portrait after transpose, so the crop slides vertically.
    #     Pillow has no HEIC decoder here, so hand the decode to sips at full res.
    #     sips also bakes in the EXIF rotation, which makes the later transpose a no-op.
    barry_jpg = SRC / "A_barry-finished-full.jpg"
    if not barry_jpg.exists():
        subprocess.run(
            ["sips", "-s", "format", "jpeg", str(SRC / "A_barry-finished.heic"),
             "--out", str(barry_jpg)],
            check=True, stdout=subprocess.DEVNULL,
        )
    barry = Image.open(barry_jpg)
    cands = []
    for tag, bias in (("top", 0.0), ("mid", 0.35), ("ctr", 0.5)):
        p = OUT / f"_cand-barry-{tag}.jpg"
        conform(crop_916(barry, bias), p)
        cands.append(p)
    contact(cands, OUT / "CAND-barry.jpg")

    # --- Oak: 1541x2048, mild upscale to 1080 wide.
    for n in (1, 2):
        oak = Image.open(SRC / f"OAK{n}.jpg")
        cands = []
        for tag, bias in (("top", 0.0), ("ctr", 0.5), ("bot", 1.0)):
            p = OUT / f"_cand-oak{n}-{tag}.jpg"
            conform(crop_916(oak, bias), p)
            cands.append(p)
        contact(cands, OUT / f"CAND-oak{n}.jpg")

    # --- Ewing: 720x1280 displayed (rotation -90 in metadata), 2.5s from the clean
    #     spray-arc window, silent (the film runs on its own music bed).
    dest = OUT / "EWING-southbend-25s.mp4"
    subprocess.run([
        "ffmpeg", "-y", "-v", "error",
        "-ss", "3.4", "-t", "2.5", "-i", str(SRC / "D_ewing-video.MOV"),
        "-an",
        "-vf", f"scale={W}:{H}:flags=lanczos,unsharp=5:5:0.45,fps=30,format=yuv420p",
        "-c:v", "libx264", "-crf", "16", "-preset", "slow",
        str(dest),
    ], check=True)
    print("wrote", dest)

    for p in sorted(OUT.glob("CAND-*.jpg")):
        print("review", p)


if __name__ == "__main__":
    main()
