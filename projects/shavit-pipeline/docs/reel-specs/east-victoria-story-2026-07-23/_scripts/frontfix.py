#!/usr/bin/env python3
"""Patch the small 514 mailbox out of the centered full-front photo (012) by cloning
adjacent grass/shrub texture over it. Keeps it a real photo, entire house visible."""
import os
from PIL import Image
DUMP = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/_drive-dump")
ASSETS = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/assets")
src = None
for n in os.listdir(DUMP):
    if n.startswith("012_"):
        src = os.path.join(DUMP, n)
im = Image.open(src).convert("RGB")
w, h = im.size
print("size", (w, h))
def box(x0, y0, x1, y1):
    return (int(x0*w), int(y0*h), int(x1*w), int(y1*h))
tgt = box(0.475, 0.565, 0.545, 0.66)
patch = im.crop(box(0.60, 0.565, 0.67, 0.66)).resize((tgt[2]-tgt[0], tgt[3]-tgt[1]))
im.paste(patch, (tgt[0], tgt[1]))
im.save(os.path.join(ASSETS, "after-front-hero.jpg"), quality=90)
print("saved after-front-hero.jpg")
