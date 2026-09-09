#!/usr/bin/env python3
"""v9: fix the two 'weird jumps'. The opening is now ONE continuous flipbook clip
(old house -> construction morph -> finished house); FORGOTTEN (massive, centered) fades over
the old house and the ADDRESS fades over the finished house, so there are NO beat crossfades
around the construction/address (the flipbook's own morph is the transition = the choppiness Jake likes).
Rooms stay smooth stills. Didot type, scored, hang-proof."""
import subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont
W,H,FPS=1080,1920,30
GOLD=(255,192,0)
DIDOT="/System/Library/Fonts/Supplemental/Didot.ttc"
PL="recut/v6/pl"; V="recut/v9"; BC=f"{V}/bc"; os.makedirs(BC,exist_ok=True)
FINAL="recut/12-River-v9-FULL.mp4"; XF=0.45
ENC=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p"]
NORM=f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},format=yuv420p"

def run(cmd,tag):
    r=subprocess.run(cmd,capture_output=True,text=True)
    if r.returncode: print("ERR",tag,r.stderr[-700:]); sys.exit(1)
    print("ok",tag)

# --- FORGOTTEN: massive, centered both axes, heavy shadow (no box) ---
def forgotten_plate():
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    f=ImageFont.truetype(DIDOT,150,index=0)   # fits the frame with margin, still massive
    cy=int(H*0.45)
    for dx,dy,a in [(0,8,150),(0,4,150),(0,0,160)]:  # layered drop shadow for contrast on the light house
        d.text((W/2+dx,cy+dy),"FORGOTTEN",font=f,fill=(0,0,0,a),anchor="mm",stroke_width=10,stroke_fill=(0,0,0,a))
    d.text((W/2,cy),"FORGOTTEN",font=f,fill=(255,255,255,255),anchor="mm")
    img.save(f"{V}/forgotten_big.png")
os.makedirs(V,exist_ok=True); forgotten_plate()

def kb(dur,zin=True):
    frames=int(dur*FPS); z="min(zoom+0.0006,1.09)" if zin else "if(lte(zoom,1.0),1.09,max(1.001,zoom-0.0006))"
    return (f"crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale={W*2}:{H*2},"
            f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS},format=yuv420p")
def clip_still(still,dur,plate,out,zin=True):
    ins=["-loop","1","-t",str(dur),"-i",still]
    if plate: ins+=["-loop","1","-i",plate]
    fc=(f"[0:v]{kb(dur,zin)}[v];[v][1:v]overlay=0:0:shortest=1[o]" if plate else f"[0:v]{kb(dur,zin)}[o]")
    run(["ffmpeg","-y","-loglevel","error",*ins,"-filter_complex",fc,"-map","[o]","-t",str(dur),*ENC,"-an",out],out)

# --- OPENING: continuous flipbook + FORGOTTEN (old) + address (finished) ---
OPEN=8.2   # address holds ~3s (Jake: 12 River Street on screen longer)
fc=(f"[0:v]tpad=start_mode=clone:start_duration=1.3,{NORM}[bg];"
    f"[1:v]format=rgba,fade=t=in:st=0.4:d=0.5:alpha=1,fade=t=out:st=2.5:d=0.5:alpha=1[fg];"
    f"[2:v]format=rgba,fade=t=in:st=5.0:d=0.5:alpha=1[ad];"
    f"[bg][fg]overlay=0:0:enable='between(t,0.3,3.1)'[m1];"
    f"[m1][ad]overlay=0:0:enable='between(t,4.9,{OPEN})'[o]")
run(["ffmpeg","-y","-loglevel","error","-i","shots/A_hero_v4_flipbook.mp4",
     "-loop","1","-i",f"{V}/forgotten_big.png","-loop","1","-i",f"{PL}/addr.png",
     "-filter_complex",fc,"-map","[o]","-t",str(OPEN),*ENC,"-an",f"{BC}/b_open.mp4"],"opening")

clips=[(f"{BC}/b_open.mp4",OPEN)]
clip_still("recut/kitchen/k23.jpg",3.6,f"{PL}/kitchen.png",f"{BC}/b4.mp4");            clips.append((f"{BC}/b4.mp4",3.6))
clip_still("upscaled/fireplace_4k.jpg",3.3,f"{PL}/living.png",f"{BC}/b5.mp4",zin=False);clips.append((f"{BC}/b5.mp4",3.3))
clip_still("upscaled/bath_4k.jpg",3.3,f"{PL}/bath.png",f"{BC}/b6.mp4");                clips.append((f"{BC}/b6.mp4",3.3))
clip_still("upscaled/sunroom_4k.jpg",3.0,f"{PL}/sun.png",f"{BC}/b7.mp4",zin=False);    clips.append((f"{BC}/b7.mp4",3.0))
clips.append(("recut/v6/_v.mp4",8.6))

inp=[]
for c,_ in clips: inp+=["-i",c]
fc=[]; prev="0:v"; acc=clips[0][1]
for i in range(1,len(clips)):
    off=round(acc-XF,3); lbl=f"x{i}"
    fc.append(f"[{prev}][{i}:v]xfade=transition=fade:duration={XF}:offset={off}[{lbl}]")
    prev=lbl; acc=round(acc+clips[i][1]-XF,3)
run(["ffmpeg","-y","-loglevel","error",*inp,"-filter_complex",";".join(fc),"-map",f"[{prev}]",*ENC,"-an",f"{BC}/_silent.mp4"],"xfade")
run(["ffmpeg","-y","-loglevel","error","-i",f"{BC}/_silent.mp4","-i","music_smalltown.mp3",
     "-filter_complex",f"[1:a]afade=t=in:st=0:d=0.5,afade=t=out:st={round(acc-1.6,3)}:d=1.6,volume=0.85[a]",
     "-map","0:v","-map","[a]","-t",str(acc),"-c:v","copy","-c:a","aac","-b:a","192k",FINAL],"music")
print("STATUS_OK",FINAL,acc)
