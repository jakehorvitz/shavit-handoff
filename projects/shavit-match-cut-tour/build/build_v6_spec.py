#!/usr/bin/env python3
"""v6: Didot (luxury serif) display + Avenir body. Smooth outro: wordmark crossfades in over the
CONTINUOUS house shot (no hard cut). Regenerates all static frames + the ending demo."""
import subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont

W,H,FPS=1080,1920,30
GOLD=(255,192,0); IVORY=(245,239,225)
DIDOT="/System/Library/Fonts/Supplemental/Didot.ttc"
AVENIR="/System/Library/Fonts/Avenir Next.ttc"
OUT="recut/v6"; PL=f"{OUT}/pl"; ST=f"{OUT}/story"
for d in (PL,ST): os.makedirs(d,exist_ok=True)
ENC=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p"]
NORM=f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},format=yuv420p"

def D(size): return ImageFont.truetype(DIDOT,size,index=0)
def A(size): return ImageFont.truetype(AVENIR,size,index=0)
def ctext(d,y,t,f,fill,tr=0,sh=True):
    ws=[d.textlength(c,font=f) for c in t]; tot=sum(ws)+tr*(len(t)-1)
    if sh:
        x=(W-tot)/2
        for c,w in zip(t,ws): d.text((x,y),c,font=f,fill=(0,0,0,150),stroke_width=5,stroke_fill=(0,0,0,150)); x+=w+tr
    x=(W-tot)/2
    for c,w in zip(t,ws): d.text((x,y),c,font=f,fill=fill); x+=w+tr
def ltext(d,x,y,t,f,fill,sh=True):
    if sh: d.text((x,y),t,font=f,fill=(0,0,0,150),stroke_width=5,stroke_fill=(0,0,0,150))
    d.text((x,y),t,font=f,fill=fill)
def scrim(img,top=0.55,peak=150):
    d=ImageDraw.Draw(img); t=int(H*top)
    for i in range(H-t): a=int(peak*(i/(H-t))**1.4); d.line([(0,t+i),(W,t+i)],fill=(0,0,0,a))
def grab(clip,t,dst): subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(t),"-i",f"shots/{clip}.mp4","-frames:v","1",dst],check=False)
def fit(src):
    im=Image.open(src).convert("RGB"); tw=im.height*9//16
    if im.width>=tw: x0=(im.width-tw)//2; im=im.crop((x0,0,x0+tw,im.height))
    else: th=im.width*16//9; y0=max(0,(im.height-th)//2); im=im.crop((0,y0,im.width,y0+th))
    return im.resize((W,H),Image.LANCZOS)
def wrap(d,t,f,mw):
    out=[]; cur=""
    for wd in t.split():
        s=(cur+" "+wd).strip()
        if d.textlength(s,font=f)<=mw: cur=s
        else: out.append(cur); cur=wd
    if cur: out.append(cur); return out

# ---- overlay plates (transparent) ----
def plate_word(name,word):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); scrim(img); d=ImageDraw.Draw(img)
    ctext(d,int(H*0.72),word,D(92),(255,255,255,255))
    img.save(f"{PL}/{name}.png")
def plate_address(name):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    by=int(H*0.55); fmain=D(104); fnum=D(150)   # Didot digits are old-style (x-height) -> scale to caps
    num="12"; gap="  "; main="RIVER STREET"
    wn=d.textlength(num,font=fnum); wg=d.textlength(gap,font=fmain); wm=d.textlength(main,font=fmain)
    x=(W-(wn+wg+wm))/2
    for t,f,w in [(num,fnum,wn),(gap,fmain,wg),(main,fmain,wm)]:
        d.text((x,by),t,font=f,fill=(0,0,0,150),anchor="ls",stroke_width=5,stroke_fill=(0,0,0,150))
        d.text((x,by),t,font=f,fill=(255,255,255,255),anchor="ls"); x+=w
    ctext(d,by+22,"HILLSDALE, MICHIGAN",A(30),IVORY+(255,),6)
    img.save(f"{PL}/{name}.png")
def plate_cta(name,text,col):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    ctext(d,int(H*0.44),text,D(110),col+(255,))
    img.save(f"{PL}/{name}.png")
def plate_room(name,head,sub):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); scrim(img,0.50,190); d=ImageDraw.Draw(img)
    x0=int(W*0.08); y=int(H*0.665)
    ltext(d,x0,y,head,D(84),(255,255,255,255)); y+=96
    d.rectangle([x0,y+2,x0+56,y+5],fill=GOLD+(255,)); y+=26
    fs=A(34)                                   # bigger + pure white + darker scrim = easier to read
    for ln in wrap(d,sub,fs,int(W*0.86)): ltext(d,x0,y,ln,fs,(255,255,255,255)); y+=48
    img.save(f"{PL}/{name}.png")
def outro_overlay(name):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    d.rectangle([0,0,W,H],fill=(0,0,0,120)); cy=int(H*0.40)
    ctext(d,cy,"BUILT IN MICHIGAN, OHIO & INDIANA",A(26),GOLD+(255,),6)
    fwm=D(88); w1=d.textlength("SHAVIT ",font=fwm); w2=d.textlength("ROOTMAN",font=fwm)
    xw=(W-(w1+w2))/2; yw=cy+58
    d.text((xw,yw),"SHAVIT ",font=fwm,fill=(0,0,0,150),stroke_width=5,stroke_fill=(0,0,0,150))
    d.text((xw+w1,yw),"ROOTMAN",font=fwm,fill=(0,0,0,150),stroke_width=5,stroke_fill=(0,0,0,150))
    d.text((xw,yw),"SHAVIT ",font=fwm,fill=(255,255,255,255)); d.text((xw+w1,yw),"ROOTMAN",font=fwm,fill=GOLD+(255,))
    ctext(d,yw+150,"REAL ESTATE, OPERATED.",A(25),(240,236,225,255),5)
    ctext(d,int(H*0.72),"MADE POSSIBLE BY THE CPM TEAM",A(25),(240,236,225,255),4.5)
    img.save(f"{PL}/{name}.png")

plate_word("forgotten","FORGOTTEN"); plate_address("addr")
plate_cta("live","LIVE WITH US",(255,255,255)); plate_cta("work","WORK WITH US",GOLD)
plate_room("kitchen","KITCHEN","Shaker cabinets, a full stainless appliance suite, subway-tile backsplash, and wide vinyl plank floors.")
plate_room("living","LIVING ROOM","Refinished floors, fresh paint throughout, and a restored brick fireplace.")
plate_room("bath","BATHROOM","A floor-to-ceiling tile shower, double vanity, and matte black fixtures.")
plate_room("sun","ALL-SEASON ROOM","The old three-season porch, rebuilt with a wood-plank ceiling and wraparound windows.")
outro_overlay("outro")

# ---- static frames ----
def frame(srcimg,name,plate=None):
    base=fit(srcimg).convert("RGBA")
    if plate: base.alpha_composite(Image.open(plate).convert("RGBA"))
    base.convert("RGB").save(f"{ST}/{name}.jpg",quality=90)
for clip,t,n in [("B1_before_pushin",2.4,"_before"),("A_hero_v4_flipbook",1.8,"_constr"),
                 ("B2_after_pushin",2.6,"_house"),("W_fireplace",2.4,"_fire"),("W_bath",2.2,"_bath"),("W_sunroom",2.4,"_sun")]:
    grab(clip,t,f"{ST}/{n}.jpg")
frame(f"{ST}/_before.jpg","01",f"{PL}/forgotten.png")
frame(f"{ST}/_constr.jpg","02")
frame(f"{ST}/_house.jpg","03",f"{PL}/addr.png")
frame("recut/kitchen/k23.jpg","04",f"{PL}/kitchen.png")
frame(f"{ST}/_fire.jpg","05",f"{PL}/living.png")
frame(f"{ST}/_bath.jpg","06",f"{PL}/bath.png")
frame(f"{ST}/_sun.jpg","07",f"{PL}/sun.png")
frame(f"{ST}/_house.jpg","08",f"{PL}/live.png")
frame(f"{ST}/_house.jpg","09",f"{PL}/work.png")
frame(f"{ST}/_house.jpg","10",f"{PL}/outro.png")

def run(cmd,tag):
    r=subprocess.run(cmd,capture_output=True,text=True)
    if r.returncode: print("ERR",tag,r.stderr[-600:]); sys.exit(1)
    print("ok",tag)

# ---- SMOOTH ending: ONE continuous house clip, LIVE->WORK->outro all crossfade over it ----
DUR=8.6
inp=["-ss","0","-t","5","-i","shots/B2_after_pushin.mp4",
     "-loop","1","-i",f"{PL}/live.png","-loop","1","-i",f"{PL}/work.png","-loop","1","-i",f"{PL}/outro.png"]
fc=[f"[0:v]setpts=1.72*PTS,{NORM}[bg]",
    "[1:v]format=rgba,fade=t=in:st=0.6:d=0.4:alpha=1,fade=t=out:st=2.4:d=0.4:alpha=1[l]",
    "[2:v]format=rgba,fade=t=in:st=3.2:d=0.4:alpha=1,fade=t=out:st=5.2:d=0.5:alpha=1[w]",
    "[3:v]format=rgba,fade=t=in:st=5.4:d=0.7:alpha=1[o]",
    "[bg][l]overlay=0:0:enable='between(t,0.5,2.9)'[m1]",
    "[m1][w]overlay=0:0:enable='between(t,3.1,5.8)'[m2]",
    f"[m2][o]overlay=0:0:enable='between(t,5.3,{DUR})'[v]"]
run(["ffmpeg","-y","-loglevel","error",*inp,"-filter_complex",";".join(fc),"-map","[v]","-t",str(DUR),*ENC,"-an",f"{OUT}/_v.mp4"],"ending")
run(["ffmpeg","-y","-loglevel","error","-i",f"{OUT}/_v.mp4","-i","music_smalltown.mp3",
     "-map","0:v","-map","1:a","-t",str(DUR),"-c:v","copy","-c:a","aac","-b:a","192k",f"{OUT}/ending-animation.mp4"],"music")
print("STATUS_OK",f"{OUT}/ending-animation.mp4")
