#!/usr/bin/env python3
"""Round-2 photo prep per Jake's annotations: distinct before/during frames + a
clean-grass patch over the mailbox house number on the full front (keeps it a real photo)."""
import os, shutil
from PIL import Image
DUMP = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/_drive-dump")
ASSETS = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/assets")

def f(idx):
    for n in os.listdir(DUMP):
        if n.startswith(f"{idx:03d}_") and n.endswith(".jpg"):
            return os.path.join(DUMP, n)
    raise FileNotFoundError(idx)

copies = {87: "before-foreclosure.jpg", 11: "during-gutted.jpg", 100: "before-exterior-alt.jpg",
          13: "before-rough-house.jpg", 34: "before-basement-2.jpg"}
for idx, name in copies.items():
    shutil.copy(f(idx), os.path.join(ASSETS, name))
    print("copied", name, "<-", os.path.basename(f(idx)))

im = Image.open(f(58)).convert("RGB")
w, h = im.size
print("front size", (w, h))
def box(x0, y0, x1, y1):
    return (int(x0*w), int(y0*h), int(x1*w), int(y1*h))
src = im.crop(box(0.80, 0.74, 0.94, 0.93))
tgt = box(0.585, 0.66, 0.725, 0.85)
src = src.resize((tgt[2]-tgt[0], tgt[3]-tgt[1]))
im.paste(src, (tgt[0], tgt[1]))
im.save(os.path.join(ASSETS, "after-front-full.jpg"), quality=90)
print("saved after-front-full.jpg")
