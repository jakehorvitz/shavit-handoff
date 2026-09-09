#!/usr/bin/env python3
"""Render the branded black title card used by both of the film's card slots.

Jake: "title cards need to have the shavit colors of white and black with the
shavit logo."

The lockup is not re-typeset. It is lifted straight out of `assets/outro.png`,
the end card already shipped on prior reels, so the wordmark on the title card
and the wordmark on the outro are literally the same pixels. Re-setting it in a
substitute font would drift, and Inter is not installed locally -- Palmier
carries its own copy, which is why the on-screen type can ask for Inter and this
script cannot.

outro.png is RGBA with its panel at alpha 120, so it is composited over solid
black first; the panel flattens to the card's own black and only the type
survives.

Brand rules this obeys (shavit-pipeline/rules/brand.md #8, and the standing
no-pulsing-logo rule from the 5/22/2026 meeting):
  * black canvas, white type, gold mark, one stake line
  * the logo is baked into a still image, so it draws once and holds perfectly
    static -- no pulse, no loop, no shimmer, which an animated layer risks

Output is ONE card reused by both slots. The film's separate pure-black asset is
left alone: it is what the dip-to-black overlay uses, and a logo must not flash
inside a transition.
"""
import sys
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parent.parent / "current-projects-team-2026-07-27"
OUTRO = BASE / "assets" / "outro.png"
OUT = BASE / "conform-0729" / "CARD-brand.png"

W, H = 1080, 1920
GOLD = (255, 192, 0)          # sampled off the outro's ROOTMAN, not guessed

# Ink bounds measured off outro.png: wordmark line y854-917, tagline y977-997.
LOCKUP_BOX = (183, 844, 894, 1007)
LOCKUP_W = 626                # ~58% of frame width
LOCKUP_TOP = 1560

STAKE_W, STAKE_H, STAKE_GAP = 132, 3, 46


def main():
    if not OUTRO.exists():
        sys.exit(f"missing {OUTRO}")

    src = Image.open(OUTRO).convert("RGBA")
    flat = Image.alpha_composite(Image.new("RGBA", src.size, (0, 0, 0, 255)), src)
    lock = flat.convert("RGB").crop(LOCKUP_BOX)
    lock = lock.resize((LOCKUP_W, round(lock.height * LOCKUP_W / lock.width)),
                       Image.LANCZOS)

    card = Image.new("RGB", (W, H), (0, 0, 0))
    card.paste(Image.new("RGB", (STAKE_W, STAKE_H), GOLD),
               ((W - STAKE_W) // 2, LOCKUP_TOP - STAKE_GAP))
    card.paste(lock, ((W - LOCKUP_W) // 2, LOCKUP_TOP))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    card.save(OUT)
    print(f"wrote {OUT}  {card.size}  lockup {lock.size} at y{LOCKUP_TOP}")


if __name__ == "__main__":
    main()
