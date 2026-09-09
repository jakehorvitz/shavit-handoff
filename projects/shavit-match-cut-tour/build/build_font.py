#!/usr/bin/env python3
"""Build a full reel in a chosen DISPLAY font. Usage: build_font.py <slug>
slug in {bigcaslon, superclarendon, futura}. Body/small text stays Avenir.
Auto-fits big text to frame width; auto-scales address digits for old-style-figure fonts."""
import subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont
W,H,FPS=1080,1920,30
GOLD=(255,192,0); IVORY=(245,239,225)
AVENIR="/System/Library/Fonts/Avenir Next.ttc"
S="/System/Library/Fonts/Supplemental"
FONTS={
 "bigcaslon":("Big Caslon",f"{S}/BigCaslon.ttf",0),
 "superclarendon":("Superclarendon",f"{S}/SuperClarendon.ttc",0),
 "futura":("Futura",f"{S}/Futura.ttc",0),
}
SLUG=sys.argv[1]; NAME,FPATH,FIDX=FONTS[SLUG]
V=f"recut/fonts_out/{SLUG}"; PL=f"{V}/pl"; BC=f"{V}/bc"
for d in (PL,BC): os.makedirs(d,exist_ok=True)
FINAL=f"recut/12-River-{SLUG}.mp4"; XF=0.45
ENC=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p"]
NORM=f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},format=yuv420p"
_dd=ImageDraw.Draw(Image.new("RGB",(10,10)))

def Disp(s): return ImageFont.truetype(FPATH,s,index=FIDX)
def A(s): return ImageFont.truetype(AVENIR,s,index=0)
def w_of(text,f,tr=0): return sum(_dd.textlength(c,font=f) for c in text)+tr*(len(text)-1)
def fit(text,target,maxw,tr=0):
    s=target
    while s>20 and w_of(text,Disp(s),tr)>maxw: s-=2
    return Disp(s),s
def digit_scale():
    f=Disp(100); cb=f.getbbox("R"); db=f.getbbox("2")
    caph=cb[3]-cb[1]; digh=db[3]-db[1]
    r=caph/digh if digh>0 else 1.0
    return r if r>1.12 else 1.0     # >1.12 => old-style figures, scale up
def ctext(d,y,t,f,fill,tr=0,sh=True,cx=None,x0=None):
    ws=[d.textlength(c,font=f) for c in t]; tot=sum(ws)+tr*(len(t)-1)
    bx=(W-tot)/2 if x0 is None else x0
    if sh:
        x=bx
        for c,w in zip(t,ws): d.text((x,y),c,font=f,fill=(0,0,0,150),stroke_width=5,stroke_fill=(0,0,0,150)); x+=w+tr
    x=bx
    for c,w in zip(t,ws): d.text((x,y),c,font=f,fill=fill); x+=w+tr
def ltext(d,x,y,t,f,fill):
    d.text((x,y),t,font=f,fill=(0,0,0,150),stroke_width=5,stroke_fill=(0,0,0,150)); d.text((x,y),t,font=f,fill=fill)
def scrim(img,top=0.50,peak=190):
    d=ImageDraw.Draw(img); t=int(H*top)
    for i in range(H-t): a=int(peak*(i/(H-t))**1.4); d.line([(0,t+i),(W,t+i)],fill=(0,0,0,a))
def wrap(t,f,mw):
    out=[]; cur=""
    for wd in t.split():
        s=(cur+" "+wd).strip()
        if w_of(s,f)<=mw: cur=s
        else: out.append(cur); cur=wd
    if cur: out.append(cur); return out

# ---------- plates ----------
def p_forgotten():
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    f,_=fit("FORGOTTEN",150,int(W*0.94)); cy=int(H*0.45)
    for dx,dy,a in [(0,8,150),(0,4,150),(0,0,160)]:
        d.text((W/2+dx,cy+dy),"FORGOTTEN",font=f,fill=(0,0,0,a),anchor="mm",stroke_width=10,stroke_fill=(0,0,0,a))
    d.text((W/2,cy),"FORGOTTEN",font=f,fill=(255,255,255,255),anchor="mm"); img.save(f"{PL}/forgotten.png")
def p_address():
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    fmain,ms=fit("RIVER STREET",104,int(W*0.66)); sc=digit_scale(); fnum=Disp(int(ms*sc))
    num="12"; gap="  "; main="RIVER STREET"
    wn=d.textlength(num,font=fnum); wg=d.textlength(gap,font=fmain); wm=d.textlength(main,font=fmain)
    by=int(H*0.55); x=(W-(wn+wg+wm))/2
    for t,f,w in [(num,fnum,wn),(gap,fmain,wg),(main,fmain,wm)]:
        d.text((x,by),t,font=f,fill=(0,0,0,150),anchor="ls",stroke_width=5,stroke_fill=(0,0,0,150))
        d.text((x,by),t,font=f,fill=(255,255,255,255),anchor="ls"); x+=w
    ctext(d,by+22,"HILLSDALE, MICHIGAN",A(30),IVORY+(255,),6)
    img.save(f"{PL}/addr.png")
def p_room(name,head,sub):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); scrim(img); d=ImageDraw.Draw(img)
    x0=int(W*0.08); y=int(H*0.665); fh,_=fit(head,84,int(W*0.84))
    ltext(d,x0,y,head,fh,(255,255,255,255)); y+=96
    d.rectangle([x0,y+2,x0+56,y+5],fill=GOLD+(255,)); y+=26
    fs=A(34)
    for ln in wrap(sub,fs,int(W*0.86)): ltext(d,x0,y,ln,fs,(255,255,255,255)); y+=48
    img.save(f"{PL}/{name}.png")
def p_cta(name,text,col):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    f,_=fit(text,110,int(W*0.86)); ctext(d,int(H*0.44),text,f,col+(255,)); img.save(f"{PL}/{name}.png")
def p_outro():
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img); d.rectangle([0,0,W,H],fill=(0,0,0,120))
    cy=int(H*0.40); ctext(d,cy,"BUILT IN MICHIGAN, OHIO & INDIANA",A(26),GOLD+(255,),6)
    fwm,ws=fit("SHAVIT ROOTMAN",92,int(W*0.90)); w1=d.textlength("SHAVIT ",font=fwm); w2=d.textlength("ROOTMAN",font=fwm)
    xw=(W-(w1+w2))/2; yw=cy+58
    d.text((xw,yw),"SHAVIT ",font=fwm,fill=(0,0,0,150),stroke_width=5,stroke_fill=(0,0,0,150))
    d.text((xw+w1,yw),"ROOTMAN",font=fwm,fill=(0,0,0,150),stroke_width=5,stroke_fill=(0,0,0,150))
    d.text((xw,yw),"SHAVIT ",font=fwm,fill=(255,255,255,255)); d.text((xw+w1,yw),"ROOTMAN",font=fwm,fill=GOLD+(255,))
    ctext(d,yw+int(ws*1.55),"REAL ESTATE, OPERATED.",A(25),(240,236,225,255),5)
    ctext(d,int(H*0.72),"MADE POSSIBLE BY THE CPM TEAM",A(25),(240,236,225,255),4.5)
    img.save(f"{PL}/outro.png")

p_forgotten(); p_address(); p_cta("live","LIVE WITH US",(255,255,255)); p_cta("work","WORK WITH US",GOLD)
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

# ending: house -> LIVE -> WORK -> smooth outro (continuous)
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

# opening: continuous flipbook + FORGOTTEN + address
OPEN=8.2
fo=(f"[0:v]tpad=start_mode=clone:start_duration=1.3,{NORM}[bg];"
    f"[1:v]format=rgba,fade=t=in:st=0.4:d=0.5:alpha=1,fade=t=out:st=2.5:d=0.5:alpha=1[fg];"
    f"[2:v]format=rgba,fade=t=in:st=5.0:d=0.5:alpha=1[ad];"
    f"[bg][fg]overlay=0:0:enable='between(t,0.3,3.1)'[m1];"
    f"[m1][ad]overlay=0:0:enable='between(t,4.9,{OPEN})'[o]")
run(["ffmpeg","-y","-loglevel","error","-i","shots/A_hero_v4_flipbook.mp4",
     "-loop","1","-i",f"{PL}/forgotten.png","-loop","1","-i",f"{PL}/addr.png",
     "-filter_complex",fo,"-map","[o]","-t",str(OPEN),*ENC,"-an",f"{BC}/b_open.mp4"],"opening")

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
print("STATUS_OK",SLUG,FINAL,round(acc,1))
