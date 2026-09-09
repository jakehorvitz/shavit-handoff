import subprocess, sys
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

W, H, FPS = 1080, 1920, 30
BLACK=(0,0,0); INK=(255,255,255); BRASS=(176,141,87); MUTED=(150,150,150)

def font(sz, bold=True):
    for path,idx in [("/System/Library/Fonts/Helvetica.ttc",1 if bold else 0),
                     ("/System/Library/Fonts/HelveticaNeue.ttc",0),
                     ("/Library/Fonts/Arial Unicode.ttf",0)]:
        try: return ImageFont.truetype(path, sz, index=idx)
        except Exception: continue
    return ImageFont.load_default()

# scenes: (start, end, eyebrow, lines, size). endcard flagged by eyebrow=="__END__"
SCENES = [
    (0.0, 2.7, "CLEVELAND, OH", ["I BUY HOMES", "2,000 MILES AWAY."], 96),
    (2.7, 5.4, None, ["NOT ON TRUST —", "ON SYSTEMS."], 104),
    (5.4, 8.7, None, ["BUY DIRECT.", "REHAB & MANAGE IN-HOUSE.", "A COMPANY PER CYCLE."], 64),
    (8.7, 11.2, "__END__", ["openings in bio"], 0),
]
DUR = SCENES[-1][1]

def measure(draw, text, f):
    b = draw.textbbox((0,0), text, font=f); return b[2]-b[0], b[3]-b[1]

def draw_block(img, eyebrow, lines, size, alpha, rise):
    d = ImageDraw.Draw(img)
    fL = font(size, True)
    line_h = int(size*1.12)
    total_h = len(lines)*line_h
    cy = H//2 - total_h//2 + rise
    # eyebrow + stripe above
    top = cy
    if eyebrow:
        fe = font(34, True)
        ew,eh = measure(d, eyebrow, fe)
        d.text(((W-ew)//2, cy-150), eyebrow, font=fe, fill=BRASS+(alpha,))
    # brass stripe
    sw=120
    d.rectangle([(W-sw)//2, cy-70, (W+sw)//2, cy-66], fill=BRASS+(alpha,))
    # lines
    y=cy
    for ln in lines:
        wl,hl = measure(d, ln, fL)
        d.text(((W-wl)//2, y), ln, font=fL, fill=INK+(alpha,))
        y+=line_h

def draw_end(img, alpha):
    d=ImageDraw.Draw(img)
    fW=font(86, True)
    a="SHAVIT"; b="ROOTMAN"
    wa,ha=measure(d,a,fW); wb,hb=measure(d,b,fW)
    total=wa+wb; x0=(W-total)//2; y=H//2-60
    d.rectangle([(W-120)//2, y-70, (W+120)//2, y-66], fill=BRASS+(alpha,))
    d.text((x0,y), a, font=fW, fill=INK+(alpha,))
    d.text((x0+wa,y), b, font=fW, fill=BRASS+(alpha,))
    fS=font(36, False)
    s="openings in bio"; ws,hs=measure(d,s,fS)
    d.text(((W-ws)//2, y+140), s, font=fS, fill=MUTED+(alpha,))

ff = imageio_ffmpeg.get_ffmpeg_exe()
proc = subprocess.Popen([ff,"-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),
    "-i","-","-an","-c:v","libx264","-pix_fmt","yuv420p","-movflags","+faststart", sys.argv[1]],
    stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

FADE=0.35
nframes=int(DUR*FPS)
preview_at={int(1.3*FPS):"/tmp/p1.png", int(4.0*FPS):"/tmp/p2.png", int(7.0*FPS):"/tmp/p3.png", int(10.0*FPS):"/tmp/p4.png"}
for fr in range(nframes):
    t=fr/FPS
    base=Image.new("RGB",(W,H),BLACK)
    layer=Image.new("RGBA",(W,H),(0,0,0,0))
    for (s,e,eye,lines,size) in SCENES:
        if s<=t<e:
            # alpha envelope
            if t-s<FADE: a=(t-s)/FADE
            elif e-t<FADE: a=(e-t)/FADE
            else: a=1.0
            a=max(0,min(1,a)); alpha=int(a*255)
            rise=int((1-a)*22) if (t-s<FADE) else 0
            if eye=="__END__": draw_end(layer, alpha)
            else: draw_block(layer, eye, lines, size, alpha, rise)
            break
    base.paste(Image.alpha_composite(base.convert("RGBA"),layer).convert("RGB"),(0,0))
    if fr in preview_at: base.save(preview_at[fr])
    proc.stdin.write(base.tobytes())
proc.stdin.close(); proc.wait()
print("done", sys.argv[1])
