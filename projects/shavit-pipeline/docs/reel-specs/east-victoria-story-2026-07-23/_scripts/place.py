#!/usr/bin/env python3
"""Copy chosen finished heroes into the spec assets folder; crop the house-number
mailbox out of the finished front exterior."""
import os, shutil
from PIL import Image
DUMP = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/_drive-dump")
ASSETS = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/assets")

def f(idx):
    for n in os.listdir(DUMP):
        if n.startswith(f"{idx:03d}_") and n.endswith(".jpg"):
            return os.path.join(DUMP, n)
    raise FileNotFoundError(idx)

copies = {59: "after-kitchen.jpg", 5: "after-bathroom.jpg", 44: "after-mechanical.jpg",
          67: "after-living.jpg", 47: "after-kitchen-wide.jpg", 66: "after-octagon-room.jpg"}
for idx, name in copies.items():
    shutil.copy(f(idx), os.path.join(ASSETS, name))
    print("copied", name)

im = Image.open(f(37)).convert("RGB")
w, h = im.size
im.crop((0, 0, w, int(h*0.62))).save(os.path.join(ASSETS, "after-exterior-front.jpg"), quality=90)
print("cropped after-exterior-front.jpg", im.size)
