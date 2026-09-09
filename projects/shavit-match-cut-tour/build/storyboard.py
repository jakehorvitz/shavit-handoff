#!/usr/bin/env python3
"""Frame-by-frame storyboard for the v3 recut: real source frame + real new-text styling
(light scrim, NO black box) so Jake approves each beat's look before any video is built."""
import subprocess, os
from PIL import Image, ImageDraw, ImageFont

W,H=1080,1920
GOLD=(255,192,0); IVORY=(245,239,225)
BRIC="fonts/Bricolage.ttf"; MAN="fonts/Manrope.ttf"
OUT="recut/story"; os.makedirs(OUT, exist_ok=True)

def Ft(p,s,w):
    f=ImageFont.truetype(p,s)
    try: f.set_variation_by_axes([w] if p==MAN else [s,100,w])
    except Exception:
        try: f.set_variation_by_axes([w])
        except Exception: pass
    return f

def grab(clip,t,dst):
    subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(t),"-i",f"shots/{clip}.mp4",
                    "-frames:v","1",dst],check=False)

def fit(src):
    im=Image.open(src).convert("RGB")
    tw=im.height*9//16
    if im.width>=tw:
        x0=(im.width-tw)//2; im=im.crop((x0,0,x0+tw,im.height))
    else:
        th=im.width*16//9; y0=max(0,(im.height-th)//2); im=im.crop((0,y0,im.width,y0+th))
    return im.resize((W,H),Image.LANCZOS)

def scrim(img, top=0.54, peak=175):   # LIGHT gradient, footage stays visible (original look)
    d=ImageDraw.Draw(img); t=int(H*top)
    for i in range(H-t):
        a=int(peak*(i/(H-t))**1.4); d.line([(0,t+i),(W,t+i)],fill=(0,0,0,a))

def track(d,y,text,f,fill,tr,cx=None,x0=None):
    ws=[d.textlength(c,font=f) for c in text]; total=sum(ws)+tr*(len(text)-1)
    x=(W-total)/2 if cx else x0
    for c,w in zip(text,ws): d.text((x,y),c,font=f,fill=fill); x+=w+tr
    return total

def wrap(d,text,f,maxw):
    words=text.split(); lines=[]; cur=""
    for wd in words:
        t=(cur+" "+wd).strip()
        if d.textlength(t,font=f)<=maxw: cur=t
        else: lines.append(cur); cur=wd
    if cur: lines.append(cur)
    return lines

def beat_lower(src, name, head, sub):
    base=fit(src).convert("RGBA"); ov=Image.new("RGBA",(W,H),(0,0,0,0)); scrim(ov)
    d=ImageDraw.Draw(ov); x0=int(W*0.08); y=int(H*0.70)
    fh=Ft(BRIC,64,800)
    for ln in head.split("\n"):
        d.text((x0,y),ln,font=fh,fill=(255,255,255,255),stroke_width=1,stroke_fill=(255,255,255,255)); y+=72
    d.rectangle([x0,y+12,x0+54,y+15],fill=GOLD+(255,)); y+=30
    if sub:
        fs=Ft(MAN,27,600)
        for ln in wrap(d,sub,fs,int(W*0.84)):
            d.text((x0,y),ln,font=fs,fill=IVORY+(225,)); y+=36
    base.alpha_composite(ov); p=f"{OUT}/{name}.jpg"; base.convert("RGB").save(p,quality=90); return p

def beat_cta(src,name):
    base=fit(src).convert("RGBA"); ov=Image.new("RGBA",(W,H),(0,0,0,0))
    d=ImageDraw.Draw(ov)
    # soft center vignette for legibility (NOT a hard box)
    cx,cy=W//2,int(H*0.46)
    for r in range(700,0,-4):
        a=int(120*(1-r/700)); d.ellipse([cx-r*1.4,cy-r,cx+r*1.4,cy+r],fill=(0,0,0,max(0,a//8)))
    f=Ft(BRIC,84,800)
    t1="LIVE WITH US"; w1=d.textlength(t1,font=f); d.text(((W-w1)/2,int(H*0.40)),t1,font=f,fill=(255,255,255,255),stroke_width=1,stroke_fill=(255,255,255,255))
    # arrow / connector
    d.line([(W/2-30,int(H*0.485)),(W/2+30,int(H*0.485))],fill=GOLD+(255,),width=4)
    t2="WORK WITH US"; w2=d.textlength(t2,font=f); d.text(((W-w2)/2,int(H*0.50)),t2,font=f,fill=GOLD+(255,),stroke_width=1,stroke_fill=GOLD+(255,))
    base.alpha_composite(ov); p=f"{OUT}/{name}.jpg"; base.convert("RGB").save(p,quality=90); return p

def beat_outro(name):
    img=Image.new("RGB",(W,H),(9,9,10)); d=ImageDraw.Draw(img); cy=int(H*0.42)
    track(d,cy,"BUILT IN MICHIGAN, OHIO & INDIANA",Ft(MAN,25,700),GOLD,6.5,cx=1)
    fwm=Ft(BRIC,90,700); w1=d.textlength("SHAVIT ",font=fwm); w2=d.textlength("ROOTMAN",font=fwm)
    xw=(W-(w1+w2))/2; yw=cy+62
    d.text((xw,yw),"SHAVIT ",font=fwm,fill=(255,255,255)); d.text((xw+w1,yw),"ROOTMAN",font=fwm,fill=GOLD)
    track(d,yw+128,"REAL ESTATE, OPERATED.",Ft(MAN,22,500),(245,239,225),5.0,cx=1)
    track(d,int(H*0.72),"MADE POSSIBLE BY THE CPM TEAM",Ft(MAN,23,600),(245,239,225),4.5,cx=1)
    p=f"{OUT}/{name}.jpg"; img.save(p,quality=90); return p

# --- grab clean source frames ---
grab("B1_before_pushin",2.4,f"{OUT}/_s1.jpg")
grab("A_hero_v4_flipbook",1.8,f"{OUT}/_s2.jpg")
grab("W_fireplace",2.4,f"{OUT}/_s4.jpg")
grab("W_bath",2.2,f"{OUT}/_s5.jpg")
grab("W_sunroom",2.4,f"{OUT}/_s6.jpg")
grab("B2_after_pushin",2.6,f"{OUT}/_s7.jpg")

beats=[
 ("01","0.0–3.0s · before exterior", beat_lower(f"{OUT}/_s1.jpg","01","12 RIVER STREET","Hillsdale, Michigan")),
 ("02","3.0–5.8s · construction",     beat_lower(f"{OUT}/_s2.jpg","02","REBUILT FROM\nTHE STUDS UP","")),
 ("03","5.8–9.8s · REAL kitchen",     beat_lower("recut/kitchen/k23.jpg","03","KITCHEN","Shaker cabinets, a full stainless appliance suite, subway-tile backsplash, and wide vinyl plank floors.")),
 ("04","9.8–13.3s · living room",     beat_lower(f"{OUT}/_s4.jpg","04","LIVING ROOM","Refinished floors, fresh paint throughout, and a restored brick fireplace.")),
 ("05","13.3–16.8s · bathroom",       beat_lower(f"{OUT}/_s5.jpg","05","BATHROOM","A floor-to-ceiling tile shower, double vanity, and matte black fixtures.")),
 ("06","16.8–20.5s · all-season room",beat_lower(f"{OUT}/_s6.jpg","06","ALL-SEASON ROOM","The old three-season porch, rebuilt with a wood-plank ceiling and wraparound windows.")),
 ("07","20.5–25.5s · renovated house",beat_cta(f"{OUT}/_s7.jpg","07")),
 ("08","25.5–29.0s · Shavit outro",   beat_outro("08")),
]
print("BEATS " + " | ".join(b[0] for b in beats))
import json; open(f"{OUT}/beats.json","w").write(json.dumps([[b[0],b[1]] for b in beats]))
