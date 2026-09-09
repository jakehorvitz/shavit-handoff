#!/usr/bin/env python3
"""FINAL v2 — match the ORIGINAL 98/100 text look exactly: Bricolage headlines + Manrope small caps,
HAIRLINE white stroke on a soft scrim (NOT a heavy dark outline), soft shadow for centered text.
Content: room names, address = RIVER STREET (no 12), no 'Forgotten', Live/Work CTA, smooth outro.
Output: recut/12-River-FINAL.mp4"""
import subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W,H,FPS=1080,1920,30
GOLD=(255,192,0); IVORY=(245,239,225)
BRIC="fonts/Bricolage.ttf"; MAN="fonts/Manrope.ttf"
V="recut/final"; PL=f"{V}/pl"; BC=f"{V}/bc"
for d in (PL,BC): os.makedirs(d,exist_ok=True)
FINAL="recut/12-River-FINAL.mp4"; XF=0.45
ENC=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p"]
NORM=f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},format=yuv420p"
_dd=ImageDraw.Draw(Image.new("RGB",(10,10)))

def Disp(s,wght=800):
    f=ImageFont.truetype(BRIC,s)
    try: f.set_variation_by_axes([s,100,wght])
    except Exception:
        try: f.set_variation_by_axes([wght])
        except Exception: pass
    return f
def A(s,wght=600):
    f=ImageFont.truetype(MAN,s)
    try: f.set_variation_by_axes([wght])
    except Exception: pass
    return f
def w_of(t,f,tr=0): return sum(_dd.textlength(c,font=f) for c in t)+tr*(len(t)-1)
def fit(t,target,maxw,wght=800,tr=0):
    s=target
    while s>20 and w_of(t,Disp(s,wght),tr)>maxw: s-=2
    return Disp(s,wght)
def scrim(img,top=0.54,peak=165):
    d=ImageDraw.Draw(img); t=int(H*top)
    for i in range(H-t): a=int(peak*(i/(H-t))**1.4); d.line([(0,t+i),(W,t+i)],fill=(0,0,0,a))
def draw_tracked(d,x,y,t,f,fill,tr=0):
    for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr
def soft_layer(drawfn):   # returns a blurred dark shadow layer for the given text draw
    sl=Image.new("RGBA",(W,H),(0,0,0,0)); drawfn(ImageDraw.Draw(sl),(0,0,0,205))
    return sl.filter(ImageFilter.GaussianBlur(6))
# centered text with soft shadow (clean, no box, no hard outline)
def centered(img,y,t,f,fill,tr=0):
    tot=w_of(t,f,tr); x0=(W-tot)/2
    img.alpha_composite(soft_layer(lambda d,c: draw_tracked(d,x0,y+3,t,f,c,tr)))
    draw_tracked(ImageDraw.Draw(img),x0,y,t,f,fill,tr)
# left text on scrim with HAIRLINE white stroke (original look)
def hstroke(d,x,y,t,f,fill):
    d.text((x,y),t,font=f,fill=fill,stroke_width=1,stroke_fill=fill)
def wrap(t,f,mw):
    out=[]; cur=""
    for wd in t.split():
        s=(cur+" "+wd).strip()
        if w_of(s,f)<=mw: cur=s
        else: out.append(cur); cur=wd
    if cur: out.append(cur); return out

def p_address():   # centered, soft shadow, RIVER STREET (no 12) + gold rule + tracked city
    img=Image.new("RGBA",(W,H),(0,0,0,0))
    f=fit("RIVER STREET",100,int(W*0.86)); ytop=int(H*0.44)
    centered(img,ytop,"RIVER STREET",f,(255,255,255,255))
    rw=70; ry=ytop+int(f.size*0.86)+12
    ImageDraw.Draw(img).rectangle([(W-rw)//2,ry,(W+rw)//2,ry+4],fill=GOLD+(255,))
    centered(img,ry+24,"HILLSDALE, MICHIGAN",A(30,700),IVORY+(255,),6)
    img.save(f"{PL}/addr.png")
def p_room(name,head,sub):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); scrim(img,0.50,180); d=ImageDraw.Draw(img)
    x0=int(W*0.08); y=int(H*0.665); fh=fit(head,84,int(W*0.84))
    hstroke(d,x0,y,head,fh,(255,255,255,255)); y+=int(fh.size*1.12)
    d.rectangle([x0,y+2,x0+56,y+5],fill=GOLD+(255,)); y+=24
    fs=A(33,600)
    for ln in wrap(sub,fs,int(W*0.86)): hstroke(d,x0,y,ln,fs,(255,255,255,255)); y+=44
    img.save(f"{PL}/{name}.png")
def p_cta(name,text,col):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); centered(img,int(H*0.44),text,fit(text,110,int(W*0.86)),col+(255,)); img.save(f"{PL}/{name}.png")
def p_outro():
    img=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(img).rectangle([0,0,W,H],fill=(0,0,0,120))
    cy=int(H*0.40); centered(img,cy,"BUILT IN MICHIGAN, OHIO & INDIANA",A(26,800),GOLD+(255,),6)
    fwm=fit("SHAVIT ROOTMAN",92,int(W*0.90),wght=700)
    tot=w_of("SHAVIT ROOTMAN",fwm); x0=(W-tot)/2; yw=cy+62
    img.alpha_composite(soft_layer(lambda d,c: d.text((x0,yw),"SHAVIT ROOTMAN",font=fwm,fill=c)))
    d=ImageDraw.Draw(img); w1=d.textlength("SHAVIT ",font=fwm)
    d.text((x0,yw),"SHAVIT ",font=fwm,fill=(255,255,255,255)); d.text((x0+w1,yw),"ROOTMAN",font=fwm,fill=GOLD+(255,))
    centered(img,yw+int(fwm.size*1.5),"REAL ESTATE, OPERATED.",A(24,700),IVORY+(255,),5)
    centered(img,int(H*0.72),"MADE POSSIBLE BY THE CPM TEAM",A(24,700),IVORY+(255,),4.5)
    img.save(f"{PL}/outro.png")

p_address(); p_cta("live","LIVE WITH US",(255,255,255)); p_cta("work","WORK WITH US",GOLD)
p_room("kitchen","KITCHEN","Shaker cabinets, a full stainless appliance suite, subway-tile backsplash, and wide vinyl plank floors.")
p_room("living","LIVING ROOM","Refinished floors, fresh paint throughout, and a restored brick fireplace.")
p_room("bath","BATHROOM","A floor-to-ceiling tile shower, double vanity, and matte black fixtures.")
p_room("sun","ALL-SEASON ROOM","The old three-season porch, rebuilt with a wood-plank ceiling and wraparound windows.")
p_outro()

def run(cmd,tag):
    r=subprocess.run(cmd,capture_output=True,text=True)
    if r.returncode: print("ERR",tag,r.stderr[-600:]); sys.exit(1)
def kb(dur,zin=True):
    frames=int(dur*FPS); z="min(zoom+0.0006,1.09)" if zin else "if(lte(zoom,1.0),1.09,max(1.001,zoom-0.0006))"
    return (f"crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale={W*2}:{H*2},"
            f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS},format=yuv420p")
def clip_still(still,dur,plate,out,zin=True):
    ins=["-loop","1","-t",str(dur),"-i",still]+(["-loop","1","-i",plate] if plate else [])
    fc=(f"[0:v]{kb(dur,zin)}[v];[v][1:v]overlay=0:0:shortest=1[o]" if plate else f"[0:v]{kb(dur,zin)}[o]")
    run(["ffmpeg","-y","-loglevel","error",*ins,"-filter_complex",fc,"-map","[o]","-t",str(dur),*ENC,"-an",out],out)

DUR=8.6
fc=[f"[0:v]setpts=1.72*PTS,{NORM}[bg]",
    "[1:v]format=rgba,fade=t=in:st=0.6:d=0.4:alpha=1,fade=t=out:st=2.4:d=0.4:alpha=1[l]",
    "[2:v]format=rgba,fade=t=in:st=3.2:d=0.4:alpha=1,fade=t=out:st=5.2:d=0.5:alpha=1[w]",
    "[3:v]format=rgba,fade=t=in:st=5.4:d=0.7:alpha=1[o]",
    "[bg][l]overlay=0:0:enable='between(t,0.5,2.9)'[m1]",
    "[m1][w]overlay=0:0:enable='between(t,3.1,5.8)'[m2]",
    f"[m2][o]overlay=0:0:enable='between(t,5.3,{DUR})'[v]"]
run(["ffmpeg","-y","-loglevel","error","-ss","0","-t","5","-i","shots/B2_after_pushin.mp4",
     "-loop","1","-i",f"{PL}/live.png","-loop","1","-i",f"{PL}/work.png","-loop","1","-i",f"{PL}/outro.png",
     "-filter_complex",";".join(fc),"-map","[v]","-t",str(DUR),*ENC,"-an",f"{BC}/_v.mp4"],"ending")

OPEN=7.4
fo=(f"[0:v]tpad=start_mode=clone:start_duration=0.6,{NORM}[bg];"
    f"[1:v]format=rgba,fade=t=in:st=4.3:d=0.5:alpha=1[ad];"
    f"[bg][ad]overlay=0:0:enable='between(t,4.2,{OPEN})'[o]")
run(["ffmpeg","-y","-loglevel","error","-i","shots/A_hero_v4_flipbook.mp4",
     "-loop","1","-i",f"{PL}/addr.png","-filter_complex",fo,"-map","[o]","-t",str(OPEN),*ENC,"-an",f"{BC}/b_open.mp4"],"opening")

clips=[(f"{BC}/b_open.mp4",OPEN)]
clip_still("recut/kitchen/k23.jpg",3.6,f"{PL}/kitchen.png",f"{BC}/b4.mp4");            clips.append((f"{BC}/b4.mp4",3.6))
clip_still("upscaled/fireplace_4k.jpg",3.3,f"{PL}/living.png",f"{BC}/b5.mp4",zin=False);clips.append((f"{BC}/b5.mp4",3.3))
clip_still("upscaled/bath_4k.jpg",3.3,f"{PL}/bath.png",f"{BC}/b6.mp4");                clips.append((f"{BC}/b6.mp4",3.3))
clip_still("upscaled/sunroom_4k.jpg",3.0,f"{PL}/sun.png",f"{BC}/b7.mp4",zin=False);    clips.append((f"{BC}/b7.mp4",3.0))
clips.append((f"{BC}/_v.mp4",DUR))

inp=[]
for c,_ in clips: inp+=["-i",c]
fcx=[]; prev="0:v"; acc=clips[0][1]
for i in range(1,len(clips)):
    off=round(acc-XF,3); fcx.append(f"[{prev}][{i}:v]xfade=transition=fade:duration={XF}:offset={off}[x{i}]"); prev=f"x{i}"; acc=round(acc+clips[i][1]-XF,3)
run(["ffmpeg","-y","-loglevel","error",*inp,"-filter_complex",";".join(fcx),"-map",f"[{prev}]",*ENC,"-an",f"{BC}/_silent.mp4"],"xfade")
run(["ffmpeg","-y","-loglevel","error","-i",f"{BC}/_silent.mp4","-i","music_smalltown.mp3",
     "-filter_complex",f"[1:a]afade=t=in:st=0:d=0.5,afade=t=out:st={round(acc-1.6,3)}:d=1.6,volume=0.85[a]",
     "-map","0:v","-map","[a]","-t",str(acc),"-c:v","copy","-c:a","aac","-b:a","192k",FINAL],"music")
print("STATUS_OK",FINAL,round(acc,1))
