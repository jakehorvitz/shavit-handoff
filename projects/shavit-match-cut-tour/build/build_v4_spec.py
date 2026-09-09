#!/usr/bin/env python3
"""v4 spec assets: updated static frames (FORGOTTEN open, clean construction, bold address at end)
+ a rendered ENDING-ANIMATION demo (house -> bold address -> LIVE animates in/out -> WORK animates in
-> HARD CUT to outro) so Jake can see the CTA animation he asked for."""
import subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont

W,H,FPS=1080,1920,30
GOLD=(255,192,0); IVORY=(245,239,225)
BRIC="fonts/Bricolage.ttf"; MAN="fonts/Manrope.ttf"
OUT="recut/v4"; PL=f"{OUT}/pl"; ST=f"{OUT}/story"
for d in (PL,ST): os.makedirs(d,exist_ok=True)

def Ft(p,s,w):
    f=ImageFont.truetype(p,s)
    try: f.set_variation_by_axes([w] if p==MAN else [s,100,w])
    except Exception:
        try: f.set_variation_by_axes([w])
        except Exception: pass
    return f
def ctext(d,y,t,f,fill,tr=0):
    ws=[d.textlength(c,font=f) for c in t]; tot=sum(ws)+tr*(len(t)-1); x=(W-tot)/2
    for c,w in zip(t,ws): d.text((x,y),c,font=f,fill=fill); x+=w+tr
def scrim(img,top=0.5,peak=150):
    d=ImageDraw.Draw(img); t=int(H*top)
    for i in range(H-t): a=int(peak*(i/(H-t))**1.4); d.line([(0,t+i),(W,t+i)],fill=(0,0,0,a))
def vign(img,peak=110):  # soft center darkening for centered text legibility (not a box)
    d=ImageDraw.Draw(img)
    for i in range(int(H*0.34),int(H*0.62)):
        d.line([(0,i),(W,i)],fill=(0,0,0,int(peak*0.5)))

def grab(clip,t,dst): subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(t),"-i",f"shots/{clip}.mp4","-frames:v","1",dst],check=False)
def fit(src):
    im=Image.open(src).convert("RGB"); tw=im.height*9//16
    if im.width>=tw: x0=(im.width-tw)//2; im=im.crop((x0,0,x0+tw,im.height))
    else: th=im.width*16//9; y0=max(0,(im.height-th)//2); im=im.crop((0,y0,im.width,y0+th))
    return im.resize((W,H),Image.LANCZOS)

# ---------- transparent overlay plates (for the animation) ----------
def plate_word(name, word):   # evocative single word, lower third, light scrim
    img=Image.new("RGBA",(W,H),(0,0,0,0)); scrim(img); d=ImageDraw.Draw(img)
    ctext(d,int(H*0.74),word,Ft(BRIC,74,800),(255,255,255,255))
    img.save(f"{PL}/{name}.png")
def plate_address(name):      # BOLD address, centered-lower
    img=Image.new("RGBA",(W,H),(0,0,0,0)); vign(img,150); d=ImageDraw.Draw(img)
    ctext(d,int(H*0.55),"12 RIVER STREET",Ft(BRIC,86,800),(255,255,255,255))
    ctext(d,int(H*0.615),"HILLSDALE, MICHIGAN",Ft(MAN,30,700),IVORY+(235,),4)
    img.save(f"{PL}/{name}.png")
def plate_cta(name,text,col): # centered CTA word
    img=Image.new("RGBA",(W,H),(0,0,0,0)); vign(img,130); d=ImageDraw.Draw(img)
    ctext(d,int(H*0.45),text,Ft(BRIC,92,800),col+(255,))
    img.save(f"{PL}/{name}.png")
def outro_img(name):
    img=Image.new("RGB",(W,H),(9,9,10)); d=ImageDraw.Draw(img); cy=int(H*0.42)
    ctext(d,cy,"BUILT IN MICHIGAN, OHIO & INDIANA",Ft(MAN,25,700),GOLD,6.5)
    fwm=Ft(BRIC,90,700); w1=d.textlength("SHAVIT ",font=fwm); w2=d.textlength("ROOTMAN",font=fwm)
    xw=(W-(w1+w2))/2; yw=cy+62
    d.text((xw,yw),"SHAVIT ",font=fwm,fill=(255,255,255)); d.text((xw+w1,yw),"ROOTMAN",font=fwm,fill=GOLD)
    ctext(d,yw+128,"REAL ESTATE, OPERATED.",Ft(MAN,22,500),(245,239,225),5)
    ctext(d,int(H*0.72),"MADE POSSIBLE BY THE CPM TEAM",Ft(MAN,23,600),(245,239,225),4.5)
    img.save(f"{PL}/{name}.png")

plate_word("forgotten","FORGOTTEN")
plate_address("addr")
plate_cta("live","LIVE WITH US",(255,255,255))
plate_cta("work","WORK WITH US",GOLD)
outro_img("outro")

# ---------- updated static storyboard frames ----------
def frame(srcimg, name, plate_png=None, base_is_still=True):
    base=(fit(srcimg) if base_is_still else Image.open(srcimg).convert("RGB")).convert("RGBA")
    if plate_png: base.alpha_composite(Image.open(plate_png).convert("RGBA"))
    base.convert("RGB").save(f"{ST}/{name}.jpg",quality=90)
grab("B1_before_pushin",2.4,f"{ST}/_before.jpg")
grab("A_hero_v4_flipbook",1.8,f"{ST}/_constr.jpg")
grab("B2_after_pushin",2.6,f"{ST}/_house.jpg")
frame(f"{ST}/_before.jpg","01",f"{PL}/forgotten.png")
frame(f"{ST}/_constr.jpg","02")                       # clean, no text
frame(f"{ST}/_house.jpg","07a",f"{PL}/addr.png")
frame(f"{ST}/_house.jpg","07b",f"{PL}/live.png")
frame(f"{ST}/_house.jpg","07c",f"{PL}/work.png")

# ---------- ENDING ANIMATION demo ----------
NORM=f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},format=yuv420p"
ENC=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p"]
HOUSE_DUR=6.8
# house base slowed a touch for more dwell (setpts), then timed alpha-fades of addr/live/work
def ov(idx,a,b,fin=0.4,fout=0.4,rise=0):
    y = f":y='H*0+{'' if not rise else f'(-{rise}*max(0,1-(t-{a})/{fin}))'}'" if rise else ""
    return (f"[{idx}:v]format=rgba,fade=t=in:st={a}:d={fin}:alpha=1,fade=t=out:st={round(b-fout,3)}:d={fout}:alpha=1[o{idx}]",)
def run(cmd,tag):
    r=subprocess.run(cmd,capture_output=True,text=True)
    if r.returncode: print("ERR",tag,r.stderr[-600:]); sys.exit(1)
    print("ok",tag)

# build house-with-animation segment
inp=["-ss","0","-t","5","-i","shots/B2_after_pushin.mp4",
     "-loop","1","-i",f"{PL}/addr.png","-loop","1","-i",f"{PL}/live.png","-loop","1","-i",f"{PL}/work.png"]
fc=[f"[0:v]setpts=1.36*PTS,{NORM}[bg]"]     # 5s -> ~6.8s slower push = more house time
# addr visible 0.4-2.4 ; live 3.0-4.6 ; work 5.0-6.8(end)
fc.append(f"[1:v]format=rgba,fade=t=in:st=0.4:d=0.4:alpha=1,fade=t=out:st=2.0:d=0.4:alpha=1[a1]")
fc.append(f"[2:v]format=rgba,fade=t=in:st=3.0:d=0.35:alpha=1,fade=t=out:st=4.25:d=0.35:alpha=1[a2]")
fc.append(f"[3:v]format=rgba,fade=t=in:st=5.0:d=0.35:alpha=1[a3]")
fc.append(f"[bg][a1]overlay=0:0:enable='between(t,0.3,2.5)'[m1]")
fc.append(f"[m1][a2]overlay=0:0:enable='between(t,2.9,4.7)'[m2]")
fc.append(f"[m2][a3]overlay=0:0:enable='between(t,4.9,{HOUSE_DUR})'[m3]")
run(["ffmpeg","-y","-loglevel","error",*inp,"-filter_complex",";".join(fc),"-map","[m3]","-t",str(HOUSE_DUR),*ENC,"-an",f"{OUT}/_house.mp4"],"house-anim")
# outro 2.8s (hard cut)
run(["ffmpeg","-y","-loglevel","error","-loop","1","-t","2.8","-i",f"{PL}/outro.png","-vf",f"fps={FPS},format=yuv420p","-t","2.8",*ENC,"-an",f"{OUT}/_outro.mp4"],"outro")
# concat (HARD CUT), add music tail
open(f"{OUT}/cat.txt","w").write(f"file '{os.path.abspath(OUT)}/_house.mp4'\nfile '{os.path.abspath(OUT)}/_outro.mp4'\n")
run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",f"{OUT}/cat.txt","-i","music_smalltown.mp3",
     "-map","0:v","-map","1:a","-t","9.6","-c:v","copy","-c:a","aac","-b:a","192k",f"{OUT}/ending-animation.mp4"],"ending")
print("STATUS_OK", f"{OUT}/ending-animation.mp4")
