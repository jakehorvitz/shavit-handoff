#!/usr/bin/env python3
"""12 River recut v2 — real Drive before/after + work-done text + construction beat.
Kills testimonials + AI disclosure; adds Live-with-us / Work-with-us CTA.
Bakes text into stills (Version-A plate grammar), Ken-Burns via ffmpeg zoompan,
splices the existing construction segment, scores to Small Town. Renders a DRAFT."""
import os, glob, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
GOLD = (255, 192, 0, 255)
IVORY = (245, 239, 225, 255)
BRIC = "fonts/Bricolage.ttf"
MAN = "fonts/Manrope.ttf"
RAW = "/private/tmp/claude-501/-Users-jakehorvitz-Personal-Jarvis/cc1057a9-9f5f-4e7e-bc88-044b13f1b287/scratchpad/12-river/raw"
OUT = "recut"; os.makedirs(f"{OUT}/beats", exist_ok=True)
MUSIC = "music_smalltown.mp3"
CONSTRUCTION = "shots/A_hero_v4_flipbook.mp4" if os.path.exists("shots/A_hero_v4_flipbook.mp4") else "seg1_hero.mp4"

def F(path, size, weight):
    f = ImageFont.truetype(path, size)
    try: f.set_variation_by_axes([weight] if path == MAN else [size, 100, weight])
    except Exception:
        try: f.set_variation_by_axes([weight])
        except Exception: pass
    return f

def raw(nn):
    g = glob.glob(f"{RAW}/{nn}_*.jpg")
    if not g: raise FileNotFoundError(nn)
    return g[0]

def fit(src):
    im = Image.open(src).convert("RGB")
    tw = im.height * 9 // 16
    if im.width >= tw:
        x0 = (im.width - tw) // 2
        im = im.crop((x0, 0, x0 + tw, im.height))
    else:
        th = im.width * 16 // 9
        y0 = max(0, (im.height - th) // 2)
        im = im.crop((0, y0, im.width, y0 + th))
    return im.resize((W, H), Image.LANCZOS)

def tracked(d, y, text, f, fill, tracking, x0=None):
    widths = [d.textlength(c, font=f) for c in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = x0 if x0 is not None else (W - total) / 2
    for c, w_ in zip(text, widths):
        d.text((x, y), c, font=f, fill=fill); x += w_ + tracking
    return total

def scrim(img, top=0.52, peak=185):
    d = ImageDraw.Draw(img); t = int(H * top)
    for i in range(H - t):
        a = int(peak * (i / (H - t)) ** 1.35)
        d.line([(0, t + i), (W, t + i)], fill=(0, 0, 0, a))

def beat_still(name, src, head, sub, eyebrow=None):
    base = fit(src).convert("RGBA")
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); scrim(ov)
    d = ImageDraw.Draw(ov)
    x0 = int(W * 0.08); y = int(H * 0.70)
    if eyebrow:
        tracked(d, y - 46, eyebrow, F(MAN, 24, 700), GOLD, 6.0, x0=x0)
    fh = F(BRIC, 66, 800)
    for ln in head:
        d.text((x0, y), ln, font=fh, fill=(255,255,255,255), stroke_width=1, stroke_fill=(255,255,255,255))
        y += 74
    d.rectangle([x0, y + 14, x0 + 54, y + 17], fill=GOLD)
    if sub:
        tracked(d, y + 30, sub, F(MAN, 26, 600), IVORY[:3] + (210,), 3.5, x0=x0)
    base.alpha_composite(ov)
    p = f"{OUT}/beats/{name}.png"; base.convert("RGB").save(p, quality=92)
    return p

def cta_still(name, src, primary, secondary_dim):
    base = fit(src).convert("RGBA")
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.rectangle([0, 0, W, H], fill=(0, 0, 0, 120))
    f = F(BRIC, 92, 800)
    def line(txt, cy, col):
        tw = d.textlength(txt, font=f); d.text(((W - tw)/2, cy), txt, font=f, fill=col, stroke_width=1, stroke_fill=col)
    line("LIVE WITH US", H*0.40, (255,255,255,255) if not secondary_dim else (255,255,255,90))
    line("WORK WITH US", H*0.52, (255,255,255,90) if not secondary_dim else GOLD)
    base.alpha_composite(ov)
    p = f"{OUT}/beats/{name}.png"; base.convert("RGB").save(p, quality=92)
    return p

def outro_still(name):
    img = Image.new("RGB", (W, H), (8, 8, 8)); d = ImageDraw.Draw(img)
    cy = int(H * 0.40)
    tracked(d, cy, "BUILT IN MICHIGAN, OHIO & INDIANA", F(MAN, 25, 700), GOLD, 6.5)
    f_wm = F(BRIC, 90, 700)
    w1 = d.textlength("SHAVIT ", font=f_wm); w2 = d.textlength("ROOTMAN", font=f_wm)
    xw = (W - (w1 + w2)) / 2; yw = cy + 64
    d.text((xw, yw), "SHAVIT ", font=f_wm, fill=(255,255,255)); d.text((xw + w1, yw), "ROOTMAN", font=f_wm, fill=GOLD[:3])
    tracked(d, yw + 126, "REAL ESTATE, OPERATED.", F(MAN, 22, 500), (245,239,225), 5.5)
    tracked(d, int(H*0.72), "MADE POSSIBLE BY THE CPM TEAM", F(MAN, 23, 600), (245,239,225), 4.5)
    p = f"{OUT}/beats/{name}.png"; img.save(p, quality=92)
    return p

# ---- beat list: (name, still_path, seconds, zoom_in?) ----
BEATS = []
def add(name, png, secs, zin=True): BEATS.append((name, png, secs, zin))

add("01_open",   beat_still("01_open", raw("27"), ["12 RIVER STREET"], "HILLSDALE, MICHIGAN", "BEFORE"), 2.4)
add("02_bath_b", beat_still("02_bath_b", raw("29"), ["ORIGINAL", "CONDITION"], None, "BEFORE"), 1.3, zin=False)
add("03_bath_b2",beat_still("03_bath_b2", raw("30"), [], None, None), 1.1)
# construction spliced here in assembly
add("05_kitchen",beat_still("05_kitchen", raw("23"), ["NEW KITCHEN"], "CABINETS · STAINLESS · SUBWAY TILE", "AFTER"), 3.2)
add("06_living", beat_still("06_living", raw("13"), ["REFINISHED FLOORS"], "FRESH PAINT THROUGHOUT"), 3.0, zin=False)
add("07_bath",   beat_still("07_bath", raw("07"), ["NEW BATH"], "TILE SHOWER · DOUBLE VANITY"), 2.6)
add("08_sun",    beat_still("08_sun", raw("19"), ["THREE-SEASON ROOM"], "NOW ALL-SEASON"), 3.0)
add("09_bed",    beat_still("09_bed", raw("11"), ["2 BED · 1 BATH"], None), 2.4, zin=False)
add("10_cover",  beat_still("10_cover", raw("32"), ["RIVER STREET"], "HILLSDALE, MICHIGAN"), 2.6)
add("11_cta1",   cta_still("11_cta1", raw("32"), "LIVE", False), 1.3)
add("12_cta2",   cta_still("12_cta2", raw("32"), "WORK", True), 1.7)
add("13_outro",  outro_still("13_outro"), 3.0, zin=False)

def sh(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print("ERR", " ".join(cmd[:6]), r.stderr[-400:]); sys.exit(1)
    return r

# per-beat Ken-Burns clips (zoompan on the baked still)
clips = []
for i, (name, png, secs, zin) in enumerate(BEATS):
    frames = int(secs * FPS)
    out = f"{OUT}/beats/{name}.mp4"
    z = ("min(zoom+0.0009,1.12)" if zin else "if(lte(zoom,1.0),1.12,max(1.001,zoom-0.0009))")
    vf = (f"scale={W*2}:{H*2},zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
          f":d={frames}:s={W}x{H}:fps={FPS},format=yuv420p")
    sh(["ffmpeg","-y","-loglevel","error","-loop","1","-i",png,"-t",str(secs),
        "-vf",vf,"-c:v","libx264","-crf","18","-pix_fmt","yuv420p","-r",str(FPS),out])
    clips.append(out)
    if name == "03_bath_b2":  # splice construction beat right after the before montage
        c = f"{OUT}/beats/04_construction.mp4"
        sh(["ffmpeg","-y","-loglevel","error","-i",CONSTRUCTION,"-t","2.6",
            "-vf",f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},format=yuv420p",
            "-an","-c:v","libx264","-crf","18","-pix_fmt","yuv420p","-r",str(FPS),c])
        clips.append(c)
        print("spliced construction:", CONSTRUCTION)

# concat (silent video)
lst = f"{OUT}/concat.txt"
open(lst,"w").write("".join(f"file '{os.path.abspath(c)}'\n" for c in clips))
silent = f"{OUT}/_silent.mp4"
sh(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",lst,
    "-c:v","libx264","-crf","18","-pix_fmt","yuv420p","-r",str(FPS),silent])

dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",silent],
                           capture_output=True,text=True).stdout.strip())
final = f"{OUT}/12-River-Recut-v2-DRAFT.mp4"
sh(["ffmpeg","-y","-loglevel","error","-i",silent,"-i",MUSIC,
    "-filter_complex",f"[1:a]afade=t=in:st=0:d=0.5,afade=t=out:st={dur-1.4}:d=1.4,volume=0.85[a]",
    "-map","0:v","-map","[a]","-t",str(dur),"-c:v","copy","-c:a","aac","-b:a","192k","-shortest",final])
print(f"\nDONE  {final}  ({dur:.1f}s, {len(clips)} beats)")
