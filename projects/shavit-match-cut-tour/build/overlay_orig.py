#!/usr/bin/env python3
"""Improve the ORIGINAL 98/100 Version A: overlay work-done plates over the 4 testimonial
beats, replace the WORK-WITH-ME + AI-disclosure outro with the Live/Work CTA + CPM credit.
Footage, motion, construction, music: untouched. Overlays fade in over each beat; strong
scrim masks the burned-in testimonial underneath."""
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
GOLD = (255, 192, 0, 255); IVORY = (245, 239, 225)
BRIC = "fonts/Bricolage.ttf"; MAN = "fonts/Manrope.ttf"
SRC = "../delivery/Shavit-River-Street-VersionA.mp4"
OUT = "recut"; PL = f"{OUT}/ov"; os.makedirs(PL, exist_ok=True)
FINAL = f"{OUT}/Shavit-River-Street-VersionA-v2.mp4"

def Ft(path, size, weight):
    f = ImageFont.truetype(path, size)
    try: f.set_variation_by_axes([weight] if path == MAN else [size, 100, weight])
    except Exception:
        try: f.set_variation_by_axes([weight])
        except Exception: pass
    return f

def tracked(d, y, text, f, fill, tr, x0=None):
    ws = [d.textlength(c, font=f) for c in text]; total = sum(ws) + tr*(len(text)-1)
    x = x0 if x0 is not None else (W-total)/2
    for c, w in zip(text, ws): d.text((x, y), c, font=f, fill=fill); x += w+tr
    return total

def scrim(img, top=0.50, peak=225):
    d = ImageDraw.Draw(img); t = int(H*top)
    for i in range(H-t):
        a = int(peak*(i/(H-t))**1.25); d.line([(0,t+i),(W,t+i)], fill=(0,0,0,a))

def lower_plate(name, head, sub):
    img = Image.new("RGBA", (W, H), (0,0,0,0)); d = ImageDraw.Draw(img)
    # near-opaque lower mask so NO burned-in testimonial can bleed through
    fade_top = int(H*0.55); fade_h = int(H*0.13)
    for i in range(fade_h):
        a = int(255*(i/fade_h)); d.line([(0,fade_top+i),(W,fade_top+i)], fill=(0,0,0,a))
    d.rectangle([0, fade_top+fade_h, W, H], fill=(0,0,0,255))
    x0 = int(W*0.08); y = int(H*0.72)
    fh = Ft(BRIC, 66, 800)
    for ln in head:
        d.text((x0, y), ln, font=fh, fill=(255,255,255,255), stroke_width=1, stroke_fill=(255,255,255,255)); y += 74
    d.rectangle([x0, y+14, x0+54, y+17], fill=GOLD)
    if sub: tracked(d, y+30, sub, Ft(MAN, 25, 600), IVORY+(215,), 3.2, x0=x0)
    p = f"{PL}/{name}.png"; img.save(p); return p

def outro_plate(name, primary, primary_col, show_credit):
    img = Image.new("RGBA", (W, H), (0,0,0,0)); d = ImageDraw.Draw(img)
    # SOLID opaque cover from just below the wordmark: hides old "WORK WITH ME" pill,
    # "MADE IN AMERICA" line, and the AI-assisted disclosure at the bottom.
    top = int(H*0.49); feather = int(H*0.015)
    for i in range(feather):
        a = int(255*(i/feather)); d.line([(0,top+i),(W,top+i)], fill=(8,8,8,a))
    d.rectangle([0, top+feather, W, H], fill=(8,8,8,255))
    f = Ft(BRIC, 82, 800)
    tw = d.textlength(primary, font=f); d.text(((W-tw)/2, int(H*0.60)), primary, font=f, fill=primary_col, stroke_width=1, stroke_fill=primary_col)
    if show_credit:
        tracked(d, int(H*0.72), "MADE POSSIBLE BY THE CPM TEAM", Ft(MAN, 23, 600), IVORY+(190,), 4.5)
    p = f"{PL}/{name}.png"; img.save(p); return p

# beats (absolute seconds in the 35.3s original)
P1 = lower_plate("t1", ["NEW KITCHEN"], "CABINETS · STAINLESS · SUBWAY TILE")
P2 = lower_plate("t2", ["REFINISHED FLOORS"], "FRESH PAINT THROUGHOUT")
P3 = lower_plate("t3", ["NEW BATH"], "TILE SHOWER · DOUBLE VANITY")
P4 = lower_plate("t4", ["THREE-SEASON ROOM"], "NOW ALL-SEASON")
OL = outro_plate("o_live", "LIVE WITH US", (255,255,255,255), False)
OW = outro_plate("o_work", "WORK WITH US", GOLD, True)
import sys as _sys; print("plates regenerated"); _sys.exit(0)   # rendering handled by segmented_recut.py

# (plate, start, end)
OVS = [
    (P1, 8.0, 11.5), (P2, 12.1, 15.8), (P3, 16.6, 20.3), (P4, 21.0, 24.0),
    (OL, 30.4, 32.6), (OW, 32.4, 35.3),
]

KITCHEN = "recut/kitchen/kitchen_kb.mp4"   # real k23 photo, replaces the AI kitchen
KS, KE = 7.5, 11.7
inputs = ["-i", SRC]
for p, _, _ in OVS: inputs += ["-loop", "1", "-i", p]
inputs += ["-i", KITCHEN]
KIDX = len(OVS) + 1
fc = []
# real kitchen laid over the AI kitchen (opaque, full-frame), faded to match the dissolves
fc.append(f"[{KIDX}:v]setpts=PTS-STARTPTS+{KS}/TB,format=rgba,fade=t=in:st={KS}:d=0.4:alpha=1,fade=t=out:st={KE-0.4}:d=0.4:alpha=1[kb]")
fc.append(f"[0:v][kb]overlay=0:0:eof_action=pass:enable='between(t,{KS-0.05},{KE+0.05})'[base1]")
prev = "base1"
for k, (p, a, b) in enumerate(OVS, start=1):
    fd = 0.35
    fc.append(f"[{k}:v]format=rgba,fade=t=in:st={a}:d={fd}:alpha=1,fade=t=out:st={b-fd}:d={fd}:alpha=1[p{k}]")
    lbl = f"v{k}"
    fc.append(f"[{prev}][p{k}]overlay=0:0:enable='between(t,{a-0.05},{b+0.05})'[{lbl}]")
    prev = lbl
filt = ";".join(fc)
cmd = ["ffmpeg","-y","-loglevel","error", *inputs, "-filter_complex", filt,
       "-map", f"[{prev}]", "-map", "0:a?", "-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p",
       "-c:a","copy", FINAL]
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode: print("ERR", r.stderr[-800:]); sys.exit(1)
print("DONE", FINAL)
