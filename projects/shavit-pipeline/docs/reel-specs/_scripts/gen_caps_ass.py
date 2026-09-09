#!/usr/bin/env python3
"""Generate Hormozi-style burn-in captions (.ass) from a Whisper verbose_json.

Matches the house style already used on the A1 build: Montserrat ExtraBold 96,
white with a gold highlight that walks word-by-word through 3-word groups,
a short scale pop on each new group, MarginV 620 so captions clear the
Instagram Reels bottom UI zone.

    python3 gen_caps_ass.py words.json out.ass [--offset SECONDS]
"""
import json
import sys

GOLD = r"{\c&H0000C0FF}"
WHITE = r"{\c&H00FFFFFF}"
POP = r"{\t(0,110,\fscx112\fscy112)}{\t(110,190,\fscx100\fscy100)}"
# Fade only on the edges of a group. A \fad on every line re-fades the whole
# group each time the highlight steps a word, which reads as a flicker and
# leaves short lines permanently semi-transparent.
FADE_IN = r"{\fad(60,0)}"
FADE_OUT = r"{\fad(0,60)}"
GROUP = 3
TAIL = 0.10

HEADER = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Cap,Montserrat ExtraBold,96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,1,0,1,7,4,2,60,60,520,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""


def ts(t):
    t = max(t, 0.0)
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def clean(word):
    return word.strip().strip(",.!?;:").upper()


def main():
    src, dst = sys.argv[1], sys.argv[2]
    offset = 0.0
    if "--offset" in sys.argv:
        offset = float(sys.argv[sys.argv.index("--offset") + 1])

    words = json.load(open(src))["words"]
    # Words wholly before the trim point belong to footage that is not in the
    # cut; keeping them would clamp a pile of captions onto frame zero.
    words = [w for w in words if clean(w["word"]) and w["end"] - offset > 0.08]

    lines = []
    for g0 in range(0, len(words), GROUP):
        group = words[g0:g0 + GROUP]
        texts = [clean(w["word"]) for w in group]
        for i, w in enumerate(group):
            start = w["start"] - offset
            if i + 1 < len(group):
                end = group[i + 1]["start"] - offset
            else:
                end = w["end"] - offset + TAIL
            if end - start < 0.04:          # whisper emits zero-width words
                end = start + 0.12
            body = " ".join(
                (GOLD if j == i else WHITE) + t for j, t in enumerate(texts)
            )
            head = POP + FADE_IN if i == 0 else ""
            if i == len(group) - 1:
                head += FADE_OUT
            lines.append(
                f"Dialogue: 0,{ts(start)},{ts(end)},Cap,,0,0,0,,{head}{body}"
            )

    with open(dst, "w") as fh:
        fh.write(HEADER + "\n".join(lines) + "\n")
    print(f"{dst}: {len(lines)} caption lines from {len(words)} words")


if __name__ == "__main__":
    main()
