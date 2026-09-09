#!/usr/bin/env python3
"""Full v6 reel: beats 1-7 (Didot plates, 0.45s dissolves) + the prebuilt ending clip
(recut/v6/_v.mp4 = house -> LIVE -> WORK -> smooth outro), scored to Small Town.
Hang-proof: every looped-image overlay is bounded (overlay shortest=1 + -t output cap)."""
import subprocess, os, sys
W,H,FPS=1080,1920,30
PL="recut/v6/pl"; BC="recut/v6/bc"; os.makedirs(BC,exist_ok=True)
FINAL="recut/12-River-v6-FULL.mp4"; XF=0.45
ENC=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p"]
NORM=f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},format=yuv420p"

def run(cmd,tag):
    r=subprocess.run(cmd,capture_output=True,text=True)
    if r.returncode: print("ERR",tag,r.stderr[-600:]); sys.exit(1)
    print("ok",tag)

def clip_v(src,ss,dur,plate,out):
    ins=["-ss",str(ss),"-t",str(dur),"-i",f"shots/{src}.mp4"]
    if plate: ins+=["-loop","1","-i",plate]
    fc=(f"[0:v]{NORM}[v];[v][1:v]overlay=0:0:shortest=1[o]" if plate else f"[0:v]{NORM}[o]")
    run(["ffmpeg","-y","-loglevel","error",*ins,"-filter_complex",fc,"-map","[o]","-t",str(dur),*ENC,"-an",out],out)

def clip_still(still,dur,plate,out):
    frames=int(dur*FPS)
    vf=(f"crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale={W*2}:{H*2},"
        f"zoompan=z='min(zoom+0.0007,1.10)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS},format=yuv420p")
    run(["ffmpeg","-y","-loglevel","error","-loop","1","-t",str(dur),"-i",still,"-loop","1","-i",plate,
         "-filter_complex",f"[0:v]{vf}[v];[v][1:v]overlay=0:0:shortest=1[o]","-map","[o]","-t",str(dur),*ENC,"-an",out],out)

# beats 1-7  (kind, src, ss, dur, plate)
clips=[]
clip_v("B1_before_pushin",1.0,3.0,f"{PL}/forgotten.png",f"{BC}/b1.mp4"); clips.append((f"{BC}/b1.mp4",3.0))
clip_v("A_hero_v4_flipbook",0.6,2.8,None,f"{BC}/b2.mp4");               clips.append((f"{BC}/b2.mp4",2.8))
clip_v("B2_after_pushin",0.0,3.5,f"{PL}/addr.png",f"{BC}/b3.mp4");      clips.append((f"{BC}/b3.mp4",3.5))
clip_still("recut/kitchen/k23.jpg",3.8,f"{PL}/kitchen.png",f"{BC}/b4.mp4"); clips.append((f"{BC}/b4.mp4",3.8))
clip_v("W_fireplace",0.7,3.3,f"{PL}/living.png",f"{BC}/b5.mp4");        clips.append((f"{BC}/b5.mp4",3.3))
clip_v("W_bath",0.7,3.3,f"{PL}/bath.png",f"{BC}/b6.mp4");              clips.append((f"{BC}/b6.mp4",3.3))
clip_v("W_sunroom",0.7,3.0,f"{PL}/sun.png",f"{BC}/b7.mp4");            clips.append((f"{BC}/b7.mp4",3.0))
clips.append(("recut/v6/_v.mp4",8.6))   # ending: house -> LIVE -> WORK -> smooth outro

# xfade chain
inp=[];
for c,_ in clips: inp+=["-i",c]
fc=[]; prev="0:v"; acc=clips[0][1]
for i in range(1,len(clips)):
    off=round(acc-XF,3); lbl=f"x{i}"
    fc.append(f"[{prev}][{i}:v]xfade=transition=fade:duration={XF}:offset={off}[{lbl}]")
    prev=lbl; acc=round(acc+clips[i][1]-XF,3)
run(["ffmpeg","-y","-loglevel","error",*inp,"-filter_complex",";".join(fc),"-map",f"[{prev}]",*ENC,"-an",f"{BC}/_silent.mp4"],"xfade")

# music over the whole thing, fade out at the end
run(["ffmpeg","-y","-loglevel","error","-i",f"{BC}/_silent.mp4","-i","music_smalltown.mp3",
     "-filter_complex",f"[1:a]afade=t=in:st=0:d=0.5,afade=t=out:st={round(acc-1.6,3)}:d=1.6,volume=0.85[a]",
     "-map","0:v","-map","[a]","-t",str(acc),"-c:v","copy","-c:a","aac","-b:a","192k",FINAL],"music")
print("STATUS_OK",FINAL,acc)
