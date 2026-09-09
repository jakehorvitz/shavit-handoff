#!/usr/bin/env python3
"""v7 full reel: choppy Kling clips -> smooth STILLS (Ken Burns) for construction + every room.
Address ("12" now cap-height) fades in gently on the reveal. Opener + ending keep their pushes.
Didot type, 0.45s dissolves, scored. Hang-proof (bounded overlays)."""
import subprocess, os, sys
W,H,FPS=1080,1920,30
PL="recut/v6/pl"; BC="recut/v7/bc"; os.makedirs(BC,exist_ok=True)
FINAL="recut/12-River-v8-FULL.mp4"; XF=0.45
ENC=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p"]
NORM=f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},format=yuv420p"

def run(cmd,tag):
    r=subprocess.run(cmd,capture_output=True,text=True)
    if r.returncode: print("ERR",tag,r.stderr[-600:]); sys.exit(1)
    print("ok",tag)

def kb(dur, zin=True):
    frames=int(dur*FPS)
    z="min(zoom+0.0006,1.09)" if zin else "if(lte(zoom,1.0),1.09,max(1.001,zoom-0.0006))"
    return (f"crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale={W*2}:{H*2},"
            f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS},format=yuv420p")

def clip_v(src,ss,dur,plate,out):   # video source (opener) + static plate
    ins=["-ss",str(ss),"-t",str(dur),"-i",f"shots/{src}.mp4"]
    if plate: ins+=["-loop","1","-i",plate]
    fc=(f"[0:v]{NORM}[v];[v][1:v]overlay=0:0:shortest=1[o]" if plate else f"[0:v]{NORM}[o]")
    run(["ffmpeg","-y","-loglevel","error",*ins,"-filter_complex",fc,"-map","[o]","-t",str(dur),*ENC,"-an",out],out)

def clip_still(still,dur,plate,out,zin=True):   # STILL + Ken Burns + static plate
    ins=["-loop","1","-t",str(dur),"-i",still]
    if plate: ins+=["-loop","1","-i",plate]
    fc=(f"[0:v]{kb(dur,zin)}[v];[v][1:v]overlay=0:0:shortest=1[o]" if plate else f"[0:v]{kb(dur,zin)}[o]")
    run(["ffmpeg","-y","-loglevel","error",*ins,"-filter_complex",fc,"-map","[o]","-t",str(dur),*ENC,"-an",out],out)

def clip_reveal(still,dur,plate,out):   # STILL + Ken Burns + plate that FADES in gently
    fc=(f"[0:v]{kb(dur)}[bg];[1:v]format=rgba,fade=t=in:st=0.7:d=0.5:alpha=1[p];"
        f"[bg][p]overlay=0:0:enable='between(t,0.65,{dur})'[o]")
    run(["ffmpeg","-y","-loglevel","error","-loop","1","-t",str(dur),"-i",still,"-loop","1","-i",plate,
         "-filter_complex",fc,"-map","[o]","-t",str(dur),*ENC,"-an",out],out)

clips=[]
clip_v("B1_before_pushin",1.0,3.0,f"{PL}/forgotten.png",f"{BC}/b1.mp4");          clips.append((f"{BC}/b1.mp4",3.0))
clip_v("A_hero_v4_flipbook",0.6,2.8,None,f"{BC}/b2.mp4");                         clips.append((f"{BC}/b2.mp4",2.8))  # flipbook motion back (Jake likes the choppiness)
clip_reveal("upscaled/after_ext_4k.jpg",3.6,f"{PL}/addr.png",f"{BC}/b3.mp4");     clips.append((f"{BC}/b3.mp4",3.6))
clip_still("recut/kitchen/k23.jpg",3.6,f"{PL}/kitchen.png",f"{BC}/b4.mp4");       clips.append((f"{BC}/b4.mp4",3.6))
clip_still("upscaled/fireplace_4k.jpg",3.3,f"{PL}/living.png",f"{BC}/b5.mp4",zin=False); clips.append((f"{BC}/b5.mp4",3.3))
clip_still("upscaled/bath_4k.jpg",3.3,f"{PL}/bath.png",f"{BC}/b6.mp4");           clips.append((f"{BC}/b6.mp4",3.3))
clip_still("upscaled/sunroom_4k.jpg",3.0,f"{PL}/sun.png",f"{BC}/b7.mp4",zin=False);clips.append((f"{BC}/b7.mp4",3.0))
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
