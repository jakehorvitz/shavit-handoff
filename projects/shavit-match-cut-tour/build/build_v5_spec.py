#!/usr/bin/env python3
"""v5 spec: address reveal moved up to beat 3 (finished house, right after construction);
ending is CTA-only (Live->Work, animated) -> HARD CUT to a BOLD outro over the house.
No black boxes/rectangles anywhere (legibility via text shadow). Renders the ending animation
+ updated static frames for the spec."""
import subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont

W,H,FPS=1080,1920,30
GOLD=(255,192,0); IVORY=(245,239,225)
BRIC="fonts/Bricolage.ttf"; MAN="fonts/Manrope.ttf"
OUT="recut/v5"; PL=f"{OUT}/pl"; ST=f"{OUT}/story"
for d in (PL,ST): os.makedirs(d,exist_ok=True)
ENC=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p"]
NORM=f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},format=yuv420p"

def Ft(p,s,w):
    f=ImageFont.truetype(p,s)
    try: f.set_variation_by_axes([w] if p==MAN else [s,100,w])
    except Exception:
        try: f.set_variation_by_axes([w])
        except Exception: pass
    return f
def ctext(d,y,t,f,fill,tr=0,shadow=True):
    ws=[d.textlength(c,font=f) for c in t]; tot=sum(ws)+tr*(len(t)-1); x=(W-tot)/2
    for c,w in zip(t,ws):
        if shadow:
            d.text((x,y),c,font=f,fill=(0,0,0,150),stroke_width=6,stroke_fill=(0,0,0,150))
        x+=w+tr
    x=(W-tot)/2
    for c,w in zip(t,ws): d.text((x,y),c,font=f,fill=fill); x+=w+tr
def scrim(img,top=0.55,peak=150):
    d=ImageDraw.Draw(img); t=int(H*top)
    for i in range(H-t): a=int(peak*(i/(H-t))**1.4); d.line([(0,t+i),(W,t+i)],fill=(0,0,0,a))
def grab(clip,t,dst): subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(t),"-i",f"shots/{clip}.mp4","-frames:v","1",dst],check=False)
def fit(src):
    im=Image.open(src).convert("RGB"); tw=im.height*9//16
    if im.width>=tw: x0=(im.width-tw)//2; im=im.crop((x0,0,x0+tw,im.height))
    else: th=im.width*16//9; y0=max(0,(im.height-th)//2); im=im.crop((0,y0,im.width,y0+th))
    return im.resize((W,H),Image.LANCZOS)

# ---- transparent overlay plates (shadow for legibility, NO box) ----
def plate_word(name,word):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); scrim(img); d=ImageDraw.Draw(img)
    ctext(d,int(H*0.73),word,Ft(BRIC,76,800),(255,255,255,255))
    img.save(f"{PL}/{name}.png")
def plate_address(name):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    ctext(d,int(H*0.54),"12 RIVER STREET",Ft(BRIC,88,800),(255,255,255,255))
    ctext(d,int(H*0.605),"HILLSDALE, MICHIGAN",Ft(MAN,30,800),IVORY+(255,),4)
    img.save(f"{PL}/{name}.png")
def plate_cta(name,text,col):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    ctext(d,int(H*0.45),text,Ft(BRIC,94,800),col+(255,))
    img.save(f"{PL}/{name}.png")
def outro_overlay(name):   # transparent: soft wash + BOLD wordmark, over the house
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    d.rectangle([0,0,W,H],fill=(0,0,0,115))          # soft wash, NOT a black screen
    cy=int(H*0.40)
    ctext(d,cy,"BUILT IN MICHIGAN, OHIO & INDIANA",Ft(MAN,26,800),GOLD+(255,),6.5)
    fwm=Ft(BRIC,98,800); w1=d.textlength("SHAVIT ",font=fwm); w2=d.textlength("ROOTMAN",font=fwm)
    xw=(W-(w1+w2))/2; yw=cy+66
    d.text((xw,yw),"SHAVIT ",font=fwm,fill=(255,255,255,255),stroke_width=6,stroke_fill=(0,0,0,150))
    d.text((xw+w1,yw),"ROOTMAN",font=fwm,fill=(255,255,255,255),stroke_width=6,stroke_fill=(0,0,0,150))
    d.text((xw,yw),"SHAVIT ",font=fwm,fill=(255,255,255,255))
    d.text((xw+w1,yw),"ROOTMAN",font=fwm,fill=GOLD+(255,))
    ctext(d,yw+140,"REAL ESTATE, OPERATED.",Ft(MAN,24,800),(245,239,225,255),5)
    ctext(d,int(H*0.72),"MADE POSSIBLE BY THE CPM TEAM",Ft(MAN,25,800),(245,239,225,255),4.5)
    img.save(f"{PL}/{name}.png")

plate_word("forgotten","FORGOTTEN")
plate_address("addr"); plate_cta("live","LIVE WITH US",(255,255,255)); plate_cta("work","WORK WITH US",GOLD)
outro_overlay("outro")

# ---- static frames ----
def frame(srcimg,name,plate=None):
    base=fit(srcimg).convert("RGBA")
    if plate: base.alpha_composite(Image.open(plate).convert("RGBA"))
    base.convert("RGB").save(f"{ST}/{name}.jpg",quality=90)
grab("B1_before_pushin",2.4,f"{ST}/_before.jpg")
grab("A_hero_v4_flipbook",1.8,f"{ST}/_constr.jpg")
grab("B2_after_pushin",2.6,f"{ST}/_house.jpg")
frame(f"{ST}/_before.jpg","01",f"{PL}/forgotten.png")
frame(f"{ST}/_constr.jpg","02")
frame(f"{ST}/_house.jpg","03",f"{PL}/addr.png")       # REVEAL + address (moved up)
frame(f"{ST}/_house.jpg","08",f"{PL}/live.png")
frame(f"{ST}/_house.jpg","09",f"{PL}/work.png")
frame(f"{ST}/_house.jpg","10",f"{PL}/outro.png")

def run(cmd,tag):
    r=subprocess.run(cmd,capture_output=True,text=True)
    if r.returncode: print("ERR",tag,r.stderr[-600:]); sys.exit(1)
    print("ok",tag)

# ---- ending animation: house -> LIVE(in/out) -> WORK(in) -> HARD CUT -> outro over house ----
CTA_DUR=5.6
inp=["-ss","0","-t","5","-i","shots/B2_after_pushin.mp4","-loop","1","-i",f"{PL}/live.png","-loop","1","-i",f"{PL}/work.png"]
fc=[f"[0:v]setpts=1.12*PTS,{NORM}[bg]",
    "[1:v]format=rgba,fade=t=in:st=0.6:d=0.4:alpha=1,fade=t=out:st=2.3:d=0.4:alpha=1[l]",
    "[2:v]format=rgba,fade=t=in:st=3.2:d=0.4:alpha=1[w]",
    "[bg][l]overlay=0:0:enable='between(t,0.5,2.8)'[m1]",
    f"[m1][w]overlay=0:0:enable='between(t,3.1,{CTA_DUR})'[m2]"]
run(["ffmpeg","-y","-loglevel","error",*inp,"-filter_complex",";".join(fc),"-map","[m2]","-t",str(CTA_DUR),*ENC,"-an",f"{OUT}/_cta.mp4"],"cta")
run(["ffmpeg","-y","-loglevel","error","-loop","1","-t","2.8","-i",f"{ST}/_house.jpg","-loop","1","-i",f"{PL}/outro.png",
     "-filter_complex",f"[0:v]{NORM}[bg];[bg][1:v]overlay=0:0:shortest=1[o]","-map","[o]","-t","2.8",*ENC,"-an",f"{OUT}/_outro.mp4"],"outro-clip")
open(f"{OUT}/cat.txt","w").write(f"file '{os.path.abspath(OUT)}/_cta.mp4'\nfile '{os.path.abspath(OUT)}/_outro.mp4'\n")
run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",f"{OUT}/cat.txt","-i","music_smalltown.mp3",
     "-map","0:v","-map","1:a","-t","8.4","-c:v","copy","-c:a","aac","-b:a","192k",f"{OUT}/ending-animation.mp4"],"ending")
print("STATUS_OK",f"{OUT}/ending-animation.mp4")
