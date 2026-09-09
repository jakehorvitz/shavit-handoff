#!/usr/bin/env python3
"""v3 animated preview: clean text-free clips + light text (no black box) + real 0.45s
cross-dissolves + music. Built modularly (beat clips -> xfade chain) to stay hang-proof.
Captions: name the room + vivid factual description of what was added (no 'new', no fluff)."""
import subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont

W,H,FPS=1080,1920,30
GOLD=(255,192,0); IVORY=(245,239,225)
BRIC="fonts/Bricolage.ttf"; MAN="fonts/Manrope.ttf"
OUT="recut/v3"; PL=f"{OUT}/pl"; BC=f"{OUT}/bc"
for d in (PL,BC): os.makedirs(d,exist_ok=True)
MUSIC="music_smalltown.mp3"; XF=0.45
FINAL="recut/12-River-v3-preview.mp4"

def Ft(p,s,w):
    f=ImageFont.truetype(p,s)
    try: f.set_variation_by_axes([w] if p==MAN else [s,100,w])
    except Exception:
        try: f.set_variation_by_axes([w])
        except Exception: pass
    return f
def track(d,y,t,f,fill,tr,cx=None,x0=None):
    ws=[d.textlength(c,font=f) for c in t]; tot=sum(ws)+tr*(len(t)-1); x=(W-tot)/2 if cx else x0
    for c,w in zip(t,ws): d.text((x,y),c,font=f,fill=fill); x+=w+tr
def wrap(d,t,f,mw):
    out=[]; cur=""
    for wd in t.split():
        s=(cur+" "+wd).strip()
        if d.textlength(s,font=f)<=mw: cur=s
        else: out.append(cur); cur=wd
    if cur: out.append(cur); return out
def scrim(img,top=0.54,peak=170):
    d=ImageDraw.Draw(img); t=int(H*top)
    for i in range(H-t): a=int(peak*(i/(H-t))**1.4); d.line([(0,t+i),(W,t+i)],fill=(0,0,0,a))

def plate_lower(name,head,sub):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); scrim(img); d=ImageDraw.Draw(img)
    x0=int(W*0.08); y=int(H*0.70); fh=Ft(BRIC,64,800)
    for ln in head.split("\n"): d.text((x0,y),ln,font=fh,fill=(255,255,255,255),stroke_width=1,stroke_fill=(255,255,255,255)); y+=72
    d.rectangle([x0,y+12,x0+54,y+15],fill=GOLD+(255,)); y+=30
    if sub:
        fs=Ft(MAN,27,600)
        for ln in wrap(d,sub,fs,int(W*0.84)): d.text((x0,y),ln,font=fs,fill=IVORY+(230,)); y+=36
    img.save(f"{PL}/{name}.png")
def plate_cta(name):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    ov=Image.new("RGBA",(W,H),(0,0,0,0)); dd=ImageDraw.Draw(ov)
    dd.rectangle([0,int(H*0.34),W,int(H*0.60)],fill=(0,0,0,90)); ov=ov.filter_gaussian if False else ov
    img.alpha_composite(ov)
    f=Ft(BRIC,84,800)
    t1="LIVE WITH US"; w=d.textlength(t1,font=f); d.text(((W-w)/2,int(H*0.40)),t1,font=f,fill=(255,255,255,255),stroke_width=1,stroke_fill=(255,255,255,255))
    d.line([(W/2-28,int(H*0.487)),(W/2+28,int(H*0.487))],fill=GOLD+(255,),width=4)
    t2="WORK WITH US"; w=d.textlength(t2,font=f); d.text(((W-w)/2,int(H*0.50)),t2,font=f,fill=GOLD+(255,),stroke_width=1,stroke_fill=GOLD+(255,))
    img.save(f"{PL}/{name}.png")
def outro_img(name):
    img=Image.new("RGB",(W,H),(9,9,10)); d=ImageDraw.Draw(img); cy=int(H*0.42)
    track(d,cy,"BUILT IN MICHIGAN, OHIO & INDIANA",Ft(MAN,25,700),GOLD,6.5,cx=1)
    fwm=Ft(BRIC,90,700); w1=d.textlength("SHAVIT ",font=fwm); w2=d.textlength("ROOTMAN",font=fwm)
    xw=(W-(w1+w2))/2; yw=cy+62
    d.text((xw,yw),"SHAVIT ",font=fwm,fill=(255,255,255)); d.text((xw+w1,yw),"ROOTMAN",font=fwm,fill=GOLD)
    track(d,yw+128,"REAL ESTATE, OPERATED.",Ft(MAN,22,500),(245,239,225),5.0,cx=1)
    track(d,int(H*0.72),"MADE POSSIBLE BY THE CPM TEAM",Ft(MAN,23,600),(245,239,225),4.5,cx=1)
    img.save(f"{PL}/{name}.png")

# revised captions: room name + vivid factual additions
plate_lower("p1","12 RIVER STREET","Hillsdale, Michigan")
plate_lower("p2","REBUILT FROM\nTHE STUDS UP","")
plate_lower("p3","KITCHEN","Shaker cabinets, a full stainless appliance suite, subway-tile backsplash, and wide vinyl plank floors.")
plate_lower("p4","LIVING ROOM","Refinished floors, fresh paint throughout, and a restored brick fireplace.")
plate_lower("p5","BATHROOM","A floor-to-ceiling tile shower, double vanity, and matte black fixtures.")
plate_lower("p6","ALL-SEASON ROOM","The old three-season porch, rebuilt with a wood-plank ceiling and wraparound windows.")
plate_cta("p7"); outro_img("p8")

def sh(cmd,tag):
    r=subprocess.run(cmd,capture_output=True,text=True)
    if r.returncode: print("ERR",tag,r.stderr[-500:]); sys.exit(1)
    print("ok",tag)

NORM=f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},format=yuv420p"
ENC=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p"]

def clip_from_video(src,ss,dur,plate,out):
    sh(["ffmpeg","-y","-loglevel","error","-ss",str(ss),"-t",str(dur),"-i",f"shots/{src}.mp4",
        "-loop","1","-i",f"{PL}/{plate}.png",
        "-filter_complex",f"[0:v]{NORM}[v];[v][1:v]overlay=0:0:shortest=1[o]",
        "-map","[o]","-t",str(dur),*ENC,"-an",out],out)
def clip_from_still(still,dur,plate,out,z=True):
    frames=int(dur*FPS); zf="min(zoom+0.0007,1.10)" if z else "1.06"
    vf=(f"crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale={W*2}:{H*2},"
        f"zoompan=z='{zf}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS},format=yuv420p")
    fc=f"[0:v]{vf}[v];[v][1:v]overlay=0:0:shortest=1[o]" if plate else f"[0:v]{vf}[o]"
    ins=["-loop","1","-t",str(dur),"-i",still]
    if plate: ins+=["-loop","1","-i",f"{PL}/{plate}.png"]
    sh(["ffmpeg","-y","-loglevel","error",*ins,"-filter_complex",fc,"-map","[o]","-t",str(dur),*ENC,"-an",out],out)

# (kind, src, ss, dur, plate)
BEATS=[
 ("v","B1_before_pushin",1.0,3.0,"p1"),
 ("v","A_hero_v4_flipbook",0.8,2.8,"p2"),
 ("s","recut/kitchen/k23.jpg",0,4.0,"p3"),
 ("v","W_fireplace",0.8,3.5,"p4"),
 ("v","W_bath",0.8,3.5,"p5"),
 ("v","W_sunroom",0.8,3.7,"p6"),
 ("v","B2_after_pushin",0.0,5.0,"p7"),
 ("s",f"{PL}/p8.png",0,3.5,None),
]
clips=[]
for i,(k,src,ss,dur,pl) in enumerate(BEATS,1):
    out=f"{BC}/b{i}.mp4"
    if k=="v": clip_from_video(src,ss,dur,pl,out)
    else: clip_from_still(src,dur,pl,out, z=(i!=8))
    clips.append((out,dur))

# xfade chain
inp=[];
for c,_ in clips: inp+=["-i",c]
fc=[]; prev="0:v"; acc=clips[0][1]
for i in range(1,len(clips)):
    off=round(acc-XF,3)
    lbl=f"x{i}"
    fc.append(f"[{prev}][{i}:v]xfade=transition=fade:duration={XF}:offset={off}[{lbl}]")
    prev=lbl; acc=round(acc+clips[i][1]-XF,3)
sh(["ffmpeg","-y","-loglevel","error",*inp,"-filter_complex",";".join(fc),"-map",f"[{prev}]",
    *ENC,"-an",f"{OUT}/_silent.mp4"],"xfade")
sh(["ffmpeg","-y","-loglevel","error","-i",f"{OUT}/_silent.mp4","-i",MUSIC,
    "-filter_complex",f"[1:a]afade=t=in:st=0:d=0.5,afade=t=out:st={round(acc-1.5,3)}:d=1.5,volume=0.85[a]",
    "-map","0:v","-map","[a]","-shortest","-c:v","copy","-c:a","aac","-b:a","192k",FINAL],"music")
print("STATUS_OK",FINAL,acc)
